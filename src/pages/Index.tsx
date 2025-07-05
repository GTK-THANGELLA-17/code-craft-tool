import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  Scissors, 
  GitMerge, 
  FileCode, 
  Eye,
  Languages,
  FileText,
  Instagram,
  ArrowUpRight,
  Settings,
  Sparkles,
  Minimize2,
  Shield,
  Wand2,
  Zap,
  User
} from "lucide-react";
import CodeDivider from "@/components/CodeDivider";
import CodeMerger from "@/components/CodeMerger";
import CodeDifferencer from "@/components/CodeDifferencer";
import CodeFormatter from "@/components/CodeFormatter";
import CodeBeautifier from "@/components/CodeBeautifier";
import CodeMinifier from "@/components/CodeMinifier";
import CodeValidator from "@/components/CodeValidator";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageLoading from "@/components/PageLoading";
import { DeveloperModal } from "@/components/DeveloperModal";
import { Chatbot } from "@/components/Chatbot";
import { ChatbotReopenButton } from "@/components/ChatbotReopenButton";

const Index = () => {
  const [activeTab, setActiveTab] = useState("divider");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast(`Switched to ${value} tool`);
  };

  const handleChatbotOpen = () => {
    setIsChatbotOpen(true);
  };

  const handleChatbotChange = (open: boolean) => {
    setIsChatbotOpen(open);
  };

  const tools = [
    { id: "divider", label: "Divider", icon: Scissors, gradient: "from-blue-500 to-indigo-500" },
    { id: "merger", label: "Merger", icon: GitMerge, gradient: "from-green-500 to-emerald-500" },
    { id: "differencer", label: "Diff", icon: Eye, gradient: "from-orange-500 to-red-500" },
    { id: "formatter", label: "Format", icon: Settings, gradient: "from-purple-500 to-pink-500" },
    { id: "beautifier", label: "Beautify", icon: Sparkles, gradient: "from-violet-500 to-purple-500" },
    { id: "minifier", label: "Minify", icon: Minimize2, gradient: "from-green-500 to-teal-500" },
    { id: "validator", label: "Validate", icon: Shield, gradient: "from-blue-500 to-cyan-500" }
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <AnimatePresence>
        {isLoading && <PageLoading />}
      </AnimatePresence>

      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-8 sm:py-12 px-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -inset-[10px]" style={{ background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") " }} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto text-center relative z-10 max-w-full px-2"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 sm:gap-3 bg-white/15 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full mb-4 border border-white/20"
            >
              <Code className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-base font-medium">Professional Developer Tools</span>
            </motion.div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent px-2">
              <Code className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-white" />
              Code Craft Toolkit
            </h1>
            
            <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed mb-6 px-4">
              The ultimate suite of professional code manipulation tools. Divide, merge, format, beautify, minify, validate, and compare code across 20+ programming languages.
            </p>
            <ChatbotReopenButton onOpen={handleChatbotOpen} />
          </motion.div>
        </header>

        <main className="w-full py-4 sm:py-8 px-2 sm:px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full"
            >
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="mb-4 sm:mb-6 w-full">
                  <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 p-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 h-auto">
                    {tools.map((tool) => (
                      <TabsTrigger 
                        key={tool.id}
                        value={tool.id} 
                        className={`
                          flex flex-col gap-1 p-2 sm:p-3 min-h-[50px] sm:min-h-[70px] text-xs sm:text-sm
                          data-[state=active]:bg-gradient-to-r data-[state=active]:${tool.gradient}
                          data-[state=active]:text-white transition-all duration-300 rounded-lg
                          hover:bg-slate-100 dark:hover:bg-slate-700
                        `}
                      >
                        <tool.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mx-auto" />
                        <span className="text-center leading-tight">{tool.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <TabsContent value="divider" className="mt-0 w-full">
                    <div className="mb-4 sm:mb-6 px-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">Smart Code Divider</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">Automatically detect and separate mixed code into different programming languages with AI-powered analysis.</p>
                    </div>
                    <div className="w-full">
                      <CodeDivider />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="merger" className="mt-0 w-full">
                    <div className="mb-4 sm:mb-6 px-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">Code Merger</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">Combine multiple code files into a single organized document with proper language sections.</p>
                    </div>
                    <div className="w-full">
                      <CodeMerger />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="differencer" className="mt-0 w-full">
                    <div className="mb-4 sm:mb-6 px-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">Code Differencer</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">Compare two versions of code side-by-side to identify changes, additions, and deletions.</p>
                    </div>
                    <div className="w-full">
                      <CodeDifferencer />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="formatter" className="mt-0 w-full">
                    <div className="mb-4 sm:mb-6 px-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">Code Formatter</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">Format and indent your code with language-specific rules for better readability and consistent structure.</p>
                    </div>
                    <div className="w-full">
                      <CodeFormatter />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="beautifier" className="mt-0 w-full">
                    <div className="mb-4 sm:mb-6 px-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">Advanced Code Beautifier</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">Transform code into beautiful, well-documented format with comments, enhanced structure, and optimized readability.</p>
                    </div>
                    <div className="w-full">
                      <CodeBeautifier />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="minifier" className="mt-0 w-full">
                    <div className="mb-4 sm:mb-6 px-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">Code Minifier</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">Compress your code by removing whitespace, comments, and unnecessary characters to reduce file size.</p>
                    </div>
                    <div className="w-full">
                      <CodeMinifier />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="validator" className="mt-0 w-full">
                    <div className="mb-4 sm:mb-6 px-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">Code Validator</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">Validate your code syntax and find potential issues, errors, and improvement suggestions.</p>
                    </div>
                    <div className="w-full">
                      <CodeValidator />
                    </div>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </motion.div>
          </div>
        </main>

        <section className="w-full py-8 sm:py-12 px-2 sm:px-4 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-6 sm:mb-8 px-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose Code Craft Toolkit?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg lg:text-xl">Professional-grade tools designed for developers, by developers</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 w-full"
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4">
                  <Languages className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">20+ Languages</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  Support for JavaScript, Python, Java, C++, HTML, CSS, SQL, PHP, and many more programming languages.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 w-full"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4">
                  <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">AI-Powered</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  Advanced AI algorithms for accurate language detection and intelligent code analysis.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 w-full"
              >
                <div className="bg-gradient-to-r from-green-500 to-teal-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Lightning Fast</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  Optimized performance for handling large codebases with instant processing and results.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 w-full"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Privacy First</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  All processing happens locally in your browser. Your code never leaves your device.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <footer className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-slate-300 py-6 sm:py-8 mt-8 sm:mt-12">
          <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 sm:mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-400" />
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Code Craft Toolkit
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-xs"
                  onClick={() => setIsDeveloperModalOpen(true)}
                >
                  <User className="h-3 w-3 mr-1" />
                  Meet Developer
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  Docs
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 text-xs">
                  <Instagram className="h-3 w-3 mr-1" />
                  Social
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Support
                </Button>
              </div>
            </div>
            
            <div className="border-t border-slate-700 pt-4 sm:pt-6 text-center">
              <p className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <span>Crafted with</span> 
                  <span className="text-red-400">❤️</span>
                  <span>by</span>
                  <span className="text-blue-400 font-medium flex items-center gap-1">
                    <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                    G.Thangella
                  </span>
                </span>
                <span>&copy; {new Date().getFullYear()}</span>
              </p>
              <p className="text-slate-400 mt-2 flex items-center justify-center text-xs sm:text-sm">
                <Languages className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-400" />
                <span>Empowering developers worldwide with professional code tools</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
      
      <DeveloperModal 
        open={isDeveloperModalOpen} 
        onOpenChange={setIsDeveloperModalOpen} 
      />
      
      <Chatbot 
        forceOpen={isChatbotOpen}
        onOpenChange={handleChatbotChange}
      />
    </div>
  );
};

export default Index;
