import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  GitMerge,
  Download,
  Copy,
  Upload,
  FileText,
  Code,
  CheckCircle2,
  FilePlus,
  Terminal,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingSpinner from "./LoadingSpinner";

interface CodeSection {
  id: string;
  icon: JSX.Element;
  fileAccept: string;
  placeholder: string;
  startComment: string;
  endComment: string;
  value: string;
  name: string;
  color: string;
  extension: string;
  validator?: (code: string) => { valid: boolean; message?: string };
}

const CodeMerger = () => {
  const [codeSections, setCodeSections] = useState<CodeSection[]>([
    {
      id: "html",
      icon: <Code className="h-5 w-5 text-orange-500" />,
      fileAccept: ".html",
      placeholder: "Enter HTML code here...",
      startComment: "<!-- HTML START -->",
      endComment: "<!-- HTML END -->",
      value: "",
      name: "HTML",
      color: "orange",
      extension: "html",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicHtmlCheck = /<\s*(!DOCTYPE|html|head|body|div|span|h1|h2|a|header|footer|main|section|nav)\b/i.test(code);
        return { 
          valid: basicHtmlCheck, 
          message: basicHtmlCheck ? undefined : "This doesn't appear to be valid HTML. Check for missing tags or syntax errors." 
        };
      }
    },
    {
      id: "react",
      icon: <Code className="h-5 w-5 text-cyan-500" />,
      fileAccept: ".jsx,.tsx",
      placeholder: "Enter React/JSX code here...",
      startComment: "// React/JSX START",
      endComment: "// React/JSX END",
      value: "",
      name: "React/JSX",
      color: "cyan",
      extension: "jsx",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const hasReactSyntax = /(<[A-Z][a-zA-Z]*|import\s+(?:React|{[^}]*useState|{[^}]*useEffect})[^;]*from\s+['"]react['"])/i.test(code);
        return { 
          valid: hasReactSyntax, 
          message: hasReactSyntax ? undefined : "This doesn't appear to be valid React code. Check for missing React imports or JSX syntax." 
        };
      }
    },
    {
      id: "css",
      icon: <Code className="h-5 w-5 text-blue-500" />,
      fileAccept: ".css",
      placeholder: "Enter CSS code here...",
      startComment: "/* CSS START */",
      endComment: "/* CSS END */",
      value: "",
      name: "CSS",
      color: "blue",
      extension: "css",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicCssCheck = /(\{[\s\S]*?\}|@media|@keyframes|@import|@font-face|\b(margin|padding|color|background|font|display|position|width|height)\s*:)/i.test(code);
        return { 
          valid: basicCssCheck, 
          message: basicCssCheck ? undefined : "This doesn't appear to be valid CSS. Check for missing braces or syntax errors." 
        };
      }
    },
    {
      id: "js",
      icon: <Code className="h-5 w-5 text-yellow-500" />,
      fileAccept: ".js",
      placeholder: "Enter JavaScript code here...",
      startComment: "// JavaScript START",
      endComment: "// JavaScript END",
      value: "",
      name: "JavaScript",
      color: "yellow",
      extension: "js",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicJsCheck = /(\bfunction\b|\bconst\b|\blet\b|\bvar\b|\b(document|window)\.\b|\=\>|\bif\b|\bfor\b|\/\/.*|\bconsole\.log\b|\bimport\b|\bexport\b)/i.test(code);
        return { 
          valid: basicJsCheck, 
          message: basicJsCheck ? undefined : "This doesn't appear to be valid JavaScript. Check for syntax errors." 
        };
      }
    },
    {
      id: "typescript",
      icon: <Code className="h-5 w-5 text-blue-600" />,
      fileAccept: ".ts,.tsx",
      placeholder: "Enter TypeScript code here...",
      startComment: "// TypeScript START",
      endComment: "// TypeScript END",
      value: "",
      name: "TypeScript",
      color: "blue",
      extension: "ts",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicTsCheck = /(\binterface\b|\btype\b|\bnamespace\b|:\s*(string|number|boolean|any)\b|\<[A-Z][A-Za-z]*\>|React\.FC\<|React\.Component\<|extends\s+React\.|\: React\.)/i.test(code);
        return { 
          valid: basicTsCheck, 
          message: basicTsCheck ? undefined : "This doesn't appear to be valid TypeScript. Check for syntax errors or type definitions." 
        };
      }
    },
    {
      id: "python",
      icon: <Code className="h-5 w-5 text-blue-700" />,
      fileAccept: ".py",
      placeholder: "Enter Python code here...",
      startComment: "# Python START",
      endComment: "# Python END",
      value: "",
      name: "Python",
      color: "blue",
      extension: "py",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicPythonCheck = /(\bdef\b|\bclass\b|\bimport\b|\bfrom\b.*\bimport\b|\bindent\b|#.*|\bif __name__ == "__main__":|print\()/i.test(code);
        return { 
          valid: basicPythonCheck, 
          message: basicPythonCheck ? undefined : "This doesn't appear to be valid Python. Check for syntax or indentation errors." 
        };
      }
    },
    {
      id: "ruby",
      icon: <Code className="h-5 w-5 text-red-600" />,
      fileAccept: ".rb",
      placeholder: "Enter Ruby code here...",
      startComment: "# Ruby START",
      endComment: "# Ruby END",
      value: "",
      name: "Ruby",
      color: "red",
      extension: "rb",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicRubyCheck = /(\bdef\b|\bclass\b|\bmodule\b|\brequire\b|\battr_accessor\b|puts\b|\bdo\b|\bend\b)/i.test(code);
        return { 
          valid: basicRubyCheck, 
          message: basicRubyCheck ? undefined : "This doesn't appear to be valid Ruby. Check for syntax errors." 
        };
      }
    },
    {
      id: "java",
      icon: <Code className="h-5 w-5 text-orange-700" />,
      fileAccept: ".java",
      placeholder: "Enter Java code here...",
      startComment: "// Java START",
      endComment: "// Java END",
      value: "",
      name: "Java",
      color: "orange",
      extension: "java",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicJavaCheck = /(\bpublic\b|\bprivate\b|\bclass\b|\bstatic\b|\bvoid\b|System\.out\.print)/i.test(code);
        return { 
          valid: basicJavaCheck, 
          message: basicJavaCheck ? undefined : "This doesn't appear to be valid Java. Check for syntax errors." 
        };
      }
    },
    {
      id: "csharp",
      icon: <Code className="h-5 w-5 text-purple-600" />,
      fileAccept: ".cs",
      placeholder: "Enter C# code here...",
      startComment: "// C# START",
      endComment: "// C# END",
      value: "",
      name: "C#",
      color: "purple",
      extension: "cs",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicCSharpCheck = /(\bnamespace\b|\busing\b|\bclass\b|\bpublic\b|\bprivate\b|\bstatic\b|\bvoid\b|\bConsole\.Write)/i.test(code);
        return { 
          valid: basicCSharpCheck, 
          message: basicCSharpCheck ? undefined : "This doesn't appear to be valid C#. Check for syntax errors." 
        };
      }
    },
    {
      id: "php",
      icon: <Code className="h-5 w-5 text-purple-500" />,
      fileAccept: ".php",
      placeholder: "Enter PHP code here...",
      startComment: "<?php // PHP START",
      endComment: "// PHP END ?>",
      value: "",
      name: "PHP",
      color: "purple",
      extension: "php",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicPhpCheck = /(<\?php|\becho\b|\bfunction\b|\bforeach\b|\$[a-zA-Z_]+)/i.test(code);
        return { 
          valid: basicPhpCheck, 
          message: basicPhpCheck ? undefined : "This doesn't appear to be valid PHP. Check for syntax errors." 
        };
      }
    },
    {
      id: "go",
      icon: <Code className="h-5 w-5 text-cyan-600" />,
      fileAccept: ".go",
      placeholder: "Enter Go code here...",
      startComment: "// Go START",
      endComment: "// Go END",
      value: "",
      name: "Go",
      color: "cyan",
      extension: "go",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicGoCheck = /(\bpackage\b|\bimport\b|\bfunc\b|\bstruct\b|\binterface\b|\bmap\b|\bgo\b|\bchan\b)/i.test(code);
        return { 
          valid: basicGoCheck, 
          message: basicGoCheck ? undefined : "This doesn't appear to be valid Go. Check for syntax errors." 
        };
      }
    },
    {
      id: "sql",
      icon: <Code className="h-5 w-5 text-blue-600" />,
      fileAccept: ".sql",
      placeholder: "Enter SQL code here...",
      startComment: "-- SQL START",
      endComment: "-- SQL END",
      value: "",
      name: "SQL",
      color: "blue",
      extension: "sql",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicSqlCheck = /(\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bGROUP BY\b|\bORDER BY\b|\bINSERT INTO\b)/i.test(code);
        return { 
          valid: basicSqlCheck, 
          message: basicSqlCheck ? undefined : "This doesn't appear to be valid SQL. Check for syntax errors." 
        };
      }
    },
    {
      id: "json",
      icon: <Code className="h-5 w-5 text-green-600" />,
      fileAccept: ".json",
      placeholder: "Enter JSON code here...",
      startComment: "/* JSON START */",
      endComment: "/* JSON END */",
      value: "",
      name: "JSON",
      color: "green",
      extension: "json",
      validator: (code: string) => {
        if (!code.trim()) return { valid: true };
        const basicJsonCheck = /([\{\}]|"[^"]*"\s*:)/i.test(code);
        return { 
          valid: basicJsonCheck, 
          message: basicJsonCheck ? undefined : "This doesn't appear to be valid JSON. Check for syntax errors." 
        };
      }
    }
  ]);
  
  const [mergedCode, setMergedCode] = useState("");
  const [isMerging, setIsMerging] = useState(false);
  const [addSyntaxHighlighting, setAddSyntaxHighlighting] = useState(false);
  const [addLineNumbers, setAddLineNumbers] = useState(false);
  const [formatCode, setFormatCode] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCodeSections(prev => 
        prev.map(section => 
          section.id === id ? { ...section, value: content } : section
        )
      );
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    event.target.value = "";
    
    const sectionName = codeSections.find(s => s.id === id)?.name || 'Code';
    toast.success(`${sectionName} file loaded successfully`, {
      description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    });
  };
  
  const handleTextAreaChange = (id: string, value: string) => {
    setCodeSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, value } : section
      )
    );
  };
  
  const validateCode = () => {
    let valid = true;
    const validationIssues: { id: string; message: string }[] = [];
    
    codeSections.forEach(section => {
      if (section.value.trim() && section.validator) {
        const result = section.validator(section.value);
        if (!result.valid && result.message) {
          valid = false;
          validationIssues.push({
            id: section.id,
            message: result.message
          });
        }
      }
    });
    
    if (!valid) {
      setShowValidationErrors(true);
      validationIssues.forEach(issue => {
        const sectionName = codeSections.find(s => s.id === issue.id)?.name || 'Code';
        toast.error(`Invalid ${sectionName}`, {
          description: issue.message
        });
      });
      return false;
    }
    
    return true;
  };
  
  const formatSourceCode = (code: string, language: string): string => {
    if (!formatCode) return code;
    
    // Simple code formatting for common languages
    try {
      // Split code into lines
      const lines = code.split('\n');
      
      // Remove excess blank lines (more than 2 consecutive blank lines)
      let formattedLines: string[] = [];
      let blankLineCount = 0;
      
      lines.forEach(line => {
        if (line.trim() === '') {
          blankLineCount++;
          if (blankLineCount <= 2) {
            formattedLines.push(line);
          }
        } else {
          blankLineCount = 0;
          formattedLines.push(line);
        }
      });
      
      // Remove trailing whitespace from each line
      formattedLines = formattedLines.map(line => line.replace(/\s+$/, ''));
      
      return formattedLines.join('\n');
    } catch (error) {
      console.error("Error formatting code:", error);
      return code; // Return original code if formatting fails
    }
  };
  
  const mergeCode = async () => {
    setIsMerging(true);
    
    // Simulate processing delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Validate code before merging
      if (!validateCode()) {
        setIsMerging(false);
        return;
      }
      
      let merged = '';
      let hasContent = false;
      
      codeSections.forEach(section => {
        if (section.value.trim()) {
          hasContent = true;
          
          // Add syntax highlighting comment for popular editors
          let codeBlock = section.value;
          
          // Format the code if enabled
          if (formatCode) {
            codeBlock = formatSourceCode(codeBlock, section.name.toLowerCase());
          }
          
          // Add pre tags with language class if syntax highlighting is enabled
          if (addSyntaxHighlighting) {
            merged += `${section.startComment}\n`;
            
            if (section.id === 'html' || section.id === 'xml') {
              merged += `<pre class="language-${section.id}">\n${codeBlock}\n</pre>\n`;
            } else {
              merged += `<pre><code class="language-${section.id}">\n${codeBlock}\n</code></pre>\n`;
            }
            
            merged += `${section.endComment}\n\n`;
          } else {
            merged += `${section.startComment}\n${codeBlock}\n${section.endComment}\n\n`;
          }
        }
      });
      
      // Add line numbers if enabled
      if (addLineNumbers && merged.trim()) {
        const lines = merged.split('\n');
        const numberedLines = lines.map((line, index) => {
          if (line.trim() === '') return '';
          return `${index + 1}. ${line}`;
        });
        merged = numberedLines.join('\n');
      }
      
      setMergedCode(merged);
      
      if (hasContent) {
        toast.success("Code successfully merged", {
          description: "Your code sections have been combined"
        });
      } else {
        toast.warning("No code to merge", {
          description: "Please enter code in at least one section"
        });
      }
    } catch (error) {
      console.error("Error merging code:", error);
      toast.error("Error merging code");
    } finally {
      setIsMerging(false);
    }
  };
  
  const copyMergedCode = () => {
    if (!mergedCode) {
      toast.error("Nothing to copy", {
        description: "Please merge your code first"
      });
      return;
    }
    
    navigator.clipboard.writeText(mergedCode);
    toast.success("Merged code copied to clipboard");
  };
  
  const downloadMergedCode = () => {
    if (!mergedCode) {
      toast.error("Nothing to download", {
        description: "Please merge your code first"
      });
      return;
    }
    
    const blob = new Blob([mergedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "merged_code.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded merged code");
  };

  const clearAllSections = () => {
    setCodeSections(prev => 
      prev.map(section => ({ ...section, value: "" }))
    );
    setMergedCode("");
    toast.info("All code sections cleared");
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>Merger Options</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="addSyntaxHighlighting" 
                      checked={addSyntaxHighlighting} 
                      onCheckedChange={(checked) => setAddSyntaxHighlighting(checked as boolean)}
                    />
                    <label
                      htmlFor="addSyntaxHighlighting"
                      className="text-sm font-medium"
                    >
                      Add syntax highlighting tags
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="addLineNumbers" 
                      checked={addLineNumbers} 
                      onCheckedChange={(checked) => setAddLineNumbers(checked as boolean)}
                    />
                    <label
                      htmlFor="addLineNumbers"
                      className="text-sm font-medium"
                    >
                      Add line numbers
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="formatCode" 
                      checked={formatCode} 
                      onCheckedChange={(checked) => setFormatCode(checked as boolean)}
                    />
                    <label
                      htmlFor="formatCode"
                      className="text-sm font-medium"
                    >
                      Basic code formatting
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="validateCode" 
                      checked={showValidationErrors} 
                      onCheckedChange={(checked) => setShowValidationErrors(checked as boolean)}
                    />
                    <label
                      htmlFor="validateCode"
                      className="text-sm font-medium"
                    >
                      Validate language syntax
                    </label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={mergeCode} 
              disabled={isMerging}
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isMerging ? (
                <>
                  <LoadingSpinner size={16} className="mr-1" />
                  <span>Merging...</span>
                </>
              ) : (
                <>
                  <GitMerge className="h-4 w-4" />
                  <span>Merge Code</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={copyMergedCode}
              disabled={!mergedCode}
              className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Result</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={downloadMergedCode}
              disabled={!mergedCode}
              className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            >
              <Download className="h-4 w-4" />
              <span>Download Result</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={clearAllSections}
              className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            >
              <FileText className="h-4 w-4" />
              <span>Clear All</span>
            </Button>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {codeSections.map((section, index) => (
          <Card key={section.id} className="overflow-hidden border-t-4 transition-shadow duration-300 hover:shadow-md" style={{ borderTopColor: `var(--${section.color}-500)` }}>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span className="font-medium">{section.name} Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {section.extension}
                  </Badge>
                  <div className="relative">
                    <Input 
                      type="file" 
                      accept={section.fileAccept}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={(e) => handleFileUpload(section.id, e)}
                    />
                    <Button variant="outline" size="sm" className="flex gap-1 bg-white dark:bg-slate-800">
                      <Upload className="h-3 w-3" />
                      <span className="text-xs">Upload</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <Textarea
                placeholder={section.placeholder}
                className="min-h-[120px] font-mono text-sm resize-y bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
                value={section.value}
                onChange={(e) => handleTextAreaChange(section.id, e.target.value)}
              />
              
              {section.value && (
                <div className="text-right">
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Code ready to merge
                  </span>
                </div>
              )}
            </motion.div>
          </Card>
        ))}
      </motion.div>
      
      {mergedCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-lg border-slate-200 dark:border-slate-700"
        >
          <div className="p-3 border-b flex items-center justify-between bg-slate-100 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Merged Code</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {mergedCode.split('\n').length} lines
              </span>
              <FilePlus className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <ScrollArea className="h-[300px] p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap">{mergedCode}</pre>
          </ScrollArea>
        </motion.div>
      )}
    </div>
  );
};

export default CodeMerger;
