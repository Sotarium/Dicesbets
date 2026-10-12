const fs = require('fs');

const f = './_next/static/chunks/app/play/jackpot/page-5d6940315f4e1216.js';
const c = fs.readFileSync(f, 'utf-8');
const regex = /"(\/games\/[^"]+|\/jackpot[^"]+|\/round[^"]+)"/g;
const matches = [...c.matchAll(regex)].map(m => m[1]);
console.log('Jackpot chunk endpoints:', Array.from(new Set(matches)));
