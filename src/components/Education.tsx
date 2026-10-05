'use client';

import { motion } from 'framer-motion';
import { educationData } from '@/data/education';
import { GraduationCap, Award, Calendar, CheckCircle2 } from 'lucide-react';

export function Education() {
  return (
    <section id="education" className="py-20 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Background & Credentials
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Education & Professional Certifications
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Academic groundwork in Computer Science & Data Analysis, complemented by specialized certifications in Generative AI, RAG Systems, and Business Intelligence.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 sm:ml-32 space-y-10">
          {educationData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative pl-6 sm:pl-8 group"
            >
              {/* Timeline Icon Marker */}
              <div className="absolute -left-[17px] top-1.5 p-2 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 shadow-sm">
                {item.type === 'education' ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
              </div>

              {/* Date Badge on Desktop */}
              <div className="hidden sm:block absolute -left-36 top-2 text-xs font-semibold font-mono text-slate-500 dark:text-slate-400 text-right w-24">
                {item.period}
              </div>

              {/* Content Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="sm:hidden inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{item.period}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {item.degreeOrTitle}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {item.institution}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Acquired Skills Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.skillsAcquired.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
