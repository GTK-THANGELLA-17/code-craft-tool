
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Settings, Copy, Download, RefreshCw } from "lucide-react";

const CodeFormatter = () => {
  const [inputCode, setInputCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isFormatting, setIsFormatting] = useState(false);

  const formatCode = async () => {
    if (!inputCode.trim()) {
      toast.error("Please provide code to format");
      return;
    }
    
    setIsFormatting(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      let formatted = inputCode;
      
      switch (selectedLanguage) {
        case 'javascript':
        case 'typescript':
          formatted = formatJavaScript(inputCode);
          break;
        case 'html':
          formatted = formatHTML(inputCode);
          break;
        case 'css':
          formatted = formatCSS(inputCode);
          break;
        case 'json':
          formatted = formatJSON(inputCode);
          break;
        case 'python':
          formatted = formatPython(inputCode);
          break;
        case 'java':
          formatted = formatJava(inputCode);
          break;
        case 'sql':
          formatted = formatSQL(inputCode);
          break;
        default:
          formatted = inputCode;
      }
      
      setFormattedCode(formatted);
      toast.success("Code formatted successfully!");
    } catch (error) {
      console.error("Error formatting code:", error);
      toast.error("Error formatting code");
    } finally {
      setIsFormatting(false);
    }
  };

  const formatJavaScript = (code: string): string => {
    let formatted = code
      .replace(/;(\s*[^\s])/g, ';\n$1')
      .replace(/\{(\s*[^\s])/g, ' {\n$1')
      .replace(/\}(\s*[^\s])/g, '\n}\n$1')
      .replace(/,(\s*[^\s\n])/g, ',\n$1');

    const lines = formatted.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let indentLevel = 0;
    
    return lines.map(line => {
      if (line.includes('}') && !line.includes('{')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = '  '.repeat(indentLevel) + line;
      
      if (line.includes('{') && !line.includes('}')) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  };

  const formatHTML = (code: string): string => {
    let formatted = code
      .replace(/></g, '>\n<')
      .replace(/(<[^/>]+>)([^<\s])/g, '$1\n$2')
      .replace(/([^>\s])(<\/[^>]+>)/g, '$1\n$2');

    const lines = formatted.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let indentLevel = 0;
    
    return lines.map(line => {
      if (line.match(/^<\/[^>]+>$/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = '  '.repeat(indentLevel) + line;
      
      if (line.match(/^<[^\/!][^>]*[^\/]>$/) && !line.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[\s>]/i)) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  };

  const formatCSS = (code: string): string => {
    let formatted = code
      .replace(/\{/g, ' {\n')
      .replace(/\}/g, '\n}\n')
      .replace(/;(?!\s*[\n\r])/g, ';\n')
      .replace(/,(?=\s*[^\n\r\}])/g, ',\n');

    const lines = formatted.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let indentLevel = 0;
    
    return lines.map(line => {
      if (line === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = '  '.repeat(indentLevel) + line;
      
      if (line.includes('{')) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  };

  const formatJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return code;
    }
  };

  const formatPython = (code: string): string => {
    const lines = code.split('\n');
    let indentLevel = 0;
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('except') || trimmed.startsWith('elif') || trimmed.startsWith('else') || trimmed.startsWith('finally')) {
        const currentIndent = Math.max(0, indentLevel - 1);
        return '    '.repeat(currentIndent) + trimmed;
      }
      
      const indentedLine = '    '.repeat(indentLevel) + trimmed;
      
      if (trimmed.endsWith(':')) {
        indentLevel++;
      }
      
      if (trimmed === 'pass' || (trimmed.startsWith('return') && indentLevel > 0)) {
        // Don't change indent for these cases
      }
      
      return indentedLine;
    }).join('\n');
  };

  const formatJava = (code: string): string => {
    let formatted = code
      .replace(/;(\s*[^\s])/g, ';\n$1')
      .replace(/\{(\s*[^\s])/g, ' {\n$1')
      .replace(/\}(\s*[^\s])/g, '\n}\n$1');

    const lines = formatted.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let indentLevel = 0;
    
    return lines.map(line => {
      if (line.includes('}') && !line.includes('{')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = '    '.repeat(indentLevel) + line;
      
      if (line.includes('{') && !line.includes('}')) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  };

  const formatSQL = (code: string): string => {
    return code
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ORDER BY|GROUP BY|HAVING|UNION|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/gi, '\n$1')
      .replace(/,/g, ',\n  ')
      .replace(/\bAND\b/gi, '\n  AND')
      .replace(/\bOR\b/gi, '\n  OR')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  };

  const copyFormatted = () => {
    if (!formattedCode) {
      toast.error("No formatted code to copy");
      return;
    }
    
    navigator.clipboard.writeText(formattedCode);
    toast.success("Formatted code copied to clipboard");
  };

  const downloadFormatted = () => {
    if (!formattedCode) {
      toast.error("No formatted code to download");
      return;
    }
    
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      json: 'json',
      python: 'py',
      java: 'java',
      sql: 'sql'
    };
    
    const ext = extensions[selectedLanguage] || 'txt';
    const blob = new Blob([formattedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded formatted code");
  };

  const resetAll = () => {
    setInputCode("");
    setFormattedCode("");
    setSelectedLanguage("javascript");
    toast.info("All fields cleared");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-gradient-to-r from-blue-200 to-purple-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Format Settings</h3>
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
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Paste your unformatted code here..."
            className="min-h-[300px] font-mono text-sm"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={formatCode}
              disabled={isFormatting}
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {isFormatting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  <span>Formatting...</span>
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4" />
                  <span>Format Code</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={copyFormatted}
              disabled={!formattedCode}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Result</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={downloadFormatted}
              disabled={!formattedCode}
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
      
      {formattedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Formatted Output</h3>
                <Badge className="bg-green-100 text-green-800">Formatted</Badge>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded max-h-[400px] overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">{formattedCode}</pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CodeFormatter;
