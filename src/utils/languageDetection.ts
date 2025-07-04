
export interface DetectedLanguage {
  name: string;
  extension: string;
  confidence: number;
  color: string;
  startComment: string;
  endComment: string;
}

const languagePatterns = {
  javascript: {
    patterns: [
      { regex: /\b(function|var|let|const|if|else|for|while|return|import|export|class|extends|async|await)\b/g, weight: 15 },
      { regex: /console\.(log|error|warn|info)/g, weight: 25 },
      { regex: /document\.|window\.|JSON\.|Array\.|Object\./g, weight: 20 },
      { regex: /[{}();]/g, weight: 3 },
      { regex: /\/\/.*$/gm, weight: 8 },
      { regex: /\/\*[\s\S]*?\*\//g, weight: 10 },
      { regex: /=>/g, weight: 20 },
      { regex: /\$\{[^}]*\}/g, weight: 25 },
      { regex: /require\(['"][^'"]*['"]\)/g, weight: 18 },
      { regex: /module\.exports/g, weight: 20 },
      { regex: /\.addEventListener\(/g, weight: 18 },
      { regex: /getElementById|querySelector/g, weight: 18 },
      { regex: /\.(push|pop|shift|unshift|splice|slice)\(/g, weight: 15 }
    ],
    name: "JavaScript",
    extension: "js",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    startComment: "/* ========== JavaScript Code ========== */",
    endComment: "/* ========== End JavaScript ========== */"
  },
  typescript: {
    patterns: [
      { regex: /\b(interface|type|enum|public|private|protected|readonly|abstract)\b/g, weight: 30 },
      { regex: /:\s*(string|number|boolean|void|any|unknown|never)\b/g, weight: 25 },
      { regex: /\b(function|var|let|const|if|else|for|while|return|import|export|class|extends)\b/g, weight: 12 },
      { regex: /<[A-Z][^>]*>/g, weight: 20 },
      { regex: /\bas\s+\w+/g, weight: 22 },
      { regex: /\?\s*:/g, weight: 18 },
      { regex: /implements\s+\w+/g, weight: 25 },
      { regex: /\w+\[\]:/g, weight: 20 }
    ],
    name: "TypeScript",
    extension: "ts",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    startComment: "/* ========== TypeScript Code ========== */",
    endComment: "/* ========== End TypeScript ========== */"
  },
  python: {
    patterns: [
      { regex: /\b(def|class|if|else|elif|for|while|import|from|return|len|range|str|int|float|try|except|with|as)\b/g, weight: 18 },
      { regex: /^\s*#.*$/gm, weight: 12 },
      { regex: /^\s*"""[\s\S]*?"""/gm, weight: 20 },
      { regex: /^\s*'''[\s\S]*?'''/gm, weight: 20 },
      { regex: /\bself\b/g, weight: 25 },
      { regex: /:\s*$/gm, weight: 15 },
      { regex: /@\w+/g, weight: 18 },
      { regex: /\b__\w+__\b/g, weight: 22 },
      { regex: /^\s{4,}/gm, weight: 10 },
      { regex: /print\s*\(/g, weight: 20 },
      { regex: /\b(True|False|None)\b/g, weight: 18 }
    ],
    name: "Python",
    extension: "py",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    startComment: "# ========== Python Code ==========",
    endComment: "# ========== End Python =========="
  },
  html: {
    patterns: [
      { regex: /<\/?[a-zA-Z][^>]*>/g, weight: 25 },
      { regex: /<!DOCTYPE/gi, weight: 30 },
      { regex: /&[a-zA-Z]+;/g, weight: 18 },
      { regex: /<(div|span|p|h[1-6]|a|img|ul|ol|li|nav|header|footer|section|article)/gi, weight: 22 },
      { regex: /class\s*=\s*["'][^"']*["']/g, weight: 20 },
      { regex: /id\s*=\s*["'][^"']*["']/g, weight: 18 },
      { regex: /<html|<head|<body/gi, weight: 30 }
    ],
    name: "HTML",
    extension: "html",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    startComment: "<!-- ========== HTML Code ========== -->",
    endComment: "<!-- ========== End HTML ========== -->"
  },
  css: {
    patterns: [
      { regex: /[a-zA-Z-]+\s*:\s*[^;]+;/g, weight: 22 },
      { regex: /\.[a-zA-Z-_]+\s*\{/g, weight: 25 },
      { regex: /#[a-zA-Z-_]+\s*\{/g, weight: 25 },
      { regex: /@[a-zA-Z-]+/g, weight: 20 },
      { regex: /\{[^}]*\}/g, weight: 15 },
      { regex: /rgb\([\d\s,]+\)/g, weight: 18 },
      { regex: /rgba\([\d\s,.]+\)/g, weight: 18 },
      { regex: /#[0-9a-fA-F]{3,6}\b/g, weight: 20 },
      { regex: /(hover|focus|active|visited):/g, weight: 22 }
    ],
    name: "CSS",
    extension: "css",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    startComment: "/* ========== CSS Code ========== */",
    endComment: "/* ========== End CSS ========== */"
  },
  java: {
    patterns: [
      { regex: /\b(public|private|protected|class|interface|extends|implements|static|final|void|abstract)\b/g, weight: 22 },
      { regex: /\b(int|String|boolean|double|float|char|long|short|byte|ArrayList|HashMap)\b/g, weight: 18 },
      { regex: /System\.out\.(println|print)/g, weight: 30 },
      { regex: /public\s+static\s+void\s+main/g, weight: 25 },
      { regex: /\bnew\s+\w+\s*\(/g, weight: 18 },
      { regex: /@(Override|Deprecated|SuppressWarnings)/g, weight: 25 },
      { regex: /import\s+java\./g, weight: 30 }
    ],
    name: "Java",
    extension: "java",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    startComment: "/* ========== Java Code ========== */",
    endComment: "/* ========== End Java ========== */"
  },
  cpp: {
    patterns: [
      { regex: /#include\s*<[^>]+>/g, weight: 30 },
      { regex: /\b(using namespace std|std::)/g, weight: 25 },
      { regex: /\b(cout|cin|endl)\b/g, weight: 25 },
      { regex: /\b(int|char|float|double|bool|void|string|vector|map)\b/g, weight: 18 },
      { regex: /\b(class|struct|template|typename|const|static|virtual|override)\b/g, weight: 22 },
      { regex: /int\s+main\s*\(\s*\)/g, weight: 25 },
      { regex: /::/g, weight: 18 }
    ],
    name: "C++",
    extension: "cpp",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    startComment: "/* ========== C++ Code ========== */",
    endComment: "/* ========== End C++ ========== */"
  },
  json: {
    patterns: [
      { regex: /^\s*\{[\s\S]*\}\s*$/m, weight: 25 },
      { regex: /^\s*\[[\s\S]*\]\s*$/m, weight: 25 },
      { regex: /"[^"]*"\s*:/g, weight: 25 },
      { regex: /:\s*"[^"]*"/g, weight: 18 },
      { regex: /:\s*\d+(\.\d+)?/g, weight: 18 },
      { regex: /:\s*(true|false|null)\b/g, weight: 22 }
    ],
    name: "JSON",
    extension: "json",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    startComment: "// ========== JSON Data ==========",
    endComment: "// ========== End JSON =========="
  },
  sql: {
    patterns: [
      { regex: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|DATABASE|INDEX)\b/gi, weight: 25 },
      { regex: /\b(JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT)\b/gi, weight: 22 },
      { regex: /\b(VARCHAR|INT|TEXT|DATE|DATETIME|BOOLEAN|FLOAT|DECIMAL|PRIMARY KEY|FOREIGN KEY)\b/gi, weight: 18 },
      { regex: /--.*$/gm, weight: 12 },
      { regex: /\/\*[\s\S]*?\*\//g, weight: 12 },
      { regex: /;\s*$/gm, weight: 15 }
    ],
    name: "SQL",
    extension: "sql",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    startComment: "-- ========== SQL Code ==========",
    endComment: "-- ========== End SQL =========="
  },
  php: {
    patterns: [
      { regex: /<\?php/g, weight: 35 },
      { regex: /\$\w+/g, weight: 25 },
      { regex: /\b(function|class|if|else|for|while|foreach|return|echo|print|var|public|private|protected)\b/g, weight: 18 },
      { regex: /->|\$this/g, weight: 22 },
      { regex: /\barray\s*\(/g, weight: 18 },
      { regex: /\?\>/g, weight: 30 }
    ],
    name: "PHP",
    extension: "php",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
    startComment: "<?php /* ========== PHP Code ========== */ ?>",
    endComment: "<?php /* ========== End PHP ========== */ ?>"
  }
};

export const detectLanguage = (code: string): DetectedLanguage => {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return {
      name: "Plain Text",
      extension: "txt",
      confidence: 100,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      startComment: "========== Plain Text ==========",
      endComment: "========== End Plain Text =========="
    };
  }

  let bestMatch = { language: 'text', confidence: 0 };
  
  for (const [langKey, lang] of Object.entries(languagePatterns)) {
    let totalScore = 0;
    let patternMatches = 0;
    let totalPossibleMatches = 0;
    
    for (const pattern of lang.patterns) {
      const matches = (code.match(pattern.regex) || []).length;
      totalPossibleMatches += pattern.weight;
      
      if (matches > 0) {
        totalScore += Math.min(matches * pattern.weight, pattern.weight * 3); // Cap individual pattern contribution
        patternMatches++;
      }
    }
    
    // Enhanced scoring with pattern diversity bonus
    if (patternMatches > 0) {
      const diversityBonus = Math.min(patternMatches * 5, 25);
      totalScore += diversityBonus;
      
      // Normalize score based on code length and total possible matches
      const codeLength = Math.max(code.length, 50);
      const normalizedScore = (totalScore / (codeLength / 100)) * 100;
      
      // Calculate final confidence with better scaling
      const baseConfidence = Math.min(90, normalizedScore);
      const patternCoverage = (patternMatches / lang.patterns.length) * 20;
      const finalConfidence = Math.min(95, baseConfidence + patternCoverage);
      
      if (finalConfidence > bestMatch.confidence && finalConfidence > 30) {
        bestMatch = { language: langKey, confidence: finalConfidence };
      }
    }
  }
  
  if (bestMatch.confidence < 35) {
    return {
      name: "Plain Text",
      extension: "txt",
      confidence: 100,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      startComment: "========== Plain Text ==========",
      endComment: "========== End Plain Text =========="
    };
  }
  
  const lang = languagePatterns[bestMatch.language as keyof typeof languagePatterns];
  return {
    ...lang,
    confidence: Math.round(bestMatch.confidence)
  };
};
