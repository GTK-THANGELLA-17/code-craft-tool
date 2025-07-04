
import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import CodeSection from './CodeSection';
import { DetectedLanguage } from '@/utils/languageDetection';

interface CodeSectionData extends DetectedLanguage {
  code: string;
  lines: number;
}

interface ResultsSectionProps {
  sections: CodeSectionData[];
  stats: { totalLines: number; sectionsFound: number };
  inputCode: string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ sections, stats, inputCode }) => {
  if (!sections.length && inputCode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
      >
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4 opacity-70" />
        <p className="text-slate-500">Click "Divide Code" to analyze and separate your code</p>
      </motion.div>
    );
  }

  if (!sections.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="font-medium">Division Results</span>
        </div>
        <div className="flex gap-4 text-sm text-slate-500">
          <span>{stats.totalLines} total lines</span>
          <span>{stats.sectionsFound} sections found</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, index) => (
          <CodeSection key={index} section={section} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default ResultsSection;
