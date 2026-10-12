const fs = require('fs');

const f = './_next/static/chunks/app/play/blackjack/page-b5a04d005580e84a.js';
const c = fs.readFileSync(f, 'utf-8');
const idx = c.indexOf('card-deal.opus');
console.log(c.substring(idx - 50, idx + 250));
