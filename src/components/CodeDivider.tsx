import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Scissors,
  Download,
  Copy,
  Upload,
  FileText,
  Code,
  CheckCircle2,
  ClipboardCopy,
  AlertTriangle,
  Languages
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "./LoadingSpinner";

// Improved language detection patterns
const languagePatterns = [
  { 
    name: "HTML", 
    pattern: /<\s*(!DOCTYPE|html|head|body|div|span|h1|h2|a|header|footer|main|section|nav|img|ul|ol|li|table)\b/i,
    startComment: "<!-- HTML START -->",
    endComment: "<!-- HTML END -->",
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
    icon: <Code className="h-4 w-4 text-orange-500" />
  },
  { 
    name: "CSS", 
    pattern: /(\{[\s\S]*?\}|@media|@keyframes|@import|@font-face|\b(margin|padding|color|background|font|display|position|width|height)\s*:)/i,
    startComment: "/* CSS START */",
    endComment: "/* CSS END */",
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    icon: <Code className="h-4 w-4 text-blue-500" />
  },
  { 
    name: "React/JSX", 
    pattern: /(<[A-Z][a-zA-Z]*|<>\s*<\/?>|import\s+React|React\.|useState|useEffect|useContext|useRef|\bJSX\b|<\/[A-Z][a-zA-Z]*>|React\.Component|React\.FC|function\s+\w+\(\s*\{\s*\w+\s*(,\s*\w+\s*)*\}|\brender\s*\(\s*\)\s*\{)/i,
    startComment: "// React/JSX START",
    endComment: "// React/JSX END",
    color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
    icon: <Code className="h-4 w-4 text-cyan-500" />
  },
  { 
    name: "JavaScript", 
    pattern: /(\bfunction\b|\bconst\b|\blet\b|\bvar\b|\b(document|window)\.\b|\=\>|\bif\b|\bfor\b|\/\/.*|\bconsole\.log\b|\bimport\b|\bexport\b|\bclass\b|\bnew\b|\bthis\b|\breturn\b|\basync\b|\bawait\b)/i,
    startComment: "// JavaScript START",
    endComment: "// JavaScript END",
    color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
    icon: <Code className="h-4 w-4 text-yellow-500" />
  },
  { 
    name: "TypeScript", 
    pattern: /(\binterface\b|\btype\b|\bnamespace\b|:\s*(string|number|boolean|any)\b|\<[A-Z][A-Za-z]*\>|React\.FC\<|React\.Component\<|extends\s+React\.|\: React\.)/i,
    startComment: "// TypeScript START",
    endComment: "// TypeScript END",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    icon: <Code className="h-4 w-4 text-blue-600" />
  },
  { 
    name: "Python", 
    pattern: /(\bdef\b|\bclass\b|\bimport\b|\bfrom\b.*\bimport\b|\bindent\b|#.*|\bif __name__ == "__main__":|print\()/i,
    startComment: "# Python START",
    endComment: "# Python END",
    color: "text-blue-700 bg-blue-100 dark:bg-blue-900/30",
    icon: <Code className="h-4 w-4 text-blue-700" />
  },
  { 
    name: "Ruby", 
    pattern: /(\bdef\b|\bclass\b|\bmodule\b|\brequire\b|\battr_accessor\b|puts\b|\bdo\b|\bend\b)/i,
    startComment: "# Ruby START",
    endComment: "# Ruby END",
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    icon: <Code className="h-4 w-4 text-red-600" />
  },
  { 
    name: "Java", 
    pattern: /(\bpublic\b|\bprivate\b|\bclass\b|\bstatic\b|\bvoid\b|System\.out\.print)/i,
    startComment: "// Java START",
    endComment: "// Java END",
    color: "text-orange-700 bg-orange-100 dark:bg-orange-900/30",
    icon: <Code className="h-4 w-4 text-orange-700" />
  },
  { 
    name: "C#", 
    pattern: /(\bnamespace\b|\busing\b|\bclass\b|\bpublic\b|\bprivate\b|\bstatic\b|\bvoid\b|\bConsole\.Write)/i,
    startComment: "// C# START",
    endComment: "// C# END",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    icon: <Code className="h-4 w-4 text-purple-600" />
  },
  { 
    name: "PHP", 
    pattern: /(<\?php|\becho\b|\bfunction\b|\bforeach\b|\$[a-zA-Z_]+)/i,
    startComment: "<?php // PHP START",
    endComment: "// PHP END ?>",
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    icon: <Code className="h-4 w-4 text-purple-500" />
  },
  { 
    name: "Go", 
    pattern: /(\bpackage\b|\bimport\b|\bfunc\b|\bstruct\b|\binterface\b|\bmap\b|\bgo\b|\bchan\b)/i,
    startComment: "// Go START",
    endComment: "// Go END",
    color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
    icon: <Code className="h-4 w-4 text-cyan-600" />
  },
  { 
    name: "SQL", 
    pattern: /(\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bGROUP BY\b|\bORDER BY\b|\bINSERT INTO\b)/i,
    startComment: "-- SQL START",
    endComment: "-- SQL END",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    icon: <Code className="h-4 w-4 text-blue-600" />
  },
  { 
    name: "JSON", 
    pattern: /([\{\}]|"[^"]*"\s*:)/i,
    startComment: "/* JSON START */",
    endComment: "/* JSON END */",
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    icon: <Code className="h-4 w-4 text-green-600" />
  },
  { 
    name: "XML", 
    pattern: /(<\/[a-zA-Z][a-zA-Z0-9]*>|<[a-zA-Z][a-zA-Z0-9]*\/?>)/i,
    startComment: "<!-- XML START -->",
    endComment: "<!-- XML END -->",
    color: "text-orange-400 bg-orange-100 dark:bg-orange-900/30",
    icon: <Code className="h-4 w-4 text-orange-400" />
  },
  { 
    name: "C++", 
    pattern: /(\bclass\b|\binclude\b|\bvoid\b|\bint\b|\bstd::|#include\s*<[^>]+>|\bnamespace\b|\bpublic:\b|\bprivate:\b|\btemplate\b)/i,
    startComment: "// C++ START",
    endComment: "// C++ END",
    color: "text-blue-800 bg-blue-100 dark:bg-blue-900/30",
    icon: <Code className="h-4 w-4 text-blue-800" />
  },
  { 
    name: "C", 
    pattern: /(#include\s*<[^>]+>|\bint\s+main\b|\bvoid\b|\bchar\s*\*|\bprintf\b|\bstruct\b|\bint\b|\breturn\b)/i,
    startComment: "/* C START */",
    endComment: "/* C END */",
    color: "text-blue-900 bg-blue-100 dark:bg-blue-900/30",
    icon: <Code className="h-4 w-4 text-blue-900" />
  },
  { 
    name: "Rust", 
    pattern: /(\bfn\b|\blet\b|\bmut\b|\buse\b|\bstruct\b|\benum\b|\bimpl\b|\bpub\b)/i,
    startComment: "// Rust START",
    endComment: "// Rust END",
    color: "text-orange-800 bg-orange-100 dark:bg-orange-900/30",
    icon: <Code className="h-4 w-4 text-orange-800" />
  },
  { 
    name: "Swift", 
    pattern: /(\bfunc\b|\bvar\b|\blet\b|\bclass\b|\bstruct\b|\benum\b|\bguard\b|\bif\b|\bswitch\b)/i,
    startComment: "// Swift START",
    endComment: "// Swift END",
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
    icon: <Code className="h-4 w-4 text-orange-500" />
  },
  { 
    name: "Kotlin", 
    pattern: /(\bfun\b|\bval\b|\bvar\b|\bclass\b|\bprivate\b|\boverride\b|\bdata\b|\bobject\b)/i,
    startComment: "// Kotlin START",
    endComment: "// Kotlin END",
    color: "text-purple-700 bg-purple-100 dark:bg-purple-900/30",
    icon: <Code className="h-4 w-4 text-purple-700" />
  },
  { 
    name: "Markdown", 
    pattern: /(#+\s+|\*\*|\*|\[.*\]\(.*\)|`{1,3})/i,
    startComment: "<!-- Markdown START -->",
    endComment: "<!-- Markdown END -->",
    color: "text-slate-700 bg-slate-100 dark:bg-slate-800/30",
    icon: <Code className="h-4 w-4 text-slate-700" />
  },
  { 
    name: "YAML", 
    pattern: /(\w+:\s+|\-\s+\w+:)/i,
    startComment: "# YAML START",
    endComment: "# YAML END",
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    icon: <Code className="h-4 w-4 text-blue-500" />
  }
];

interface DetectedLanguage {
  name: string;
  code: string;
  confidence: number;
  icon?: JSX.Element;
  color?: string;
}

const CodeDivider = () => {
  const [inputCode, setInputCode] = useState("");
  const [dividedCode, setDividedCode] = useState<DetectedLanguage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // Improved language detection algorithm with better React detection
  const detectLanguages = (code: string): DetectedLanguage[] => {
    if (!code.trim()) return [];
    
    const result: DetectedLanguage[] = [];
    const uniqueLanguages = new Set<string>();
    
    // Check for React/JSX specifically first
    const reactMatches = (code.match(languagePatterns.find(l => l.name === "React/JSX")?.pattern || /a^/) || []).length;
    const hasReactImports = /\bimport\s+(?:React|{[^}]*useState|{[^}]*useEffect|{[^}]*Component})[^;]*from\s+['"]react['"]/i.test(code);
    const hasJSXSyntax = /<[A-Z][a-zA-Z]*[^>]*>[^<]*<\/[A-Z][a-zA-Z]*>/i.test(code);
    
    if (hasReactImports || hasJSXSyntax || reactMatches > 1) {
      // This is almost certainly React code
      const reactLanguage = languagePatterns.find(l => l.name === "React/JSX");
      if (reactLanguage) {
        uniqueLanguages.add(reactLanguage.name);
        
        // Calculate confidence with special ReactJS boost
        const totalLines = code.split('\n').length;
        let confidence = Math.min(100, Math.round((reactMatches / (totalLines * 0.2)) * 100));
        
        // Boost confidence if explicit React imports or JSX syntax found
        if (hasReactImports) confidence = Math.min(100, confidence + 40);
        if (hasJSXSyntax) confidence = Math.min(100, confidence + 40);
        
        result.push({
          name: reactLanguage.name,
          code: code,
          confidence: Math.max(70, confidence), // Minimum confidence for React detection
          icon: reactLanguage.icon,
          color: reactLanguage.color
        });
      }
    }
    
    // Calculate confidence scores for each language
    const languageScores = languagePatterns.map(language => {
      // Skip React specific detection as we've already handled it
      if (language.name === "React/JSX" && result.some(r => r.name === "React/JSX")) {
        return {
          name: language.name,
          pattern: language.pattern,
          confidence: 0,
          startComment: language.startComment,
          endComment: language.endComment,
          icon: language.icon,
          color: language.color
        };
      }
      
      const matches = (code.match(language.pattern) || []).length;
      const totalLines = code.split('\n').length;
      
      // Adjust confidence calculation for more accurate detection
      let confidence = Math.min(100, Math.round((matches / (totalLines * 0.3)) * 100));
      
      // Special handling for specific languages to reduce false positives
      if (language.name === "HTML" && matches < 3) {
        confidence = Math.round(confidence * 0.7); // Reduce HTML confidence if few matches
      }
      
      // If code contains JavaScript but is actually React, reduce JS confidence
      if (language.name === "JavaScript" && result.some(r => r.name === "React/JSX")) {
        confidence = Math.round(confidence * 0.6);
      }
      
      return {
        name: language.name,
        pattern: language.pattern,
        confidence: confidence,
        startComment: language.startComment,
        endComment: language.endComment,
        icon: language.icon,
        color: language.color
      };
    });
    
    // Sort by confidence score (descending)
    languageScores.sort((a, b) => b.confidence - a.confidence);
    
    // Filter out low-confidence detections
    const significantLanguages = languageScores.filter(lang => lang.confidence > 20);
    
    if (significantLanguages.length === 0 && result.length === 0) {
      // If no language detected with confidence, return plain text
      return [{
        name: "Plain Text",
        code: code,
        confidence: 100,
        icon: <FileText className="h-4 w-4 text-slate-500" />,
        color: "text-slate-500 bg-slate-100 dark:bg-slate-800/30"
      }];
    }
    
    // Extract code for each detected language
    for (const lang of significantLanguages) {
      if (uniqueLanguages.has(lang.name)) continue;
      uniqueLanguages.add(lang.name);
      
      // Look for specific language blocks first based on their patterns
      let extractedCode = "";
      let remainingCode = code;
      
      // Try to extract all segments matching this language's pattern
      const lines = code.split('\n');
      const matchingLines = lines.filter(line => 
        line.match(lang.pattern)
      );
      
      if (matchingLines.length > 0) {
        extractedCode = matchingLines.join('\n');
        
        // Add the extracted code for this language
        result.push({
          name: lang.name,
          code: extractedCode,
          confidence: lang.confidence,
          icon: lang.icon,
          color: lang.color
        });
      }
    }
    
    // If no languages were detected with the pattern matching approach
    if (result.length === 0) {
      return [{
        name: "Plain Text",
        code: code,
        confidence: 100,
        icon: <FileText className="h-4 w-4 text-slate-500" />,
        color: "text-slate-500 bg-slate-100 dark:bg-slate-800/30"
      }];
    }
    
    return result;
  };
  
  const divideCode = async () => {
    if (!inputCode.trim()) {
      toast.warning("Please enter some code first", {
        description: "The code divider needs content to analyze"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const detectedLanguages = detectLanguages(inputCode);
      setDividedCode(detectedLanguages);
      
      if (detectedLanguages.length > 0) {
        // Set first tab as active
        setActiveTab(detectedLanguages[0].name);
        
        const languageNames = detectedLanguages.map(lang => lang.name).join(', ');
        toast.success("Code successfully divided", {
          description: `Detected ${detectedLanguages.length} languages: ${languageNames}`
        });
      } else {
        toast.info("No specific languages detected", {
          description: "Your code appears to be plain text or in a format we don't recognize"
        });
      }
    } catch (error) {
      console.error("Error dividing code:", error);
      toast.error("Failed to divide code", {
        description: "Please check your input and try again"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputCode(content);
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    event.target.value = "";
    
    toast.success(`File loaded successfully`, {
      description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    });
  };
  
  const copyCode = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`${language} code copied to clipboard`);
  };
  
  const downloadCode = (code: string, language: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Get file extension based on language
    const extension = languagePatterns.find(lang => lang.name === language)?.name.toLowerCase() || 'txt';
    a.download = `${language.toLowerCase()}_code.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${language} code`);
  };
  
  const downloadAllCode = () => {
    if (dividedCode.length === 0) {
      toast.warning("No divided code to download");
      return;
    }
    
    let combinedCode = "";
    
    dividedCode.forEach(lang => {
      const startComment = languagePatterns.find(p => p.name === lang.name)?.startComment || `// ${lang.name} START`;
      const endComment = languagePatterns.find(p => p.name === lang.name)?.endComment || `// ${lang.name} END`;
      
      combinedCode += `\n${startComment}\n${lang.code}\n${endComment}\n\n`;
    });
    
    const blob = new Blob([combinedCode.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "divided_code_all_languages.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded all divided code");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Input Code</h3>
              </div>
              <div className="relative">
                <Input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={handleFileUpload}
                />
                <Button variant="outline" size="sm" className="flex gap-1 bg-white dark:bg-slate-800">
                  <Upload className="h-3 w-3" />
                  <span className="text-xs">Upload Code</span>
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Paste your mixed code here..."
              className="min-h-[300px] font-mono text-sm resize-y bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col"
        >
          <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 flex-1">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-medium">Divide Settings</h3>
                </div>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                  {languagePatterns.length} Languages Supported
                </Badge>
              </div>
              
              <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300">
                <p>Use the code divider to automatically separate mixed code into its respective programming languages. Upload a file or paste your code in the input area.</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Smart language detection with confidence scoring</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Support for 20+ programming languages</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Export individual language files</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={divideCode} 
                  disabled={isProcessing || !inputCode.trim()}
                  className="w-full gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size={16} className="mr-1" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="h-4 w-4" />
                      <span>Divide Code</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                Paste your code and click "Divide Code" to extract languages
              </div>
            </CardContent>
          </Card>
          
          {dividedCode.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Detected Languages</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadAllCode}
                className="flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                <span className="text-xs">Download All</span>
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {dividedCode.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <Tabs value={activeTab || ""} onValueChange={setActiveTab} className="w-full">
              <div className="bg-slate-50 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                <TabsList className="inline-flex w-auto h-9 bg-transparent">
                  {dividedCode.map((lang) => (
                    <TabsTrigger 
                      key={lang.name} 
                      value={lang.name}
                      className="data-[state=active]:shadow-sm data-[state=active]:text-indigo-700 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 gap-1.5"
                    >
                      {lang.icon}
                      <span>{lang.name}</span>
                      <Badge 
                        className="ml-1 h-5 text-xs px-1.5"
                        variant="outline"
                      >
                        {lang.confidence}%
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {dividedCode.map((lang) => (
                <TabsContent 
                  key={lang.name} 
                  value={lang.name}
                  className="p-0 m-0"
                >
                  <div className="p-3 bg-white dark:bg-slate-850 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${lang.color || ""} border-0`}
                      >
                        {lang.name}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {lang.code.split('\n').length} lines
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyCode(lang.code, lang.name)}
                        className="h-8 gap-1"
                      >
                        <ClipboardCopy className="h-3.5 w-3.5" />
                        <span className="text-xs">Copy</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => downloadCode(lang.code, lang.name)}
                        className="h-8 gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="text-xs">Download</span>
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[300px] bg-slate-50 dark:bg-slate-900 rounded-b-lg">
                    <div className="p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                        {lang.code}
                      </pre>
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.div>
      )}
      
      {inputCode && !dividedCode.length && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
        >
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4 opacity-70" />
          <p className="text-slate-500">Click "Divide Code" to analyze and separate your code by language</p>
        </motion.div>
      )}
    </div>
  );
};

export default CodeDivider;
