'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Copy, Check, Send, Phone } from 'lucide-react';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const email = 'sidharthwadhwa003@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Get In Touch
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Let&apos;s Connect & Build Together
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Software Engineer specializing in Python, Multimodal RAG Systems, Qdrant Vector Databases, Neo4j, and Data Analytics. Feel free to reach out directly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Email Address</h3>
                  <p className="text-xs text-slate-500 font-mono">{email}</p>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Email to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* Social & Contact Links */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://github.com/sidharth76"
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 transition-all flex items-center space-x-3 group"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:text-indigo-600">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">GitHub</span>
                  <span className="text-[11px] text-slate-500">@sidharth76</span>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/sidharth-wadhwa76"
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 transition-all flex items-center space-x-3 group"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:text-indigo-600">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">LinkedIn</span>
                  <span className="text-[11px] text-slate-500">sidharth-wadhwa76</span>
                </div>
              </a>
            </div>

            {/* Phone & Location */}
            <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono">+91-9614512478</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Hyderabad / Mohali, India</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Send Sidharth a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="RAG / AI Engineering Inquiry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hi Sidharth, I'd like to discuss a project involving Multimodal RAG pipelines and vector database integration..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/25"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>

              {submitted && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs text-center font-medium">
                  Thank you! Message sent successfully. Sidharth will get back to you shortly.
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
