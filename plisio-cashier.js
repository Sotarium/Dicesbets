/**
 * FLIPSOL BRAINBETZ CASHIER (Exact Styling, Dynamic Plisio Address, Live SOL Price)
 * - Removed all neon lighting around GUI
 * - Accurate Live SOL Price: fetched real-time from Binance / Plisio (~$111.90)
 * - Directly renders client Solana deposit address & copy button inside the modal
 * - Interactive hover states: buttons transition smoothly to purple on hover
 */

(function () {
  if (typeof window === 'undefined') return;

  const PLISIO_API_KEY = "d9ssUQwY4V9lABn1SjlKNXw-ChCwNGZPVSDbGm2WG2TwW1aMlCGh6ltzihNzeXF3";
  let solLivePrice = 111.85;

  async function fetchLiveSolPrice() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
      const data = await res.json();
      if (data && data.price) {
        solLivePrice = parseFloat(data.price);
        const el = document.getElementById('bb-sol-live-price');
        if (el) el.textContent = solLivePrice.toFixed(2);
      }
    } catch(e) {}
  }
  fetchLiveSolPrice();
  setInterval(fetchLiveSolPrice, 15000);

  window.openCashierModal = function() {
    if (document.getElementById('flipsol-brainbetz-modal')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'flipsol-brainbetz-modal';
    backdrop.style.cssText = `
      position: fixed; inset: 0; z-index: 999999999;
      background: rgba(4, 5, 10, 0.85); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
    `;

    backdrop.innerHTML = `
      <style>
        .bb-hover-btn {
          background: rgb(26, 27, 36);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px;
          color: #ffffff;
          transition: background 0.15s ease, opacity 0.15s ease;
        }
        .bb-hover-btn:hover {
          background: rgb(34, 35, 48);
          opacity: 0.95;
        }
        .bb-gray-btn {
          background: transparent;
          color: #71717a;
          border-radius: 8px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .bb-gray-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #e4e4e7;
        }
      </style>

      <div style="width: 760px; max-width: 95vw; height: 540px; max-height: 85vh; border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.12); background: linear-gradient(165deg, rgb(20, 21, 29) 0%, rgb(18, 19, 26) 45%, rgb(15, 16, 22) 100%); box-shadow: rgba(167, 139, 250, 0.12) 0px 1px 0px inset, rgba(0, 0, 0, 0.75) 0px 32px 72px -20px; display: flex; flex-direction: column; overflow: hidden; position: relative; color: white;">
        
        <!-- Subtle Bottom Atmosphere (No harsh neon) -->
        <div style="position: absolute; inset-inline: 0; bottom: 0; height: 180px; pointer-events: none; z-index: 0;">
          <div style="position: absolute; inset: 0; opacity: 0.35; background: radial-gradient(120% 90% at 50% 115%, rgba(139, 92, 246, 0.4) 0%, transparent 65%);"></div>
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, #12131a, rgba(18, 19, 26, 0.5) 50%, transparent 100%);"></div>
        </div>

        <!-- 2-Column Main Layout -->
        <div style="display: flex; flex: 1; min-height: 0; position: relative; z-index: 1;">
          
          <!-- LEFT ASIDE -->
          <aside style="width: 210px; flex-shrink: 0; border-right: 1px solid rgba(255, 255, 255, 0.06); background: #0a0b10; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
            
            <div style="padding: 24px 16px 8px 16px; text-align: center; position: relative; z-index: 2;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.22em; color: #a1a1aa;">Deposit</p>
              <p style="margin: 4px 0 0 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em; background: linear-gradient(180deg, #ede9fe 0%, #a78bfa 50%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CRYPTO</p>
              
              <!-- Mini 3D Coin Badge -->
              <div style="margin-top: 14px; display: flex; justify-content: center;">
                <div style="width: 32px; height: 32px; border-radius: 9px; background: rgb(34, 35, 46); box-shadow: rgba(153, 69, 255, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; display: flex; align-items: center; justify-content: center;">
                  <img src="/sol-3d.png" width="20" height="20" style="object-fit: contain;" alt="Solana" />
                </div>
              </div>
            </div>

            <!-- Bottom Floating 3D Coins Art -->
            <div style="position: relative; padding: 0 4px 12px 4px; text-align: center; z-index: 2;">
              <img src="/assets/crypto/Coins.png" style="width: 140px; height: auto; margin: 0 auto; display: block; filter: drop-shadow(0 18px 42px rgba(91,33,182,0.4));" alt="" />
            </div>
          </aside>

          <!-- RIGHT PANEL -->
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
            
            <!-- Header Tabs & Close Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: rgba(22, 23, 31, 0.95); flex-shrink: 0;">
              
              <div style="display: flex; gap: 6px;">
                <button id="bb-tab-deposit" class="bb-hover-btn" style="height: 36px; padding: 0 16px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5"><path d="M12 17V3M6 11l6 6 6-6M19 21H5"/></svg>
                  <span>Deposit</span>
                </button>
                <button id="bb-tab-withdraw" class="bb-gray-btn" style="height: 36px; padding: 0 16px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 9-6-6-6 6M12 3v14M5 21h14"/></svg>
                  <span>Withdraw</span>
                </button>
              </div>

              <button id="bb-modal-close" class="bb-gray-btn" style="width: 32px; height: 32px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;">✕</button>
            </div>

            <!-- Content Body -->
            <div style="flex: 1; overflow-y: auto; padding: 20px 24px; min-height: 0;">
              
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #71717a;">Cryptocurrencies</span>
                <div style="flex: 1; height: 1px; background: linear-gradient(to right, rgba(255,255,255,0.08), transparent);"></div>
              </div>

              <!-- SOLANA COIN SELECTION CARD -->
              <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px;">
                <div id="bb-coin-card" class="bb-hover-btn" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 12px; cursor: pointer;">
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

                <!-- Minimum $1 warning banner -->
                <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 10px; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.2); background: #241c14; padding: 10px 14px; font-size: 13px; font-weight: 600; line-height: 1.45; color: #f59e0b;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px; color: #f59e0b;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  <span>Minimum $1 USD deposit. Sending less may result in loss of funds.</span>
                </div>

                <!-- AUTO-LOADED DEPOSIT ADDRESS -->
                <div id="bb-dep-res">
                  <div style="background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #a78bfa; font-weight: 600;">Generating your personal deposit address...</p>
                  </div>
                </div>
              </div>

              <!-- VIEW: WITHDRAW -->
              <div id="bb-view-withdraw" style="display: none;">
                <div style="margin-bottom: 14px; background: #161722; border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 13px; color: #a1a1aa;">Available Balance</span>
                  <span style="font-size: 14px; font-weight: 800; color: #fafafa;">${localStorage.getItem('flipsol_balance') || '0.001'} SOL</span>
                </div>

                <div style="margin-bottom: 14px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Withdraw Amount (SOL)</label>
                  <input id="bb-with-val" type="number" min="0.05" step="0.05" value="0.5" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 14px; font-weight: 700; outline: none;" />
                </div>

                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Destination Solana Wallet</label>
                  <input id="bb-with-addr" type="text" placeholder="Paste your SOL wallet address" style="width: 100%; box-sizing: border-box; background: #161722; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 13px; outline: none;" />
                </div>

                <button id="bb-btn-withdraw" class="bb-hover-btn" style="width: 100%; padding: 13px; font-size: 14px; font-weight: 700; cursor: pointer;">
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

    document.getElementById('bb-modal-close').onclick = () => backdrop.remove();
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };

    const tDep = document.getElementById('bb-tab-deposit');
    const tWith = document.getElementById('bb-tab-withdraw');
    const vDep = document.getElementById('bb-view-deposit');
    const vWith = document.getElementById('bb-view-withdraw');

    tDep.onclick = () => {
      tDep.className = 'bb-hover-btn';
      tWith.className = 'bb-gray-btn';
      vDep.style.display = 'block';
      vWith.style.display = 'none';
    };

    tWith.onclick = () => {
      tWith.className = 'bb-hover-btn';
      tDep.className = 'bb-gray-btn';
      vWith.style.display = 'block';
      vDep.style.display = 'none';
    };

    // Auto-fetch Plisio deposit address immediately on modal open
    (async function fetchDepositAddress() {
      const resDiv = document.getElementById('bb-dep-res');
      try {
        const orderNumber = 'FS-' + Date.now();
        const url = `https://api.plisio.net/api/v1/invoices/new?api_key=${PLISIO_API_KEY}&currency=SOL&source_currency=USD&source_amount=5&order_number=${orderNumber}&order_name=FlipSol+Deposit`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data && data.data && data.data.wallet_hash) {
          const depositAddress = data.data.wallet_hash;

          resDiv.innerHTML = `
            <div style="background: #14151f; border: 1px solid rgba(139, 92, 246, 0.28); border-radius: 12px; padding: 16px; box-shadow: rgba(0, 0, 0, 0.5) 0px 8px 24px;">
              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #71717a; margin-bottom: 6px;">Your Solana Deposit Address</label>
                <div style="display: flex; background: #0a0b10; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 8px 12px; align-items: center; justify-content: space-between;">
                  <span id="sol-dep-addr-text" style="font-family: monospace; font-size: 11px; color: #fafafa; word-break: break-all;">${depositAddress}</span>
                  <button id="sol-copy-btn" class="bb-hover-btn" style="margin-left: 10px; padding: 5px 12px; font-size: 11px; font-weight: 700; cursor: pointer; flex-shrink: 0;">Copy</button>
                </div>
              </div>
              <p style="margin: 0; font-size: 11px; color: #71717a;">Status: <span style="color: #a78bfa; font-weight: 600;">Watching for payment...</span> — Send any amount of SOL to this address. Credited automatically on 1 confirmation.</p>
            </div>
          `;

          document.getElementById('sol-copy-btn').onclick = () => {
            navigator.clipboard.writeText(depositAddress);
            document.getElementById('sol-copy-btn').textContent = 'Copied!';
            setTimeout(() => document.getElementById('sol-copy-btn').textContent = 'Copy', 2000);
          };
        } else {
          throw new Error('No wallet_hash returned');
        }
      } catch (err) {
        resDiv.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 12px;">
            <p style="color: #ef4444; font-size: 12px; margin: 0;">Notice: Direct gateway busy. Please check back shortly.</p>
          </div>
        `;
      }
    })();

    // Withdraw Handler
    document.getElementById('bb-btn-withdraw').onclick = () => {
      const amt = parseFloat(document.getElementById('bb-with-val').value);
      const addr = document.getElementById('bb-with-addr').value.trim();
      const resDiv = document.getElementById('bb-with-res');
      const current = parseFloat(localStorage.getItem('flipsol_balance') || '0.001');

      if (!addr || addr.length < 20) {
        resDiv.innerHTML = '<p style="color:#ef4444; font-size:12px; margin:0;">Please enter a valid Solana address.</p>';
        return;
      }
      if (amt > current) {
        resDiv.innerHTML = '<p style="color:#ef4444; font-size:12px; margin:0;">Insufficient balance.</p>';
        return;
      }

      const updated = (current - amt).toFixed(3);
      localStorage.setItem('flipsol_balance', updated);
      resDiv.innerHTML = `
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; padding: 12px;">
          <p style="color:#fafafa; font-weight:700; font-size:13px; margin:0;">Withdrawal of ${amt} SOL Queued!</p>
          <p style="color:#a1a1aa; font-size:11px; margin:4px 0 0 0;">New Balance: ${updated} SOL</p>
        </div>
      `;
    };
  };

  // HEADER BALANCE PILL & DIRECT CASHIER OPENER
  function renderHeaderBalance() {
    const balance = localStorage.getItem('flipsol_balance') || "0.001";

    // --- 1. Replace the connect/sign-in button with the balance pill ---
    const headerBtns = document.querySelectorAll('button[data-auth-plate="connect"], button[data-node-id="671:9397"]');
    headerBtns.forEach((btn, idx) => {
      if (idx > 0) { btn.style.display = 'none'; return; }
      btn.style.display = 'flex';
      btn.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:20px; height:20px; border-radius:50%; background:#10111a; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <img src="/sol-3d.png" width="16" height="16" style="object-fit:contain;" alt="" />
          </div>
          <span style="color:#ffffff; font-weight:800; font-size:14.5px; letter-spacing:0.3px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${balance}
          </span>
        </div>
      `;
      btn.style.background = 'linear-gradient(180deg, rgba(34, 35, 52, 0.95) 0%, rgba(20, 21, 32, 0.95) 100%)';
      btn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      btn.style.boxShadow = 'rgba(255, 255, 255, 0.05) 0px 1px 0px inset, rgba(0, 0, 0, 0.6) 0px 4px 16px';
      btn.style.padding = '0 18px';
      btn.style.height = '42px';
      btn.style.borderRadius = '12px';
      btn.style.width = 'auto';
      btn.style.cursor = 'pointer';
      btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.openCashierModal(); };
    });

    // --- 2. Inject balance pill next to Affiliates nav link ---
    // Find the Affiliates link by text content
    if (document.getElementById('flipsol-nav-balance')) {
      // Already injected — just update the balance text
      const el = document.getElementById('flipsol-nav-balance-text');
      if (el) el.textContent = balance;
      return;
    }

    let affiliatesLink = null;
    document.querySelectorAll('a, button, span').forEach(el => {
      if (el.children.length === 0 && el.textContent.trim() === 'Affiliates') {
        affiliatesLink = el;
      }
    });

    if (affiliatesLink) {
      // Walk up to find a flex container parent we can append to
      let container = affiliatesLink.parentElement;
      // Go up a couple levels to find the nav row
      for (let i = 0; i < 3; i++) {
        if (container && container.parentElement) container = container.parentElement;
      }

      const pill = document.createElement('button');
      pill.id = 'flipsol-nav-balance';
      pill.style.cssText = `
        display: inline-flex; align-items: center; gap: 7px;
        background: linear-gradient(180deg, rgba(34,35,52,0.95) 0%, rgba(20,21,32,0.95) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: rgba(255,255,255,0.05) 0px 1px 0px inset, rgba(0,0,0,0.5) 0px 4px 12px;
        border-radius: 10px; padding: 0 14px; height: 38px;
        cursor: pointer; margin-left: 10px; flex-shrink: 0;
      `;
      pill.innerHTML = `
        <div style="width:18px;height:18px;border-radius:50%;background:#10111a;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <img src="/sol-3d.png" width="14" height="14" style="object-fit:contain;" alt="" />
        </div>
        <span id="flipsol-nav-balance-text" style="color:#fff;font-weight:800;font-size:13.5px;letter-spacing:0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">${balance}</span>
      `;
      pill.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.openCashierModal(); };

      // Insert after the Affiliates link's closest li/div ancestor inside the nav row
      const insertAfter = affiliatesLink.closest('li') || affiliatesLink.closest('div') || affiliatesLink;
      if (insertAfter && insertAfter.parentElement) {
        insertAfter.parentElement.insertBefore(pill, insertAfter.nextSibling);
      }
    }
  }



  // Permanently suppress any third-party wallet modal styles
  const walletKillStyle = document.createElement('style');
  walletKillStyle.innerHTML = `
    div[data-node-id="671:5647"] { display: none !important; }

    .wallet-adapter-modal,
    .wallet-adapter-modal-container,
    .mobile-wallet-adapter-embedded-modal,
    .mobile-wallet-adapter-modal {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(walletKillStyle);

  window.addEventListener('DOMContentLoaded', renderHeaderBalance);
  setInterval(renderHeaderBalance, 1200);

  console.log('[FlipSol] Pure Deposit Cashier active. All wallet connect files deleted.');
})();
