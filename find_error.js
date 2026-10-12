const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else if (full.endsWith('.js')) files.push(full);
  }
  return files;
}

const files = walk(path.join(__dirname, '_next/static/chunks'));
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('Could not reach SolPrime')) {
    console.log('Found message in file:', file);
    const idx = content.indexOf('Could not reach SolPrime');
    console.log(content.substring(Math.max(0, idx - 400), Math.min(content.length, idx + 400)));
  }
}
