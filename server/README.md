# FlipSol Game Server & Fee System

This server provides the backend REST APIs and WebSocket real-time feeds for:
- **Dice Duels** (Create duels, 1v1 matchmaking, player queues)
- **Coinflip** (50/50 flip games)
- **Jackpot** (Real-time pot rounds, ticket distribution, countdown timer)
- **Blackjack** (Table lists, seat allocation, dealer cards)
- **Affiliates & Fees** (3% house fee logic, referral tracking, earnings)

## Setup & Running

```powershell
cd server
npm install
node index.js
```

## Free Cloud Deployment (e.g. Render / Railway)

1. Connect your GitHub repository `Sotarium/FlipSol`.
2. Set Root Directory to `server`.
3. Set Build Command: `npm install`
4. Set Start Command: `node index.js`
5. Configure Environment Variables:
   - `HOUSE_WALLET`: Your personal Solana wallet address (where all house cut fees are sent).
   - `HOUSE_FEE_BPS`: `300` (equal to 3.00% fee).
