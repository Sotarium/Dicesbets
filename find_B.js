const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '_next/static/chunks/5074-5ebfd1ea60a496a0.js');
const content = fs.readFileSync(file, 'utf-8');
const idx = content.indexOf('Could not reach SolPrime');
console.log(content.substring(Math.max(0, idx - 1500), idx + 200));
