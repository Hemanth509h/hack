const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src');

// Regex rules for mapping dark mode classes to support light/dark modes
const rules = [
  { regex: /\btext-white\b/g, replacement: 'text-gray-900 dark:text-white' },
  { regex: /\btext-gray-100\b/g, replacement: 'text-gray-800 dark:text-gray-100' },
  { regex: /\btext-gray-300\b/g, replacement: 'text-gray-700 dark:text-gray-300' },
  { regex: /\btext-gray-400\b/g, replacement: 'text-gray-600 dark:text-gray-400' },
  // Be careful with background colors as they might be within hover: or focus: pseudo-classes
  // This simple script handles plain bg- classes. We'll rely on manual tweaks if hover states break.
  { regex: /(?<![:\w-])bg-gray-900\b/g, replacement: 'bg-white dark:bg-gray-900' },
  { regex: /(?<![:\w-])bg-gray-800\b/g, replacement: 'bg-gray-50 dark:bg-gray-800' },
  { regex: /(?<![:\w-])bg-gray-950\b/g, replacement: 'bg-gray-100 dark:bg-gray-950' },
  { regex: /(?<![:\w-])bg-\[\#030303\](?![-\w])/g, replacement: 'bg-gray-50 dark:bg-[#030303]' },
  
  // Borders
  { regex: /(?<![:\w-])border-white\/10\b/g, replacement: 'border-black/10 dark:border-white/10' },
  { regex: /(?<![:\w-])border-white\/5\b/g, replacement: 'border-black/5 dark:border-white/5' },
  { regex: /(?<![:\w-])border-gray-800\b/g, replacement: 'border-gray-200 dark:border-gray-800' },
  
  // Translucent backgrounds
  { regex: /(?<![:\w-])bg-white\/10\b/g, replacement: 'bg-black/10 dark:bg-white/10' },
  { regex: /(?<![:\w-])bg-white\/5\b/g, replacement: 'bg-black/5 dark:bg-white/5' },
  
  // Hover translucent backgrounds
  { regex: /\bhover:bg-white\/10\b/g, replacement: 'hover:bg-black/10 dark:hover:bg-white/10' },
  { regex: /\bhover:bg-white\/5\b/g, replacement: 'hover:bg-black/5 dark:hover:bg-white/5' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Ensure we don't double replace (e.g. text-gray-900 dark:text-gray-900 dark:text-white)
  if (content.includes('dark:text-white')) {
    // skip files that might have already been processed to avoid messing them up
    // but we can just be careful. Actually, multiple runs will duplicate dark: classes.
  }

  rules.forEach(rule => {
    content = content.replace(rule.regex, (match, offset, string) => {
        // Prevent matching if 'dark:' is right before it
        const prefix = string.substring(Math.max(0, offset - 5), offset);
        if (prefix.includes('dark:')) return match;
        return rule.replacement;
    });
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  });
}

console.log('Starting theme conversion...');
traverseDirectory(directoryPath);
console.log('Done!');
