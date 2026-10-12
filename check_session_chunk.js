const fs = require('fs');

const f = './_next/static/chunks/8526-dbbdf5df8fa85c0a.js';
const c = fs.readFileSync(f, 'utf-8');
const idx = c.indexOf('solprime.session');
if (idx !== -1) {
  console.log(c.substring(Math.max(0, idx - 200), Math.min(c.length, idx + 400)));
} else {
  console.log('not in 8526');
}
