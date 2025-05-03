
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
  Settings
} from "lucide-react";
import CodeDivider from "@/components/CodeDivider";
import CodeMerger from "@/components/CodeMerger";
import CodeDifferencer from "@/components/CodeDifferencer";
import CodeFormatter from "@/components/CodeFormatter";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageLoading from "@/components/PageLoading";

const Index = () => {
  const [activeTab, setActiveTab] = useState("divider");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time
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

  return (
    <>
      <AnimatePresence>
        {isLoading && <PageLoading />}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -inset-[10px]" style={{ background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") " }} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <Code className="h-5 w-5" />
              <span className="text-sm font-medium">Developer-Friendly Tools</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl font-bold flex items-center justify-center gap-3 mb-4">
              <Code className="h-10 w-10" />
              Code Craft Toolkit
            </h1>
            
            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
              A comprehensive suite of tools to manipulate, compare, and format code snippets across multiple programming languages
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                onClick={() => handleTabChange("divider")}
              >
                <Scissors className="h-4 w-4 mr-2" /> 
                Try Code Divider
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                onClick={() => handleTabChange("formatter")}
              >
                <Code className="h-4 w-4 mr-2" /> 
                Try Code Formatter
              </Button>
            </div>
          </motion.div>
        </header>

        <main className="container mx-auto py-12 px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <TabsTrigger 
                  value="divider" 
                  className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/80 data-[state=active]:to-indigo-500/80 data-[state=active]:text-white"
                >
                  <Scissors className="h-4 w-4" />
                  <span className="hidden sm:inline">Divide Code</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="merger" 
                  className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/80 data-[state=active]:to-indigo-500/80 data-[state=active]:text-white"
                >
                  <GitMerge className="h-4 w-4" />
                  <span className="hidden sm:inline">Merge Code</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="differencer" 
                  className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/80 data-[state=active]:to-indigo-500/80 data-[state=active]:text-white"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Code Differencer</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="formatter" 
                  className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/80 data-[state=active]:to-indigo-500/80 data-[state=active]:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Code Formatter</span>
                </TabsTrigger>
              </TabsList>
              
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="divider" className="mt-0">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Code Divider</h2>
                    <p className="text-slate-600 dark:text-slate-400">Upload or paste your code and automatically separate it into different programming languages.</p>
                  </div>
                  <CodeDivider />
                </TabsContent>
                
                <TabsContent value="merger" className="mt-0">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Code Merger</h2>
                    <p className="text-slate-600 dark:text-slate-400">Combine code from multiple programming languages into a single structured file.</p>
                  </div>
                  <CodeMerger />
                </TabsContent>
                
                <TabsContent value="differencer" className="mt-0">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Code Differencer</h2>
                    <p className="text-slate-600 dark:text-slate-400">Compare two versions of code to identify changes, additions, and deletions.</p>
                  </div>
                  <CodeDifferencer />
                </TabsContent>
                
                <TabsContent value="formatter" className="mt-0">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Code Formatter</h2>
                    <p className="text-slate-600 dark:text-slate-400">Format and beautify your code with language-specific rules and syntax highlighting.</p>
                  </div>
                  <CodeFormatter />
                </TabsContent>
              </motion.div>
            </Tabs>
          </motion.div>
        </main>

        <section className="py-12 px-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Why Use Code Craft Toolkit?</h2>
              <p className="text-slate-600 dark:text-slate-400">Powerful tools designed to make developers' lives easier</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
              >
                <Scissors className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Language Detection</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Smart detection for 20+ programming languages with confidence scoring.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
              >
                <GitMerge className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Simple Merging</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Combine multiple code files with proper language sections and syntax highlighting.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
              >
                <Eye className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Visual Diffing</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Compare code versions with visual highlighting to spot changes instantly.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
              >
                <Settings className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Smart Formatting</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Format code with language-specific rules and customizable options.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-300 py-10 mt-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <Code className="h-6 w-6 mr-2 text-blue-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Code Craft Toolkit</span>
              </div>
              
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Support
                </Button>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-6 text-center">
              <p className="flex items-center justify-center gap-2">
                <span>Designed and developed by</span> 
                <span className="text-blue-400 font-medium flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  G.Thangella
                </span>
                <span>&copy; {new Date().getFullYear()}</span>
              </p>
              <p className="text-sm text-slate-400 mt-2 flex items-center justify-center">
                <Languages className="h-4 w-4 mr-1 text-blue-400" />
                <span>Built with passion for developers worldwide</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
