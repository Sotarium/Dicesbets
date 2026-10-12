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
  
  let solLivePrice = 111.85;
  async function updateSolPrice() {
    try {
      const res = await (window.__origFetch || fetch)('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
      const data = await res.json();
      if (data && data.price) solLivePrice = parseFloat(data.price);
    } catch(e) {}
  }
  updateSolPrice();
  setInterval(updateSolPrice, 15000);

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
    roundIndex: 1045,
    opensAt: Math.floor(Date.now() / 1000) - 30,
    closesAt: Math.floor(Date.now() / 1000) + 150,
    pot: "4500000000",
    status: "open",
    winningTicket: null,
    winner: null,
    winnerContributed: null,
    payout: null,
    rakeTaken: "0",
    event: null,
    entries: [
      {
        id: "jp-e1",
        amount: "2500000000",
        ticketStart: "0",
        ticketEnd: "2500000000",
        player: { pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", handle: "NeonWhale", level: 14, isBot: false }
      },
      {
        id: "jp-e2",
        amount: "1200000000",
        ticketStart: "2500000000",
        ticketEnd: "3700000000",
        player: { pubkey: "4kLm97x9999999999999999999999999999999999Sol", handle: "SolDegen", level: 28, isBot: false }
      },
      {
        id: "jp-e3",
        amount: "800000000",
        ticketStart: "3700000000",
        ticketEnd: "4500000000",
        player: { pubkey: "9vGg5i33333333333333333333333333333333333bV", handle: "LuckySol", level: 25, isBot: false }
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

    // Always pass through external APIs immediately (Plisio, Binance price feed)
    if (url.includes('plisio.net') || url.includes('binance.com')) {
      try {
        return await originalFetch.apply(this, arguments);
      } catch(err) {
        return jsonResp({ ok: false, error: 'network_error' });
      }
    }

    // 1. GLOBAL CONFIG & SYSTEM HOOKS
    if (url.includes('/config')) {
      return jsonResp({
        ok: true,
        maintenance: { on: false },
        limits: { blackjackMaxBet: "5000000000", maxBetSol: 50 },
        blackjackTables: true,
        solPriceUsd: solLivePrice
      });
    }

    if (url.includes('/api/sol-price') || url.includes('/sol-price')) {
      return jsonResp({ ok: true, price: solLivePrice, usd: solLivePrice });
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

    if (url.includes('/chat/rooms')) {
      return jsonResp({
        ok: true,
        rooms: [
          { id: "global", name: "English (Global)", minLevel: 0, slowModeSeconds: 0, locked: false }
        ]
      });
    }

    if (url.includes('/chat/') && url.includes('/messages')) {
      const defaultMsgs = [
        { id: "m-1", room: "global", at: Date.now() - 120000, pubkey: "9vGg5i33333333333333333333333333333333333bV", name: "LuckySol", handle: "LuckySol", level: 25, role: "player", body: "Welcome to FlipSol! 🎲🔥" },
        { id: "m-2", room: "global", at: Date.now() - 60000, pubkey: "4kLm97x9999999999999999999999999999999999Sol", name: "SolDegen", handle: "SolDegen", level: 14, role: "player", body: "GL to all players!" }
      ];
      let storedMsgs = S.get('chat_messages', defaultMsgs);
      return jsonResp({ ok: true, messages: storedMsgs });
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
    // Dynamic chair management so user can choose whichever seat they click!
    if (url.includes('/games/blackjack/table/chairs')) {
      const myPubkey = localStorage.getItem('flipsol_pubkey') || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      let currentChairs = [];
      try {
        currentChairs = JSON.parse(localStorage.getItem('flipsol_bj_chairs') || '[]');
      } catch(e) {}

      if (method === 'POST') {
        try {
          const body = init && init.body ? JSON.parse(init.body) : {};
          const chairNum = parseInt(body.chair, 10);
          if (!isNaN(chairNum)) {
            if (body.claim) {
              if (!currentChairs.includes(chairNum)) currentChairs.push(chairNum);
            } else {
              currentChairs = currentChairs.filter(c => c !== chairNum);
            }
            localStorage.setItem('flipsol_bj_chairs', JSON.stringify(currentChairs));
          }
        } catch(e) {}
      }

      return jsonResp({
        ok: true,
        seated: currentChairs.length > 0,
        held: false,
        table: {
          id: 'standard-1', code: 'STD1', visibility: 'public', capacity: 3, chairsTaken: currentChairs.length, version: Date.now(),
          players: [{
            pubkey: myPubkey, handle: localStorage.getItem('flipsol_username') || 'Player',
            level: 5, status: 'active', staked: '0', stakes: [],
            chairs: currentChairs, you: true
          }]
        }
      });
    }

    if (url.includes('/games/blackjack/table') && !url.includes('/tables')) {
      const myPubkey = localStorage.getItem('flipsol_pubkey') || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      let currentChairs = [];
      try {
        currentChairs = JSON.parse(localStorage.getItem('flipsol_bj_chairs') || '[]');
      } catch(e) {}

      return jsonResp({
        ok: true,
        seated: currentChairs.length > 0,
        held: false,
        table: {
          id: 'standard-1', code: 'STD1', visibility: 'public', capacity: 3, chairsTaken: currentChairs.length, version: 1,
          players: [{
            pubkey: myPubkey, handle: localStorage.getItem('flipsol_username') || 'Player',
            level: 5, status: 'active', staked: '0', stakes: [],
            chairs: currentChairs, you: true
          }]
        }
      });
    }
    if (url.includes('/wallet/balance')) {
      const curBal = localStorage.getItem('flipsol_balance') || '0.001';
      const lamports = Math.floor(parseFloat(curBal) * 1e9).toString();
      return jsonResp({ ok: true, available: lamports, locked: '0' });
    }
    if (url.includes('/wallet/deposit-address')) {
      const myPubkey = localStorage.getItem('flipsol_pubkey') || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      return jsonResp({ ok: true, address: '7FHDkTRsRBAE6z7CoKFSPNDvjEn5D7W2tueQVyXR9KR2', minimum: '10000000', mustSendFrom: myPubkey });
    }
    if (url.includes('/games/blackjack/stake')) {
      return jsonResp({ ok: true, status: 'staked' });
    }
    if (url.includes('/games/blackjack/boxes/pending') || url.includes('/blackjack/boxes')) {
      return jsonResp({ ok: true, boxes: [] });
    }
    if (url.includes('/games/blackjack/hand')) {
      return jsonResp({
        ok: true,
        status: 'confirmed',
        hand: {
          id: 'h-' + Date.now(),
          status: 'dealt',
          entropySlot: 100,
          hands: [
            {
              cards: [
                { rank: 'K', suit: 'hearts' },
                { rank: '8', suit: 'diamonds' }
              ],
              bet: '10000000',
              doubled: false,
              closed: false,
              outcome: 'pending',
              payout: null,
              box: 0
            }
          ],
          boxes: [
            {
              seat: 0,
              bet: '10000000',
              side213: '0',
              sidePair: '0',
              side213Result: null,
              sidePairResult: null,
              side213Payout: '0',
              sidePairPayout: '0',
              insurance: '0',
              staked: '10000000'
            }
          ]
        }
      });
    }
    if (url.includes('/admin/blackjack/tables') || url.includes('/blackjack/tables') || url.includes('/games/blackjack/tables')) {
      return jsonResp({
        ok: true,
        tables: [
          { id: 'high-roller-1', code: 'HR1', name: 'High Roller Salon', visibility: 'public', capacity: 3, minBet: '100000000', maxBet: '5000000000' },
          { id: 'standard-1', code: 'STD1', name: 'Standard 1', visibility: 'public', capacity: 3, minBet: '10000000', maxBet: '500000000' }
        ],
        truncated: false,
        recentSeconds: 0
      });
    }

    // 4. DICE DUELS
    if (url.includes('/games/dice')) {
      const myPub = localStorage.getItem('flipsol_pubkey') || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      let duels = S.get('duels', [
        {
          id: "duel-1",
          stake: "50000000",
          pot: "100000000",
          capacity: 2,
          format: "freeForAll",
          direction: "high",
          rakeBps: 200,
          status: "open",
          creator: { pubkey: "9vGg5i33333333333333333333333333333333333bV", handle: "LuckySol", level: 25, isBot: false },
          seats: [
            { seatIndex: 0, player: { pubkey: "9vGg5i33333333333333333333333333333333333bV", handle: "LuckySol", level: 25, isBot: false }, mode: "wallet", roll: null, tiebreak: null, payout: "0", team: null, joinedAt: Date.now() - 60000 }
          ],
          winnerSeat: null,
          payout: null,
          potentialPayout: "98000000",
          createdAt: Date.now() - 60000,
          expiresAt: Date.now() + 300000,
          matchedAt: null,
          resolvedAt: null,
          resolvedAtMs: null
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
      const myPub = localStorage.getItem('flipsol_pubkey') || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      const myUser = { pubkey: myPub, handle: localStorage.getItem('flipsol_username') || 'Player', level: 5, isBot: false };
      let games = S.get('coinflips', [
        {
          id: 'cf-1',
          stake: '100000000',
          creatorSide: true,
          creator: { pubkey: '9vGg5i33333333333333333333333333333333333bV', handle: 'LuckySol', level: 25, isBot: false },
          opponent: null,
          creatorWins: null,
          status: 'open',
          createdAt: Date.now() - 45000,
          resolvedAt: null
        }
      ]);

      if (method === 'POST') {
        try {
          const body = init && init.body ? JSON.parse(init.body) : {};
          const created = {
            id: 'cf-' + Date.now(),
            stake: body.stake || '100000000',
            creatorSide: body.side !== undefined ? body.side : true,
            creator: myUser,
            opponent: null,
            creatorWins: null,
            status: 'open',
            createdAt: Date.now(),
            resolvedAt: null
          };
          games.unshift(created);
          S.set('coinflips', games);
          return jsonResp({ ok: true, game: created, signature: 'cf-' + Date.now() });
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
  const activeSockets = new Set();
  class SafeWS {
    constructor(url) {
      this.url = url;
      this.readyState = 1;
      activeSockets.add(this);
      setTimeout(() => {
        if (this.onopen) this.onopen({ type: 'open' });
        // Send protocol v1 handshake!
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage({ data: JSON.stringify({ t: 'hello', v: 1 }) });
          }
        }, 10);
      }, 50);
    }
    send(data) {
      try {
        const msg = JSON.parse(data);
        if (msg.op === 'say') {
          const myPub = localStorage.getItem('flipsol_pubkey') || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
          const myHandle = localStorage.getItem('flipsol_username') || 'Player';
          const newMsg = {
            id: 'm-' + Date.now(),
            room: msg.room || 'global',
            at: Date.now(),
            pubkey: myPub,
            name: myHandle,
            handle: myHandle,
            level: 5,
            role: 'player',
            body: msg.body,
            replyTo: msg.replyTo || null
          };
          let list = S.get('chat_messages', []);
          list.push(newMsg);
          S.set('chat_messages', list.slice(-100));

          // Broadcast to all active sockets as batch event
          activeSockets.forEach(s => {
            if (s.onmessage) {
              s.onmessage({
                data: JSON.stringify({
                  t: 'batch',
                  events: [{ e: 'chat.message', message: newMsg }]
                })
              });
            }
          });
        }
      } catch(e) {}
    }
    close() {
      this.readyState = 3;
      activeSockets.delete(this);
      if (this.onclose) this.onclose({ type: 'close' });
    }
  }
  window.WebSocket = SafeWS;

  console.log('[FlipSol] Comprehensive Local Interceptor Active.');
})();
