const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else if (full.endsWith('.js')) files.push(full);
  }
  return files;
}

const files = walk('./_next/static/chunks');
for (const f of files) {
  const c = fs.readFileSync(f, 'utf-8');
  if (c.includes('solprime.session')) {
    console.log('Found in:', f);
    const idx = c.indexOf('solprime.session');
    console.log(c.substring(Math.max(0, idx - 200), Math.min(c.length, idx + 400)));
  }
}
