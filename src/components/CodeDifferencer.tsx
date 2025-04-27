
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Eye,
  RefreshCw,
  Download,
  Copy,
  Upload,
  ArrowLeftRight,
  FileCode,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

// Programming language detection patterns (same as in CodeDivider)
const languagePatterns = [
  { name: "HTML", pattern: /<\s*(!DOCTYPE|html|head|body|div|span|h1|h2|a)\b/i },
  { name: "CSS", pattern: /(\{[\s\S]*?\}|@media|@keyframes|@import|@font-face|\b(margin|padding|color|background|font|display|position|width|height)\s*:)/i },
  { name: "JavaScript", pattern: /(\bfunction\b|\bconst\b|\blet\b|\bvar\b|\b(document|window)\.\b|\=\>|\bif\b|\bfor\b|\/\/.*|\bconsole\.log\b)/i },
  { name: "TypeScript", pattern: /(\binterface\b|\btype\b|\bnamespace\b|:\s*(string|number|boolean|any)\b)/i },
  { name: "Python", pattern: /(\bdef\b|\bclass\b|\bimport\b|\bfrom\b.*\bimport\b|\bindent\b|#.*|\bif __name__ == "__main__":|print\()/i },
  { name: "Ruby", pattern: /(\bdef\b|\bclass\b|\bmodule\b|\brequire\b|\battr_accessor\b|puts\b|\bdo\b|\bend\b)/i },
  { name: "Java", pattern: /(\bpublic\b|\bprivate\b|\bclass\b|\bstatic\b|\bvoid\b|System\.out\.print)/i },
  { name: "C#", pattern: /(\bnamespace\b|\busing\b|\bclass\b|\bpublic\b|\bprivate\b|\bstatic\b|\bvoid\b|\bConsole\.Write)/i },
  { name: "PHP", pattern: /(<\?php|\becho\b|\bfunction\b|\bforeach\b|\$[a-zA-Z_]+)/i },
  { name: "Go", pattern: /(\bpackage\b|\bimport\b|\bfunc\b|\bstruct\b|\binterface\b|\bmap\b|\bgo\b|\bchan\b)/i },
  { name: "Rust", pattern: /(\bfn\b|\blet\b|\bmod\b|\bstruct\b|\benum\b|\bimpl\b|\bpub\b|\bmut\b)/i },
  { name: "Swift", pattern: /(\bfunc\b|\blet\b|\bvar\b|\bclass\b|\bstruct\b|\benum\b|\bguard\b|\bif\b|\bswitch\b)/i },
  { name: "Kotlin", pattern: /(\bfun\b|\bval\b|\bvar\b|\bclass\b|\bprivate\b|\boverride\b|\bdata\b|\bobject\b)/i },
  { name: "SQL", pattern: /(\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bGROUP BY\b|\bORDER BY\b|\bINSERT INTO\b)/i },
];

const CodeDifferencer = () => {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [differences, setDifferences] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [oldLanguage, setOldLanguage] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState<string | null>(null);
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  
  const detectLanguage = (code: string): string | null => {
    if (!code.trim()) return null;
    
    // Score each language pattern
    const scores = languagePatterns.map(language => {
      const matches = code.match(language.pattern) || [];
      return {
        name: language.name,
        score: matches.length
      };
    }).filter(lang => lang.score > 0);
    
    // Sort by score and get the highest
    scores.sort((a, b) => b.score - a.score);
    
    if (scores.length > 0) {
      return scores[0].name;
    }
    
    return null;
  };
  
  const handleOldFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setOldCode(content);
      const language = detectLanguage(content);
      setOldLanguage(language);
      if (language) {
        toast.success(`Detected ${language} code for original file`);
      }
    };
    reader.readAsText(file);
    
    event.target.value = "";
    
    toast.success("Original code file loaded");
  };
  
  const handleNewFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setNewCode(content);
      const language = detectLanguage(content);
      setNewLanguage(language);
      if (language) {
        toast.success(`Detected ${language} code for updated file`);
      }
    };
    reader.readAsText(file);
    
    event.target.value = "";
    
    toast.success("Updated code file loaded");
  };
  
  const preprocessLine = (line: string): string => {
    let processedLine = line;
    
    if (ignoreWhitespace) {
      processedLine = processedLine.trim().replace(/\s+/g, ' ');
    }
    
    if (ignoreCase) {
      processedLine = processedLine.toLowerCase();
    }
    
    return processedLine;
  };
  
  const compareCode = async () => {
    if (!oldCode.trim() || !newCode.trim()) {
      toast.error("Please provide both original and updated code");
      return;
    }
    
    setIsComparing(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const oldLines = oldCode.split('\n');
      const newLines = newCode.split('\n');
      
      let diffHtml = '';
      let addedLines = 0;
      let removedLines = 0;
      let unchangedLines = 0;
      
      // Process line by line with syntax highlighting based on detected language
      for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
        const oldLine = oldLines[i] || '';
        const newLine = newLines[i] || '';
        
        const processedOldLine = preprocessLine(oldLine);
        const processedNewLine = preprocessLine(newLine);
        
        if (processedOldLine === processedNewLine) {
          diffHtml += `<div class="diff-line">
            <div class="line-number">${i + 1}</div>
            <div class="line-content unchanged">${escapeHtml(oldLine)}</div>
          </div>`;
          unchangedLines++;
        } else {
          diffHtml += `<div class="diff-line">
            <div class="line-number">${i + 1}</div>
            <div class="line-content removed">${escapeHtml(oldLine)}</div>
            <div class="line-content added">${escapeHtml(newLine)}</div>
          </div>`;
          
          if (oldLine) removedLines++;
          if (newLine) addedLines++;
        }
      }
      
      setStats({
        added: addedLines,
        removed: removedLines,
        unchanged: unchangedLines
      });
      
      setDifferences(diffHtml);
      setIsComparing(false);
      
      toast.success("Code comparison complete", {
        description: `Found ${addedLines} additions and ${removedLines} removals`
      });
    } catch (error) {
      console.error("Error comparing code:", error);
      toast.error("Error processing code comparison");
      setIsComparing(false);
    }
  };
  
  const escapeHtml = (html: string) => {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  const swapCodes = () => {
    const temp = oldCode;
    setOldCode(newCode);
    setNewCode(temp);
    
    const tempLang = oldLanguage;
    setOldLanguage(newLanguage);
    setNewLanguage(tempLang);
    
    toast.info("Code snippets swapped");
  };
  
  const resetCodes = () => {
    setOldCode("");
    setNewCode("");
    setDifferences(null);
    setOldLanguage(null);
    setNewLanguage(null);
    setStats({ added: 0, removed: 0, unchanged: 0 });
    toast.info("Code areas cleared");
  };
  
  const copyDifferences = () => {
    if (!differences) {
      toast.error("No differences to copy", {
        description: "Please compare your code first"
      });
      return;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = differences;
    const textContent = tempDiv.textContent || '';
    
    navigator.clipboard.writeText(textContent);
    toast.success("Differences copied to clipboard");
  };
  
  const downloadDifferences = () => {
    if (!differences) {
      toast.error("No differences to download", {
        description: "Please compare your code first"
      });
      return;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = differences;
    const textContent = tempDiv.textContent || '';
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "code_differences.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded code differences");
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Original Code {oldLanguage && <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">{oldLanguage}</span>}</h3>
                </div>
                <div className="relative">
                  <Input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    onChange={handleOldFileUpload}
                  />
                  <Button variant="outline" size="sm" className="flex gap-1 bg-white dark:bg-slate-800">
                    <Upload className="h-3 w-3" />
                    <span className="text-xs">Upload</span>
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Paste original code here..."
                className="min-h-[250px] font-mono text-sm resize-y bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
                value={oldCode}
                onChange={(e) => {
                  setOldCode(e.target.value);
                  if (e.target.value.trim() && !oldLanguage) {
                    const lang = detectLanguage(e.target.value);
                    setOldLanguage(lang);
                  }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-medium">Updated Code {newLanguage && <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">{newLanguage}</span>}</h3>
                </div>
                <div className="relative">
                  <Input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    onChange={handleNewFileUpload}
                  />
                  <Button variant="outline" size="sm" className="flex gap-1 bg-white dark:bg-slate-800">
                    <Upload className="h-3 w-3" />
                    <span className="text-xs">Upload</span>
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Paste updated code here..."
                className="min-h-[250px] font-mono text-sm resize-y bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
                value={newCode}
                onChange={(e) => {
                  setNewCode(e.target.value);
                  if (e.target.value.trim() && !newLanguage) {
                    const lang = detectLanguage(e.target.value);
                    setNewLanguage(lang);
                  }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Collapsible className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-medium">Comparison Options</h3>
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
                  id="ignoreWhitespace" 
                  checked={ignoreWhitespace} 
                  onCheckedChange={(checked) => setIgnoreWhitespace(checked as boolean)} 
                />
                <label
                  htmlFor="ignoreWhitespace"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ignore whitespace differences
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ignoreCase" 
                  checked={ignoreCase} 
                  onCheckedChange={(checked) => setIgnoreCase(checked as boolean)}
                />
                <label
                  htmlFor="ignoreCase"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ignore case differences
                </label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Button 
          onClick={compareCode}
          disabled={isComparing}
          className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          {isComparing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Show Differences</span>
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={swapCodes}
          className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Swap Code</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={resetCodes}
          className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={copyDifferences}
          disabled={!differences}
          className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
        >
          <Copy className="h-4 w-4" />
          <span>Copy Differences</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={downloadDifferences}
          disabled={!differences}
          className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
        >
          <Download className="h-4 w-4" />
          <span>Download Differences</span>
        </Button>
      </motion.div>
      
      {differences && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-lg"
        >
          <div className="p-3 border-b bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 mr-2" />
              <span className="font-medium">Code Differences</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm mr-1"></div>
                <span>Added: {stats.added}</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm mr-1"></div>
                <span>Removed: {stats.removed}</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-sm mr-1"></div>
                <span>Unchanged: {stats.unchanged}</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ScrollArea className="h-[400px]">
              <div 
                className="code-diff-container font-mono text-sm"
                dangerouslySetInnerHTML={{ __html: differences }}
              />
            </ScrollArea>
            <style>
              {`
              .code-diff-container {
                font-family: monospace;
              }
              .diff-line {
                display: flex;
                margin-bottom: 2px;
              }
              .line-number {
                color: #888;
                min-width: 30px;
                text-align: right;
                padding-right: 10px;
                user-select: none;
              }
              .line-content {
                white-space: pre;
                padding: 0 5px;
              }
              .line-content.removed {
                background-color: rgba(255, 0, 0, 0.1);
                color: #d00;
                text-decoration: line-through;
                margin-right: 5px;
              }
              .line-content.added {
                background-color: rgba(0, 255, 0, 0.1);
                color: #090;
              }
              .line-content.unchanged {
                color: inherit;
              }
              `}
            </style>
          </div>
        </motion.div>
      )}
      
      {!differences && (oldCode || newCode) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
        >
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4 opacity-70" />
          <p className="text-slate-500">Click "Show Differences" to compare the code</p>
        </motion.div>
      )}
    </div>
  );
};

export default CodeDifferencer;
