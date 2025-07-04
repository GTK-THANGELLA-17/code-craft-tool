
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FileCode, Upload, Scissors, Download, RefreshCw } from "lucide-react";

interface CodeInputSectionProps {
  inputCode: string;
  setInputCode: (code: string) => void;
  isDividing: boolean;
  onDivideCode: () => void;
  onDownloadAll: () => void;
  onResetAll: () => void;
  hasSections: boolean;
}

const CodeInputSection: React.FC<CodeInputSectionProps> = ({
  inputCode,
  setInputCode,
  isDividing,
  onDivideCode,
  onDownloadAll,
  onResetAll,
  hasSections
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputCode(content);
    };
    reader.readAsText(file);
    
    event.target.value = "";
    
    toast.success("File loaded successfully", {
      description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-blue-500" />
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
          <Textarea
            placeholder="Paste your mixed programming code here..."
            className="min-h-[300px] font-mono text-sm resize-y bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={onDivideCode}
              disabled={isDividing}
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isDividing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4" />
                  <span>Divide Code</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onDownloadAll}
              disabled={!hasSections}
              className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            >
              <Download className="h-4 w-4" />
              <span>Download All</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onResetAll}
              className="gap-2 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CodeInputSection;
