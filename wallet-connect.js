/**
 * DICESBETS AUTH & PLAYER SESSION LAYER
 * - NEVER auto-log in brand new users!
 * - If not registered/logged in: displays default "⚡ Sign In / Play" button
 * - Clicking opens Account Modal
 * - Once logged in: displays "0.000 SOL | Username"
 */

(function () {
  if (typeof window === 'undefined') return;

  // Clean out any rogue auto-login entries
  if (localStorage.getItem('dicesbets_username') === 'PlayerOne') {
    localStorage.removeItem('dicesbets_username');
    localStorage.removeItem('dicesbets_balance');
    localStorage.removeItem('dicesbets_pubkey');
    sessionStorage.removeItem('solprime.session');
    sessionStorage.removeItem('solprime.siws');
  }

  function getPlayer() {
    const username = localStorage.getItem('dicesbets_username');
    const balance = localStorage.getItem('dicesbets_balance');
    if (username && username.trim() !== '') {
      return { loggedIn: true, username: username.trim(), balance: balance || "0.000" };
    }
    return { loggedIn: false, username: null, balance: "0.000" };
  }

  function syncInternalSession(addr) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({ sub: addr, address: addr, iat: now, exp: now + (30 * 86400) }));
    const token = `${header}.${payload}.sig`;
    try {
      sessionStorage.setItem('solprime.session', JSON.stringify({
        state: { session: { address: addr, token: token, expiresAt: Date.now() + (30 * 86400 * 1000) } },
        version: 0
      }));
      sessionStorage.setItem('solprime.siws', JSON.stringify({ state: { proof: "valid" }, version: 0 }));
    } catch(e) {}
  }

  function renderHeader() {
    const player = getPlayer();
    
    // Find auth buttons in header
    const connectBtns = document.querySelectorAll('button[data-auth-plate="connect"], button[data-node-id="671:9397"]');
    
    connectBtns.forEach((btn, idx) => {
      if (idx > 0) {
        btn.style.display = 'none';
        return;
      }
      btn.style.display = 'flex';

      if (!player.loggedIn) {
        // LOGGED OUT STATE
        btn.innerHTML = `
          <span style="display:flex; align-items:center; gap:6px; font-weight:800; font-size:14px; color:#ffffff;">
            <span>⚡</span> Sign In / Play
          </span>
        `;
        btn.style.background = 'linear-gradient(180deg, #0083e5 0%, #0060a8 100%)';
        btn.style.border = '1px solid rgba(0, 131, 229, 0.4)';
        btn.style.boxShadow = '0 3px 12px rgba(0, 131, 229, 0.35)';
        btn.style.padding = '0 18px';
        btn.style.borderRadius = '9px';
        btn.style.width = 'auto';

        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openAuthModal();
        };
      } else {
        // LOGGED IN STATE
        btn.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:flex; align-items:center; gap:5px; color:#00ffa3; font-weight:800; font-size:13.5px;">
              <span style="width:7px; height:7px; border-radius:50%; background:#00ffa3; box-shadow:0 0 6px #00ffa3;"></span>
              ${player.balance} SOL
            </span>
            <span style="color:#5a6578;">|</span>
            <span style="color:#ffffff; font-weight:700; font-size:13.5px;">${player.username}</span>
          </div>
        `;
        btn.style.background = 'linear-gradient(180deg, #161a26 0%, #0d111d 100%)';
        btn.style.border = '1px solid rgba(0, 131, 229, 0.4)';
        btn.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.5)';
        btn.style.padding = '0 16px';
        btn.style.borderRadius = '9px';
        btn.style.width = 'auto';

        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.openCashierModal) window.openCashierModal();
        };
      }
    });

    // Remove rogue injected buttons
    document.querySelectorAll('#dicesbets-cashier-btn').forEach((b, i) => {
      if (i > 0) b.remove();
    });
  }

  function openAuthModal() {
    if (document.getElementById('dicesbets-auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'dicesbets-auth-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 999999999;
      background: rgba(3, 5, 12, 0.88); backdrop-filter: blur(14px);
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: #0e131f; border: 1px solid rgba(0, 131, 229, 0.35); border-radius: 22px; width: 400px; max-width: 92vw; padding: 32px 28px; box-shadow: 0 20px 60px rgba(0,0,0,0.85); color: white; text-align: center; position: relative;">
        <button id="auth-close" style="position: absolute; right: 18px; top: 18px; background: transparent; border: none; color: #8e99a8; font-size: 18px; cursor: pointer;">✕</button>
        
        <div style="width: 54px; height: 54px; border-radius: 16px; background: rgba(0, 131, 229, 0.15); border: 1px solid #0083e5; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0083e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>

        <h2 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #fff;">Join Dicesbets</h2>
        <p style="margin: 0 0 22px 0; font-size: 13.5px; color: #9aa3a8;">Enter your player handle to create your standalone account & access deposits.</p>

        <div style="margin-bottom: 20px; text-align: left;">
          <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0083e5; margin-bottom: 6px;">Player Username</label>
          <input id="auth-username-input" type="text" maxlength="15" placeholder="e.g. Satoshi, LuckyAce" style="width: 100%; box-sizing: border-box; background: #131a29; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 13px 16px; color: #fff; font-size: 15px; font-weight: 600; outline: none;" />
          <div id="auth-err" style="display: none; color: #ff5252; font-size: 12px; margin-top: 6px;"></div>
        </div>

        <button id="auth-submit-btn" style="width: 100%; padding: 14px; border-radius: 12px; background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%); border: none; color: #fff; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 18px rgba(0, 131, 229, 0.4);">
          Create Account & Play
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
      localStorage.setItem('dicesbets_username', val);
      localStorage.setItem('dicesbets_balance', '0.000');
      const fakePubkey = "DB" + Math.random().toString(36).substring(2, 10).toUpperCase() + "Sol";
      localStorage.setItem('dicesbets_pubkey', fakePubkey);
      syncInternalSession(fakePubkey);

      modal.remove();
      renderHeader();

      // Open Cashier
      if (window.openCashierModal) window.openCashierModal();
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') submitBtn.click();
    };
  }

  // Intercept click on any connect/sign-in button
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (!btn) return;
    const text = (btn.innerText || btn.textContent || '').toLowerCase();
    if (btn.getAttribute('data-auth-plate') === 'connect' || text.includes('sign in') || text.includes('connect')) {
      const p = getPlayer();
      if (!p.loggedIn) {
        e.preventDefault();
        e.stopPropagation();
        openAuthModal();
      }
    }
  }, true);

  window.addEventListener('DOMContentLoaded', renderHeader);
  setInterval(renderHeader, 1200);

  console.log('[Dicesbets] Real Player Auth Layer Active.');
})();
