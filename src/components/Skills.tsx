'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '@/data/skills';
import { 
  BrainCircuit, 
  Sparkles, 
  Network, 
  Cpu, 
  BarChart3, 
  PieChart, 
  Code2, 
  Database,
  CheckCircle2
} from 'lucide-react';

export function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'AI & GenAI',
    'Machine Learning',
    'Data Analytics',
    'APIs & Backend',
    'Languages & Tools',
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit className="w-6 h-6 text-indigo-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'Network': return <Network className="w-6 h-6 text-cyan-500" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-emerald-500" />;
      case 'BarChart3': return <BarChart3 className="w-6 h-6 text-blue-500" />;
      case 'PieChart': return <PieChart className="w-6 h-6 text-amber-500" />;
      case 'Code2': return <Code2 className="w-6 h-6 text-indigo-400" />;
      case 'Database': return <Database className="w-6 h-6 text-teal-500" />;
      default: return <BrainCircuit className="w-6 h-6 text-indigo-500" />;
    }
  };

  const filteredSkills = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter((skill) => skill.category === selectedCategory);

  return (
    <section id="skills" className="py-20 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Technical Competencies
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Skillset & Expertise Matrix
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Proficient across the complete data and artificial intelligence spectrum — from building state-of-the-art RAG pipelines to designing enterprise Power BI & SQL analytical solutions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative group p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 group-hover:scale-105 transition-transform">
                    {getIcon(skill.iconName)}
                  </div>
                  {skill.highlight && (
                    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      Core Skill
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-6 space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span>Proficiency</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{skill.level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
