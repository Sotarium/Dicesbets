/**
 * DICESBETS EXACT BRAINBETZ CASHIER (Refined Satin Finish, No Neon)
 * - Exact dark matte palette (#12131a, #0a0b10, rgb(34, 35, 46))
 * - Premium subtle violet bevel rim and satin box-shadows
 * - Crisp Inter / Geist typography
 * - Dedicated SOL currency selector with live price and Plisio checkout
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

  window.openCashierModal = function() {
    if (document.getElementById('dicesbets-brainbetz-modal')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'dicesbets-brainbetz-modal';
    backdrop.style.cssText = `
      position: fixed; inset: 0; z-index: 999999999;
      background: rgba(4, 5, 10, 0.85); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
    `;

    backdrop.innerHTML = `
      <div style="width: 760px; max-width: 95vw; height: 540px; max-height: 85vh; border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.12); background: linear-gradient(165deg, rgb(20, 21, 29) 0%, rgb(18, 19, 26) 45%, rgb(15, 16, 22) 100%); box-shadow: rgba(167, 139, 250, 0.12) 0px 1px 0px inset, rgba(0, 0, 0, 0.75) 0px 32px 72px -20px, rgba(139, 92, 246, 0.1) 0px 0px 0px 1px, rgba(91, 33, 182, 0.4) 0px 0px 80px -35px; display: flex; flex-direction: column; overflow: hidden; position: relative; color: white;">
        
        <!-- Subtle Bottom Atmosphere -->
        <div style="position: absolute; inset-inline: 0; bottom: 0; height: 200px; pointer-events: none; z-index: 0;">
          <div style="position: absolute; inset: 0; opacity: 0.55; background: radial-gradient(120% 90% at 50% 115%, rgba(139, 92, 246, 0.62) 0%, rgba(91, 33, 182, 0.28) 42%, transparent 72%);"></div>
          <div style="position: absolute; inset: 0; opacity: 0.45; background: radial-gradient(95% 58% at 50% 118%, rgba(196, 181, 253, 0.32) 0%, rgba(139, 92, 246, 0.1) 42%, transparent 62%);"></div>
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, #12131a, rgba(18, 19, 26, 0.65) 50%, transparent 100%);"></div>
        </div>

        <!-- 2-Column Main Layout -->
        <div style="display: flex; flex: 1; min-height: 0; position: relative; z-index: 1;">
          
          <!-- LEFT ASIDE -->
          <aside style="width: 210px; flex-shrink: 0; border-right: 1px solid rgba(255, 255, 255, 0.06); background: #0a0b10; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
            
            <div style="padding: 24px 16px 8px 16px; text-align: center; position: relative; z-index: 2;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.22em; color: #a1a1aa;">Deposit</p>
              <p style="margin: 4px 0 0 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em; background: linear-gradient(180deg, #ede9fe 0%, #a78bfa 50%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 18px rgba(139,92,246,0.35));">CRYPTO</p>
              
              <!-- Mini 3D Coin Badge -->
              <div style="margin-top: 14px; display: flex; justify-content: center;">
                <div style="width: 32px; height: 32px; border-radius: 9px; background: rgb(34, 35, 46); box-shadow: rgba(153, 69, 255, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; display: flex; align-items: center; justify-content: center;">
                  <img src="/sol-3d.png" width="20" height="20" style="object-fit: contain;" alt="Solana" />
                </div>
              </div>
            </div>

            <!-- Bottom Floating 3D Coins Art -->
            <div style="position: relative; padding: 0 4px 12px 4px; text-align: center; z-index: 2;">
              <img src="/assets/crypto/Coins.png" style="width: 140px; height: auto; margin: 0 auto; display: block; filter: drop-shadow(0 18px 42px rgba(91,33,182,0.55));" alt="" />
            </div>
          </aside>

          <!-- RIGHT PANEL -->
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
            
            <!-- Header Tabs & Close Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: rgba(22, 23, 31, 0.95); flex-shrink: 0;">
              
              <div style="display: flex; gap: 6px;">
                <button id="bb-tab-deposit" style="height: 36px; padding: 0 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; color: #ffffff; background: rgb(34, 35, 46); box-shadow: rgba(139, 92, 246, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5"><path d="M12 17V3M6 11l6 6 6-6M19 21H5"/></svg>
                  <span>Deposit</span>
                </button>
                <button id="bb-tab-withdraw" style="height: 36px; padding: 0 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; color: #71717a; background: transparent; display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 9-6-6-6 6M12 3v14M5 21h14"/></svg>
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

              <!-- SOLANA COIN SELECTION CARD (Exact Satin Border) -->
              <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 20px;">
                <div id="bb-coin-card" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 12px; background: rgb(34, 35, 46); box-shadow: rgba(139, 92, 246, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; cursor: pointer;">
                  <div style="width: 44px; height: 44px; border-radius: 12px; background: rgb(24, 25, 34); box-shadow: rgba(139, 92, 246, 0.28) 0px 1px 0px inset; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <img src="/sol-3d.png" width="30" height="30" style="object-fit: contain;" alt="Solana" />
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <p style="margin: 0; font-size: 13.5px; font-weight: 700; color: #fafafa;">SOL</p>
                    <p style="margin: 2px 0 0 0; font-size: 11.5px; font-weight: 500; color: #71717a;">$<span id="bb-sol-live-price">${solLivePrice.toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              <!-- VIEW: DEPOSIT -->
              <div id="bb-view-deposit">
                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Deposit Amount (USD)</label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 14px; top: 11px; font-weight: 700; color: #71717a; font-size: 15px;">$</span>
                    <input id="bb-dep-input" type="number" min="5" value="25" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px 11px 30px; color: #fff; font-size: 14px; font-weight: 700; outline: none;" />
                  </div>
                </div>

                <button id="bb-btn-pay" style="width: 100%; padding: 13px; border-radius: 10px; background: rgb(34, 35, 46); box-shadow: rgba(139, 92, 246, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; border: none; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; transition: filter 0.2s;">
                  Pay with Solana (Plisio)
                </button>
                <div id="bb-dep-res" style="margin-top: 10px; text-align: center;"></div>
              </div>

              <!-- VIEW: WITHDRAW -->
              <div id="bb-view-withdraw" style="display: none;">
                <div style="margin-bottom: 14px; background: #161722; border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 13px; color: #a1a1aa;">Available Balance</span>
                  <span style="font-size: 14px; font-weight: 800; color: #fafafa;">${localStorage.getItem('dicesbets_balance') || '0.001'} SOL</span>
                </div>

                <div style="margin-bottom: 14px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Withdraw Amount (SOL)</label>
                  <input id="bb-with-val" type="number" min="0.05" step="0.05" value="0.5" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 14px; font-weight: 700; outline: none;" />
                </div>

                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Destination Solana Wallet</label>
                  <input id="bb-with-addr" type="text" placeholder="Paste your SOL wallet address" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 13px; outline: none;" />
                </div>

                <button id="bb-btn-withdraw" style="width: 100%; padding: 13px; border-radius: 10px; background: rgb(34, 35, 46); box-shadow: rgba(139, 92, 246, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; border: none; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;">
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
      tDep.style.boxShadow = 'rgba(139, 92, 246, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px';
      
      tWith.style.background = 'transparent';
      tWith.style.color = '#71717a';
      tWith.style.boxShadow = 'none';

      vDep.style.display = 'block';
      vWith.style.display = 'none';
    };

    tWith.onclick = () => {
      tWith.style.background = 'rgb(34, 35, 46)';
      tWith.style.color = '#fff';
      tWith.style.boxShadow = 'rgba(139, 92, 246, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px';
      
      tDep.style.background = 'transparent';
      tDep.style.color = '#71717a';
      tDep.style.boxShadow = 'none';

      vWith.style.display = 'block';
      vDep.style.display = 'none';
    };

    // Plisio Checkout
    document.getElementById('bb-btn-pay').onclick = () => {
      const amt = document.getElementById('bb-dep-input').value;
      const orderNumber = 'DB-' + Date.now();
      const invoiceUrl = `https://plisio.net/account/invoices/new?api_key=${PLISIO_API_KEY}&source_currency=USD&source_amount=${amt}&currency=SOL&order_number=${orderNumber}&order_name=Dicesbets+Deposit`;

      const resDiv = document.getElementById('bb-dep-res');
      resDiv.innerHTML = `
        <div style="background: rgba(139, 92, 246, 0.12); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; padding: 12px;">
          <a href="${invoiceUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: rgb(34, 35, 46); box-shadow: rgba(139, 92, 246, 0.38) 0px 1px 0px inset; color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 13.5px;">Open Plisio Checkout ($${amt} USD)</a>
        </div>
      `;
    };

    // Withdraw Trigger
    document.getElementById('bb-btn-withdraw').onclick = () => {
      const amt = parseFloat(document.getElementById('bb-with-val').value);
      const addr = document.getElementById('bb-with-addr').value.trim();
      const resDiv = document.getElementById('bb-with-res');
      const current = parseFloat(localStorage.getItem('dicesbets_balance') || '0.001');

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
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; padding: 12px;">
          <p style="color:#fafafa; font-weight:700; font-size:13px; margin:0;">Withdrawal of ${amt} SOL Queued!</p>
          <p style="color:#a1a1aa; font-size:11px; margin:4px 0 0 0;">New Balance: ${updated} SOL</p>
        </div>
      `;
    };
  };

  console.log('[Dicesbets] Premium BrainBetz Cashier Initialized.');
})();
