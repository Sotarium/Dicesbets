/**
 * FLIPSOL HEADER & AUTH LAYER
 * - Matches user screenshot: [Affiliates] [ (SOL Icon) 0.001 ]
 * - Dark satin pill with inner border and deep gradient
 * - Clicking the balance pill directly opens the Deposit/Withdraw Cashier
 */

(function () {
  if (typeof window === 'undefined') return;

  function getPlayer() {
    const username = localStorage.getItem('flipsol_username');
    const balance = localStorage.getItem('flipsol_balance') || "0.001";
    return {
      loggedIn: !!(username && username.trim() !== ''),
      username: username || null,
      balance: balance
    };
  }

  function renderHeader() {
    const player = getPlayer();
    const connectBtns = document.querySelectorAll('button[data-auth-plate="connect"], button[data-node-id="671:9397"]');

    connectBtns.forEach((btn, idx) => {
      if (idx > 0) {
        btn.style.display = 'none';
        return;
      }
      btn.style.display = 'flex';

      // Always show clean balance pill: [ (SOL Icon) 0.001 ]
      btn.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:20px; height:20px; border-radius:50%; background:#10111a; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <img src="/sol-3d.png" width="16" height="16" style="object-fit:contain;" alt="" />
          </div>
          <span style="color:#ffffff; font-weight:800; font-size:14.5px; letter-spacing:0.3px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${player.balance}
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

      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.openCashierModal) window.openCashierModal();
      };
    });

    // Remove any extra cashiers injected previously
    document.querySelectorAll('#flipsol-cashier-btn').forEach(b => b.remove());
  }

  function openAuthModal() {
    if (document.getElementById('flipsol-auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'flipsol-auth-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 999999999;
      background: rgba(3, 5, 12, 0.85); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: #12131a; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; width: 380px; max-width: 92vw; padding: 30px 26px; box-shadow: rgba(0, 0, 0, 0.8) 0px 32px 72px; color: white; text-align: center; position: relative;">
        <button id="auth-close" style="position: absolute; right: 16px; top: 16px; background: transparent; border: none; color: #71717a; font-size: 18px; cursor: pointer;">✕</button>
        
        <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #fff;">Join FlipSol</h2>
        <p style="margin: 0 0 20px 0; font-size: 13px; color: #71717a;">Choose a player handle to start playing & depositing.</p>

        <div style="margin-bottom: 18px; text-align: left;">
          <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">Player Username</label>
          <input id="auth-username-input" type="text" maxlength="15" placeholder="e.g. Satoshi" style="width: 100%; box-sizing: border-box; background: #1a1b24; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 14px; font-weight: 600; outline: none;" />
          <div id="auth-err" style="display: none; color: #ff5252; font-size: 12px; margin-top: 6px;"></div>
        </div>

        <button id="auth-submit-btn" style="width: 100%; padding: 13px; border-radius: 10px; background: rgb(34, 35, 46); box-shadow: rgba(139, 92, 246, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; border: none; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;">
          Continue
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('auth-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const input = document.getElementById('auth-username-input');
    const submitBtn = document.getElementById('auth-submit-btn');
    const errText = document.getElementById('auth-err');

    input.focus();
    submitBtn.onclick = () => {
      const val = input.value.trim();
      if (!val || val.length < 3) {
        errText.innerText = 'Username must be at least 3 characters.';
        errText.style.display = 'block';
        return;
      }
      localStorage.setItem('flipsol_username', val);
      localStorage.setItem('flipsol_balance', '0.001');
      modal.remove();
      renderHeader();
      if (window.openCashierModal) window.openCashierModal();
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') submitBtn.click();
    };
  }

  // SUPPRESS ALL WALLET CONNECT MODALS & REDIRECT TO CASHIER
  const killWalletModals = () => {
    // 1. Target any wallet modal elements
    const selectors = [
      '.wallet-adapter-modal',
      '.wallet-adapter-modal-wrapper',
      '.mobile-wallet-adapter-modal',
      '.mobile-wallet-adapter-embedded-modal',
      'div[role="dialog"]:has(.wallet-adapter-list)',
      'div[role="dialog"]:has(#mobile-wallet-adapter-launch-action)'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // 2. Hide any modal with "Connect Wallet" title
    document.querySelectorAll('div[role="dialog"]').forEach(dialog => {
      const text = dialog.innerText || '';
      if (text.includes('Connect Wallet') || text.includes('Select Wallet') || text.includes('Phantom') || text.includes('Solflare')) {
        dialog.remove();
        if (window.openCashierModal) window.openCashierModal();
      }
    });
  };

  // Global click interceptor: if anything triggers a wallet connect, open Cashier directly instead
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, [role="button"]');
    if (!target) return;
    const txt = (target.innerText || '').toLowerCase();
    if (txt.includes('connect wallet') || txt.includes('select wallet')) {
      e.preventDefault();
      e.stopPropagation();
      killWalletModals();
      if (window.openCashierModal) window.openCashierModal();
    }
  }, true);

  // MutationObserver to immediately zap any wallet connect popup
  const observer = new MutationObserver(() => {
    killWalletModals();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Inject CSS to permanently suppress wallet adapter popups
  const style = document.createElement('style');
  style.innerHTML = `
    .wallet-adapter-modal,
    .wallet-adapter-modal-container,
    .mobile-wallet-adapter-embedded-modal,
    .mobile-wallet-adapter-modal {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('DOMContentLoaded', renderHeader);
  setInterval(renderHeader, 1200);

  console.log('[FlipSol] Wallet modals suppressed. Pure deposit cashier active.');
})();
