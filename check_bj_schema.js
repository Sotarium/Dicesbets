const fs = require('fs');

const f = './_next/static/chunks/app/play/blackjack/page-b5a04d005580e84a.js';
const c = fs.readFileSync(f, 'utf-8');

const queries = ['ec(', 'useBlackjackTable', 'round', 'dealer', 'seats'];
for (const q of queries) {
  let idx = c.indexOf(q);
  if (idx !== -1) {
    console.log(`=== Query: ${q} ===`);
    console.log(c.substring(Math.max(0, idx - 100), Math.min(c.length, idx + 300)));
  }
}
