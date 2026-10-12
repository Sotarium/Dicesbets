const https = require('https');

https.get('https://www.brainbetz.com/', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const fonts = [...html.matchAll(/font-[a-zA-Z0-9_\-]+/g)].map(m => m[0]);
    console.log('Font classes in BrainBetz:', Array.from(new Set(fonts)));
    const woff = [...html.matchAll(/\/static\/media\/[a-zA-Z0-9_\-]+\.woff2?/g)].map(m => m[0]);
    console.log('Font files in BrainBetz:', Array.from(new Set(woff)));
  });
});
