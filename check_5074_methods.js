const fs = require('fs');

const f = './_next/static/chunks/5074-5ebfd1ea60a496a0.js';
const c = fs.readFileSync(f, 'utf-8');

const funcs = ['getCurrentRound', 'getRound', 'getRoundHistory', 'getJackpotEventConfig', 'getJackpotEventOperator', 'listTables', 'getTable'];

for (const fn of funcs) {
  const idx = c.indexOf(fn);
  if (idx !== -1) {
    console.log(`=== ${fn} ===`);
    console.log(c.substring(Math.max(0, idx - 100), Math.min(c.length, idx + 300)));
  }
}
