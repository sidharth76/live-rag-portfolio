import { NextResponse } from 'next/server';
import { createRagClients } from '@/lib/rag/clients';
import { getRagConfig, RagConfigurationError } from '@/lib/rag/config';
import { answerResumeQuestion, ResumeIndexNotReadyError } from '@/lib/rag/query';
import {
  createRagLogContext,
  logRagEvent,
  RagStepError,
  safeRagErrorMessage,
} from '@/lib/rag/logging';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_REQUEST_BYTES = 8_192;
const MAX_QUERY_LENGTH = 500;

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const requestContext = createRagLogContext([], requestId);
  logRagEvent('info', requestContext, 'request_received');

  const bodyText = await request.text();
  if (new TextEncoder().encode(bodyText).byteLength > MAX_REQUEST_BYTES) {
    logRagEvent('error', requestContext, 'request_rejected', {
      reason: 'payload_too_large',
    });
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    logRagEvent('error', requestContext, 'request_rejected', {
      reason: 'invalid_json',
    });
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('query' in body) ||
    typeof body.query !== 'string'
  ) {
    logRagEvent('error', requestContext, 'request_rejected', {
      reason: 'query_missing_or_not_text',
    });
    return NextResponse.json({ error: 'Provide a query as text.' }, { status: 400 });
  }

  const query = body.query.trim();
  if (!query) {
    logRagEvent('error', requestContext, 'request_rejected', {
      reason: 'query_empty',
    });
    return NextResponse.json({ error: 'Enter a question to search the resume.' }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    logRagEvent('error', requestContext, 'request_rejected', {
      reason: 'query_too_long',
      queryLength: query.length,
    });
    return NextResponse.json(
      { error: `Questions must be ${MAX_QUERY_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  logRagEvent('info', requestContext, 'query_validated', {
    queryLength: query.length,
  });
  let logContext = requestContext;
  try {
    const config = getRagConfig();
    logContext = createRagLogContext([
      config.geminiApiKey,
      config.qdrantApiKey,
      config.neo4jPassword,
    ], requestId);
    logRagEvent('info', logContext, 'configuration_loaded', {
      embeddingModel: config.embeddingModel,
      generationModel: config.generationModel,
      collection: config.qdrantCollection,
      neo4jDatabase: config.neo4jDatabase,
    });
    const clients = createRagClients(config);
    const encoder = new TextEncoder();
    let isCancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const send = (event: Record<string, string>) => {
          if (!isCancelled) {
            controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
          }
        };
        send({ type: 'stage', stage: 'understanding' });
        void (async () => {
          try {
            const result = await answerResumeQuestion(
              clients,
              config,
              query,
              logContext,
              (stage) => send({ type: 'stage', stage }),
            );
            logRagEvent('info', logContext, 'request_completed', {
              durationMs: Date.now() - startedAt,
            });
            send({ type: 'result', answer: result.answer });
          } catch (error) {
            if (error instanceof ResumeIndexNotReadyError) {
              logRagEvent('error', logContext, 'request_failed', {
                failedStep: 'check_qdrant_collection',
                errorMessage: error.message,
                durationMs: Date.now() - startedAt,
              });
              send({
                type: 'error',
                error: `Qdrant collection "${error.collection}" is missing. Run "npm run index:resumes" from the project root, then retry.`,
              });
            } else if (error instanceof RagStepError) {
              logRagEvent('error', logContext, 'request_failed', {
                failedStep: error.step,
                errorMessage: error.safeMessage,
                durationMs: Date.now() - startedAt,
              });
              send({
                type: 'error',
                error: `RAG step "${error.step}" failed: ${error.safeMessage}`,
              });
            } else {
              logRagEvent('error', logContext, 'request_failed', {
                failedStep: 'initialize_rag_clients',
                errorName: error instanceof Error ? error.name : 'UnknownError',
                errorMessage: safeRagErrorMessage(error, logContext.secrets),
                durationMs: Date.now() - startedAt,
              });
              send({
                type: 'error',
                error: 'The resume search could not be completed. Check the server terminal logs.',
              });
            }
          } finally {
            try {
              await clients.neo4j.close();
            } catch (error) {
              logRagEvent('error', logContext, 'neo4j_driver_close_failed', {
                errorName: error instanceof Error ? error.name : 'UnknownError',
                errorMessage: safeRagErrorMessage(error, logContext.secrets),
              });
              send({
                type: 'error',
                error: 'The resume search could not be completed because the database connection did not close cleanly.',
              });
            } finally {
              if (!isCancelled) controller.close();
            }
          }
        })();
      },
      cancel() {
        isCancelled = true;
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof RagConfigurationError) {
      logRagEvent('error', logContext, 'configuration_failed', {
        missingVariables: error.missingVariables.join(', '),
        durationMs: Date.now() - startedAt,
      });
      return NextResponse.json(
        {
          error: `RAG configuration is incomplete: ${error.missingVariables.join(', ')}.`,
          requestId,
        },
        { status: 503 },
      );
    }
    if (error instanceof ResumeIndexNotReadyError) {
      logRagEvent('error', logContext, 'step_failed', {
        step: 'check_qdrant_collection',
        errorMessage: error.message,
        collection: error.collection,
        durationMs: Date.now() - startedAt,
      });
      return NextResponse.json(
        {
          error: `Qdrant collection "${error.collection}" is missing. Run "npm run index:resumes" from the project root, then retry.`,
          failedStep: 'check_qdrant_collection',
          requestId,
        },
        { status: 503 },
      );
    }

    if (error instanceof RagStepError) {
      logRagEvent('error', logContext, 'request_failed', {
        failedStep: error.step,
        errorMessage: error.safeMessage,
        durationMs: Date.now() - startedAt,
      });
      return NextResponse.json(
        {
          error: `RAG step "${error.step}" failed: ${error.safeMessage}`,
          failedStep: error.step,
          requestId,
        },
        { status: 502 },
      );
    }

    logRagEvent('error', logContext, 'request_failed', {
      failedStep: 'initialize_rag_clients',
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: safeRagErrorMessage(error, logContext.secrets),
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json(
      {
        error: 'RAG step "initialize_rag_clients" failed. Check the server terminal logs.',
        failedStep: 'initialize_rag_clients',
        requestId,
      },
      { status: 502 },
    );
  }
}
