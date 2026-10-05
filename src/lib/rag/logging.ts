import { randomUUID } from 'node:crypto';

export interface RagLogContext {
  requestId: string;
  secrets: string[];
}

export class RagStepError extends Error {
  constructor(
    readonly step: string,
    readonly safeMessage: string,
  ) {
    super(`${step}: ${safeMessage}`);
    this.name = 'RagStepError';
  }
}

export function createRagLogContext(
  secrets: string[] = [],
  requestId: string = randomUUID(),
): RagLogContext {
  return { requestId, secrets: secrets.filter(Boolean) };
}

export function logRagEvent(
  level: 'info' | 'error',
  context: RagLogContext,
  event: string,
  fields: Record<string, string | number | boolean | undefined> = {},
): void {
  const record = {
    timestamp: new Date().toISOString(),
    service: 'resume-rag',
    event,
    requestId: context.requestId,
    ...fields,
  };
  console[level](JSON.stringify(record));
}

export async function runRagStep<T>(
  context: RagLogContext,
  step: string,
  operation: () => Promise<T>,
  metadata: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
  const startedAt = Date.now();
  logRagEvent('info', context, 'step_started', { step, ...metadata });

  try {
    const result = await operation();
    logRagEvent('info', context, 'step_succeeded', {
      step,
      durationMs: Date.now() - startedAt,
      ...metadata,
    });
    return result;
  } catch (error) {
    const safeMessage = safeRagErrorMessage(error, context.secrets);
    logRagEvent('error', context, 'step_failed', {
      step,
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: safeMessage,
      ...metadata,
    });
    throw new RagStepError(step, safeMessage);
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function safeRagErrorMessage(error: unknown, secrets: string[] = []): string {
  const message = getErrorMessage(error);
  return secrets.reduce(
    (redacted, secret) => redacted.split(secret).join('[REDACTED]'),
    message,
  );
}
