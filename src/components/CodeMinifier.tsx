
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Minimize2, Copy, Download, RefreshCw, Zap } from "lucide-react";

const CodeMinifier = () => {
  const [inputCode, setInputCode] = useState("");
  const [minifiedCode, setMinifiedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isMinifying, setIsMinifying] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0);

  const minifyCode = async () => {
    if (!inputCode.trim()) {
      toast.error("Please provide code to minify");
      return;
    }
    
    setIsMinifying(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      let minified = inputCode;
      
      switch (selectedLanguage) {
        case 'javascript':
        case 'typescript':
          minified = minifyJavaScript(inputCode);
          break;
        case 'html':
          minified = minifyHTML(inputCode);
          break;
        case 'css':
          minified = minifyCSS(inputCode);
          break;
        case 'json':
          minified = minifyJSON(inputCode);
          break;
        default:
          minified = minifyGeneric(inputCode);
      }
      
      const originalSize = inputCode.length;
      const minifiedSize = minified.length;
      const ratio = Math.round(((originalSize - minifiedSize) / originalSize) * 100);
      
      setMinifiedCode(minified);
      setCompressionRatio(ratio);
      toast.success(`Code minified! ${ratio}% size reduction`);
    } catch (error) {
      console.error("Error minifying code:", error);
      toast.error("Error minifying code");
    } finally {
      setIsMinifying(false);
    }
  };

  const minifyJavaScript = (code: string): string => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multiline comments
      .replace(/\/\/.*$/gm, '') // Remove single line comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\s*([{}();,=+\-*/%<>!&|])\s*/g, '$1') // Remove spaces around operators
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .trim();
  };

  const minifyHTML = (code: string): string => {
    return code
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\s+>/g, '>') // Remove spaces before closing >
      .replace(/\s+\/>/g, '/>') // Remove spaces before self-closing />
      .trim();
  };

  const minifyCSS = (code: string): string => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove spaces around CSS operators
      .replace(/;\s*}/g, '}') // Remove last semicolon in rule
      .replace(/\s*{\s*/g, '{') // Remove spaces around braces
      .replace(/;\s*/g, ';') // Remove spaces after semicolons
      .trim();
  };

  const minifyJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed);
    } catch {
      return code.replace(/\s+/g, '');
    }
  };

  const minifyGeneric = (code: string): string => {
    return code
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
  };

  const copyMinified = () => {
    if (!minifiedCode) {
      toast.error("No minified code to copy");
      return;
    }
    
    navigator.clipboard.writeText(minifiedCode);
    toast.success("Minified code copied to clipboard");
  };

  const downloadMinified = () => {
    if (!minifiedCode) {
      toast.error("No minified code to download");
      return;
    }
    
    const extensions: Record<string, string> = {
      javascript: 'min.js',
      typescript: 'min.ts',
      html: 'min.html',
      css: 'min.css',
      json: 'min.json'
    };
    
    const ext = extensions[selectedLanguage] || 'min.txt';
    const blob = new Blob([minifiedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minified_code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded minified code");
  };

  const resetAll = () => {
    setInputCode("");
    setMinifiedCode("");
    setCompressionRatio(0);
    setSelectedLanguage("javascript");
    toast.info("All fields cleared");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-gradient-to-r from-green-200 to-teal-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Minimize2 className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Code Minifier</h3>
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
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Paste your code here to minify and reduce file size..."
            className="min-h-[300px] font-mono text-sm"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={minifyCode}
              disabled={isMinifying}
              className="gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              {isMinifying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  <span>Minifying...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Minify Code</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={copyMinified}
              disabled={!minifiedCode}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Result</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={downloadMinified}
              disabled={!minifiedCode}
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
      
      {minifiedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Minified Output</h3>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {compressionRatio}% smaller
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">Minified</Badge>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded max-h-[400px] overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">{minifiedCode}</pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CodeMinifier;
