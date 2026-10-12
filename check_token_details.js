const fs = require('fs');

const f = './_next/static/chunks/5074-5ebfd1ea60a496a0.js';
const c = fs.readFileSync(f, 'utf-8');
const idx = c.indexOf('{name:"solprime.session"');
console.log(c.substring(idx - 100, idx + 800));
