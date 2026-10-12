const https = require('https');

https.get('/home', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = [...data.matchAll(/href=["'](\/[^"']*)["']/g)].map(m => m[1]);
    console.log(Array.from(new Set(matches)).sort().join('\n'));
  });
}).on('error', (err) => {
  console.error(err);
});
