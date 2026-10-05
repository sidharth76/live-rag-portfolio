'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Check, Circle, LoaderCircle, Play, RefreshCw, Search, Sparkles } from 'lucide-react';

interface RagResponse {
  answer: string;
}

type RagStage = 'understanding' | 'searching' | 'graph' | 'generating';

interface RagErrorResponse {
  error?: string;
  requestId?: string;
  failedStep?: string;
}

const progressSteps: { id: RagStage; label: string; detail: string }[] = [
  { id: 'understanding', label: 'Understanding your question', detail: 'Preparing your resume search' },
  { id: 'searching', label: 'Searching resume content', detail: 'Finding the most relevant chunks' },
  { id: 'graph', label: 'Exploring Neo4j connections', detail: 'Adding related experience and projects' },
  { id: 'generating', label: 'Writing your answer', detail: 'Putting the relevant context together' },
];

const stageOrder: RagStage[] = ['understanding', 'searching', 'graph', 'generating'];

const sampleQuestions = [
  'What experience does Sidharth have with RAG systems?',
  'Describe the Maintenance Command Center integration.',
  'What is Sidharth’s education and work experience?',
];

const pipelineSteps = [
  { title: 'Embed question', detail: 'Gemini converts the question into a search vector.' },
  { title: 'Retrieve context', detail: 'Qdrant finds relevant resume chunks.' },
  { title: 'Expand relationships', detail: 'Neo4j adds related resume context.' },
  { title: 'Generate answer', detail: 'Gemini answers from retrieved excerpts.' },
];

export function InteractiveRAGDemo() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RagResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressStage, setProgressStage] = useState<RagStage>('understanding');

  async function submitQuery(event?: FormEvent<HTMLFormElement>, suggestedQuery?: string) {
    event?.preventDefault();
    const question = (suggestedQuery ?? query).trim();
    if (!question || isLoading) return;

    setQuery(question);
    setIsLoading(true);
    setResult(null);
    setError(null);
    setProgressStage('understanding');

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
      });
      const contentType = response.headers.get('content-type') ?? '';
      if (!response.ok || !contentType.includes('application/x-ndjson')) {
        const payload = await response.json() as RagResponse | RagErrorResponse;
        throw new Error('error' in payload && payload.error
          ? `${payload.error}${payload.requestId ? ` (Request ID: ${payload.requestId})` : ''}`
          : 'The resume search could not be completed.');
      }
      if (!response.body) {
        throw new Error('The resume search stream was unavailable. Please try again.');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let answer: string | undefined;
      let streamError: string | undefined;

      function handleEvent(line: string) {
        if (!line.trim()) return;
        const event: unknown = JSON.parse(line);
        if (typeof event !== 'object' || event === null || !('type' in event)) {
          throw new Error('The resume search returned an invalid progress update.');
        }
        if (event.type === 'stage' && 'stage' in event && stageOrder.includes(event.stage as RagStage)) {
          setProgressStage(event.stage as RagStage);
        } else if (event.type === 'result' && 'answer' in event && typeof event.answer === 'string') {
          answer = event.answer;
        } else if (event.type === 'error' && 'error' in event && typeof event.error === 'string') {
          streamError = event.error;
        }
      }

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        lines.forEach(handleEvent);
        if (done) break;
      }
      if (buffer.trim()) handleEvent(buffer);
      if (streamError) throw new Error(streamError);
      if (!answer) throw new Error('The resume search finished without an answer.');
      setResult({ answer });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The resume search could not be completed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="playground" className="py-20 bg-slate-900 text-slate-100 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-10 overflow-hidden relative border border-slate-800 shadow-2xl">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Resume RAG Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ask About My Experience
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Ask a question and get a concise answer grounded in my indexed resume PDFs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pipelineSteps.map((step, index) => (
            <div key={step.title} className="p-4 rounded-xl border border-slate-800 bg-slate-800/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <span className="flex w-5 h-5 items-center justify-center rounded-full bg-indigo-950 border border-indigo-800">
                  {index + 1}
                </span>
                <span>{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap justify-center gap-2">
            {sampleQuestions.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => void submitQuery(undefined, sample)}
                disabled={isLoading}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors disabled:opacity-50"
              >
                {sample}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => void submitQuery(event)}
            className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-2xl p-2 max-w-3xl mx-auto shadow-inner"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              maxLength={500}
              placeholder="Ask about skills, projects, education, or work experience..."
              aria-label="Ask a question about Sidharth's resume"
              className="w-full bg-transparent text-sm text-slate-100 focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex shrink-0 items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </>
              )}
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-500">Questions are limited to 500 characters.</p>
        </div>

        {isLoading && (
          <div role="status" aria-live="polite" className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-slate-800/90 border border-indigo-500/30 shadow-lg shadow-indigo-950/20">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-100">
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span>Building your answer</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Step {stageOrder.indexOf(progressStage) + 1} of {progressSteps.length}
              </span>
            </div>
            <div className="space-y-3">
              {progressSteps.map((step, index) => {
                const currentIndex = stageOrder.indexOf(progressStage);
                const isComplete = index < currentIndex;
                const isCurrent = index === currentIndex;
                return (
                  <div key={step.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                    isCurrent ? 'bg-indigo-500/10' : ''
                  }`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                      isComplete
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : isCurrent
                          ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-200'
                          : 'border-slate-700 bg-slate-900/60 text-slate-500'
                    }`}>
                      {isComplete ? (
                        <Check className="h-4 w-4" />
                      ) : isCurrent ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${
                        isCurrent ? 'text-indigo-100' : isComplete ? 'text-slate-300' : 'text-slate-500'
                      }`}>{step.label}</p>
                      {isCurrent && <p className="mt-0.5 text-[11px] text-slate-400">{step.detail}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="max-w-3xl mx-auto p-5 rounded-2xl bg-red-950/50 border border-red-800 text-sm text-red-200">
            {error}
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-slate-800/90 border border-emerald-500/40 space-y-5"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <BrainCircuit className="w-4 h-4" />
              <span>Answer from resume context</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {renderAnswer(result.answer)}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function renderAnswer(answer: string) {
  return answer.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
