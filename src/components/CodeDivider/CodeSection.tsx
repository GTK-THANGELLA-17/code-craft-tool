
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";
import { DetectedLanguage } from '@/utils/languageDetection';

interface CodeSectionData extends DetectedLanguage {
  code: string;
  lines: number;
}

interface CodeSectionProps {
  section: CodeSectionData;
  index: number;
}

const CodeSection: React.FC<CodeSectionProps> = ({ section, index }) => {
  const copySection = () => {
    const formattedCode = `${section.startComment}\n${section.code}\n${section.endComment}`;
    navigator.clipboard.writeText(formattedCode);
    toast.success(`${section.name} code copied to clipboard`);
  };

  const downloadSection = () => {
    const formattedCode = `${section.startComment}\n${section.code}\n${section.endComment}`;
    const blob = new Blob([formattedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${section.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_code.${section.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${section.name} code`);
  };

  return (
    <Card key={index} className="overflow-hidden border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={section.color}>
              {section.name}
            </Badge>
            <span className="text-sm text-slate-500">
              {section.lines} lines • {section.confidence}% confidence
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={copySection}
              className="flex gap-1"
            >
              <Copy className="h-3 w-3" />
              <span className="text-xs">Copy</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadSection}
              className="flex gap-1"
            >
              <Download className="h-3 w-3" />
              <span className="text-xs">Download</span>
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[200px]">
          <pre className="text-sm font-mono whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-3 rounded">
            {section.code}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CodeSection;
