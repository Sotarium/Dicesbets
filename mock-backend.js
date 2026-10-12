/**
 * FLIPSOL COMPREHENSIVE INTERCEPTOR & GAME ENGINE
 * Intercepts all requests:
 * - /cases/odds, /config, /auth/session, /race, /chat/rooms, /api/sol-price
 * - Jackpot: /games/jackpot/current, rounds, events, bet
 * - Dice Duels & Coinflip & Blackjack
 * Prevents ANY network request from failing or throwing CORS
 */

(function () {
  if (typeof window === 'undefined') return;

  const S = {
    get: (k, d) => {
      try { const v = localStorage.getItem('flipsol_' + k); return v ? JSON.parse(v) : d; }
      catch(e) { return d; }
    },
    set: (k, v) => {
      try { localStorage.setItem('flipsol_' + k, JSON.stringify(v)); }
      catch(e) {}
    }
  };

  // Overwrite window.solana, phantom, and solflare completely to prevent browser extension popups
  const playerPubkey = localStorage.getItem('flipsol_pubkey') || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
  const mockPublicKey = {
    toBase58: () => playerPubkey,
    toString: () => playerPubkey,
    toBytes: () => new Uint8Array(32),
    equals: () => true
  };

  const safeProvider = {
    isPhantom: true,
    isConnected: true,
    publicKey: mockPublicKey,
    connect: async () => ({ publicKey: mockPublicKey }),
    disconnect: async () => {},
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
    signAndSendTransaction: async (tx) => ({ signature: "sim-" + Date.now() }),
    signMessage: async (msg) => ({ signature: new Uint8Array(64) }),
    on: () => {},
    off: () => {},
    emit: () => {}
  };

  try {
    Object.defineProperty(window, 'solana', { value: safeProvider, writable: true, configurable: true });
    Object.defineProperty(window, 'phantom', { value: { solana: safeProvider }, writable: true, configurable: true });
    Object.defineProperty(window, 'solflare', { value: safeProvider, writable: true, configurable: true });
  } catch(e) {
    window.solana = safeProvider;
  }

  const defaultJackpotRound = {
    roundId: 1045,
    index: 1045,
    state: "open",
    pot: "4500000000",
    potSol: 4.5,
    jackpotPaid: "0",
    jackpotHit: false,
    endAt: Date.now() + 180000,
    timeRemainingMs: 145000,
    seekMs: 0,
    entries: [
      {
        id: "jp-e1",
        contributed: "2500000000",
        user: { pubkey: "7xKXtg...sU", handle: "NeonWhale", level: 14, avatarUrl: null }
      },
      {
        id: "jp-e2",
        contributed: "1200000000",
        user: { pubkey: "4kLm97...Sol", handle: "SolDegen", level: 28, avatarUrl: null }
      },
      {
        id: "jp-e3",
        contributed: "800000000",
        user: { pubkey: "9vGg5i...bV", handle: "LuckySol", level: 25, avatarUrl: null }
      }
    ]
  };

  const defaultBlackjackRound = {
    roundId: 881,
    tableId: "high-roller-1",
    phase: "betting",
    actionSeq: 0,
    insurance: null,
    seats: [
      {
        chair: 0,
        player: { pubkey: "7xKXtg...sU", handle: "NeonWhale", level: 14 },
        hands: [{ cards: [{ rank: "K", suit: "hearts" }, { rank: "8", suit: "diamonds" }], bet: "500000000", total: 18, status: "standing" }]
      },
      { chair: 1, player: null, hands: [] },
      { chair: 2, player: null, hands: [] }
    ],
    dealer: {
      cards: [{ rank: "A", suit: "spades" }, { rank: "hidden", suit: "hidden" }],
      total: 11
    }
  };

  const jsonResp = (obj, status = 200) => new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const rawUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    const url = rawUrl.toLowerCase();
    const method = (init && init.method ? init.method : 'GET').toUpperCase();

    // 1. GLOBAL CONFIG & SYSTEM HOOKS
    if (url.includes('/config')) {
      return jsonResp({
        ok: true,
        maintenance: { on: false },
        limits: { blackjackMaxBet: "5000000000", maxBetSol: 50 },
        blackjackTables: true,
        solPriceUsd: 185.50
      });
    }

    if (url.includes('/api/sol-price') || url.includes('/sol-price')) {
      return jsonResp({ ok: true, price: 185.50, usd: 185.50 });
    }

    if (url.includes('/auth/session') || url.includes('/session')) {
      return jsonResp({
        ok: true,
        session: {
          address: localStorage.getItem('flipsol_pubkey') || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
          token: "valid-session-token",
          expiresAt: Date.now() + 864000000
        }
      });
    }

    if (url.includes('/cases/odds') || url.includes('/odds')) {
      return jsonResp({ ok: true, odds: [] });
    }

    if (url.includes('/race')) {
      return jsonResp({ ok: true, active: false, prize: 5000, leaderboard: [] });
    }

    if (url.includes('/chat/rooms') || url.includes('/rooms')) {
      return jsonResp({
        ok: true,
        rooms: [
          { id: "global", name: "English (Global)", messages: [] }
        ]
      });
    }

    // 2. JACKPOT ROUTES
    if (url.includes('/games/jackpot/current') || url.includes('/jackpot/current')) {
      return jsonResp({ ok: true, round: defaultJackpotRound, entries: defaultJackpotRound.entries });
    }
    if (url.includes('/games/jackpot/rounds')) {
      return jsonResp({ ok: true, rounds: [defaultJackpotRound], round: defaultJackpotRound, entries: defaultJackpotRound.entries });
    }
    if (url.includes('/games/jackpot/events/operator') || url.includes('/jackpot/events')) {
      return jsonResp({ ok: true, operator: null, enabled: false, testOnly: false, pending: null });
    }
    if (url.includes('/games/jackpot/progressive') || url.includes('/progressive')) {
      return jsonResp({ ok: true, totalPaid: "125000000000", lastHitAt: Date.now() - 3600000, lastHitRef: 1040 });
    }
    if (url.includes('/jackpot/bet') || (url.includes('/jackpot') && method === 'POST')) {
      return jsonResp({ ok: true, round: defaultJackpotRound });
    }

    // 3. BLACKJACK ROUTES
    if (url.includes('/games/blackjack/tables/') || url.includes('/blackjack/table')) {
      return jsonResp({ ok: true, round: defaultBlackjackRound, table: defaultBlackjackRound, status: "confirmed" });
    }
    if (url.includes('/admin/blackjack/tables') || url.includes('/blackjack/tables')) {
      return jsonResp({
        ok: true,
        tables: [
          { id: "high-roller-1", code: "HR1", name: "High Roller Salon", visibility: "public", capacity: 3, minBet: "100000000", maxBet: "5000000000" },
          { id: "standard-1", code: "STD1", name: "Standard 1", visibility: "public", capacity: 3, minBet: "10000000", maxBet: "500000000" }
        ],
        truncated: false,
        recentSeconds: 0
      });
    }

    // 4. DICE DUELS
    if (url.includes('/games/dice')) {
      let duels = S.get('duels', [
        {
          id: "duel-1",
          stake: "50000000",
          capacity: 2,
          format: "1v1",
          direction: "high",
          creator: { pubkey: "7xKX...sU", handle: "NeonWhale", level: 14 },
          players: [{ pubkey: "7xKX...sU", handle: "NeonWhale", level: 14, roll: null }],
          status: "waiting",
          winner: null,
          created_at: Date.now() - 60000
        }
      ]);

      if (method === 'POST') {
        try {
          const body = init && init.body ? JSON.parse(init.body) : {};
          const created = {
            id: "duel-" + Date.now(),
            stake: body.stake || "50000000",
            capacity: body.capacity || 2,
            format: body.format || "1v1",
            direction: body.direction || "high",
            creator: { pubkey: localStorage.getItem('flipsol_pubkey') || "You", handle: localStorage.getItem('flipsol_username') || "Player", level: 5 },
            players: [{ pubkey: localStorage.getItem('flipsol_pubkey') || "You", handle: localStorage.getItem('flipsol_username') || "Player", level: 5, roll: null }],
            status: "waiting",
            winner: null,
            created_at: Date.now()
          };
          duels.unshift(created);
          S.set('duels', duels);
          return jsonResp({ ok: true, duel: created, signature: "dd-" + Date.now() });
        } catch(e) {}
      }
      return jsonResp({ ok: true, duels: duels, total: duels.length });
    }

    // 5. COINFLIP
    if (url.includes('/games/coinflip')) {
      let games = S.get('coinflips', [
        {
          id: "cf-1",
          stake: "100000000",
          side: true,
          creator: { pubkey: "9vGg...bV", handle: "LuckySol", level: 25 },
          status: "waiting",
          winner: null,
          created_at: Date.now() - 45000
        }
      ]);

      if (method === 'POST') {
        try {
          const body = init && init.body ? JSON.parse(init.body) : {};
          const created = {
            id: "cf-" + Date.now(),
            stake: body.stake || "100000000",
            side: body.side !== undefined ? body.side : true,
            creator: { pubkey: localStorage.getItem('flipsol_pubkey') || "You", handle: localStorage.getItem('flipsol_username') || "Player", level: 5 },
            status: "waiting",
            winner: null,
            created_at: Date.now()
          };
          games.unshift(created);
          S.set('coinflips', games);
          return jsonResp({ ok: true, game: created, signature: "cf-" + Date.now() });
        } catch(e) {}
      }
      return jsonResp({ ok: true, games: games, total: games.length });
    }

    // 6. AFFILIATES
    if (url.includes('/affiliates') || url.includes('/referral')) {
      return jsonResp({
        ok: true,
        code: "FLIPSOL",
        referrals: 18,
        refereeVolume: "48500000000",
        totalEarnings: "1455000000",
        claimable: "450000000",
        rateBps: 300
      });
    }

    // Always pass through external APIs (Plisio, Binance price feed)
    if (url.includes('plisio.net') || url.includes('binance.com')) {
      try {
        return await originalFetch.apply(this, arguments);
      } catch(err) {
        return jsonResp({ ok: false, error: 'network_error' });
      }
    }

    // Catch-all for any other SolPrime or internal API calls to avoid CORS
    if (url.includes('solprime') || url.includes('/api/') || url.includes('/games/')) {
      return jsonResp({ ok: true, data: {} });
    }

    try {
      return await originalFetch.apply(this, arguments);
    } catch(err) {
      return jsonResp({ ok: true });
    }
  };

  // Safe Mock WebSocket
  class SafeWS {
    constructor(url) {
      this.url = url;
      this.readyState = 1;
      setTimeout(() => { if (this.onopen) this.onopen({ type: 'open' }); }, 50);
    }
    send() {}
    close() {
      this.readyState = 3;
      if (this.onclose) this.onclose({ type: 'close' });
    }
  }
  window.WebSocket = SafeWS;

  console.log('[FlipSol] Comprehensive Local Interceptor Active.');
})();
