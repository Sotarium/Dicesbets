const fs = require('fs');
const path = require('path');

function replaceInDir(dir, searchStr, replaceStr) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      replaceInDir(full, searchStr, replaceStr);
    } else if (full.endsWith('.js') || full.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf-8');
      if (content.includes(searchStr)) {
        console.log(`Replacing in ${full}`);
        content = content.replaceAll(searchStr, replaceStr);
        fs.writeFileSync(full, content, 'utf-8');
      }
    }
  }
}

// 1. Enable mock mode in layout
const layoutFile = path.join(__dirname, '_next/static/chunks/app/layout-34313281f3960252.js');
let layoutContent = fs.readFileSync(layoutFile, 'utf-8');
// e5="mock"===e0.env.NEXT_PUBLIC_API_MODE -> change to e5=!0 (force mock mode true)
layoutContent = layoutContent.replace('e5="mock"===e0.env.NEXT_PUBLIC_API_MODE', 'e5=!0');
fs.writeFileSync(layoutFile, layoutContent, 'utf-8');
console.log('Set mock mode to true in layout bundle.');

// 2. Also replace "https://23-160-168-53.sslip.io" with origin or localhost relative endpoint
replaceInDir(path.join(__dirname, '_next'), 'https://23-160-168-53.sslip.io', 'https://www.solprime.io');

console.log('Done.');
