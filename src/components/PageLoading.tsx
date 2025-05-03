
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import { Code, Languages, Scissors, GitMerge, Eye, Settings } from "lucide-react";

const codeLogos = [
  { icon: <Scissors className="h-6 w-6 text-white" />, label: "Divide" },
  { icon: <GitMerge className="h-6 w-6 text-white" />, label: "Merge" },
  { icon: <Eye className="h-6 w-6 text-white" />, label: "Compare" },
  { icon: <Settings className="h-6 w-6 text-white" />, label: "Format" }
];

const PageLoading = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div 
          className="relative bg-white/10 backdrop-blur-sm p-8 rounded-full mb-4"
          animate={{ 
            boxShadow: ["0px 0px 20px rgba(255,255,255,0.2)", "0px 0px 40px rgba(255,255,255,0.4)", "0px 0px 20px rgba(255,255,255,0.2)"]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2
          }}
        >
          <Code className="h-14 w-14 text-white" />
          
          <div className="absolute -top-4 -left-4 w-full h-full">
            <motion.div
              className="absolute p-2 bg-white/10 backdrop-blur-sm rounded-full"
              animate={{
                rotate: [0, 360],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear"
              }}
              style={{ top: "10%", left: "0%" }}
            >
              <Scissors className="h-4 w-4 text-white" />
            </motion.div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 w-full h-full">
            <motion.div
              className="absolute p-2 bg-white/10 backdrop-blur-sm rounded-full"
              animate={{
                rotate: [0, -360],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "linear"
              }}
              style={{ bottom: "10%", right: "0%" }}
            >
              <Settings className="h-4 w-4 text-white" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Code Craft Toolkit
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-6 mt-2 mb-6"
        >
          {codeLogos.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.6 + (index * 0.1),
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                {item.icon}
              </div>
              <span className="text-xs text-blue-100 mt-1">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
        
        <LoadingSpinner size={40} color="white" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 flex items-center"
        >
          <Languages className="h-5 w-5 text-blue-300 mr-2" />
          <span className="text-blue-100 text-sm">Supporting 20+ programming languages</span>
        </motion.div>
        
        <motion.p 
          className="text-blue-100 mt-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Loading developer toolkit...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default PageLoading;
