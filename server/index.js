const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const cors = require('cors');
const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// ==========================================
// CONFIGURATION: HOUSE SETTINGS & WALLET
// ==========================================
const HOUSE_WALLET = process.env.HOUSE_WALLET || "YOUR_SOLANA_HOUSE_WALLET_ADDRESS";
const HOUSE_FEE_BPS = 300; // 3.00% House Fee (300 basis points)
const SOLANA_RPC = process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com";

// In-Memory Storage (Can be connected to Redis/PostgreSQL)
const state = {
  duels: [
    {
      id: "duel-1001",
      stake: "50000000", // 0.05 SOL
      capacity: 2,
      format: "1v1",
      direction: "high",
      creator: { pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", handle: "NeonWhale", level: 14 },
      players: [{ pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", handle: "NeonWhale", level: 14, roll: null }],
      status: "waiting",
      winner: null,
      created_at: Date.now() - 60000
    }
  ],
  coinflips: [
    {
      id: "cf-2001",
      stake: "100000000", // 0.1 SOL
      side: true, // heads
      creator: { pubkey: "9vGg5i328d8xUeGsmK2974bVnBks3", handle: "LuckySol", level: 25 },
      status: "waiting",
      winner: null,
      created_at: Date.now() - 30000
    }
  ],
  jackpot: {
    roundId: 1045,
    state: "open",
    potSol: 3.42,
    usdPerSol: 185.50,
    endAt: Date.now() + 120000,
    entries: [
      {
        id: "jp-1",
        contributed: "1850000000",
        user: { pubkey: "4kLm97u...Sol", handle: "SolDegen", level: 28, avatarUrl: null }
      },
      {
        id: "jp-2",
        contributed: "1570000000",
        user: { pubkey: "7xKXtg2...AsU", handle: "NeonWhale", level: 14, avatarUrl: null }
      }
    ]
  },
  blackjackTables: [
    {
      id: "table-1",
      name: "High Roller Salon",
      minBet: "100000000",
      maxBet: "5000000000",
      seats: [
        { index: 0, player: { pubkey: "7xKXtg...AsU", handle: "NeonWhale", level: 14 }, bet: "500000000" },
        { index: 1, player: null, bet: null },
        { index: 2, player: null, bet: null }
      ],
      dealerHand: { cards: ["K-hearts", "hidden"], total: 10 },
      state: "betting"
    },
    {
      id: "table-2",
      name: "Standard Table",
      minBet: "10000000",
      maxBet: "500000000",
      seats: [
        { index: 0, player: null, bet: null },
        { index: 1, player: null, bet: null },
        { index: 2, player: null, bet: null }
      ],
      dealerHand: { cards: [], total: 0 },
      state: "waiting"
    }
  ],
  affiliates: {
    code: "DICESBETS",
    commissionRateBps: HOUSE_FEE_BPS,
    refereeCount: 18,
    totalWagered: "48200000000", // in lamports (~48.2 SOL)
    earnings: "1446000000",      // ~1.446 SOL
    claimable: "720000000"       // ~0.72 SOL
  }
};

// Broadcast updates to all connected players
function broadcast(event, data) {
  const payload = JSON.stringify({ e: event, d: data, t: "event" });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// ==========================================
// API ROUTES
// ==========================================

// Health & System Check
app.get('/health', (req, res) => res.json({ status: "ok", timestamp: Date.now() }));

// 1. DICE DUELS
app.get('/games/dice', (req, res) => {
  res.json({ duels: state.duels, total: state.duels.length });
});

app.post('/games/dice', (req, res) => {
  const { stake, capacity = 2, format = "1v1", direction = "high", idempotencyKey } = req.body;
  const newDuel = {
    id: "duel-" + Date.now(),
    stake: stake ? stake.toString() : "10000000",
    capacity,
    format,
    direction,
    creator: { pubkey: "You", handle: "Player", level: 10 },
    players: [{ pubkey: "You", handle: "Player", level: 10, roll: null }],
    status: "waiting",
    winner: null,
    created_at: Date.now()
  };
  state.duels.unshift(newDuel);
  broadcast("dice.created", newDuel);
  res.json({ ok: true, duel: newDuel, signature: "tx-" + Date.now() });
});

// 2. COINFLIP
app.get('/games/coinflip', (req, res) => {
  res.json({ games: state.coinflips, total: state.coinflips.length });
});

app.post('/games/coinflip', (req, res) => {
  const { stake, side = true } = req.body;
  const newGame = {
    id: "cf-" + Date.now(),
    stake: stake ? stake.toString() : "50000000",
    side,
    creator: { pubkey: "You", handle: "Player", level: 10 },
    status: "waiting",
    winner: null,
    created_at: Date.now()
  };
  state.coinflips.unshift(newGame);
  broadcast("coinflip.created", newGame);
  res.json({ ok: true, game: newGame, signature: "cf-" + Date.now() });
});

// 3. JACKPOT
app.get('/jackpot', (req, res) => {
  res.json({ ok: true, round: state.jackpot, current: state.jackpot });
});

app.post('/jackpot/bet', (req, res) => {
  const { amountLamports, user } = req.body;
  const entry = {
    id: "jp-" + Date.now(),
    contributed: (amountLamports || 100000000).toString(),
    user: user || { pubkey: "You", handle: "Player", level: 1 }
  };
  state.jackpot.entries.push(entry);
  state.jackpot.potSol += Number(entry.contributed) / 1e9;
  broadcast("jackpot.entry", entry);
  res.json({ ok: true, round: state.jackpot });
});

// 4. BLACKJACK
app.get('/blackjack/tables', (req, res) => {
  res.json({ ok: true, tables: state.blackjackTables });
});

// 5. AFFILIATES / REFERRALS
app.get('/affiliates/config', (req, res) => {
  res.json({
    ok: true,
    houseWallet: HOUSE_WALLET,
    feeBasisPoints: HOUSE_FEE_BPS,
    summary: state.affiliates
  });
});

app.get('/referral/:wallet', (req, res) => {
  res.json({
    ok: true,
    code: state.affiliates.code,
    referees: state.affiliates.refereeCount,
    totalVolume: state.affiliates.totalWagered,
    claimable: state.affiliates.claimable,
    rateBps: state.affiliates.commissionRateBps
  });
});

// ==========================================
// WEBSOCKET LOGIC
// ==========================================
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ t: "welcome", message: "Connected to Dicesbets Game Server" }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.t === 'ping') ws.send(JSON.stringify({ t: 'pong' }));
    } catch(e) {}
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Dicesbets Solana Game & Fee Server running on port ${PORT}`);
  console.log(`House Wallet: ${HOUSE_WALLET}`);
  console.log(`House Fee: ${(HOUSE_FEE_BPS / 100).toFixed(2)}%`);
  console.log(`===============================================`);
});
