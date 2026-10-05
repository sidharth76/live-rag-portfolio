import { BrainCircuit, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-indigo-600 text-white">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">AI & Data Engineering Portfolio</span>
        </div>

        <div>
          © {new Date().getFullYear()} All rights reserved. Designed for AI/ML, RAG, & Data Analytics Excellence.
        </div>

        <div className="flex items-center space-x-1">
          <span>Built with Next.js 14, Tailwind CSS &</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
        </div>

      </div>
    </footer>
  );
}
