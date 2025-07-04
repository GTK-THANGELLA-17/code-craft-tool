
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Shield, AlertCircle, CheckCircle, Copy, Download, RefreshCw, Zap } from "lucide-react";

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  line: number;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

const CodeValidator = () => {
  const [inputCode, setInputCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [validationResults, setValidationResults] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const validateCode = async () => {
    if (!inputCode.trim()) {
      toast.error("Please provide code to validate");
      return;
    }
    
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      let issues: ValidationIssue[] = [];
      
      switch (selectedLanguage) {
        case 'javascript':
        case 'typescript':
          issues = validateJavaScript(inputCode);
          break;
        case 'html':
          issues = validateHTML(inputCode);
          break;
        case 'css':
          issues = validateCSS(inputCode);
          break;
        case 'json':
          issues = validateJSON(inputCode);
          break;
        case 'python':
          issues = validatePython(inputCode);
          break;
        case 'java':
          issues = validateJava(inputCode);
          break;
        case 'sql':
          issues = validateSQL(inputCode);
          break;
        default:
          issues = validateGeneric(inputCode);
      }
      
      const score = calculateScore(issues);
      setValidationResults(issues);
      setOverallScore(score);
      
      if (issues.length === 0) {
        toast.success("Code validation passed! No issues found.");
      } else {
        const errors = issues.filter(i => i.type === 'error').length;
        const warnings = issues.filter(i => i.type === 'warning').length;
        toast.info(`Validation complete: ${errors} errors, ${warnings} warnings`);
      }
    } catch (error) {
      console.error("Error validating code:", error);
      toast.error("Error validating code");
    } finally {
      setIsValidating(false);
    }
  };

  const validateJavaScript = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Check for common syntax issues
      if (trimmed.includes('var ')) {
        issues.push({
          type: 'warning',
          line: lineNum,
          message: "Consider using 'let' or 'const' instead of 'var'",
          severity: 'medium'
        });
      }
      
      // Check for missing semicolons
      if (trimmed.length > 0 && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') && 
          !trimmed.startsWith('//') && 
          !trimmed.startsWith('/*') &&
          !trimmed.includes('if') &&
          !trimmed.includes('for') &&
          !trimmed.includes('while') &&
          !trimmed.includes('function') &&
          !trimmed.includes('class')) {
        issues.push({
          type: 'warning',
          line: lineNum,
          message: "Missing semicolon",
          severity: 'low'
        });
      }
      
      // Check for console.log
      if (trimmed.includes('console.log')) {
        issues.push({
          type: 'info',
          line: lineNum,
          message: "Console.log statement found - consider removing for production",
          severity: 'low'
        });
      }
      
      // Check for == instead of ===
      if (trimmed.includes('==') && !trimmed.includes('===')) {
        issues.push({
          type: 'warning',
          line: lineNum,
          message: "Consider using '===' for strict equality",
          severity: 'medium'
        });
      }
      
      // Check for function syntax
      if (trimmed.includes('function(')) {
        issues.push({
          type: 'info',
          line: lineNum,
          message: "Consider using arrow functions for cleaner syntax",
          severity: 'low'
        });
      }
    });
    
    return issues;
  };

  const validateHTML = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');
    
    // Check for DOCTYPE
    if (!code.includes('<!DOCTYPE')) {
      issues.push({
        type: 'warning',
        line: 1,
        message: "Missing DOCTYPE declaration",
        severity: 'medium'
      });
    }
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Check for unclosed tags
      const openTags = (trimmed.match(/<[^\/!][^>]*>/g) || []).filter(tag => !tag.endsWith('/>'));
      const closeTags = trimmed.match(/<\/[^>]*>/g) || [];
      
      if (openTags.length > closeTags.length) {
        issues.push({
          type: 'error',
          line: lineNum,
          message: "Potential unclosed HTML tag",
          severity: 'high'
        });
      }
      
      // Check for alt attributes on images
      if (trimmed.includes('<img') && !trimmed.includes('alt=')) {
        issues.push({
          type: 'warning',
          line: lineNum,
          message: "Image missing alt attribute for accessibility",
          severity: 'medium'
        });
      }
      
      // Check for inline styles
      if (trimmed.includes('style=')) {
        issues.push({
          type: 'info',
          line: lineNum,
          message: "Consider using external CSS instead of inline styles",
          severity: 'low'
        });
      }
    });
    
    return issues;
  };

  const validateCSS = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Check for missing semicolons
      if (trimmed.includes(':') && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          trimmed.length > 0) {
        issues.push({
          type: 'error',
          line: lineNum,
          message: "Missing semicolon in CSS property",
          severity: 'high'
        });
      }
      
      // Check for vendor prefixes
      if (trimmed.includes('-webkit-') || trimmed.includes('-moz-') || trimmed.includes('-ms-')) {
        issues.push({
          type: 'info',
          line: lineNum,
          message: "Vendor prefix found - ensure modern browser compatibility",
          severity: 'low'
        });
      }
      
      // Check for !important
      if (trimmed.includes('!important')) {
        issues.push({
          type: 'warning',
          line: lineNum,
          message: "Avoid using !important when possible",
          severity: 'medium'
        });
      }
    });
    
    return issues;
  };

  const validateJSON = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    try {
      JSON.parse(code);
    } catch (error) {
      issues.push({
        type: 'error',
        line: 1,
        message: `Invalid JSON: ${error}`,
        severity: 'high'
      });
    }
    
    return issues;
  };

  const validatePython = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Check indentation
      if (line.length > 0 && line[0] === ' ' && !line.startsWith('    ')) {
        const spaces = line.length - line.trimStart().length;
        if (spaces % 4 !== 0) {
          issues.push({
            type: 'warning',
            line: lineNum,
            message: "Inconsistent indentation - use 4 spaces",
            severity: 'medium'
          });
        }
      }
      
      // Check for missing colons
      if ((trimmed.startsWith('if ') || 
           trimmed.startsWith('for ') || 
           trimmed.startsWith('while ') || 
           trimmed.startsWith('def ') || 
           trimmed.startsWith('class ')) && 
          !trimmed.endsWith(':')) {
        issues.push({
          type: 'error',
          line: lineNum,
          message: "Missing colon at end of statement",
          severity: 'high'
        });
      }
    });
    
    return issues;
  };

  const validateJava = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Check for missing semicolons
      if (trimmed.length > 0 && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') && 
          !trimmed.startsWith('//') &&
          !trimmed.includes('if') &&
          !trimmed.includes('for') &&
          !trimmed.includes('while') &&
          !trimmed.includes('class') &&
          !trimmed.includes('public') &&
          !trimmed.includes('private')) {
        issues.push({
          type: 'error',
          line: lineNum,
          message: "Missing semicolon",
          severity: 'high'
        });
      }
      
      // Check for naming conventions
      if (trimmed.includes('class ')) {
        const className = trimmed.split('class ')[1]?.split(' ')[0];
        if (className && className[0] !== className[0].toUpperCase()) {
          issues.push({
            type: 'warning',
            line: lineNum,
            message: "Class names should start with uppercase letter",
            severity: 'medium'
          });
        }
      }
    });
    
    return issues;
  };

  const validateSQL = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim().toLowerCase();
      
      // Check for missing semicolons
      if (trimmed.length > 0 && 
          (trimmed.includes('select') || 
           trimmed.includes('insert') || 
           trimmed.includes('update') || 
           trimmed.includes('delete')) && 
          !trimmed.endsWith(';')) {
        issues.push({
          type: 'warning',
          line: lineNum,
          message: "SQL statement should end with semicolon",
          severity: 'medium'
        });
      }
      
      // Check for SELECT *
      if (trimmed.includes('select *')) {
        issues.push({
          type: 'info',
          line: lineNum,
          message: "Consider specifying columns instead of using SELECT *",
          severity: 'low'
        });
      }
    });
    
    return issues;
  };

  const validateGeneric = (code: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      if (line.length > 120) {
        issues.push({
          type: 'info',
          line: lineNum,
          message: "Line too long - consider breaking into multiple lines",
          severity: 'low'
        });
      }
    });
    
    return issues;
  };

  const calculateScore = (issues: ValidationIssue[]): number => {
    const totalLines = inputCode.split('\n').length;
    const errorWeight = 10;
    const warningWeight = 5;
    const infoWeight = 1;
    
    const totalDeductions = issues.reduce((sum, issue) => {
      switch (issue.type) {
        case 'error': return sum + errorWeight;
        case 'warning': return sum + warningWeight;
        case 'info': return sum + infoWeight;
        default: return sum;
      }
    }, 0);
    
    const maxPossibleScore = Math.max(totalLines * 2, 100);
    const score = Math.max(0, Math.round(((maxPossibleScore - totalDeductions) / maxPossibleScore) * 100));
    
    return score;
  };

  const copyResults = () => {
    if (validationResults.length === 0) {
      toast.error("No validation results to copy");
      return;
    }
    
    const results = validationResults.map(issue => 
      `Line ${issue.line}: [${issue.type.toUpperCase()}] ${issue.message}`
    ).join('\n');
    
    navigator.clipboard.writeText(results);
    toast.success("Validation results copied to clipboard");
  };

  const downloadResults = () => {
    if (validationResults.length === 0) {
      toast.error("No validation results to download");
      return;
    }
    
    const results = `Code Validation Report\n${'='.repeat(30)}\n\nOverall Score: ${overallScore}/100\n\nIssues Found:\n\n` +
      validationResults.map(issue => 
        `Line ${issue.line}: [${issue.type.toUpperCase()}] ${issue.message} (${issue.severity} severity)`
      ).join('\n');
    
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "validation_report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded validation report");
  };

  const resetAll = () => {
    setInputCode("");
    setValidationResults([]);
    setOverallScore(0);
    setSelectedLanguage("javascript");
    toast.info("All fields cleared");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-gradient-to-r from-blue-200 to-cyan-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Code Validator</h3>
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
            placeholder="Paste your code here to validate syntax and find issues..."
            className="min-h-[300px] font-mono text-sm"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={validateCode}
              disabled={isValidating}
              className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              {isValidating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Validate Code</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={copyResults}
              disabled={validationResults.length === 0}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Results</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={downloadResults}
              disabled={validationResults.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
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
      
      {validationResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Validation Results</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getScoreBadge(overallScore)}>
                    Score: {overallScore}/100
                  </Badge>
                  <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore >= 80 ? '✓' : overallScore >= 60 ? '⚠' : '✗'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {validationResults.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      issue.type === 'error'
                        ? 'bg-red-50 border-red-500 dark:bg-red-900/20'
                        : issue.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
                        : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {issue.type === 'error' ? (
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      ) : issue.type === 'warning' ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">Line {issue.line}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              issue.type === 'error' ? 'text-red-600' : 
                              issue.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                            }`}
                          >
                            {issue.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {issue.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CodeValidator;
