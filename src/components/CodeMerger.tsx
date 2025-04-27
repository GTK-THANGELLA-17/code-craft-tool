
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  CheckCircle2
} from "lucide-react";

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
      color: "orange"
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
      color: "blue"
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
      color: "yellow"
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
      color: "blue"
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
      color: "red"
    },
    {
      id: "typescript",
      icon: <Code className="h-5 w-5 text-blue-600" />,
      fileAccept: ".ts",
      placeholder: "Enter TypeScript code here...",
      startComment: "// TypeScript START",
      endComment: "// TypeScript END",
      value: "",
      name: "TypeScript",
      color: "blue"
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
      color: "orange"
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
      color: "purple"
    }
  ]);
  
  const [mergedCode, setMergedCode] = useState("");
  const [isMerging, setIsMerging] = useState(false);
  
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
  
  const mergeCode = async () => {
    setIsMerging(true);
    
    // Simulate processing delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let merged = '';
      let hasContent = false;
      
      codeSections.forEach(section => {
        if (section.value.trim()) {
          hasContent = true;
          merged += `${section.startComment}\n${section.value}\n${section.endComment}\n\n`;
        }
      });
      
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
        <div className="flex flex-wrap justify-end gap-3 mb-4">
          <Button 
            onClick={mergeCode} 
            disabled={isMerging}
            className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isMerging ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <GitMerge className="h-4 w-4" />
                </motion.div>
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
