
import { detectLanguage, DetectedLanguage } from './languageDetection';

export interface CodeSectionData extends DetectedLanguage {
  code: string;
  lines: number;
  startLine: number;
  endLine: number;
}

export const divideCodeIntoSections = (inputCode: string): CodeSectionData[] => {
  const lines = inputCode.split('\n');
  const sections: CodeSectionData[] = [];
  
  if (lines.length === 0) return sections;
  
  // Check if this is a complete HTML document
  const isCompleteHTML = inputCode.includes('<!DOCTYPE html>') || 
                         (inputCode.includes('<html>') && inputCode.includes('</html>'));
  
  if (isCompleteHTML) {
    return extractHTMLSections(inputCode);
  }
  
  // For non-HTML code, use the existing line-by-line analysis
  return analyzeCodeLineByLine(inputCode);
};

const extractHTMLSections = (htmlCode: string): CodeSectionData[] => {
  const sections: CodeSectionData[] = [];
  const lines = htmlCode.split('\n');
  
  // Extract CSS from <style> tags
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  while ((styleMatch = styleRegex.exec(htmlCode)) !== null) {
    const cssCode = styleMatch[1].trim();
    if (cssCode) {
      const startLine = htmlCode.substring(0, styleMatch.index).split('\n').length;
      const endLine = startLine + cssCode.split('\n').length - 1;
      
      sections.push({
        name: "CSS",
        extension: "css",
        confidence: 95,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        startComment: "/* ========== CSS Code ========== */",
        endComment: "/* ========== End CSS ========== */",
        code: cssCode,
        lines: cssCode.split('\n').length,
        startLine,
        endLine
      });
    }
  }
  
  // Extract JavaScript from <script> tags
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(htmlCode)) !== null) {
    const jsCode = scriptMatch[1].trim();
    if (jsCode) {
      const startLine = htmlCode.substring(0, scriptMatch.index).split('\n').length;
      const endLine = startLine + jsCode.split('\n').length - 1;
      
      sections.push({
        name: "JavaScript",
        extension: "js",
        confidence: 95,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        startComment: "/* ========== JavaScript Code ========== */",
        endComment: "/* ========== End JavaScript ========== */",
        code: jsCode,
        lines: jsCode.split('\n').length,
        startLine,
        endLine
      });
    }
  }
  
  // Extract HTML structure (without style and script tags)
  let htmlStructure = htmlCode
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .trim();
  
  if (htmlStructure) {
    sections.unshift({
      name: "HTML",
      extension: "html",
      confidence: 95,
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      startComment: "<!-- ========== HTML Code ========== -->",
      endComment: "<!-- ========== End HTML ========== -->",
      code: htmlStructure,
      lines: htmlStructure.split('\n').length,
      startLine: 1,
      endLine: htmlStructure.split('\n').length
    });
  }
  
  return sections;
};

const analyzeCodeLineByLine = (inputCode: string): CodeSectionData[] => {
  const lines = inputCode.split('\n');
  const sections: CodeSectionData[] = [];
  
  let currentSection: string[] = [];
  let currentLang: DetectedLanguage | null = null;
  let sectionStartLine = 1;
  
  const finishSection = (endLineIndex: number) => {
    if (currentSection.length > 0 && currentLang) {
      const sectionCode = currentSection.join('\n').trim();
      if (sectionCode.length > 0) {
        const finalLang = detectLanguage(sectionCode);
        sections.push({
          ...finalLang,
          code: sectionCode,
          lines: currentSection.length,
          startLine: sectionStartLine,
          endLine: endLineIndex
        });
      }
    }
    currentSection = [];
    currentLang = null;
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      if (currentSection.length > 0) {
        currentSection.push(line);
      }
      continue;
    }
    
    const lineLanguage = detectLanguage(line);
    
    if (!currentLang) {
      currentLang = lineLanguage;
      currentSection = [line];
      sectionStartLine = i + 1;
      continue;
    }
    
    const testCode = [...currentSection, line].join('\n');
    const combinedLanguage = detectLanguage(testCode);
    
    let shouldContinue = false;
    
    if (lineLanguage.name === currentLang.name) {
      shouldContinue = true;
    } else if (combinedLanguage.name === currentLang.name && 
               combinedLanguage.confidence >= currentLang.confidence - 10) {
      shouldContinue = true;
    } else if (lineLanguage.confidence < 40 && currentLang.confidence > 50) {
      shouldContinue = true;
    } else if (lineLanguage.confidence > currentLang.confidence + 20) {
      shouldContinue = false;
    } else {
      shouldContinue = Math.abs(lineLanguage.confidence - currentLang.confidence) < 25;
    }
    
    if (shouldContinue) {
      currentSection.push(line);
      if (combinedLanguage.confidence > currentLang.confidence + 5) {
        currentLang = combinedLanguage;
      }
    } else {
      finishSection(i);
      currentLang = lineLanguage;
      currentSection = [line];
      sectionStartLine = i + 1;
    }
  }
  
  finishSection(lines.length);
  
  if (sections.length === 0 && inputCode.trim()) {
    const lang = detectLanguage(inputCode);
    sections.push({
      ...lang,
      code: inputCode.trim(),
      lines: lines.length,
      startLine: 1,
      endLine: lines.length
    });
  }
  
  return sections;
};
