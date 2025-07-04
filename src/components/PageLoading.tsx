
import { motion } from "framer-motion";
import { Code } from "lucide-react";

const PageLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4"
        >
          <Code className="h-12 w-12 text-blue-500" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2"
        >
          Loading Code Craft Toolkit
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 dark:text-slate-400"
        >
          Preparing your development tools...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PageLoading;
