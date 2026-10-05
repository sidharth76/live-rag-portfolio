'use client';

import { motion } from 'framer-motion';
import { experienceData } from '@/data/experience';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Work History
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Professional Experience
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Software engineering experience specializing in Multimodal RAG pipelines, Qdrant vector databases, Neo4j knowledge graphs, and data-driven backend automation.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {experienceData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {item.role}
                    </h3>
                  </div>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                    {item.company}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.period}</span>
                  </span>
                  <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>

              {/* Bullet points */}
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {item.description.map((point, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies used */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
