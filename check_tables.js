const fs = require('fs');

const f = './_next/static/chunks/5074-5ebfd1ea60a496a0.js';
const c = fs.readFileSync(f, 'utf-8');

const queries = ['listAdminBlackjackTables', 'blackjack/tables'];
for (const q of queries) {
  let idx = 0;
  while ((idx = c.indexOf(q, idx)) !== -1) {
    console.log(`Match for ${q} at ${idx}:`);
    console.log(c.substring(Math.max(0, idx - 80), Math.min(c.length, idx + 180)));
    console.log('---');
    idx += q.length;
  }
}
