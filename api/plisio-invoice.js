const http = require('http');
const https = require('https');
const url = require('url');

const PLISIO_API_KEY = "d9ssUQwY4V9lABn1SjlKNXw-ChCwNGZPVSDbGm2WG2TwW1aMlCGh6ltzihNzeXF3";

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { amount = 25 } = req.query;
  const orderNumber = 'FS-' + Date.now();
  const plisioUrl = `https://api.plisio.net/api/v1/invoices/new?api_key=${PLISIO_API_KEY}&currency=SOL&source_currency=USD&source_amount=${amount}&order_number=${orderNumber}&order_name=FlipSol+Deposit`;

  https.get(plisioUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (apiRes) => {
    let body = '';
    apiRes.on('data', chunk => body += chunk);
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.status === 'success' && json.data) {
          return res.status(200).json({
            ok: true,
            address: json.data.wallet_hash,
            amountSol: json.data.invoice_total_sum,
            amountUsd: amount,
            qrCode: json.data.qr_code,
            invoiceUrl: json.data.invoice_url
          });
        }
        res.status(400).json({ ok: false, error: json.data || 'Failed to create Plisio invoice' });
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ ok: false, error: err.message });
  });
}
