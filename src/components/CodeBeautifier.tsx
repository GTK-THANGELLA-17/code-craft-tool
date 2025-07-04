
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, Copy, Download, RefreshCw, Settings } from "lucide-react";

const CodeBeautifier = () => {
  const [inputCode, setInputCode] = useState("");
  const [beautifiedCode, setBeautifiedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBeautifying, setIsBeautifying] = useState(false);
  
  // Beautification options
  const [addComments, setAddComments] = useState(true);
  const [optimizeStructure, setOptimizeStructure] = useState(true);
  const [enhanceReadability, setEnhanceReadability] = useState(true);
  const [addSpacing, setAddSpacing] = useState(true);

  const beautifyCode = async () => {
    if (!inputCode.trim()) {
      toast.error("Please provide code to beautify");
      return;
    }
    
    setIsBeautifying(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      let beautified = inputCode;
      
      switch (selectedLanguage) {
        case 'javascript':
        case 'typescript':
          beautified = beautifyJavaScript(inputCode);
          break;
        case 'html':
          beautified = beautifyHTML(inputCode);
          break;
        case 'css':
          beautified = beautifyCSS(inputCode);
          break;
        case 'python':
          beautified = beautifyPython(inputCode);
          break;
        case 'json':
          beautified = beautifyJSON(inputCode);
          break;
        default:
          beautified = beautifyGeneric(inputCode);
      }
      
      setBeautifiedCode(beautified);
      toast.success("Code beautified with enhanced structure and readability!");
    } catch (error) {
      console.error("Error beautifying code:", error);
      toast.error("Error beautifying code");
    } finally {
      setIsBeautifying(false);
    }
  };

  const beautifyJavaScript = (code: string): string => {
    let beautified = code;
    
    // Enhanced formatting with proper spacing
    if (addSpacing) {
      beautified = beautified
        .replace(/;(\s*[^\s])/g, ';\n$1')
        .replace(/\{(\s*[^\s])/g, ' {\n  $1')
        .replace(/\}(\s*[^\s])/g, '\n}\n\n$1')
        .replace(/,(\s*[^\s\n])/g, ',\n  $1');
    }
    
    // Add descriptive comments
    if (addComments) {
      beautified = beautified
        .replace(/function\s+(\w+)/g, '// Function: $1\nfunction $1')
        .replace(/const\s+(\w+)\s*=/g, '// Variable: $1\nconst $1 =')
        .replace(/class\s+(\w+)/g, '// Class Definition: $1\nclass $1');
    }
    
    // Enhanced structure with proper indentation
    if (optimizeStructure) {
      const lines = beautified.split('\n');
      let indentLevel = 0;
      beautified = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
        const indentedLine = '  '.repeat(indentLevel) + trimmed;
        if (trimmed.includes('{')) indentLevel++;
        
        return indentedLine;
      }).join('\n');
    }
    
    // Enhanced readability
    if (enhanceReadability) {
      beautified = beautified
        .replace(/\)\{/g, ') {')
        .replace(/\}else/g, '} else')
        .replace(/\)(\w)/g, ') $1')
        .replace(/(\w)\(/g, '$1 (');
    }
    
    return beautified;
  };

  const beautifyHTML = (code: string): string => {
    let beautified = code;
    
    // Enhanced HTML structure
    if (optimizeStructure) {
      beautified = beautified
        .replace(/></g, '>\n<')
        .replace(/(<[^/>]+>)([^<\s])/g, '$1\n  $2')
        .replace(/([^>\s])(<\/[^>]+>)/g, '$1\n$2');
    }
    
    // Add HTML comments for sections
    if (addComments) {
      beautified = beautified
        .replace(/<head>/g, '<!-- Document Head -->\n<head>')
        .replace(/<body>/g, '<!-- Document Body -->\n<body>')
        .replace(/<main>/g, '<!-- Main Content -->\n<main>')
        .replace(/<footer>/g, '<!-- Footer Section -->\n<footer>');
    }
    
    // Proper indentation
    const lines = beautified.split('\n');
    let indentLevel = 0;
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.match(/^<\/[^>]+>$/)) indentLevel = Math.max(0, indentLevel - 1);
      const indentedLine = '  '.repeat(indentLevel) + trimmed;
      if (trimmed.match(/^<[^\/!][^>]*[^\/]>$/) && !trimmed.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[\s>]/i)) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  };

  const beautifyCSS = (code: string): string => {
    let beautified = code;
    
    // Enhanced CSS structure
    if (optimizeStructure) {
      beautified = beautified
        .replace(/\{/g, ' {\n')
        .replace(/\}/g, '\n}\n')
        .replace(/;(?!\s*[\n\r])/g, ';\n')
        .replace(/,(?=\s*[^\n\r\}])/g, ',\n');
    }
    
    // Add CSS comments for sections
    if (addComments) {
      beautified = beautified
        .replace(/body\s*\{/g, '/* Body Styles */\nbody {')
        .replace(/\.(\w+)\s*\{/g, '/* .$1 Class Styles */\n.$1 {')
        .replace(/#(\w+)\s*\{/g, '/* #$1 ID Styles */\n#$1 {');
    }
    
    // Proper indentation with enhanced spacing
    const lines = beautified.split('\n');
    let indentLevel = 0;
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed === '}') indentLevel = Math.max(0, indentLevel - 1);
      const indentedLine = '  '.repeat(indentLevel) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      
      return indentedLine;
    }).join('\n');
  };

  const beautifyPython = (code: string): string => {
    let beautified = code;
    
    // Add docstrings and comments
    if (addComments) {
      beautified = beautified
        .replace(/def\s+(\w+)/g, '# Function: $1\ndef $1')
        .replace(/class\s+(\w+)/g, '# Class: $1\nclass $1');
    }
    
    // Enhanced Python structure
    const lines = beautified.split('\n');
    let indentLevel = 0;
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('except') || trimmed.startsWith('elif') || trimmed.startsWith('else')) {
        const currentIndent = Math.max(0, indentLevel - 1);
        return '    '.repeat(currentIndent) + trimmed;
      }
      
      const indentedLine = '    '.repeat(indentLevel) + trimmed;
      if (trimmed.endsWith(':')) indentLevel++;
      
      return indentedLine;
    }).join('\n');
  };

  const beautifyJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      let beautified = JSON.stringify(parsed, null, 2);
      
      if (addComments && selectedLanguage === 'json') {
        // Add explanatory comments (for display purposes)
        beautified = '// Beautified JSON Structure\n' + beautified;
      }
      
      return beautified;
    } catch (error) {
      return code;
    }
  };

  const beautifyGeneric = (code: string): string => {
    return code
      .replace(/\t/g, '  ') // Replace tabs with spaces
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive blank lines
      .split('\n')
      .map(line => line.trimRight()) // Remove trailing whitespace
      .join('\n');
  };

  const copyBeautified = () => {
    if (!beautifiedCode) {
      toast.error("No beautified code to copy");
      return;
    }
    
    navigator.clipboard.writeText(beautifiedCode);
    toast.success("Beautified code copied to clipboard");
  };

  const downloadBeautified = () => {
    if (!beautifiedCode) {
      toast.error("No beautified code to download");
      return;
    }
    
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      json: 'json',
      python: 'py'
    };
    
    const ext = extensions[selectedLanguage] || 'txt';
    const blob = new Blob([beautifiedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beautified_code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded beautified code");
  };

  const resetAll = () => {
    setInputCode("");
    setBeautifiedCode("");
    setSelectedLanguage("javascript");
    setAddComments(true);
    setOptimizeStructure(true);
    setEnhanceReadability(true);
    setAddSpacing(true);
    toast.info("All fields cleared");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-gradient-to-r from-violet-200 to-purple-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <h3 className="font-medium">Code Beautification Settings</h3>
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Beautification Options */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch id="comments" checked={addComments} onCheckedChange={setAddComments} />
              <Label htmlFor="comments" className="text-sm">Add Comments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="structure" checked={optimizeStructure} onCheckedChange={setOptimizeStructure} />
              <Label htmlFor="structure" className="text-sm">Optimize Structure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="readability" checked={enhanceReadability} onCheckedChange={setEnhanceReadability} />
              <Label htmlFor="readability" className="text-sm">Enhance Readability</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="spacing" checked={addSpacing} onCheckedChange={setAddSpacing} />
              <Label htmlFor="spacing" className="text-sm">Add Spacing</Label>
            </div>
          </div>
          
          <Textarea
            placeholder="Paste your code here to beautify with enhanced structure, comments, and readability..."
            className="min-h-[300px] font-mono text-sm"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={beautifyCode}
              disabled={isBeautifying}
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              {isBeautifying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  <span>Beautifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Beautify Code</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={copyBeautified}
              disabled={!beautifiedCode}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Result</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={downloadBeautified}
              disabled={!beautifiedCode}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetAll}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {beautifiedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Beautified Output</h3>
                <div className="flex gap-2">
                  <Badge className="bg-violet-100 text-violet-800">Enhanced</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Beautified</Badge>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded max-h-[400px] overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">{beautifiedCode}</pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CodeBeautifier;
