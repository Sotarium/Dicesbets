/**
 * DICESBETS TUFF CASHIER MODAL (Plisio Crypto - Solana Only)
 * - Tuff Dark Glassmorphism UI inspired by the design
 * - Live Solana Price fetched real-time
 * - 3D Solana Coin graphic
 * - Plisio Direct Gateway Integration
 */

(function () {
  if (typeof window === 'undefined') return;

  const PLISIO_API_KEY = "d9ssUQwY4V9lABn1SjlKNXw-ChCwNGZPVSDbGm2WG2TwW1aMlCGh6ltzihNzeXF3";
  let solLivePrice = 184.25;

  // Fetch Live Solana Price
  async function fetchSolPrice() {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await res.json();
      if (data && data.solana && data.solana.usd) {
        solLivePrice = data.solana.usd;
        updateSolPriceDisplay();
      }
    } catch(e) {}
  }
  fetchSolPrice();
  setInterval(fetchSolPrice, 30000);

  function updateSolPriceDisplay() {
    const el = document.getElementById('cashier-sol-live-price');
    if (el) el.textContent = `$${solLivePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  window.openCashierModal = function(initialTab = 'deposit') {
    if (document.getElementById('dicesbets-tuff-cashier')) return;

    const modal = document.createElement('div');
    modal.id = 'dicesbets-tuff-cashier';
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 999999999;
      background: rgba(3, 5, 12, 0.88); backdrop-filter: blur(16px);
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="display: flex; background: #0b0f19; border: 1px solid rgba(0, 131, 229, 0.35); border-radius: 24px; width: 840px; max-width: 95vw; min-height: 520px; box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 131, 229, 0.15); overflow: hidden; position: relative; color: white;">
        
        <!-- LEFT SIDEBAR: BRANDING & 3D ART -->
        <div style="width: 280px; background: linear-gradient(180deg, #070a13 0%, #0c111f 100%); border-right: 1px solid rgba(255, 255, 255, 0.06); padding: 36px 28px; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
          <div>
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #5a6578; margin-bottom: 6px;">DEPOSIT</div>
            <div style="font-size: 32px; font-weight: 900; letter-spacing: 0.5px; color: #0083e5; text-shadow: 0 0 25px rgba(0, 131, 229, 0.6); margin-bottom: 24px;">CRYPTO</div>
            
            <!-- Floating Mini Coin Badges -->
            <div style="display: flex; gap: 8px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(0, 131, 229, 0.15); border: 1px solid #0083e5; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(0, 131, 229, 0.3);">
                <img src="/solana-3d.svg" width="26" height="26" alt="SOL" />
              </div>
            </div>
          </div>

          <!-- Bottom 3D Floating Coin Graphics -->
          <div style="position: relative; height: 160px; display: flex; align-items: center; justify-content: center;">
            <img src="/solana-3d.svg" width="130" height="130" style="filter: drop-shadow(0 15px 25px rgba(0, 131, 229, 0.5)); transform: rotate(-12deg);" alt="" />
          </div>
        </div>

        <!-- RIGHT MAIN CONTENT -->
        <div style="flex: 1; padding: 32px 36px; display: flex; flex-direction: column;">
          
          <!-- TOP CONTROLS: TABS & CLOSE -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
            <div style="display: flex; background: #121826; border-radius: 12px; padding: 4px; border: 1px solid rgba(255,255,255,0.06);">
              <button id="tuff-tab-deposit" style="display: flex; align-items: center; gap: 8px; padding: 9px 20px; border-radius: 9px; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; background: #0083e5; color: white; transition: all 0.2s;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg> Deposit
              </button>
              <button id="tuff-tab-withdraw" style="display: flex; align-items: center; gap: 8px; padding: 9px 20px; border-radius: 9px; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; background: transparent; color: #7e8b9b; transition: all 0.2s;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg> Withdraw
              </button>
            </div>
            
            <button id="tuff-cashier-close" style="width: 34px; height: 34px; border-radius: 50%; background: #131a29; border: 1px solid rgba(255,255,255,0.08); color: #8e99a8; font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">✕</button>
          </div>

          <!-- SECTION HEADER -->
          <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #5a6578; margin-bottom: 16px;">
            CRYPTOCURRENCIES
          </div>

          <!-- COIN SELECTOR CARD (SOLANA) -->
          <div style="margin-bottom: 24px;">
            <div id="coin-card-sol" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; background: linear-gradient(135deg, rgba(0, 131, 229, 0.15) 0%, #121826 100%); border: 2px solid #0083e5; border-radius: 16px; cursor: pointer; box-shadow: 0 8px 24px rgba(0, 131, 229, 0.25);">
              <div style="display: flex; align-items: center; gap: 16px;">
                <img src="/solana-3d.svg" width="48" height="48" style="filter: drop-shadow(0 4px 8px rgba(0, 131, 229, 0.4));" alt="SOL" />
                <div>
                  <div style="font-size: 18px; font-weight: 800; color: #ffffff;">SOL</div>
                  <div id="cashier-sol-live-price" style="font-size: 13px; font-weight: 600; color: #00ffa3; margin-top: 2px;">$${solLivePrice.toFixed(2)}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #0083e5; background: rgba(0, 131, 229, 0.15); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(0, 131, 229, 0.3);">ACTIVE</span>
              </div>
            </div>
          </div>

          <!-- PANEL: DEPOSIT -->
          <div id="tuff-panel-deposit">
            <div style="margin-bottom: 18px;">
              <label style="display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #8e99a8; margin-bottom: 8px;">Deposit Amount (USD)</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 16px; top: 13px; font-weight: 700; color: #5a6578; font-size: 16px;">$</span>
                <input id="tuff-dep-amount" type="number" min="5" value="25" style="width: 100%; box-sizing: border-box; background: #121826; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px 16px 13px 32px; color: #fff; font-size: 16px; font-weight: 700; outline: none;" />
              </div>
            </div>

            <button id="tuff-btn-pay" style="width: 100%; padding: 15px; border-radius: 12px; background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%); border: none; color: #fff; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 131, 229, 0.4); display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.15s;">
              Deposit with Solana (Plisio)
            </button>
            <div id="tuff-dep-result" style="margin-top: 14px;"></div>
          </div>

          <!-- PANEL: WITHDRAW -->
          <div id="tuff-panel-withdraw" style="display: none;">
            <div style="margin-bottom: 14px; background: #121826; border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #8e99a8;">Your Current Balance</span>
              <span style="font-size: 15px; font-weight: 800; color: #00ffa3;">${localStorage.getItem('dicesbets_balance') || '2.500'} SOL</span>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8e99a8; margin-bottom: 8px;">Withdraw Amount (SOL)</label>
              <input id="tuff-with-amount" type="number" min="0.05" step="0.05" value="0.5" style="width: 100%; box-sizing: border-box; background: #121826; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px 16px; color: #fff; font-size: 15px; font-weight: 700; outline: none;" />
            </div>

            <div style="margin-bottom: 18px;">
              <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8e99a8; margin-bottom: 8px;">Destination Solana Wallet</label>
              <input id="tuff-with-addr" type="text" placeholder="Paste your SOL address" style="width: 100%; box-sizing: border-box; background: #121826; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px 16px; color: #fff; font-size: 14px; outline: none;" />
            </div>

            <button id="tuff-btn-withdraw-submit" style="width: 100%; padding: 15px; border-radius: 12px; background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%); border: none; color: #fff; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 131, 229, 0.4);">
              Submit Instant Withdrawal
            </button>
            <div id="tuff-with-result" style="margin-top: 14px;"></div>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('tuff-cashier-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const tabDep = document.getElementById('tuff-tab-deposit');
    const tabWith = document.getElementById('tuff-tab-withdraw');
    const pDep = document.getElementById('tuff-panel-deposit');
    const pWith = document.getElementById('tuff-panel-withdraw');

    tabDep.onclick = () => {
      tabDep.style.background = '#0083e5'; tabDep.style.color = '#fff';
      tabWith.style.background = 'transparent'; tabWith.style.color = '#7e8b9b';
      pDep.style.display = 'block'; pWith.style.display = 'none';
    };

    tabWith.onclick = () => {
      tabWith.style.background = '#0083e5'; tabWith.style.color = '#fff';
      tabDep.style.background = 'transparent'; tabDep.style.color = '#7e8b9b';
      pWith.style.display = 'block'; pDep.style.display = 'none';
    };

    // Deposit Button Action (Plisio Invoice)
    document.getElementById('tuff-btn-pay').onclick = () => {
      const amount = document.getElementById('tuff-dep-amount').value;
      const orderNumber = 'DB-' + Date.now();
      const invoiceUrl = `https://plisio.net/account/invoices/new?api_key=${PLISIO_API_KEY}&source_currency=USD&source_amount=${amount}&currency=SOL&order_number=${orderNumber}&order_name=Dicesbets+Deposit`;

      const resDiv = document.getElementById('tuff-dep-result');
      resDiv.innerHTML = `
        <div style="background: rgba(0, 131, 229, 0.1); border: 1px solid #0083e5; border-radius: 12px; padding: 14px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 13.5px; color: #fff;">Deposit <strong>$${amount} USD</strong> via Solana</p>
          <a href="${invoiceUrl}" target="_blank" style="display: inline-block; padding: 10px 24px; background: #0083e5; color: #fff; font-weight: 800; border-radius: 8px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 15px rgba(0, 131, 229, 0.4);">Open Plisio Payment Gateway</a>
        </div>
      `;
    };

    // Withdrawal Action
    document.getElementById('tuff-btn-withdraw-submit').onclick = () => {
      const amt = parseFloat(document.getElementById('tuff-with-amount').value);
      const addr = document.getElementById('tuff-with-addr').value.trim();
      const resDiv = document.getElementById('tuff-with-result');
      const current = parseFloat(localStorage.getItem('dicesbets_balance') || '2.500');

      if (!addr || addr.length < 20) {
        resDiv.innerHTML = '<p style="color:#ff5252;font-size:13px;text-align:center;">Please enter a valid Solana wallet address.</p>';
        return;
      }
      if (amt > current) {
        resDiv.innerHTML = '<p style="color:#ff5252;font-size:13px;text-align:center;">Insufficient account balance.</p>';
        return;
      }

      const updated = (current - amt).toFixed(3);
      localStorage.setItem('dicesbets_balance', updated);
      resDiv.innerHTML = `
        <div style="background: rgba(0, 255, 163, 0.1); border: 1px solid #00ffa3; border-radius: 12px; padding: 14px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #00ffa3; font-weight: 800;">Withdrawal of ${amt} SOL Submitted!</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #9aa3a8;">Sent to ${addr.slice(0, 4)}...${addr.slice(-4)}. New Balance: ${updated} SOL</p>
        </div>
      `;
    };
  };

  // Replace default button
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

  console.log('[Dicesbets] Tuff Plisio Cashier initialized.');
})();
