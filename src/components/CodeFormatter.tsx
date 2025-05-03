
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Code,
  Upload,
  Download,
  Copy,
  CheckCircle2,
  Settings,
  ClipboardCopy,
  FileText,
  Languages
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import LoadingSpinner from "./LoadingSpinner";
import { Badge } from "@/components/ui/badge";

// Language patterns for autodetection - reduced list for formatter
const languagePatterns = [
  { name: "HTML", pattern: /<\s*(!DOCTYPE|html|head|body|div|span|h1|h2|a)\b/i },
  { name: "CSS", pattern: /(\{[\s\S]*?\}|@media|@keyframes|@import|@font-face|\b(margin|padding|color|background|font|display|position|width|height)\s*:)/i },
  { name: "JavaScript", pattern: /(\bfunction\b|\bconst\b|\blet\b|\bvar\b|\b(document|window)\.\b|\=\>|\bif\b|\bfor\b|\/\/.*|\bconsole\.log\b)/i },
  { name: "TypeScript", pattern: /(\binterface\b|\btype\b|\bnamespace\b|:\s*(string|number|boolean|any)\b)/i },
  { name: "JSON", pattern: /([\{\}]|"[^"]*"\s*:)/i },
  { name: "XML", pattern: /(<\/[a-zA-Z][a-zA-Z0-9]*>|<[a-zA-Z][a-zA-Z0-9]*\/?>)/i },
  { name: "Python", pattern: /(\bdef\b|\bclass\b|\bimport\b|\bfrom\b.*\bimport\b|\bindent\b|#.*|\bif __name__ == "__main__":|print\()/i },
  { name: "SQL", pattern: /(\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bGROUP BY\b|\bORDER BY\b|\bINSERT INTO\b)/i },
];

const CodeFormatter = () => {
  const [inputCode, setInputCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [indentSize, setIndentSize] = useState("2");
  const [useTabs, setUseTabs] = useState(false);
  const [removeComments, setRemoveComments] = useState(false);
  const [minify, setMinify] = useState(false);
  const [singleQuotes, setSingleQuotes] = useState(true);
  const [detectLanguage, setDetectLanguage] = useState("");
  
  // Detect language from code sample
  const autoDetectLanguage = (code: string): string => {
    if (!code.trim()) return "plain";
    
    // Score each language pattern
    const scores = languagePatterns.map(language => {
      const matches = code.match(language.pattern) || [];
      return {
        name: language.name.toLowerCase(),
        score: matches.length
      };
    }).filter(lang => lang.score > 0);
    
    // Sort by score and get the highest
    scores.sort((a, b) => b.score - a.score);
    
    if (scores.length > 0) {
      return scores[0].name;
    }
    
    return "plain";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputCode(content);
      
      // Auto-detect language when file is loaded
      const detected = autoDetectLanguage(content);
      setDetectLanguage(detected);
      
      toast.success(`File loaded successfully`, {
        description: `Detected language: ${detected.toUpperCase()}`
      });
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    event.target.value = "";
  };
  
  // Format HTML code
  const formatHTML = (code: string): string => {
    if (minify) {
      // Minify HTML: remove extra spaces, newlines, and comments
      return code
        .replace(/<!--[\s\S]*?-->/g, (match) => removeComments ? '' : match)
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }
    
    const indent = useTabs ? '\t' : ' '.repeat(parseInt(indentSize));
    let formattedCode = '';
    let indentLevel = 0;
    let inTag = false;
    
    // Remove existing indentation first
    code = code.replace(/^\s+/gm, '');
    
    // Remove comments if requested
    if (removeComments) {
      code = code.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    // Process each character
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const nextChar = code[i + 1] || '';
      
      if (char === '<' && nextChar !== '/') {
        // Opening tag
        if (code.substring(i).startsWith('<script') || 
            code.substring(i).startsWith('<style') ||
            code.substring(i).startsWith('<pre')) {
          // Special tags that shouldn't be formatted inside
          const closingTag = code.substring(i).startsWith('<script') ? '</script>' :
                            code.substring(i).startsWith('<style') ? '</style>' : '</pre>';
          const endIndex = code.indexOf(closingTag, i);
          
          if (endIndex !== -1) {
            formattedCode += '\n' + indent.repeat(indentLevel) + code.substring(i, endIndex + closingTag.length);
            i = endIndex + closingTag.length - 1;
            continue;
          }
        }
        
        formattedCode += '\n' + indent.repeat(indentLevel) + '<';
        indentLevel++;
        inTag = true;
      } else if (char === '<' && nextChar === '/') {
        // Closing tag
        indentLevel = Math.max(0, indentLevel - 1);
        formattedCode += '\n' + indent.repeat(indentLevel) + '<';
        inTag = true;
      } else if (char === '>' && inTag) {
        // End of tag
        formattedCode += '>';
        inTag = false;
      } else {
        // Regular character
        formattedCode += char;
      }
    }
    
    return formattedCode.trim();
  };
  
  // Format JavaScript/TypeScript code
  const formatJS = (code: string): string => {
    if (minify) {
      // Minify JS: remove comments, extra spaces, and newlines
      return code
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, (match) => removeComments ? '' : match)
        .replace(/\s{2,}/g, ' ')
        .replace(/\n+/g, '')
        .trim();
    }
    
    const indent = useTabs ? '\t' : ' '.repeat(parseInt(indentSize));
    let formattedCode = '';
    let indentLevel = 0;
    let inString = false;
    let stringChar = '';
    
    // Remove existing indentation first
    code = code.replace(/^\s+/gm, '');
    
    // Remove comments if requested
    if (removeComments) {
      code = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    }
    
    // Replace quotes if needed
    if (singleQuotes) {
      // Replace double quotes with single quotes except in strings that contain single quotes
      code = code.replace(/"([^"\\]*(\\.[^"\\]*)*)"(?=(?:[^']*'[^']*')*[^']*$)/g, "'$1'");
    } else {
      // Replace single quotes with double quotes except in strings that contain double quotes
      code = code.replace(/'([^'\\]*(\\.[^'\\]*)*)'(?=(?:[^"]*"[^"]*")*[^"]*$)/g, '"$1"');
    }
    
    // Process each character
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const nextChar = code[i + 1] || '';
      
      // Handle strings
      if ((char === '"' || char === "'") && (i === 0 || code[i - 1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
        formattedCode += char;
        continue;
      }
      
      if (inString) {
        formattedCode += char;
        continue;
      }
      
      // Handle brackets
      if (char === '{' || char === '[' || char === '(') {
        formattedCode += char;
        if (char === '{') {
          indentLevel++;
          formattedCode += '\n' + indent.repeat(indentLevel);
        }
      } else if (char === '}' || char === ']' || char === ')') {
        if (char === '}') {
          indentLevel = Math.max(0, indentLevel - 1);
          formattedCode += '\n' + indent.repeat(indentLevel);
        }
        formattedCode += char;
      } else if (char === ';') {
        formattedCode += ';';
        formattedCode += '\n' + indent.repeat(indentLevel);
      } else if (char === '\n') {
        formattedCode += '\n' + indent.repeat(indentLevel);
      } else {
        formattedCode += char;
      }
    }
    
    return formattedCode.trim();
  };
  
  // Format CSS code
  const formatCSS = (code: string): string => {
    if (minify) {
      // Minify CSS: remove comments, extra spaces, and newlines
      return code
        .replace(/\/\*[\s\S]*?\*\//g, (match) => removeComments ? '' : match)
        .replace(/\s{2,}/g, ' ')
        .replace(/\s*([{}:;,])\s*/g, '$1')
        .replace(/;\}/g, '}')
        .trim();
    }
    
    const indent = useTabs ? '\t' : ' '.repeat(parseInt(indentSize));
    let formattedCode = '';
    let indentLevel = 0;
    
    // Remove existing indentation first
    code = code.replace(/^\s+/gm, '');
    
    // Remove comments if requested
    if (removeComments) {
      code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    // Process each character
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      
      if (char === '{') {
        formattedCode += ' {';
        indentLevel++;
        formattedCode += '\n' + indent.repeat(indentLevel);
      } else if (char === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
        formattedCode += '\n' + indent.repeat(indentLevel) + '}';
        formattedCode += '\n' + indent.repeat(indentLevel);
      } else if (char === ';') {
        formattedCode += ';';
        formattedCode += '\n' + indent.repeat(indentLevel);
      } else if (char === '\n') {
        formattedCode += '\n' + indent.repeat(indentLevel);
      } else {
        formattedCode += char;
      }
    }
    
    return formattedCode.trim();
  };
  
  // Format JSON code
  const formatJSON = (code: string): string => {
    try {
      const json = JSON.parse(code);
      
      if (minify) {
        return JSON.stringify(json);
      }
      
      const spaces = useTabs ? '\t' : parseInt(indentSize);
      return JSON.stringify(json, null, spaces);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      toast.error("Invalid JSON syntax");
      return code;
    }
  };
  
  // Format SQL code
  const formatSQL = (code: string): string => {
    if (minify) {
      // Minify SQL: remove comments, extra spaces, and newlines
      return code
        .replace(/--.*$/gm, (match) => removeComments ? '' : match)
        .replace(/\s{2,}/g, ' ')
        .trim();
    }
    
    const indent = useTabs ? '\t' : ' '.repeat(parseInt(indentSize));
    let formattedCode = '';
    
    // Remove comments if requested
    if (removeComments) {
      code = code.replace(/--.*$/gm, '');
    }
    
    // Replace SQL keywords with uppercase
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'ON',
      'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'VIEW',
      'AND', 'OR', 'NOT', 'NULL', 'IN', 'BETWEEN', 'LIKE', 'AS', 'CASE', 'WHEN', 'THEN',
      'ELSE', 'END', 'WITH'
    ];
    
    let lines = code.split('\n');
    lines = lines.map(line => line.trim()).filter(line => line !== '');
    
    keywords.forEach(keyword => {
      for (let i = 0; i < lines.length; i++) {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        lines[i] = lines[i].replace(regex, keyword);
      }
    });
    
    // Format clauses
    formattedCode = lines.join('\n');
    formattedCode = formattedCode
      .replace(/\b(SELECT)\b/gi, '\nSELECT')
      .replace(/\b(FROM)\b/gi, '\nFROM')
      .replace(/\b(WHERE)\b/gi, '\nWHERE')
      .replace(/\b(GROUP BY)\b/gi, '\nGROUP BY')
      .replace(/\b(HAVING)\b/gi, '\nHAVING')
      .replace(/\b(ORDER BY)\b/gi, '\nORDER BY')
      .replace(/\b(LIMIT)\b/gi, '\nLIMIT')
      .replace(/\b(OFFSET)\b/gi, '\nOFFSET')
      .replace(/\b(INSERT INTO)\b/gi, '\nINSERT INTO')
      .replace(/\b(VALUES)\b/gi, '\nVALUES')
      .replace(/\b(UPDATE)\b/gi, '\nUPDATE')
      .replace(/\b(SET)\b/gi, '\nSET')
      .replace(/\b(DELETE FROM)\b/gi, '\nDELETE FROM')
      .replace(/\b(CREATE TABLE)\b/gi, '\nCREATE TABLE')
      .replace(/\b(ALTER TABLE)\b/gi, '\nALTER TABLE')
      .replace(/\b(DROP TABLE)\b/gi, '\nDROP TABLE');
    
    // Add indentation
    lines = formattedCode.split('\n');
    formattedCode = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      if (line.startsWith('SELECT') || line.startsWith('INSERT') || 
          line.startsWith('UPDATE') || line.startsWith('DELETE') || 
          line.startsWith('CREATE') || line.startsWith('ALTER') || 
          line.startsWith('DROP')) {
        formattedCode += line + '\n';
      } else {
        formattedCode += indent + line + '\n';
      }
    }
    
    return formattedCode.trim();
  };
  
  // Format XML code
  const formatXML = (code: string): string => {
    // For XML, we use the HTML formatter with some adjustments
    return formatHTML(code);
  };
  
  // Format Python code
  const formatPython = (code: string): string => {
    if (minify) {
      // Minify Python: remove comments, extra spaces while preserving indentation
      return code
        .replace(/#.*$/gm, (match) => removeComments ? '' : match)
        .replace(/^\s*\n/gm, '')
        .replace(/\s+$/gm, '')
        .trim();
    }
    
    const indent = useTabs ? '\t' : ' '.repeat(parseInt(indentSize));
    let lines = code.split('\n');
    let formattedLines = [];
    
    // Remove comments if requested
    if (removeComments) {
      lines = lines.map(line => line.replace(/#.*$/, ''));
    }
    
    // Process each line, preserving Python's indentation-based structure
    let currentIndent = 0;
    let inMultilineString = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) {
        formattedLines.push('');
        continue;
      }
      
      // Check for multiline string delimiters
      const tripleQuotes = (line.match(/"""/g) || []).length;
      const tripleSingleQuotes = (line.match(/'''/g) || []).length;
      
      if ((tripleQuotes % 2 !== 0) || (tripleSingleQuotes % 2 !== 0)) {
        inMultilineString = !inMultilineString;
      }
      
      if (inMultilineString) {
        // Don't adjust indentation in multiline strings
        formattedLines.push(indent.repeat(currentIndent) + line);
      } else {
        // Adjust indentation for control structures
        if (line.endsWith(':')) {
          formattedLines.push(indent.repeat(currentIndent) + line);
          currentIndent++;
        } else if (line.startsWith('return ') || line === 'return' || 
                  line.startsWith('break') || line === 'break' || 
                  line.startsWith('continue') || line === 'continue' || 
                  line.startsWith('pass') || line === 'pass' || 
                  line.startsWith('raise ')) {
          formattedLines.push(indent.repeat(currentIndent) + line);
          if (currentIndent > 0 && i < lines.length - 1 && !lines[i + 1].trim()) {
            currentIndent--;
          }
        } else if (line.startsWith('elif ') || line.startsWith('else:') || 
                  line.startsWith('except:') || line.startsWith('except ') || 
                  line.startsWith('finally:')) {
          if (currentIndent > 0) {
            currentIndent--;
          }
          formattedLines.push(indent.repeat(currentIndent) + line);
          currentIndent++;
        } else {
          formattedLines.push(indent.repeat(currentIndent) + line);
        }
      }
    }
    
    return formattedLines.join('\n');
  };
  
  // Main format function that delegates to specific formatters
  const formatCode = async () => {
    if (!inputCode.trim()) {
      toast.warning("Please enter some code first", {
        description: "The formatter needs content to process"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let language = selectedLanguage;
      let result = inputCode;
      
      // Auto-detect language if set to auto
      if (language === "auto") {
        language = autoDetectLanguage(inputCode);
        setDetectLanguage(language);
      }
      
      // Call the appropriate formatter based on language
      switch (language.toLowerCase()) {
        case "html":
          result = formatHTML(inputCode);
          break;
        case "javascript":
        case "typescript":
        case "js":
        case "ts":
          result = formatJS(inputCode);
          break;
        case "css":
          result = formatCSS(inputCode);
          break;
        case "json":
          result = formatJSON(inputCode);
          break;
        case "xml":
          result = formatXML(inputCode);
          break;
        case "sql":
          result = formatSQL(inputCode);
          break;
        case "python":
          result = formatPython(inputCode);
          break;
        default:
          // For other languages, just normalize whitespace
          result = inputCode.replace(/\r\n/g, '\n')
                          .replace(/\t/g, ' '.repeat(parseInt(indentSize)))
                          .trim();
      }
      
      setFormattedCode(result);
      
      toast.success("Code formatted successfully", {
        description: `Formatted as ${language.toUpperCase()}${minify ? ' (minified)' : ''}`
      });
    } catch (error) {
      console.error("Error formatting code:", error);
      toast.error("Failed to format code", {
        description: `Please check your code syntax for ${selectedLanguage}`
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const copyFormattedCode = () => {
    if (!formattedCode) {
      toast.error("Nothing to copy", {
        description: "Please format your code first"
      });
      return;
    }
    
    navigator.clipboard.writeText(formattedCode);
    toast.success("Formatted code copied to clipboard");
  };
  
  const downloadFormattedCode = () => {
    if (!formattedCode) {
      toast.error("Nothing to download", {
        description: "Please format your code first"
      });
      return;
    }
    
    const blob = new Blob([formattedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Get file extension based on language
    let extension = 'txt';
    let lang = selectedLanguage === 'auto' ? detectLanguage : selectedLanguage;
    
    switch (lang.toLowerCase()) {
      case 'html': extension = 'html'; break;
      case 'javascript': extension = 'js'; break;
      case 'typescript': extension = 'ts'; break;
      case 'css': extension = 'css'; break;
      case 'json': extension = 'json'; break;
      case 'xml': extension = 'xml'; break;
      case 'sql': extension = 'sql'; break;
      case 'python': extension = 'py'; break;
    }
    
    a.download = `formatted_code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded formatted ${lang} code`);
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
          <div className="p-3 border-b bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-teal-500" />
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
                <span className="text-xs">Upload File</span>
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <Textarea
              placeholder="Paste your code here to format..."
              className="min-h-[300px] font-mono text-sm resize-y bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>
        </Card>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col"
        >
          <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 mb-4">
            <div className="p-3 border-b bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-teal-500" />
                <h3 className="font-medium">Formatting Options</h3>
              </div>
              {detectLanguage && (
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800">
                  Detected: {detectLanguage.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="plain">Plain Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Indent Size</label>
                  <Select value={indentSize} onValueChange={setIndentSize} disabled={useTabs}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select indent size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="8">8 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="useTabs" 
                    checked={useTabs} 
                    onCheckedChange={(checked) => setUseTabs(!!checked)} 
                  />
                  <label
                    htmlFor="useTabs"
                    className="text-sm"
                  >
                    Use tabs
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="minify" 
                    checked={minify} 
                    onCheckedChange={(checked) => setMinify(!!checked)} 
                  />
                  <label
                    htmlFor="minify"
                    className="text-sm"
                  >
                    Minify code
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="removeComments" 
                    checked={removeComments} 
                    onCheckedChange={(checked) => setRemoveComments(!!checked)} 
                  />
                  <label
                    htmlFor="removeComments"
                    className="text-sm"
                  >
                    Remove comments
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="singleQuotes" 
                    checked={singleQuotes} 
                    onCheckedChange={(checked) => setSingleQuotes(!!checked)} 
                  />
                  <label
                    htmlFor="singleQuotes"
                    className="text-sm"
                  >
                    Use single quotes
                  </label>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 flex-1">
            <div className="p-4 flex flex-col h-full">
              <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 mb-4">
                <p>Format your code with standardized indentation, spacing, and styling based on language-specific conventions.</p>
              </div>
              
              <div className="flex-1"></div>
              
              <div className="space-y-3 mt-auto">
                <Button 
                  onClick={formatCode} 
                  disabled={isProcessing || !inputCode.trim()}
                  className="w-full gap-2 bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size={16} className="mr-1" />
                      <span>Formatting...</span>
                    </>
                  ) : (
                    <>
                      <Code className="h-4 w-4" />
                      <span>Format Code</span>
                    </>
                  )}
                </Button>
                
                <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                  {selectedLanguage === 'auto' 
                    ? "Language will be auto-detected from your code" 
                    : `Formatting as ${selectedLanguage.toUpperCase()}`}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      
      {formattedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="p-3 border-b bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Formatted Code</h3>
                {detectLanguage && (
                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {detectLanguage.toUpperCase()}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyFormattedCode}
                  className="flex gap-1 bg-white dark:bg-slate-800"
                >
                  <ClipboardCopy className="h-3.5 w-3.5" />
                  <span className="text-xs">Copy</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadFormattedCode}
                  className="flex gap-1 bg-white dark:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-xs">Download</span>
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                  {formattedCode}
                </pre>
              </div>
            </ScrollArea>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CodeFormatter;
