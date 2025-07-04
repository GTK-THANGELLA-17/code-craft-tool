
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, RefreshCw, ArrowLeftRight } from "lucide-react";

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

const CodeDifferencer = () => {
  const [originalCode, setOriginalCode] = useState("");
  const [modifiedCode, setModifiedCode] = useState("");
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('split');
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });

  const compareCode = async () => {
    if (!originalCode.trim() || !modifiedCode.trim()) {
      toast.error("Please provide both original and modified code");
      return;
    }
    
    setIsComparing(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const originalLines = originalCode.split('\n');
      const modifiedLines = modifiedCode.split('\n');
      const diff: DiffLine[] = [];
      let added = 0, removed = 0, unchanged = 0;
      
      const maxLines = Math.max(originalLines.length, modifiedLines.length);
      
      for (let i = 0; i < maxLines; i++) {
        const originalLine = originalLines[i] || '';
        const modifiedLine = modifiedLines[i] || '';
        
        if (originalLine === modifiedLine && originalLine !== '') {
          diff.push({ 
            type: 'unchanged', 
            content: originalLine, 
            lineNumber: i + 1,
            originalLineNumber: i + 1,
            modifiedLineNumber: i + 1
          });
          unchanged++;
        } else {
          if (originalLine && !modifiedLine) {
            diff.push({ 
              type: 'removed', 
              content: originalLine, 
              lineNumber: i + 1,
              originalLineNumber: i + 1
            });
            removed++;
          } else if (!originalLine && modifiedLine) {
            diff.push({ 
              type: 'added', 
              content: modifiedLine, 
              lineNumber: i + 1,
              modifiedLineNumber: i + 1
            });
            added++;
          } else if (originalLine !== modifiedLine) {
            if (originalLine) {
              diff.push({ 
                type: 'removed', 
                content: originalLine, 
                lineNumber: i + 1,
                originalLineNumber: i + 1
              });
              removed++;
            }
            if (modifiedLine) {
              diff.push({ 
                type: 'added', 
                content: modifiedLine, 
                lineNumber: i + 1,
                modifiedLineNumber: i + 1
              });
              added++;
            }
          }
        }
      }
      
      setDiffResult(diff);
      setStats({ added, removed, unchanged });
      toast.success("Code comparison complete");
    } catch (error) {
      console.error("Error comparing code:", error);
      toast.error("Error comparing code");
    } finally {
      setIsComparing(false);
    }
  };

  const resetAll = () => {
    setOriginalCode("");
    setModifiedCode("");
    setDiffResult([]);
    setStats({ added: 0, removed: 0, unchanged: 0 });
    toast.info("All fields cleared");
  };

  const renderSplitView = () => {
    const originalLines = originalCode.split('\n');
    const modifiedLines = modifiedCode.split('\n');
    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    return (
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-0">
            <div className="bg-red-50 dark:bg-red-900/20 p-2 border-b">
              <Badge variant="outline" className="text-red-600">Original</Badge>
            </div>
            <div className="max-h-[500px] overflow-auto">
              {Array.from({ length: maxLines }, (_, i) => {
                const line = originalLines[i] || '';
                const hasChange = modifiedLines[i] !== line;
                return (
                  <div
                    key={i}
                    className={`px-4 py-1 font-mono text-sm border-l-4 ${
                      !line ? 'bg-gray-50 border-gray-200' :
                      hasChange ? 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                      'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                  >
                    <span className="text-gray-400 mr-4 select-none w-8 inline-block">{i + 1}</span>
                    {line || ' '}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 border-b">
              <Badge variant="outline" className="text-green-600">Modified</Badge>
            </div>
            <div className="max-h-[500px] overflow-auto">
              {Array.from({ length: maxLines }, (_, i) => {
                const line = modifiedLines[i] || '';
                const hasChange = originalLines[i] !== line;
                return (
                  <div
                    key={i}
                    className={`px-4 py-1 font-mono text-sm border-l-4 ${
                      !line ? 'bg-gray-50 border-gray-200' :
                      hasChange ? 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                  >
                    <span className="text-gray-400 mr-4 select-none w-8 inline-block">{i + 1}</span>
                    {line || ' '}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderUnifiedView = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-auto">
            {diffResult.map((line, index) => (
              <div
                key={index}
                className={`px-4 py-1 font-mono text-sm border-l-4 ${
                  line.type === 'added'
                    ? 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : line.type === 'removed'
                    ? 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <span className="text-gray-400 mr-4 select-none">{line.lineNumber}</span>
                <span className="mr-2 select-none">
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                {line.content}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-blue-100 text-blue-800">Original</Badge>
              <span className="text-sm text-slate-500">Before changes</span>
            </div>
            <Textarea
              placeholder="Paste your original code here..."
              className="min-h-[300px] font-mono text-sm"
              value={originalCode}
              onChange={(e) => setOriginalCode(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-100 text-green-800">Modified</Badge>
              <span className="text-sm text-slate-500">After changes</span>
            </div>
            <Textarea
              placeholder="Paste your modified code here..."
              className="min-h-[300px] font-mono text-sm"
              value={modifiedCode}
              onChange={(e) => setModifiedCode(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          onClick={compareCode}
          disabled={isComparing}
          className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
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
              <span>Compare Code</span>
            </>
          )}
        </Button>
        
        {diffResult.length > 0 && (
          <Button 
            variant="outline"
            onClick={() => setViewMode(viewMode === 'split' ? 'unified' : 'split')}
            className="gap-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>{viewMode === 'split' ? 'Unified View' : 'Split View'}</span>
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={resetAll}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>
      
      {diffResult.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <h3 className="font-medium">Comparison Results</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">+{stats.added} added</span>
              <span className="text-red-600">-{stats.removed} removed</span>
              <span className="text-slate-500">{stats.unchanged} unchanged</span>
            </div>
          </div>
          
          {viewMode === 'split' ? renderSplitView() : renderUnifiedView()}
        </motion.div>
      )}
    </div>
  );
};

export default CodeDifferencer;
