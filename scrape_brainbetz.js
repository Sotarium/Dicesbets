const https = require('https');

https.get('https://www.brainbetz.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const css = [...data.matchAll(/href=["'](\/_next\/static\/css\/[^"']+)["']/g)].map(m => m[1]);
    const js = [...data.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)].map(m => m[1]);
    console.log('CSS:', css);
    console.log('JS count:', js.length);
    console.log('First JS:', js.slice(0, 10));
  });
});
