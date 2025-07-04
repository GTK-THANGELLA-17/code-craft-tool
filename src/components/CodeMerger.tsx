import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GitMerge, Download, RefreshCw, Copy, FileCode } from "lucide-react";

const CodeMerger = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [mergedCode, setMergedCode] = useState("");
  const [isMerging, setIsMerging] = useState(false);

  const mergeCode = async () => {
    if (!htmlCode.trim() && !cssCode.trim() && !jsCode.trim()) {
      toast.error("Please provide at least one type of code to merge");
      return;
    }
    
    setIsMerging(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      let merged = "";
      
      // Check if HTML already contains a complete structure
      const hasCompleteHTML = htmlCode.includes('<!DOCTYPE html>') || 
                              (htmlCode.includes('<html>') && htmlCode.includes('</html>'));
      
      if (hasCompleteHTML) {
        // Use existing HTML structure
        merged = htmlCode.trim();
        
        // Add CSS to existing structure
        if (cssCode.trim()) {
          const cleanCSS = cssCode.trim();
          const styleTag = `  <style>\n${cleanCSS.split('\n').map(line => '    ' + line).join('\n')}\n  </style>`;
          
          if (merged.includes('</head>')) {
            // Insert before closing head tag
            merged = merged.replace('</head>', `${styleTag}\n</head>`);
          } else if (merged.includes('<head>')) {
            // Add after opening head tag
            merged = merged.replace('<head>', `<head>\n${styleTag}`);
          }
        }
        
        // Add JavaScript to existing structure
        if (jsCode.trim()) {
          const cleanJS = jsCode.trim();
          const scriptTag = `  <script>\n${cleanJS.split('\n').map(line => '    ' + line).join('\n')}\n  </script>`;
          
          if (merged.includes('</body>')) {
            // Insert before closing body tag
            merged = merged.replace('</body>', `${scriptTag}\n</body>`);
          } else if (merged.includes('</html>')) {
            // Insert before closing html tag
            merged = merged.replace('</html>', `<body>\n${scriptTag}\n</body>\n</html>`);
          }
        }
      } else {
        // Create new HTML structure
        if (!htmlCode.trim()) {
          merged = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Merged Code</title>\n</head>\n<body>\n  <h1>Generated HTML</h1>\n</body>\n</html>`;
        } else {
          const cleanHTML = htmlCode.trim();
          
          if (cleanHTML.includes('<html>')) {
            merged = `<!DOCTYPE html>\n${cleanHTML}`;
          } else {
            merged = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n${cleanHTML}\n</body>\n</html>`;
          }
        }
        
        // Add CSS
        if (cssCode.trim()) {
          const cleanCSS = cssCode.trim();
          const styleTag = `  <style>\n${cleanCSS.split('\n').map(line => '    ' + line).join('\n')}\n  </style>`;
          
          if (merged.includes('</head>')) {
            merged = merged.replace('</head>', `${styleTag}\n</head>`);
          }
        }
        
        // Add JavaScript
        if (jsCode.trim()) {
          const cleanJS = jsCode.trim();
          const scriptTag = `  <script>\n${cleanJS.split('\n').map(line => '    ' + line).join('\n')}\n  </script>`;
          
          if (merged.includes('</body>')) {
            merged = merged.replace('</body>', `${scriptTag}\n</body>`);
          }
        }
      }
      
      // Clean up formatting
      merged = merged
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();
      
      setMergedCode(merged);
      toast.success("Code merged successfully!");
    } catch (error) {
      console.error("Error merging code:", error);
      toast.error("Error merging code");
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedCode) {
      toast.error("No merged code to download");
      return;
    }
    
    const blob = new Blob([mergedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "merged_code.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded merged HTML file");
  };

  const copyMerged = () => {
    if (!mergedCode) {
      toast.error("No merged code to copy");
      return;
    }
    
    navigator.clipboard.writeText(mergedCode);
    toast.success("Merged code copied to clipboard");
  };

  const resetAll = () => {
    setHtmlCode("");
    setCssCode("");
    setJsCode("");
    setMergedCode("");
    toast.info("All fields cleared");
  };

  const loadExample = () => {
    setHtmlCode(`<div class="container">
  <h1 id="title">Hello World</h1>
  <button onclick="changeColor()">Change Color</button>
</div>`);
    
    setCssCode(`.container {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

#title {
  color: #333;
  transition: color 0.3s ease;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}`);
    
    setJsCode(`function changeColor() {
  const title = document.getElementById('title');
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  title.style.color = randomColor;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded successfully!');
});`);
    
    toast.info("Example code loaded");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">HTML</Badge>
                <span className="text-sm text-slate-500">Structure</span>
              </div>
              <span className="text-xs text-slate-400">{htmlCode.length} chars</span>
            </div>
            <Textarea
              placeholder="Enter your HTML code here..."
              className="min-h-[200px] font-mono text-sm"
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">CSS</Badge>
                <span className="text-sm text-slate-500">Styling</span>
              </div>
              <span className="text-xs text-slate-400">{cssCode.length} chars</span>
            </div>
            <Textarea
              placeholder="Enter your CSS code here..."
              className="min-h-[200px] font-mono text-sm"
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">JavaScript</Badge>
                <span className="text-sm text-slate-500">Functionality</span>
              </div>
              <span className="text-xs text-slate-400">{jsCode.length} chars</span>
            </div>
            <Textarea
              placeholder="Enter your JavaScript code here..."
              className="min-h-[200px] font-mono text-sm"
              value={jsCode}
              onChange={(e) => setJsCode(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          onClick={mergeCode}
          disabled={isMerging}
          className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          {isMerging ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4" />
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
          onClick={loadExample}
          className="gap-2"
        >
          <FileCode className="h-4 w-4" />
          <span>Load Example</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={copyMerged}
          disabled={!mergedCode}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          <span>Copy Result</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={downloadMerged}
          disabled={!mergedCode}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download HTML</span>
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
      
      {mergedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Merged HTML Output</h3>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  <span className="text-xs text-slate-500">{mergedCode.length} chars</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded max-h-[400px] overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">{mergedCode}</pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CodeMerger;
