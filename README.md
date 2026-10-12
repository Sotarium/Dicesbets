# SolPrime Clone

Complete clone of [SolPrime](https://www.solprime.io/home) including all pages, Next.js chunk bundles, stylesheets, custom fonts, cards, and UI figma assets.

## Cloned Routes

- `/` & `/home` - Main Casino Landing Page & House Games (Blackjack, Coinflip, Jackpot, Dice Duels)
- `/play/blackjack` - Blackjack Game Page
- `/play/coinflip` - Coinflip Game Page
- `/play/jackpot` - Jackpot Game Page
- `/play/dice-duels` - Dice Duels Game Page
- `/earn` - Refer & Earn / Affiliates
- `/roadmap` - Roadmap Page
- `/legal/terms` - Terms of Service
- `/legal/fairness` - Fairness / Provably Fair System
- `/legal/privacy` - Privacy Policy

## Directory Structure

```
Solprime/
├── cloned_solprime/
│   ├── index.html
│   ├── home/index.html
│   ├── earn/index.html
│   ├── roadmap/index.html
│   ├── play/
│   │   ├── blackjack/index.html
│   │   ├── coinflip/index.html
│   │   ├── dice-duels/index.html
│   │   └── jackpot/index.html
│   ├── legal/
│   │   ├── fairness/index.html
│   │   ├── privacy/index.html
│   │   └── terms/index.html
│   ├── _next/static/   (all JavaScript chunks, CSS stylesheets, fonts)
│   └── figma/          (game cards, badges, vector icons, UI graphics)
├── serve.js            (Local HTTP server)
└── crawler.js          (Scraper & asset sync script)
```

## Running the Clone Locally

To start the local preview server:

```powershell
node serve.js
```

Then open your browser and go to:
- [http://localhost:3000/home](http://localhost:3000/home)
- [http://localhost:3000/play/blackjack](http://localhost:3000/play/blackjack)
- [http://localhost:3000/play/coinflip](http://localhost:3000/play/coinflip)
- [http://localhost:3000/play/jackpot](http://localhost:3000/play/jackpot)
- [http://localhost:3000/play/dice-duels](http://localhost:3000/play/dice-duels)
- [http://localhost:3000/earn](http://localhost:3000/earn)
- [http://localhost:3000/roadmap](http://localhost:3000/roadmap)
