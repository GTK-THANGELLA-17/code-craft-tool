
import { useState } from "react";
import { toast } from "sonner";
import CodeInputSection from "./CodeDivider/CodeInputSection";
import ResultsSection from "./CodeDivider/ResultsSection";
import { divideCodeIntoSections, CodeSectionData } from "@/utils/codeDivisionLogic";

const CodeDivider = () => {
  const [inputCode, setInputCode] = useState("");
  const [dividedSections, setDividedSections] = useState<CodeSectionData[]>([]);
  const [isDividing, setIsDividing] = useState(false);
  const [stats, setStats] = useState({ totalLines: 0, sectionsFound: 0 });

  const divideCode = async () => {
    if (!inputCode.trim()) {
      toast.error("Please provide code to divide");
      return;
    }
    
    setIsDividing(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const sections = divideCodeIntoSections(inputCode);
      const lines = inputCode.split('\n');
      
      setDividedSections(sections);
      setStats({
        totalLines: lines.length,
        sectionsFound: sections.length
      });
      
      toast.success("Code division complete", {
        description: `Found ${sections.length} section(s) in ${lines.length} lines`
      });
    } catch (error) {
      console.error("Error dividing code:", error);
      toast.error("Error processing code division");
    } finally {
      setIsDividing(false);
    }
  };

  const downloadAll = () => {
    if (dividedSections.length === 0) {
      toast.error("No sections to download");
      return;
    }
    
    let allCode = "";
    dividedSections.forEach((section) => {
      allCode += `${section.startComment}\n${section.code}\n${section.endComment}\n\n`;
    });
    
    const blob = new Blob([allCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "divided_code.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded all divided code");
  };

  const resetAll = () => {
    setInputCode("");
    setDividedSections([]);
    setStats({ totalLines: 0, sectionsFound: 0 });
    toast.info("All fields cleared");
  };

  return (
    <div className="space-y-6">
      <CodeInputSection
        inputCode={inputCode}
        setInputCode={setInputCode}
        isDividing={isDividing}
        onDivideCode={divideCode}
        onDownloadAll={downloadAll}
        onResetAll={resetAll}
        hasSections={dividedSections.length > 0}
      />

      <ResultsSection
        sections={dividedSections}
        stats={stats}
        inputCode={inputCode}
      />
    </div>
  );
};

export default CodeDivider;
