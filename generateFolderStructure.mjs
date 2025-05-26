import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Config
const ROOT_DIR = path.join(__dirname);
const IGNORE = ['node_modules', '.git'];
const INCLUDE_HIDDEN = false;

const walk = (dir, prefix = '', mdPrefix = '') => {
  let textResult = '';
  let mdResult = '';
  let files;

  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    console.error(`❌ Failed to read directory: ${dir}`, err);
    return { textResult: '', mdResult: '' };
  }

  files.sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    if (!INCLUDE_HIDDEN && file.startsWith('.')) continue;
    if (IGNORE.includes(file)) continue;

    const filepath = path.join(dir, file);
    let stat;

    try {
      stat = fs.statSync(filepath);
    } catch (err) {
      console.error(`❌ Failed to get stats for: ${filepath}`, err);
      continue;
    }

    const size = stat.isFile() ? ` (${stat.size}B)` : '';
    const type = stat.isDirectory() ? '[DIR]' : '[FILE]';
    const emoji = stat.isDirectory() ? '📁' : '📄';

    textResult += `${prefix}- ${file} ${type}${size}\n`;
    mdResult += `${mdPrefix}- ${emoji} \`${file}\`\n`;

    if (stat.isDirectory()) {
      const { textResult: subText, mdResult: subMd } = walk(
        filepath,
        prefix + '  ',
        mdPrefix + '  '
      );
      textResult += subText;
      mdResult += subMd;
    }
  }

  return { textResult, mdResult };
};

// Build structure
const timestamp = new Date().toLocaleString();
let textHeader = `# Folder structure of 'Backend'\n# Generated on ${timestamp}\n\n`;
let mdHeader = `## 📂 Folder Structure (Backend)\n> Generated on \`${timestamp}\`\n\n`;

const { textResult, mdResult } = walk(ROOT_DIR);

const finalText = textHeader + textResult;
const finalMd = mdHeader + mdResult;

// Ensure output directory
const outputDir = path.join(__dirname, 'folderStructure');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Write files
fs.writeFileSync(path.join(outputDir, 'folderStructure.txt'), finalText, 'utf-8');
fs.writeFileSync(path.join(outputDir, 'folderStructure.md'), finalMd, 'utf-8');

console.log('✅ folderStructure.txt and folderStructure.md generated successfully.');
