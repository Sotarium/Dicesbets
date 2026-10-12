// Mock local server & interceptor for SolPrime Games
(function() {
  if (typeof window === 'undefined') return;

  // Local storage state initialization
  const STORAGE_KEY_DUELS = 'solprime_mock_duels';
  const STORAGE_KEY_COINFLIP = 'solprime_mock_coinflips';
  const STORAGE_KEY_JACKPOT = 'solprime_mock_jackpot';
  const STORAGE_KEY_BJ = 'solprime_mock_bj';

  function getStored(key, defaultVal) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : defaultVal;
    } catch(e) {
      return defaultVal;
    }
  }

  function setStored(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {}
  }

  // Initialize sample data if empty
  if (!localStorage.getItem(STORAGE_KEY_DUELS)) {
    setStored(STORAGE_KEY_DUELS, [
      {
        id: "duel-101",
        stake: "50000000", // 0.05 SOL
        capacity: 2,
        format: "1v1",
        direction: "high",
        creator: { pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", handle: "NeonWhale", level: 14 },
        players: [{ pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", handle: "NeonWhale", level: 14, roll: null }],
        status: "waiting",
        winner: null,
        created_at: Date.now() - 120000
      },
      {
        id: "duel-102",
        stake: "200000000", // 0.2 SOL
        capacity: 2,
        format: "1v1",
        direction: "high",
        creator: { pubkey: "9vGg5i328d8xUeGsmK2974bVnBks3", handle: "LuckySol", level: 25 },
        players: [{ pubkey: "9vGg5i328d8xUeGsmK2974bVnBks3", handle: "LuckySol", level: 25, roll: null }],
        status: "waiting",
        winner: null,
        created_at: Date.now() - 60000
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEY_COINFLIP)) {
    setStored(STORAGE_KEY_COINFLIP, [
      {
        id: "cf-101",
        stake: "100000000", // 0.1 SOL
        side: true, // heads
        creator: { pubkey: "8Z91xK...1", handle: "CryptoKing", level: 18 },
        status: "waiting",
        winner: null,
        created_at: Date.now() - 80000
      },
      {
        id: "cf-102",
        stake: "500000000", // 0.5 SOL
        side: false, // tails
        creator: { pubkey: "4kLm9...2", handle: "SolDegen", level: 31 },
        status: "waiting",
        winner: null,
        created_at: Date.now() - 40000
      }
    ]);
  }

  const origFetch = window.fetch;
  window.fetch = async function(input, init) {
    let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    
    // Check if this is an API call
    if (url.includes('/games/') || url.includes('/jackpot') || url.includes('/blackjack') || url.includes('/affiliates') || url.includes('/referral') || url.includes('/fair/')) {
      const method = (init && init.method ? init.method : 'GET').toUpperCase();

      // --- DICE DUELS ---
      if (url.includes('/games/dice')) {
        let duels = getStored(STORAGE_KEY_DUELS, []);
        if (method === 'POST') {
          try {
            const body = init && init.body ? JSON.parse(init.body) : {};
            const newDuel = {
              id: "duel-" + Date.now(),
              stake: body.stake || "10000000",
              capacity: body.capacity || 2,
              format: body.format || "1v1",
              direction: body.direction || "high",
              creator: { pubkey: "You", handle: "Player", level: 5 },
              players: [{ pubkey: "You", handle: "Player", level: 5, roll: null }],
              status: "waiting",
              winner: null,
              created_at: Date.now()
            };
            duels.unshift(newDuel);
            setStored(STORAGE_KEY_DUELS, duels);
            return new Response(JSON.stringify({ ok: true, duel: newDuel, signature: "sig-" + Date.now() }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } catch(e) {
            console.error(e);
          }
        } else {
          return new Response(JSON.stringify({ duels: duels, total: duels.length }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // --- COINFLIP ---
      if (url.includes('/games/coinflip')) {
        let games = getStored(STORAGE_KEY_COINFLIP, []);
        if (method === 'POST') {
          try {
            const body = init && init.body ? JSON.parse(init.body) : {};
            const newGame = {
              id: "cf-" + Date.now(),
              stake: body.stake || "50000000",
              side: body.side !== undefined ? body.side : true,
              creator: { pubkey: "You", handle: "Player", level: 5 },
              status: "waiting",
              winner: null,
              created_at: Date.now()
            };
            games.unshift(newGame);
            setStored(STORAGE_KEY_COINFLIP, games);
            return new Response(JSON.stringify({ ok: true, game: newGame, signature: "cf-sig-" + Date.now() }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } catch(e) {
            console.error(e);
          }
        } else {
          return new Response(JSON.stringify({ games: games, total: games.length }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // --- JACKPOT ---
      if (url.includes('/jackpot')) {
        const round = {
          roundId: 1042,
          state: "open",
          potSol: 4.85,
          usdPerSol: 180,
          endAt: Date.now() + 180000,
          entries: [
            {
              id: "entry-1",
              contributed: "2500000000",
              user: { pubkey: "4kLm9...2", handle: "SolDegen", level: 31, avatarUrl: null }
            },
            {
              id: "entry-2",
              contributed: "1500000000",
              user: { pubkey: "7xKXtg...sU", handle: "NeonWhale", level: 14, avatarUrl: null }
            },
            {
              id: "entry-3",
              contributed: "850000000",
              user: { pubkey: "9vGg5...bV", handle: "LuckySol", level: 25, avatarUrl: null }
            }
          ]
        };
        return new Response(JSON.stringify({ ok: true, round: round, current: round }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // --- BLACKJACK TABLES ---
      if (url.includes('/blackjack')) {
        const tables = [
          {
            id: "bj-table-1",
            name: "High Roller Salon",
            minBet: "100000000",
            maxBet: "10000000000",
            seats: [
              { index: 0, player: { pubkey: "7xKX...sU", handle: "NeonWhale", level: 14 }, bet: "500000000" },
              { index: 1, player: null, bet: null },
              { index: 2, player: null, bet: null }
            ],
            dealerHand: { cards: ["K-hearts", "hidden"], total: 10 },
            state: "betting"
          },
          {
            id: "bj-table-2",
            name: "Standard Table",
            minBet: "10000000",
            maxBet: "1000000000",
            seats: [
              { index: 0, player: null, bet: null },
              { index: 1, player: null, bet: null },
              { index: 2, player: null, bet: null }
            ],
            dealerHand: { cards: [], total: 0 },
            state: "waiting"
          }
        ];
        return new Response(JSON.stringify({ ok: true, tables: tables }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // --- AFFILIATES / REFERRAL ---
      if (url.includes('/affiliates') || url.includes('/referral')) {
        return new Response(JSON.stringify({
          ok: true,
          code: "DICESBETS",
          referrals: 12,
          refereeVolume: "14500000000",
          totalEarnings: "1250000000",
          claimable: "450000000",
          rateBps: 100
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Default passthrough
    try {
      return await origFetch.apply(this, arguments);
    } catch(err) {
      // Prevent network error popups for indexer / stats
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };

  // Mock WebSocket to emulate live round tickers & game rolls
  class MockWebSocket {
    constructor(url) {
      this.url = url;
      this.readyState = 1; // OPEN
      setTimeout(() => {
        if (this.onopen) this.onopen({ type: 'open' });
      }, 50);
    }
    send(data) {}
    close() {
      this.readyState = 3;
      if (this.onclose) this.onclose({ type: 'close' });
    }
  }
  window.WebSocket = MockWebSocket;
  console.log('[Dicesbets] Mock game backend layer initialized.');
})();
