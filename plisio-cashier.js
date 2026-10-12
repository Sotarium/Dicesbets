/**
 * DICESBETS EXACT BRAINBETZ DEPOSIT & WITHDRAW MODAL
 * Uses explicit desktop CSS styling to render the full 2-column modal
 * perfectly without relying on Tailwind CDN breakpoint classes.
 */

(function () {
  if (typeof window === 'undefined') return;

  const PLISIO_API_KEY = "d9ssUQwY4V9lABn1SjlKNXw-ChCwNGZPVSDbGm2WG2TwW1aMlCGh6ltzihNzeXF3";
  let solLivePrice = 184.25;

  async function fetchSolPrice() {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await res.json();
      if (data?.solana?.usd) {
        solLivePrice = data.solana.usd;
        const el = document.getElementById('bb-sol-live-price');
        if (el) el.textContent = solLivePrice.toFixed(2);
      }
    } catch(e) {}
  }
  fetchSolPrice();
  setInterval(fetchSolPrice, 30000);

  window.openCashierModal = function(initialTab = 'deposit') {
    if (document.getElementById('dicesbets-brainbetz-modal')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'dicesbets-brainbetz-modal';
    backdrop.style.cssText = `
      position: fixed; inset: 0; z-index: 999999999;
      background: rgba(4, 6, 14, 0.82); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    backdrop.innerHTML = `
      <div style="width: 760px; max-width: 95vw; height: 540px; max-height: 85vh; border-radius: 16px; border: 1px solid rgba(0, 131, 229, 0.25); background: linear-gradient(165deg, rgb(20, 21, 29) 0%, rgb(18, 19, 26) 45%, rgb(15, 16, 22) 100%); box-shadow: rgba(0, 131, 229, 0.15) 0px 1px 0px inset, rgba(0, 0, 0, 0.85) 0px 32px 72px -20px, rgba(0, 131, 229, 0.35) 0px 0px 80px -35px; display: flex; flex-direction: column; overflow: hidden; position: relative; color: white;">
        
        <!-- Bottom Radial Glows -->
        <div style="position: absolute; inset-inline: 0; bottom: 0; height: 220px; pointer-events: none; z-index: 0;">
          <div style="position: absolute; inset: 0; opacity: 0.6; background: radial-gradient(120% 90% at 50% 115%, rgba(0, 131, 229, 0.6) 0%, rgba(0, 80, 150, 0.25) 42%, transparent 72%);"></div>
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, #12131a, rgba(18, 19, 26, 0.6) 50%, transparent 100%);"></div>
        </div>

        <!-- 2-Column Main Layout -->
        <div style="display: flex; flex: 1; min-height: 0; position: relative; z-index: 1;">
          
          <!-- LEFT ASIDE -->
          <aside style="width: 210px; flex-shrink: 0; border-right: 1px solid rgba(255, 255, 255, 0.06); background: #0a0b10; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
            
            <div style="padding: 24px 16px 8px 16px; text-align: center; position: relative; z-index: 2;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em; color: #a1a1aa;">Deposit</p>
              <p style="margin: 4px 0 0 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em; background: linear-gradient(180deg, #b3e0ff 0%, #0083e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CRYPTO</p>
              
              <!-- Mini 3D Coin Badge -->
              <div style="margin-top: 14px; display: flex; justify-content: center;">
                <div style="width: 34px; height: 34px; border-radius: 9px; background: rgb(34, 35, 46); box-shadow: rgba(0, 131, 229, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; display: flex; align-items: center; justify-content: center;">
                  <img src="/sol-3d.png" width="22" height="22" style="object-fit: contain;" alt="Solana" />
                </div>
              </div>
            </div>

            <!-- Bottom Floating 3D Coins Art -->
            <div style="position: relative; padding: 0 8px 14px 8px; text-align: center; z-index: 2;">
              <img src="/assets/crypto/Coins.png" style="width: 140px; height: auto; margin: 0 auto; display: block; filter: drop-shadow(0 18px 42px rgba(0, 131, 229, 0.55));" alt="" />
            </div>
          </aside>

          <!-- RIGHT PANEL -->
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
            
            <!-- Header Tabs & Close Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: rgba(22, 23, 31, 0.95); flex-shrink: 0;">
              
              <div style="display: flex; gap: 6px;">
                <button id="bb-tab-deposit" style="height: 36px; padding: 0 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; color: #ffffff; background: rgb(34, 35, 46); box-shadow: rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; display: flex; align-items: center; gap: 6px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0083e5" stroke-width="2.5"><path d="M12 17V3M6 11l6 6 6-6M19 21H5"/></svg>
                  <span>Deposit</span>
                </button>
                <button id="bb-tab-withdraw" style="height: 36px; padding: 0 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; color: #71717a; background: transparent; display: flex; align-items: center; gap: 6px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 9-6-6-6 6M12 3v14M5 21h14"/></svg>
                  <span>Withdraw</span>
                </button>
              </div>

              <button id="bb-modal-close" style="width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent; color: #71717a; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;">✕</button>
            </div>

            <!-- Content Body -->
            <div style="flex: 1; overflow-y: auto; padding: 20px 24px; min-height: 0;">
              
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #71717a;">Cryptocurrencies</span>
                <div style="flex: 1; height: 1px; background: linear-gradient(to right, rgba(255,255,255,0.08), transparent);"></div>
              </div>

              <!-- SOLANA COIN SELECTION CARD -->
              <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 20px;">
                <div id="bb-coin-card" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; background: rgb(34, 35, 46); box-shadow: rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; border: 1.5px solid #0083e5; cursor: pointer;">
                  <div style="width: 46px; height: 46px; border-radius: 12px; background: rgb(24, 25, 34); box-shadow: rgba(0, 131, 229, 0.38) 0px 1px 0px inset; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <img src="/sol-3d.png" width="34" height="34" style="object-fit: contain;" alt="Solana" />
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <p style="margin: 0; font-size: 14px; font-weight: 800; color: #fafafa;">SOL</p>
                    <p style="margin: 2px 0 0 0; font-size: 12px; font-weight: 600; color: #00ffa3;">$<span id="bb-sol-live-price">${solLivePrice.toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              <!-- VIEW: DEPOSIT -->
              <div id="bb-view-deposit">
                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Deposit Amount (USD)</label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 14px; top: 11px; font-weight: 700; color: #71717a; font-size: 16px;">$</span>
                    <input id="bb-dep-input" type="number" min="5" value="25" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px 11px 32px; color: #fff; font-size: 15px; font-weight: 700; outline: none;" />
                  </div>
                </div>

                <button id="bb-btn-pay" style="width: 100%; padding: 14px; border-radius: 10px; background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%); border: none; color: #fff; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 18px rgba(0, 131, 229, 0.4);">
                  Pay with Solana (Plisio)
                </button>
                <div id="bb-dep-res" style="margin-top: 10px; text-align: center;"></div>
              </div>

              <!-- VIEW: WITHDRAW -->
              <div id="bb-view-withdraw" style="display: none;">
                <div style="margin-bottom: 14px; background: #161722; border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 13px; color: #a1a1aa;">Available Balance</span>
                  <span style="font-size: 14px; font-weight: 800; color: #00ffa3;">${localStorage.getItem('dicesbets_balance') || '0.000'} SOL</span>
                </div>

                <div style="margin-bottom: 14px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Withdraw Amount (SOL)</label>
                  <input id="bb-with-val" type="number" min="0.05" step="0.05" value="0.5" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 15px; font-weight: 700; outline: none;" />
                </div>

                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Destination Solana Wallet</label>
                  <input id="bb-with-addr" type="text" placeholder="Paste your SOL wallet address" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 13px; outline: none;" />
                </div>

                <button id="bb-btn-withdraw" style="width: 100%; padding: 14px; border-radius: 10px; background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%); border: none; color: #fff; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 18px rgba(0, 131, 229, 0.4);">
                  Submit Instant Payout
                </button>
                <div id="bb-with-res" style="margin-top: 10px; text-align: center;"></div>
              </div>

            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(backdrop);

    // Event handling
    document.getElementById('bb-modal-close').onclick = () => backdrop.remove();
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };

    const tDep = document.getElementById('bb-tab-deposit');
    const tWith = document.getElementById('bb-tab-withdraw');
    const vDep = document.getElementById('bb-view-deposit');
    const vWith = document.getElementById('bb-view-withdraw');

    tDep.onclick = () => {
      tDep.style.background = 'rgb(34, 35, 46)';
      tDep.style.color = '#fff';
      tDep.style.boxShadow = 'rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px';
      
      tWith.style.background = 'transparent';
      tWith.style.color = '#71717a';
      tWith.style.boxShadow = 'none';

      vDep.style.display = 'block';
      vWith.style.display = 'none';
    };

    tWith.onclick = () => {
      tWith.style.background = 'rgb(34, 35, 46)';
      tWith.style.color = '#fff';
      tWith.style.boxShadow = 'rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px';
      
      tDep.style.background = 'transparent';
      tDep.style.color = '#71717a';
      tDep.style.boxShadow = 'none';

      vWith.style.display = 'block';
      vDep.style.display = 'none';
    };

    // Plisio Trigger
    document.getElementById('bb-btn-pay').onclick = () => {
      const amt = document.getElementById('bb-dep-input').value;
      const orderNumber = 'DB-' + Date.now();
      const invoiceUrl = `https://plisio.net/account/invoices/new?api_key=${PLISIO_API_KEY}&source_currency=USD&source_amount=${amt}&currency=SOL&order_number=${orderNumber}&order_name=Dicesbets+Deposit`;

      const resDiv = document.getElementById('bb-dep-res');
      resDiv.innerHTML = `
        <div style="background: rgba(0, 131, 229, 0.12); border: 1px solid #0083e5; border-radius: 10px; padding: 12px;">
          <a href="${invoiceUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #0083e5; color: #fff; font-weight: 800; border-radius: 8px; text-decoration: none; font-size: 13.5px;">Open Plisio Checkout ($${amt} USD)</a>
        </div>
      `;
    };

    // Withdraw Trigger
    document.getElementById('bb-btn-withdraw').onclick = () => {
      const amt = parseFloat(document.getElementById('bb-with-val').value);
      const addr = document.getElementById('bb-with-addr').value.trim();
      const resDiv = document.getElementById('bb-with-res');
      const current = parseFloat(localStorage.getItem('dicesbets_balance') || '0.000');

      if (!addr || addr.length < 20) {
        resDiv.innerHTML = '<p style="color:#ff5252; font-size:12px; margin:0;">Please enter a valid Solana address.</p>';
        return;
      }
      if (amt > current) {
        resDiv.innerHTML = '<p style="color:#ff5252; font-size:12px; margin:0;">Insufficient balance.</p>';
        return;
      }

      const updated = (current - amt).toFixed(3);
      localStorage.setItem('dicesbets_balance', updated);
      resDiv.innerHTML = `
        <div style="background: rgba(0, 255, 163, 0.1); border: 1px solid #00ffa3; border-radius: 10px; padding: 12px;">
          <p style="color:#00ffa3; font-weight:800; font-size:13px; margin:0;">Withdrawal of ${amt} SOL Queued!</p>
          <p style="color:#a1a1aa; font-size:11px; margin:4px 0 0 0;">New Balance: ${updated} SOL</p>
        </div>
      `;
    };
  };

  // Header Cashier Trigger
  window.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('[data-node-id="671:9361"] > div:last-child');
    if (container) {
      let existing = document.getElementById('dicesbets-cashier-btn');
      if (existing) existing.remove();

      const btn = document.createElement('button');
      btn.id = 'dicesbets-cashier-btn';
      btn.type = 'button';
      btn.style.cssText = `
        display: flex; align-items: center; gap: 8px;
        height: 44px; padding: 0 18px; border-radius: 10px;
        background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%);
        color: #ffffff; font-weight: 800; font-size: 14px;
        border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 131, 229, 0.4);
      `;
      btn.innerHTML = `<span>⚡</span> Cashier`;
      btn.onclick = () => window.openCashierModal();
      container.insertBefore(btn, container.firstChild);
    }
  });

  console.log('[Dicesbets] Exact BrainBetz Cashier Initialized.');
})();
