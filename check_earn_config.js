const fs = require('fs');

const f = './_next/static/chunks/app/earn/page-45abe301cfcbdb3e.js';
const c = fs.readFileSync(f, 'utf-8');
const idx = c.indexOf('reading config...');
if (idx !== -1) {
  console.log(c.substring(Math.max(0, idx - 600), Math.min(c.length, idx + 400)));
} else {
  console.log('not found');
}
