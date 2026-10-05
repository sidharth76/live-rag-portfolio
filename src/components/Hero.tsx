'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Sparkles, Download, Mail, Github, Linkedin } from 'lucide-react';

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Software Engineer | RAG & AI Systems</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.15]">
              Hi, I&apos;m <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Sidharth Wadhwa</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              Software Engineer at <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">TCAIGV Technologies</strong> specializing in <strong className="text-slate-900 dark:text-slate-100 font-semibold">Python</strong>, <strong className="text-slate-900 dark:text-slate-100 font-semibold">Multimodal RAG Pipelines</strong>, <strong className="text-slate-900 dark:text-slate-100 font-semibold">Ollama &amp; Azure OpenAI</strong>, <strong className="text-slate-900 dark:text-slate-100 font-semibold">Qdrant Vector DB</strong>, <strong className="text-slate-900 dark:text-slate-100 font-semibold">Neo4j Knowledge Graphs</strong>, and <strong className="text-slate-900 dark:text-slate-100 font-semibold">Power BI &amp; SQL Data Analytics</strong>.
            </p>

            {/* Key Skill Highlights Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['RAG Architecture', 'Multimodal AI', 'Ollama & Azure OpenAI', 'Qdrant & Neo4j', 'Python', 'SQL', 'Power BI', 'LangGraph'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#playground"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Try RAG Playground</span>
              </a>

              <a
                href="https://github.com/sidharth76"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com/in/sidharth-wadhwa76"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Right Interactive Code & Feature Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl overflow-hidden font-mono text-xs text-slate-300 space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-slate-500">sidharth_multimodal_rag.py</span>
              </div>

              {/* Code Snippet */}
              <div className="space-y-1.5 leading-relaxed">
                <p className="text-purple-400">from <span className="text-cyan-300">qdrant_client</span> import QdrantClient</p>
                <p className="text-purple-400">from <span className="text-cyan-300">neo4j</span> import GraphDatabase</p>
                <p className="text-purple-400">from <span className="text-cyan-300">langgraph.graph</span> import StateGraph</p>
                <br />
                <p className="text-slate-500"># Multimodal LightMES RAG Pipeline</p>
                <p className="text-slate-300"><span className="text-indigo-400">qdrant</span> = QdrantClient(host=<span className="text-emerald-400">&quot;localhost&quot;</span>, port=6333)</p>
                <p className="text-slate-300"><span className="text-indigo-400">neo4j_driver</span> = GraphDatabase.driver(<span className="text-emerald-400">&quot;bolt://localhost:7687&quot;</span>)</p>
                <br />
                <p className="text-cyan-400">async def <span className="text-indigo-300">retrieve_multimodal_context</span>(ticket_id: str):</p>
                <p className="pl-4 text-slate-300">vector_docs = await qdrant.search(collection=<span className="text-emerald-400">&quot;manuals&quot;</span>)</p>
                <p className="pl-4 text-slate-300">graph_nodes = await neo4j_driver.query_relations(ticket_id)</p>
                <p className="pl-4 text-emerald-400">return synthesize_ollama(vector_docs, graph_nodes)</p>
              </div>

              {/* Realtime Stats Badge */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/60 p-2.5 rounded-lg">
                  <div className="text-indigo-400 font-bold text-sm">TCAIGV Tech</div>
                  <div className="text-[10px] text-slate-400">Software Engineer</div>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-lg">
                  <div className="text-cyan-400 font-bold text-sm">Qdrant & Neo4j</div>
                  <div className="text-[10px] text-slate-400">Multimodal RAG</div>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-lg">
                  <div className="text-emerald-400 font-bold text-sm">B.Tech AI & DS</div>
                  <div className="text-[10px] text-slate-400">CGPA 7.63 (2025)</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
