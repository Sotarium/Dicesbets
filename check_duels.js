const fs = require('fs');

const f5074 = './_next/static/chunks/5074-5ebfd1ea60a496a0.js';
const content = fs.readFileSync(f5074, 'utf-8');

const queries = ['createDiceDuel', 'createCoinflipGame'];
for (const q of queries) {
  let idx = content.indexOf(q);
  console.log(`=== ${q} ===`);
  if (idx !== -1) {
    console.log(content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 400)));
  } else {
    console.log('Not found');
  }
}
