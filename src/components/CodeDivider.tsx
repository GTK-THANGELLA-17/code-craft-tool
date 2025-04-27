
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Code,
  Download,
  Copy,
  Upload,
  FileCode,
  FileText,
  Scissors,
  Zap
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

// Programming language detection patterns
const languagePatterns = [
  { name: "HTML", pattern: /<\s*(!DOCTYPE|html|head|body|div|span|h1|h2|a)\b/i, color: "orange" },
  { name: "CSS", pattern: /(\{[\s\S]*?\}|@media|@keyframes|@import|@font-face|\b(margin|padding|color|background|font|display|position|width|height)\s*:)/i, color: "blue" },
  { name: "JavaScript", pattern: /(\bfunction\b|\bconst\b|\blet\b|\bvar\b|\b(document|window)\.\b|\=\>|\bif\b|\bfor\b|\/\/.*|\bconsole\.log\b)/i, color: "yellow" },
  { name: "TypeScript", pattern: /(\binterface\b|\btype\b|\bnamespace\b|:\s*(string|number|boolean|any)\b)/i, color: "blue" },
  { name: "Python", pattern: /(\bdef\b|\bclass\b|\bimport\b|\bfrom\b.*\bimport\b|\bindent\b|#.*|\bif __name__ == "__main__":|print\()/i, color: "blue" },
  { name: "Ruby", pattern: /(\bdef\b|\bclass\b|\bmodule\b|\brequire\b|\battr_accessor\b|puts\b|\bdo\b|\bend\b)/i, color: "red" },
  { name: "Java", pattern: /(\bpublic\b|\bprivate\b|\bclass\b|\bstatic\b|\bvoid\b|System\.out\.print)/i, color: "orange" },
  { name: "C#", pattern: /(\bnamespace\b|\busing\b|\bclass\b|\bpublic\b|\bprivate\b|\bstatic\b|\bvoid\b|\bConsole\.Write)/i, color: "purple" },
  { name: "PHP", pattern: /(<\?php|\becho\b|\bfunction\b|\bforeach\b|\$[a-zA-Z_]+)/i, color: "purple" },
  { name: "Go", pattern: /(\bpackage\b|\bimport\b|\bfunc\b|\bstruct\b|\binterface\b|\bmap\b|\bgo\b|\bchan\b)/i, color: "cyan" },
  { name: "Rust", pattern: /(\bfn\b|\blet\b|\bmod\b|\bstruct\b|\benum\b|\bimpl\b|\bpub\b|\bmut\b)/i, color: "brown" },
  { name: "Swift", pattern: /(\bfunc\b|\blet\b|\bvar\b|\bclass\b|\bstruct\b|\benum\b|\bguard\b|\bif\b|\bswitch\b)/i, color: "orange" },
  { name: "Kotlin", pattern: /(\bfun\b|\bval\b|\bvar\b|\bclass\b|\bprivate\b|\boverride\b|\bdata\b|\bobject\b)/i, color: "purple" },
  { name: "SQL", pattern: /(\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bGROUP BY\b|\bORDER BY\b|\bINSERT INTO\b)/i, color: "blue" },
];

interface OutputSection {
  id: string;
  name: string;
  code: string;
  icon: JSX.Element;
  color: string;
  detected: boolean;
}

const CodeDivider = () => {
  const [codeInput, setCodeInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [removeComments, setRemoveComments] = useState(false);
  const [normalizeIndentation, setNormalizeIndentation] = useState(false);
  
  const initialSections = [
    { id: "html", name: "HTML", code: "", icon: <FileCode className="h-5 w-5 text-orange-500" />, color: "orange", detected: false },
    { id: "css", name: "CSS", code: "", icon: <FileCode className="h-5 w-5 text-blue-500" />, color: "blue", detected: false },
    { id: "javascript", name: "JavaScript", code: "", icon: <FileCode className="h-5 w-5 text-yellow-500" />, color: "yellow", detected: false },
    { id: "typescript", name: "TypeScript", code: "", icon: <FileCode className="h-5 w-5 text-blue-700" />, color: "blue", detected: false },
    { id: "python", name: "Python", code: "", icon: <FileCode className="h-5 w-5 text-blue-700" />, color: "blue", detected: false },
    { id: "ruby", name: "Ruby", code: "", icon: <FileCode className="h-5 w-5 text-red-600" />, color: "red", detected: false },
    { id: "java", name: "Java", code: "", icon: <FileCode className="h-5 w-5 text-orange-600" />, color: "orange", detected: false },
    { id: "csharp", name: "C#", code: "", icon: <FileCode className="h-5 w-5 text-purple-600" />, color: "purple", detected: false },
    { id: "php", name: "PHP", code: "", icon: <FileCode className="h-5 w-5 text-purple-500" />, color: "purple", detected: false },
    { id: "go", name: "Go", code: "", icon: <FileCode className="h-5 w-5 text-cyan-600" />, color: "cyan", detected: false },
    { id: "rust", name: "Rust", code: "", icon: <FileCode className="h-5 w-5 text-amber-700" />, color: "brown", detected: false },
    { id: "swift", name: "Swift", code: "", icon: <FileCode className="h-5 w-5 text-orange-500" />, color: "orange", detected: false },
    { id: "kotlin", name: "Kotlin", code: "", icon: <FileCode className="h-5 w-5 text-purple-500" />, color: "purple", detected: false },
    { id: "sql", name: "SQL", code: "", icon: <FileCode className="h-5 w-5 text-blue-600" />, color: "blue", detected: false }
  ];
  
  const [outputSections, setOutputSections] = useState<OutputSection[]>(initialSections);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCodeInput(content);
      
      // Auto-detect language on file upload
      detectLanguage(content);
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    event.target.value = "";
    
    toast.success("File loaded successfully", {
      description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    });
  };
  
  const detectLanguage = (code: string): string | null => {
    if (!code.trim()) return null;
    
    // Score each language pattern
    const scores = languagePatterns.map(language => {
      const matches = code.match(language.pattern) || [];
      return {
        name: language.name,
        score: matches.length,
        color: language.color
      };
    }).filter(lang => lang.score > 0);
    
    // Sort by score and get the highest
    scores.sort((a, b) => b.score - a.score);
    
    if (scores.length > 0) {
      const detected = scores[0].name;
      setDetectedLanguage(detected);
      toast.success(`Detected ${detected} code`, {
        description: "The code will be processed accordingly"
      });
      return detected;
    }
    
    setDetectedLanguage(null);
    return null;
  };
  
  const preprocessCode = (code: string): string => {
    let processedCode = code;
    
    if (removeComments) {
      // Remove comments based on detected language
      if (detectedLanguage === "JavaScript" || detectedLanguage === "TypeScript" || detectedLanguage === "Java" || detectedLanguage === "C#") {
        processedCode = processedCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      } else if (detectedLanguage === "Python" || detectedLanguage === "Ruby") {
        processedCode = processedCode.replace(/#.*$/gm, '');
      } else if (detectedLanguage === "HTML") {
        processedCode = processedCode.replace(/<!--[\s\S]*?-->/g, '');
      } else if (detectedLanguage === "CSS") {
        processedCode = processedCode.replace(/\/\*[\s\S]*?\*\//g, '');
      }
    }
    
    if (normalizeIndentation) {
      // Normalize indentation
      const lines = processedCode.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);
      
      if (nonEmptyLines.length > 0) {
        // Find minimum indentation
        const minIndent = nonEmptyLines.reduce((min, line) => {
          const indent = line.match(/^\s*/)[0].length;
          return indent < min ? indent : min;
        }, Infinity);
        
        // Remove minimum indentation from all lines
        if (minIndent < Infinity && minIndent > 0) {
          processedCode = lines.map(line => {
            if (line.trim().length === 0) return line;
            return line.substring(minIndent);
          }).join('\n');
        }
      }
    }
    
    return processedCode;
  };
  
  const divideCode = async () => {
    // Skip if input is empty
    if (!codeInput.trim()) {
      toast.error("Please enter some code to divide");
      return;
    }

    setIsProcessing(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const processedCode = preprocessCode(codeInput);
      
      // Reset output sections
      const updatedSections = [...initialSections].map(section => ({
        ...section,
        code: "",
        detected: false
      }));
      
      // Extract HTML (excluding <style> and <script> tags)
      const htmlBodyRegex = /<html[\s\S]*?>[\s\S]*?<\/html>/gi;
      const htmlMatch = processedCode.match(htmlBodyRegex);
      
      if (htmlMatch) {
        // Get HTML but remove any embedded scripts and styles
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlMatch[0];
        
        // Remove script tags
        const scriptElements = tempContainer.querySelectorAll('script');
        scriptElements.forEach(script => script.remove());
        
        // Remove style tags
        const styleElements = tempContainer.querySelectorAll('style');
        styleElements.forEach(style => style.remove());
        
        const htmlSection = updatedSections.find(s => s.id === "html");
        if (htmlSection) {
          htmlSection.code = tempContainer.innerHTML;
          htmlSection.detected = true;
        }
      }

      // Extract CSS content (both from <style> tags and specific CSS comments)
      const cssRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      const cssFileRegex = /\/\* CSS START \*\/([\s\S]*?)\/\* CSS END \*\//gi;
      const cssMatches: string[] = [];
      
      let cssMatch;
      while ((cssMatch = cssRegex.exec(processedCode)) !== null) {
        cssMatches.push(cssMatch[1]);
      }
      
      let cssFileMatch;
      while ((cssFileMatch = cssFileRegex.exec(processedCode)) !== null) {
        cssMatches.push(cssFileMatch[1]);
      }
      
      const cssSection = updatedSections.find(s => s.id === "css");
      if (cssSection && cssMatches.length > 0) {
        cssSection.code = cssMatches.join('\n\n');
        cssSection.detected = true;
      }

      // Extract JS content (both from <script> tags and specific JS comments)
      const jsRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
      const jsFileRegex = /\/\/ JavaScript START([\s\S]*?)\/\/ JavaScript END/gi;
      const jsMatches: string[] = [];
      
      let jsMatch;
      while ((jsMatch = jsRegex.exec(processedCode)) !== null) {
        jsMatches.push(jsMatch[1]);
      }
      
      let jsFileMatch;
      while ((jsFileMatch = jsFileRegex.exec(processedCode)) !== null) {
        jsMatches.push(jsFileMatch[1]);
      }
      
      const jsSection = updatedSections.find(s => s.id === "javascript");
      if (jsSection && jsMatches.length > 0) {
        jsSection.code = jsMatches.join('\n\n');
        jsSection.detected = true;
      }

      // Extract other languages based on comment markers
      const extractLanguageSection = (sectionId: string, startMarker: string, endMarker: string) => {
        const regex = new RegExp(`${startMarker}([\\s\\S]*?)${endMarker}`, 'gi');
        const matches: string[] = [];
        
        let match;
        while ((match = regex.exec(processedCode)) !== null) {
          matches.push(match[1]);
        }
        
        const section = updatedSections.find(s => s.id === sectionId);
        if (section && matches.length > 0) {
          section.code = matches.join('\n\n');
          section.detected = true;
        }
      };

      extractLanguageSection("python", "# Python START", "# Python END");
      extractLanguageSection("ruby", "# Ruby START", "# Ruby END");
      extractLanguageSection("typescript", "// TypeScript START", "// TypeScript END");
      extractLanguageSection("java", "// Java START", "// Java END");
      extractLanguageSection("csharp", "// C# START", "// C# END");
      extractLanguageSection("php", "<?php", "?>");
      extractLanguageSection("go", "// Go START", "// Go END");
      extractLanguageSection("rust", "// Rust START", "// Rust END");
      extractLanguageSection("swift", "// Swift START", "// Swift END");
      extractLanguageSection("kotlin", "// Kotlin START", "// Kotlin END");
      extractLanguageSection("sql", "-- SQL START", "-- SQL END");
      
      // If no specific language blocks were found, try to detect from the entire code
      if (!updatedSections.some(section => section.detected)) {
        const detected = detectedLanguage || detectLanguage(processedCode);
        if (detected) {
          const section = updatedSections.find(s => s.name === detected);
          if (section) {
            section.code = processedCode;
            section.detected = true;
          }
        }
      }

      setOutputSections(updatedSections);
      
      // Count detected languages
      const detectedCount = updatedSections.filter(s => s.detected).length;
      
      if (detectedCount > 0) {
        toast.success(`Code divided successfully`, {
          description: `Detected ${detectedCount} language${detectedCount > 1 ? 's' : ''}`
        });
      } else {
        toast.warning("No specific code patterns detected", {
          description: "Try providing more code or check the format"
        });
      }
    } catch (error) {
      console.error("Error dividing code:", error);
      toast.error("Error processing code", {
        description: "Please check your code format and try again"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const copyCode = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`${language} code copied to clipboard`);
  };
  
  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${filename}`);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 p-6 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1">
              <Input 
                type="file" 
                id="fileInput" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={handleFileUpload}
              />
              <Button variant="outline" className="w-full flex gap-2 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-300">
                <Upload className="h-4 w-4" />
                <span>Upload Code File</span>
              </Button>
            </div>
            <Button 
              onClick={divideCode} 
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Scissors className="h-4 w-4" />
                  </motion.div>
                  <span>Dividing...</span>
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4" />
                  <span>Divide Code</span>
                </>
              )}
            </Button>
          </div>
          
          <Collapsible className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Zap className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-medium">Advanced Options</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="text-xs">Toggle options</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="removeComments" 
                    checked={removeComments} 
                    onCheckedChange={(checked) => setRemoveComments(checked as boolean)} 
                  />
                  <label
                    htmlFor="removeComments"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remove comments
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="normalizeIndentation" 
                    checked={normalizeIndentation} 
                    onCheckedChange={(checked) => setNormalizeIndentation(checked as boolean)}
                  />
                  <label
                    htmlFor="normalizeIndentation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Normalize indentation
                  </label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="relative">
            <Textarea
              id="codeInput"
              placeholder="Enter or upload your code here..."
              className="min-h-[200px] font-mono text-sm resize-y bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value);
                if (e.target.value.trim() && !detectedLanguage) {
                  detectLanguage(e.target.value);
                }
              }}
            />
            {detectedLanguage && (
              <div className="absolute right-2 bottom-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                Detected: {detectedLanguage}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {outputSections.some(section => section.detected) && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {outputSections.filter(section => section.detected).map((section) => (
            <motion.div key={section.id} variants={itemVariants}>
              <Card className="overflow-hidden border-t-4" style={{ borderTopColor: `var(--${section.color}-500)` }}>
                <CardHeader className={`bg-gradient-to-r from-${section.color}-500/10 to-${section.color}-600/5 dark:from-${section.color}-900/20 dark:to-${section.color}-800/10 flex flex-row items-center gap-2 py-3`}>
                  <CardTitle className="flex items-center text-lg">
                    {section.icon}
                    <span className="ml-2">{section.name} Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[200px] p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{section.code}</pre>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between p-2 gap-2 bg-slate-50/80 dark:bg-slate-800/50">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => copyCode(section.code, section.name)}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => downloadCode(section.code, `code.${section.id}`)}
                  >
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CodeDivider;
