
export const languagePatterns = {
  javascript: {
    patterns: [
      /\b(function|var|let|const|if|else|for|while|return|import|export)\b/g,
      /\b(console\.log|document\.|window\.)/g,
      /[{}();]/g,
      /\/\/.*$/gm,
      /\/\*[\s\S]*?\*\//g
    ],
    name: "JavaScript",
    extension: "js",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  },
  python: {
    patterns: [
      /\b(def|class|if|else|elif|for|while|import|from|return|print)\b/g,
      /^\s*#.*$/gm,
      /^\s*"""[\s\S]*?"""/gm,
      /^\s*'''[\s\S]*?'''/gm
    ],
    name: "Python",
    extension: "py",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  },
  html: {
    patterns: [
      /<\/?[a-zA-Z][^>]*>/g,
      /<!DOCTYPE/gi,
      /&[a-zA-Z]+;/g
    ],
    name: "HTML",
    extension: "html",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  },
  css: {
    patterns: [
      /[a-zA-Z-]+\s*:\s*[^;]+;/g,
      /\.[a-zA-Z-]+\s*{/g,
      /#[a-zA-Z-]+\s*{/g,
      /@[a-zA-Z-]+/g
    ],
    name: "CSS",
    extension: "css",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
  }
};
