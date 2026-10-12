const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else if (full.endsWith('.js') || full.endsWith('.html')) files.push(full);
  }
  return files;
}

const allFiles = walk(__dirname);
let replacedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Replace SolPrime external API domain with local origin
  if (content.includes('')) {
    content = content.replaceAll('', '');
  }
  if (content.includes('')) {
    content = content.replaceAll('', '');
  }

  // Replace Brand text where appropriate
  if (file.endsWith('.html')) {
    content = content.replaceAll('SolPrime', 'FlipSol');
    content = content.replaceAll('SOLPRIME', 'FLIPSOL');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    replacedCount++;
  }
}

console.log(`Completely detached Solprime domains across ${replacedCount} files.`);
