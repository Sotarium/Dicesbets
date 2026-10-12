const fs = require('fs');

const f = './_next/static/chunks/app/play/jackpot/page-5d6940315f4e1216.js';
const c = fs.readFileSync(f, 'utf-8');

// Find query keys or fetch calls
const queryMatches = [...c.matchAll(/queryKey:([a-zA-Z0-9_\.\$]+)/g)].map(m => m[1]);
console.log('Query keys:', Array.from(new Set(queryMatches)));

// Find strings containing jackpot
const strMatches = [...c.matchAll(/"([^"]*jackpot[^"]*)"/gi)].map(m => m[1]);
console.log('Jackpot strings:', Array.from(new Set(strMatches)).slice(0, 20));
