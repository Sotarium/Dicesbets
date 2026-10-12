const fs = require('fs');

const files = [
  './_next/static/chunks/1485-dd7524ed9bf6a6fc.js',
  './_next/static/chunks/app/layout-34313281f3960252.js'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf-8');
  let idx = 0;
  while ((idx = content.indexOf('sslip.io', idx)) !== -1) {
    console.log(f);
    console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 100)));
    console.log('---');
    idx += 8;
  }
}
