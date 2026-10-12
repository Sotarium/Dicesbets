const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== 'node_modules' && item !== '.git') files = files.concat(walk(full));
    } else if (full.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = walk(__dirname);
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('/wallet-connect.js')) {
    content = content.replace('</head>', '<script src="/wallet-connect.js"></script></head>');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Injected wallet-connect.js into ${file}`);
  }
}
