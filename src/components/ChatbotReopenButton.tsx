
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotReopenButtonProps {
  onOpen: () => void;
}

export const ChatbotReopenButton: React.FC<ChatbotReopenButtonProps> = ({ onOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex justify-center mt-6"
    >
      <Button
        onClick={onOpen}
        variant="outline"
        size="sm"
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-200 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Bot className="h-4 w-4 mr-2" />
        Need Help? Ask our AI Assistant
        <MessageCircle className="h-4 w-4 ml-2" />
      </Button>
    </motion.div>
  );
};
