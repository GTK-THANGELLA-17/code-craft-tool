
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ 
  size = 24, 
  color = "currentColor", 
  className = "",
  text
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <LoaderCircle size={size} color={color} />
      </motion.div>
      {text && <p className="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
