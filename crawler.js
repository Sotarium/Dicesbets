const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE_URL = 'https://www.solprime.io';
const OUTPUT_DIR = path.resolve(__dirname, 'cloned_solprime');

const pagesToCrawl = [
  '/',
  '/home',
  '/earn',
  '/roadmap',
  '/play/blackjack',
  '/play/coinflip',
  '/play/dice-duels',
  '/play/jackpot',
  '/legal/fairness',
  '/legal/privacy',
  '/legal/terms'
];

const visitedUrls = new Set();
const downloadedAssets = new Set();

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  fs.mkdirSync(dirname, { recursive: true });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        return fetchBuffer(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function downloadAsset(assetPath) {
  try {
    let cleanAssetPath = assetPath.split('?')[0].split('#')[0];
    if (downloadedAssets.has(cleanAssetPath)) return;
    downloadedAssets.add(cleanAssetPath);

    const assetUrl = new URL(assetPath, BASE_URL).toString();
    const localPath = path.join(OUTPUT_DIR, cleanAssetPath);

    console.log(`Downloading asset: ${cleanAssetPath}`);
    const buffer = await fetchBuffer(assetUrl);
    ensureDirectoryExistence(localPath);
    fs.writeFileSync(localPath, buffer);

    // If it's a CSS file, parse for urls (fonts, images)
    if (cleanAssetPath.endsWith('.css')) {
      const text = buffer.toString('utf-8');
      const urlMatches = [...text.matchAll(/url\((?:['"]?)([^'"()]+)(?:['"]?)\)/g)];
      for (const match of urlMatches) {
        let subUrl = match[1];
        if (!subUrl.startsWith('data:') && !subUrl.startsWith('http')) {
          const resolvedPath = path.posix.resolve(path.posix.dirname(cleanAssetPath), subUrl);
          await downloadAsset(resolvedPath);
        }
      }
    }
  } catch (err) {
    console.error(`Failed to download asset ${assetPath}: ${err.message}`);
  }
}

async function clonePage(pagePath) {
  try {
    console.log(`\n--- Cloning Page: ${pagePath} ---`);
    const pageUrl = new URL(pagePath, BASE_URL).toString();
    const htmlBuffer = await fetchBuffer(pageUrl);
    const html = htmlBuffer.toString('utf-8');

    let localHtmlFile;
    if (pagePath === '/' || pagePath === '') {
      localHtmlFile = path.join(OUTPUT_DIR, 'index.html');
    } else {
      let trimmed = pagePath.replace(/^\/+|\/+$/g, '');
      localHtmlFile = path.join(OUTPUT_DIR, trimmed, 'index.html');
    }
    ensureDirectoryExistence(localHtmlFile);
    fs.writeFileSync(localHtmlFile, html, 'utf-8');
    console.log(`Saved page to ${localHtmlFile}`);

    // Extract all scripts, links, styles, images, figma svgs/webps/pngs
    const assetRegex = /(?:src|href)=["'](\/(?:_next|figma|cards|icon|fonts)[^"']*)["']/g;
    const assets = [...html.matchAll(assetRegex)].map(m => m[1]);

    // Also look for background images / images in inline style or markup
    const inlineImgRegex = /(?:\/figma\/[a-zA-Z0-9_\-\.\/]+|\/_next\/static\/[a-zA-Z0-9_\-\.\/]+)/g;
    const inlineAssets = [...html.matchAll(inlineImgRegex)].map(m => m[0]);

    const allAssets = Array.from(new Set([...assets, ...inlineAssets]));

    for (const asset of allAssets) {
      await downloadAsset(asset);
    }
  } catch (err) {
    console.error(`Failed to clone page ${pagePath}: ${err.message}`);
  }
}

async function main() {
  console.log(`Starting clone of SolPrime into ${OUTPUT_DIR}...`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const page of pagesToCrawl) {
    await clonePage(page);
  }

  // Also create a root index.html copy of /home if / doesn't redirect
  const homePath = path.join(OUTPUT_DIR, 'home', 'index.html');
  const rootIndex = path.join(OUTPUT_DIR, 'index.html');
  if (fs.existsSync(homePath) && (!fs.existsSync(rootIndex) || fs.statSync(rootIndex).size < 1000)) {
    fs.copyFileSync(homePath, rootIndex);
  }

  console.log('\n=========================================');
  console.log('Finished cloning all SolPrime pages and assets!');
  console.log(`Total unique assets downloaded: ${downloadedAssets.size}`);
  console.log('=========================================');
}

main();
