/**
 * DICESBETS SOLANA WALLET & ONBOARDING SYSTEM
 * - Direct connection to Phantom, Solflare, Backpack, or window.solana
 * - Interactive clean username creation overlay
 * - Persistent profile state & live balance display
 */

(function () {
  if (typeof window === 'undefined') return;

  const DEFAULT_HOUSE_WALLET = "9vGg5i328d8xUeGsmK2974bVnBks3";
  const HOUSE_FEE_PERCENT = 0.03; // 3%
  const HELIUS_RPC = "https://mainnet.helius-rpc.com/?api-key=15319bf4-5b40-4966-ac4d-11e82d79870e";

  window.dicesbetsState = {
    connected: false,
    walletName: null,
    publicKey: null,
    username: localStorage.getItem('dicesbets_username') || null,
    balance: "0.00",
    houseWallet: DEFAULT_HOUSE_WALLET,
    feePercent: HOUSE_FEE_PERCENT
  };

  function ensureSolanaWeb3(cb) {
    if (window.solanaWeb3) return cb();
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js';
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  // Connect Wallet
  async function connectWallet(provider, name) {
    try {
      const resp = await provider.connect();
      const pubkey = (resp && resp.publicKey ? resp.publicKey : provider.publicKey).toString();
      window.dicesbetsState.connected = true;
      window.dicesbetsState.publicKey = pubkey;
      window.dicesbetsState.walletName = name;

      closeWalletModal();
      fetchBalance(pubkey);

      // Check if user has picked a username
      const existingName = localStorage.getItem('dicesbets_username');
      if (!existingName) {
        showUsernameOverlay(pubkey);
      } else {
        window.dicesbetsState.username = existingName;
        updateUIOnConnect(existingName, pubkey);
      }
    } catch (err) {
      console.error('[Dicesbets] Wallet connection error:', err);
    }
  }

  // Fetch Balance
  async function fetchBalance(pubkey) {
    if (!window.solanaWeb3) return;
    try {
      const connection = new window.solanaWeb3.Connection(HELIUS_RPC, 'confirmed');
      const pk = new window.solanaWeb3.PublicKey(pubkey);
      const lamports = await connection.getBalance(pk);
      const sol = (lamports / window.solanaWeb3.LAMPORTS_PER_SOL).toFixed(3);
      window.dicesbetsState.balance = sol;
    } catch (e) {}
  }

  // Update Connect Button
  function updateUIOnConnect(username, pubkey) {
    const label = username || (pubkey.slice(0, 4) + '...' + pubkey.slice(-4));
    document.querySelectorAll('button').forEach(btn => {
      if (btn.innerText && btn.innerText.includes('Connect')) {
        btn.innerHTML = `
          <span style="display:flex;align-items:center;gap:7px;font-weight:700;color:#fff;">
            <span style="width:8px;height:8px;border-radius:50%;background:#22eb7d;box-shadow:0 0 8px #22eb7d;"></span>
            ${label}
          </span>
        `;
        btn.style.background = 'linear-gradient(180deg, #1b2336 0%, #111726 100%)';
        btn.style.border = '1px solid rgba(120, 133, 255, 0.4)';
      }
    });
  }

  // ========================================================
  // CLEAN USERNAME OVERLAY
  // ========================================================
  function showUsernameOverlay(pubkey) {
    if (document.getElementById('dicesbets-username-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'dicesbets-username-modal';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999999;
      background: rgba(4, 7, 14, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    overlay.innerHTML = `
      <div style="background: #0e131f; border: 1px solid rgba(103, 111, 255, 0.35); border-radius: 20px; width: 420px; max-width: 92vw; padding: 32px 28px; box-shadow: 0 16px 50px rgba(0, 0, 0, 0.85); text-align: center; color: white; position: relative;">
        <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(103, 111, 255, 0.15); border: 1px solid rgba(103, 111, 255, 0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7884ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <h2 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; letter-spacing: 0.3px; color: #fff;">Choose Your Handle</h2>
        <p style="margin: 0 0 22px 0; font-size: 13.5px; color: #9aa3a8; line-height: 1.5;">Welcome to Dicesbets! Pick your player name to participate in Duels, Jackpot, and Blackjack.</p>
        
        <div style="margin-bottom: 20px; text-align: left;">
          <label style="display: block; font-size: 12px; font-weight: 600; color: #7884ff; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Username</label>
          <input id="dicesbets-username-input" type="text" maxlength="15" placeholder="e.g. Satoshi, LuckyAce" style="width: 100%; box-sizing: border-box; background: #131a29; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 13px 16px; color: #fff; font-size: 15px; outline: none; transition: border 0.2s;" />
          <div id="dicesbets-username-err" style="display: none; color: #ff5252; font-size: 12px; margin-top: 6px;"></div>
        </div>

        <button id="dicesbets-username-submit" style="width: 100%; padding: 13px; border-radius: 10px; background: linear-gradient(180deg, #8189ff 0%, #5a62f0 100%); border: none; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(103, 111, 255, 0.4); transition: transform 0.15s;">Continue to Games</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = document.getElementById('dicesbets-username-input');
    const submitBtn = document.getElementById('dicesbets-username-submit');
    const errText = document.getElementById('dicesbets-username-err');

    input.focus();
    input.onfocus = () => input.style.borderColor = '#7884ff';
    input.onblur = () => input.style.borderColor = 'rgba(255,255,255,0.12)';

    submitBtn.onclick = () => {
      const val = input.value.trim();
      if (!val || val.length < 3) {
        errText.innerText = 'Username must be at least 3 characters.';
        errText.style.display = 'block';
        return;
      }
      localStorage.setItem('dicesbets_username', val);
      window.dicesbetsState.username = val;
      updateUIOnConnect(val, pubkey);
      overlay.remove();
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') submitBtn.click();
    };
  }

  // ========================================================
  // WALLET SELECTOR MODAL
  // ========================================================
  function createWalletModal() {
    if (document.getElementById('dicesbets-wallet-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'dicesbets-wallet-modal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(3, 6, 16, 0.82);
      backdrop-filter: blur(8px);
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: #0e131f; border: 1px solid rgba(120, 133, 255, 0.28); border-radius: 18px; width: 380px; max-width: 90vw; padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); position: relative; color: white;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #fff;">Connect Solana Wallet</h3>
          <button id="dicesbets-modal-close" style="background: transparent; border: none; color: #9aa3a8; font-size: 20px; cursor: pointer; padding: 4px;">✕</button>
        </div>
        <div id="dicesbets-wallet-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
        <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #6d7680; text-align: center;">
          Secured by Helius RPC • 3% Automated House Yield
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('dicesbets-modal-close').onclick = closeWalletModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeWalletModal();
    };
  }

  function openWalletModal() {
    createWalletModal();
    const modal = document.getElementById('dicesbets-wallet-modal');
    const list = document.getElementById('dicesbets-wallet-list');
    list.innerHTML = '';

    const wallets = [
      { name: 'Phantom', icon: 'https://phantom.app/favicon.ico', getProvider: () => window.phantom?.solana || window.solana },
      { name: 'Solflare', icon: 'https://solflare.com/favicon.ico', getProvider: () => window.solflare },
      { name: 'Backpack', icon: 'https://backpack.app/favicon.ico', getProvider: () => window.backpack }
    ];

    wallets.forEach(w => {
      const provider = w.getProvider();
      const isInstalled = !!provider;
      const btn = document.createElement('button');
      btn.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #131a29;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      btn.onmouseenter = () => btn.style.borderColor = 'rgba(120, 133, 255, 0.6)';
      btn.onmouseleave = () => btn.style.borderColor = 'rgba(255,255,255,0.06)';

      btn.innerHTML = `
        <span style="display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600;">
          <img src="${w.icon}" width="24" height="24" style="border-radius: 6px;" alt="" />
          ${w.name}
        </span>
        <span style="font-size: 12px; color: ${isInstalled ? '#33f667' : '#9aa3a8'}; font-weight: 500;">
          ${isInstalled ? 'Installed' : 'Get'}
        </span>
      `;

      btn.onclick = () => {
        if (isInstalled) {
          connectWallet(provider, w.name);
        } else {
          if (w.name === 'Phantom') window.open('https://phantom.app/', '_blank');
          if (w.name === 'Solflare') window.open('https://solflare.com/', '_blank');
          if (w.name === 'Backpack') window.open('https://backpack.app/', '_blank');
        }
      };

      list.appendChild(btn);
    });

    modal.style.display = 'flex';
  }

  function closeWalletModal() {
    const modal = document.getElementById('dicesbets-wallet-modal');
    if (modal) modal.style.display = 'none';
  }

  function bindConnectButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, a');
      if (!btn) return;

      const text = btn.innerText || btn.textContent || '';
      const isConnectBtn = btn.getAttribute('data-auth-plate') === 'connect' ||
        text.toLowerCase().includes('connect') ||
        btn.getAttribute('aria-label')?.toLowerCase().includes('connect');

      if (isConnectBtn && !window.dicesbetsState.connected) {
        e.preventDefault();
        e.stopPropagation();
        openWalletModal();
      }
    }, true);
  }

  ensureSolanaWeb3(() => {
    bindConnectButtons();
  });
})();
