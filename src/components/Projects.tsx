'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsData } from '@/data/projects';
import { Project } from '@/types';
import { ExternalLink, Github, Layers, Activity, ChevronRight, X, Cpu, Database, BrainCircuit, Network } from 'lucide-react';

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = [
    'All',
    'RAG & LLM',
    'Machine Learning',
    'Data Analytics',
    'API & Automation',
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Featured Portfolio
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Real-World Projects & Case Studies
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Detailed breakdown of production RAG architectures, machine learning models, REST/OAuth API integrations, and business intelligence solutions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    {project.category}
                  </span>
                  <div className="flex space-x-2">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    ) : project.liveUrl && project.liveUrl !== '#' ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center space-x-1 text-xs font-semibold"
                        title="View Company Product Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-[11px]">Product Page</span>
                      </a>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Metrics Highlights */}
                {project.metrics && (
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-700/60">
                    {project.metrics.map((m) => (
                      <div key={m} className="text-center">
                        <span className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                          {m}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-[11px] font-mono rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-6">
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors group-hover:border-indigo-200"
                >
                  <span>View System Architecture & Deep Dive</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for Deep Dive Architecture */}
        <AnimatePresence>
          {activeModalProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {activeModalProject.category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {activeModalProject.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Overview</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {activeModalProject.fullDescription}
                    </p>
                  </div>

                  {activeModalProject.architectureOverview && (
                    <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
                      <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
                        <Layers className="w-4 h-4" />
                        <span>System Architecture Pipeline</span>
                      </div>
                      <p className="leading-relaxed text-slate-300">
                        {activeModalProject.architectureOverview}
                      </p>
                    </div>
                  )}

                  {activeModalProject.metrics && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Impact Metrics</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {activeModalProject.metrics.map((m) => (
                          <div key={m} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end space-x-3">
                    {activeModalProject.githubUrl && (
                      <a
                        href={activeModalProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold"
                      >
                        <Github className="w-4 h-4" />
                        <span>View Repository</span>
                      </a>
                    )}
                    {activeModalProject.liveUrl && activeModalProject.liveUrl !== '#' && (
                      <a
                        href={activeModalProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Product Page</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
