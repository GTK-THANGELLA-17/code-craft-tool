
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bot, User, Code, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface PredefinedQuestion {
  id: string;
  question: string;
  response: string;
  icon: React.ReactNode;
}

interface ChatbotProps {
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const predefinedQuestions: PredefinedQuestion[] = [
  {
    id: '1',
    question: 'What is CodeCraft Toolkit?',
    response: '🚀 CodeCraft Toolkit is a professional suite of developer tools designed to enhance your coding workflow! It includes 7 powerful tools: Code Divider, Merger, Differencer, Formatter, Beautifier, Minifier, and Validator. All tools support 20+ programming languages and work entirely in your browser for maximum privacy! ✨',
    icon: <Code className="h-4 w-4" />
  },
  {
    id: '2',
    question: 'How does the Code Divider work?',
    response: '✂️ The Code Divider uses AI-powered language detection to automatically separate mixed code into different programming languages! Simply paste your code containing multiple languages (like HTML with CSS and JavaScript), and it will intelligently split them into organized sections. Perfect for cleaning up messy code files! 🎯',
    icon: <Sparkles className="h-4 w-4" />
  },
  {
    id: '3',
    question: 'Is my code safe and private?',
    response: '🔒 Absolutely! Your privacy is our top priority. All code processing happens locally in your browser - your code never leaves your device or gets sent to any servers. We don\'t store, track, or have access to any of your code. It\'s completely secure and private! 🛡️',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: '4',
    question: 'Which programming languages are supported?',
    response: '🌐 We support 20+ programming languages including JavaScript, Python, Java, C++, HTML, CSS, SQL, PHP, Ruby, Go, Rust, TypeScript, JSON, XML, YAML, and many more! Our AI-powered detection continuously improves to recognize even more languages and frameworks. 💻',
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: '5',
    question: 'How can I merge multiple code files?',
    response: '🔄 The Code Merger allows you to combine multiple code files into a single organized document! You can merge HTML, CSS, and JavaScript files, or combine different code sections with proper formatting. It maintains the structure and adds appropriate separators between different code blocks. 📁',
    icon: <Code className="h-4 w-4" />
  },
  {
    id: '6',
    question: 'What makes CodeCraft different from other tools?',
    response: '⭐ CodeCraft Toolkit stands out with its AI-powered analysis, 20+ language support, privacy-first approach, and lightning-fast performance! Unlike other tools, we offer a complete suite of professional-grade tools in one place, with beautiful UI/UX and no need for installations or sign-ups. Plus, it\'s completely free! 🎉',
    icon: <Sparkles className="h-4 w-4" />
  }
];

export const Chatbot = ({ forceOpen = false, onOpenChange }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'bot',
      content: '👋 Hello! I\'m your CodeCraft assistant. I\'m here to help you learn about our amazing developer tools! Click on any question below to get started! 🚀',
      timestamp: new Date()
    }
  ]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsVisible(false);
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleQuestionClick = (question: PredefinedQuestion) => {
    if (askedQuestions.has(question.id)) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question.question,
      timestamp: new Date()
    };

    // Add bot response
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: question.response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setAskedQuestions(prev => new Set([...prev, question.id]));
  };

  const resetChat = () => {
    setMessages([
      {
        id: '0',
        type: 'bot',
        content: '👋 Hello! I\'m your CodeCraft assistant. I\'m here to help you learn about our amazing developer tools! Click on any question below to get started! 🚀',
        timestamp: new Date()
      }
    ]);
    setAskedQuestions(new Set());
  };

  const availableQuestions = predefinedQuestions.filter(q => !askedQuestions.has(q.id));

  return (
    <>
      {/* Chatbot Trigger Button */}
      <AnimatePresence>
        {isVisible && !forceOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => handleOpenChange(!isOpen)}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              size="icon"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 20, scale: 0.95 }}
  transition={{ duration: 0.3 }}
  className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-hidden"
>
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">CodeCraft Assistant</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Always here to help! 🤖</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetChat}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenChange(false)}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-0">
                {/* Messages Area */}
                <ScrollArea className="h-64 p-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-2 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'bot' && (
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.type === 'user' && (
                          <div className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="h-3 w-3 text-slate-600 dark:text-slate-300" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Questions Area */}
                {availableQuestions.length > 0 && (
                  <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      💡 Click a question to learn more:
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableQuestions.map((question) => (
                        <motion.button
                          key={question.id}
                          onClick={() => handleQuestionClick(question)}
                          className="w-full text-left p-2 text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-blue-500 dark:text-blue-400">
                            {question.icon}
                          </div>
                          <span className="text-slate-700 dark:text-slate-300">
                            {question.question}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {availableQuestions.length === 0 && (
                  <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      🎉 Thanks for exploring! Reset to ask more questions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
