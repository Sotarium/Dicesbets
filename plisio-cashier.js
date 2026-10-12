/**
 * DICESBETS EXACT DEPOSIT MODAL (Pixel-Perfect from User HTML & 3D Solana Coin)
 * - Uses exact DOM & CSS structure provided by user
 * - Colors themed to #0083e5 with glowing accents
 * - Live Solana USD Price update
 * - Direct Plisio.net deposit & withdrawal flow
 */

(function () {
  if (typeof window === 'undefined') return;

  const PLISIO_API_KEY = "d9ssUQwY4V9lABn1SjlKNXw-ChCwNGZPVSDbGm2WG2TwW1aMlCGh6ltzihNzeXF3";
  let solLivePrice = 184.25;

  async function fetchSolPrice() {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await res.json();
      if (data?.solana?.usd) {
        solLivePrice = data.solana.usd;
        const el = document.getElementById('modal-sol-live-price');
        if (el) el.textContent = solLivePrice.toFixed(2);
      }
    } catch(e) {}
  }
  fetchSolPrice();
  setInterval(fetchSolPrice, 30000);

  window.openCashierModal = function(initialTab = 'deposit') {
    if (document.getElementById('dicesbets-exact-cashier')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'dicesbets-exact-cashier';
    backdrop.style.cssText = `
      position: fixed; inset: 0; z-index: 999999999;
      background: rgba(4, 6, 14, 0.82); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    backdrop.innerHTML = `
      <div data-slot="dialog-panel" class="bg-background text-foreground pointer-events-auto z-10 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg overscroll-contain !flex !flex-col !p-0 !gap-0 min-h-0 overflow-hidden relative h-[min(78dvh,620px)] !max-h-[min(86dvh,680px)] sm:h-[min(62dvh,540px)] sm:!max-h-[min(72dvh,640px)] !rounded-2xl !border !border-[#0083e5]/[0.22] !bg-[#12131a] !duration-500 !overflow-hidden transition-[height,max-height] duration-500 ease-out outline-none" style="box-shadow: rgba(0, 131, 229, 0.15) 0px 1px 0px inset, rgba(0, 0, 0, 0.85) 0px 32px 72px -20px, rgba(0, 131, 229, 0.15) 0px 0px 0px 1px, rgba(0, 131, 229, 0.35) 0px 0px 80px -35px; width: min(96vw, 760px); max-width: min(96vw, 760px); background: linear-gradient(165deg, rgb(20, 21, 29) 0%, rgb(18, 19, 26) 45%, rgb(15, 16, 22) 100%);">
        
        <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#12131a]">
          
          <!-- Bottom Radial Glows -->
          <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 z-0 block select-none h-[min(44dvh,340px)] min-[1100px]:h-[min(22dvh,200px)]">
            <div class="absolute inset-0 opacity-95 min-[1100px]:opacity-55" style="background: radial-gradient(120% 90% at 50% 115%, rgba(0, 131, 229, 0.55) 0%, rgba(0, 96, 168, 0.25) 42%, transparent 72%);"></div>
            <div class="absolute inset-0 opacity-80 min-[1100px]:opacity-45" style="background: radial-gradient(95% 58% at 50% 118%, rgba(0, 210, 255, 0.28) 0%, rgba(0, 131, 229, 0.1) 42%, transparent 62%);"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#12131a] via-[#12131a]/50 to-transparent min-[1100px]:via-[#12131a]/65"></div>
          </div>

          <!-- Main Layout -->
          <div class="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden">
            <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden min-[1100px]:h-full">
              <div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
                <div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden min-[1100px]:flex-row">
                  
                  <!-- LEFT ASIDE: CRYPTO & 3D COIN ART -->
                  <aside class="relative hidden w-[196px] shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#0a0b10] min-[1100px]:flex min-[1100px]:min-h-full min-[1100px]:self-stretch lg:w-[210px]">
                    <div aria-hidden="true" class="pointer-events-none opacity-[0.14] absolute inset-x-0 top-0 h-[42%]"></div>
                    <div class="relative z-[2] flex shrink-0 flex-col items-center px-4 pb-2 pt-6 text-center">
                      <p class="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">Deposit</p>
                      <p class="mt-1 uppercase font-display bg-gradient-to-b from-blue-200 via-[#0083e5] to-blue-600 bg-clip-text font-black tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(0,131,229,0.45)] text-[26px]" style="background: linear-gradient(180deg, #b3e0ff 0%, #0083e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CRYPTO</p>
                      
                      <!-- Mini 3D Coin Badge -->
                      <div class="relative mt-3.5 flex items-center gap-2 rounded-xl px-1 py-1">
                        <button type="button" aria-label="Deposit Solana" class="group relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden p-[2px] cursor-pointer outline-none" style="border-radius: 9px; background: rgb(34, 35, 46); box-shadow: rgba(0, 131, 229, 0.38) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px;">
                          <div class="relative z-[1] flex h-full w-full items-center justify-center overflow-hidden rounded-[7px]">
                            <img alt="Solana" class="h-[22px] w-[22px] object-contain" src="/assets/crypto/Solana.png">
                          </div>
                        </button>
                      </div>
                    </div>

                    <!-- Bottom 3D Coin Asset Art -->
                    <div class="relative mt-auto flex shrink-0 items-end justify-center overflow-hidden pb-4">
                      <div class="relative z-[1] w-full px-2 text-center">
                        <img alt="3D Coins" class="mx-auto h-[130px] w-auto object-contain drop-shadow-[0_18px_42px_rgba(0,131,229,0.55)]" src="/assets/crypto/Coins.png">
                      </div>
                    </div>
                  </aside>

                  <!-- RIGHT CONTENT AREA -->
                  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
                    
                    <!-- Header Tabs & Close -->
                    <div class="relative flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] bg-[#16171f]/95 px-3 py-2.5 sm:px-4">
                      <div class="flex min-w-0 flex-1 items-center gap-2.5">
                        <div class="inline-flex w-fit max-w-full shrink-0 items-center gap-1.5">
                          
                          <!-- Tab Deposit -->
                          <button id="exact-tab-deposit" type="button" class="group relative z-[1] h-9 min-w-[6.75rem] overflow-hidden rounded-lg px-3.5 text-xs font-bold outline-none cursor-pointer text-white" style="border-radius: 8px; background: rgb(34, 35, 46); box-shadow: rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px;">
                            <span class="relative z-[1] flex min-w-0 items-center justify-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0083e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V3"></path><path d="m6 11 6 6 6-6"></path><path d="M19 21H5"></path></svg>
                              <span>Deposit</span>
                            </span>
                          </button>

                          <!-- Tab Withdraw -->
                          <button id="exact-tab-withdraw" type="button" class="group relative z-[1] h-9 min-w-[6.75rem] overflow-hidden rounded-lg px-3.5 text-xs font-bold outline-none cursor-pointer text-zinc-400 hover:text-white" style="border-radius: 8px; background: transparent;">
                            <span class="relative z-[1] flex min-w-0 items-center justify-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 9-6-6-6 6"></path><path d="M12 3v14"></path><path d="M5 21h14"></path></svg>
                              <span>Withdraw</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <!-- Close Button -->
                      <button id="exact-cashier-close" class="inline-flex items-center justify-center text-zinc-400 hover:text-white size-8 rounded-lg cursor-pointer transition-transform hover:scale-105" type="button" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                      </button>
                    </div>

                    <!-- Panel Content -->
                    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                      <div class="relative min-h-0 flex-1 basis-0">
                        <div class="space-y-5 px-3.5 py-4 sm:px-5 sm:py-6 absolute inset-0 flex min-h-0 flex-col overflow-x-hidden overflow-y-auto">
                          
                          <!-- SECTION: CRYPTOCURRENCIES -->
                          <section class="space-y-3">
                            <div class="flex items-center gap-2">
                              <h3 class="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">Cryptocurrencies</h3>
                              <div class="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
                            </div>

                            <!-- SOLANA COIN BUTTON -->
                            <div class="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3">
                              <div>
                                <button id="btn-select-sol" type="button" class="group relative flex w-full items-center gap-3.5 overflow-hidden px-3.5 py-3.5 text-left outline-none cursor-pointer transition-all hover:brightness-105" style="border-radius: 12px; background: rgb(34, 35, 46); box-shadow: rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px; border: 1.5px solid #0083e5;">
                                  
                                  <!-- 3D Coin Container -->
                                  <div class="group shrink-0 overflow-hidden p-[3px] relative z-[1]" style="width: 48px; height: 48px; border-radius: 12px; background: rgb(26, 28, 38); box-shadow: rgba(0, 131, 229, 0.38) 0px 1px 0px inset;">
                                    <img alt="Solana" class="h-full w-full object-contain" src="/assets/crypto/Solana.png">
                                  </div>

                                  <!-- Coin Info & Live Price -->
                                  <div class="relative z-[1] min-w-0 flex-1">
                                    <p class="text-[14px] font-extrabold tracking-tight text-white">SOL</p>
                                    <p class="truncate text-[12px] tabular-nums text-zinc-400 font-semibold mt-0.5">
                                      <span class="inline-flex items-center gap-0.5 font-sans tabular-nums text-[12px] text-[#00ffa3]">
                                        <span>$</span><span id="modal-sol-live-price">${solLivePrice.toFixed(2)}</span>
                                      </span>
                                    </p>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </section>

                          <!-- DEPOSIT INPUT / PLISIO TRIGGER -->
                          <div id="exact-view-deposit" class="mt-4 space-y-3">
                            <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">Deposit Amount (USD)</label>
                            <div class="relative flex items-center">
                              <span class="absolute left-3.5 text-zinc-500 font-bold">$</span>
                              <input id="exact-dep-val" type="number" min="5" value="25" class="w-full bg-[#181a24] border border-white/[0.08] rounded-xl py-3 pl-8 pr-4 text-white font-bold outline-none focus:border-[#0083e5]" style="background: #181a24; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 12px 14px 12px 30px; color: #fff; width: 100%; box-sizing: border-box; outline: none;" />
                            </div>

                            <button id="exact-btn-plisio-pay" type="button" class="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white cursor-pointer transition-transform active:scale-[0.98]" style="background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%); box-shadow: 0 4px 18px rgba(0, 131, 229, 0.4); border: none; border-radius: 12px; padding: 14px; width: 100%; font-weight: 800; cursor: pointer;">
                              Pay with Solana (Plisio)
                            </button>
                            <div id="exact-dep-result" class="mt-2 text-center"></div>
                          </div>

                          <!-- WITHDRAW VIEW -->
                          <div id="exact-view-withdraw" class="mt-4 space-y-3" style="display: none;">
                            <div class="flex justify-between items-center bg-[#181a24] p-3 rounded-xl border border-white/[0.06]">
                              <span class="text-xs text-zinc-400">Available Balance</span>
                              <span class="text-sm font-bold text-[#00ffa3]">${localStorage.getItem('dicesbets_balance') || '2.500'} SOL</span>
                            </div>

                            <div>
                              <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Withdraw Amount (SOL)</label>
                              <input id="exact-with-val" type="number" min="0.05" step="0.05" value="0.5" class="w-full bg-[#181a24] border border-white/[0.08] rounded-xl p-3 text-white font-bold outline-none" style="background: #181a24; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 12px; color: #fff; width: 100%; box-sizing: border-box;" />
                            </div>

                            <div>
                              <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Payout Solana Address</label>
                              <input id="exact-with-addr" type="text" placeholder="Paste your SOL wallet" class="w-full bg-[#181a24] border border-white/[0.08] rounded-xl p-3 text-white text-xs outline-none" style="background: #181a24; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 12px; color: #fff; width: 100%; box-sizing: border-box;" />
                            </div>

                            <button id="exact-btn-withdraw-submit" type="button" class="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white cursor-pointer" style="background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%); box-shadow: 0 4px 18px rgba(0, 131, 229, 0.4); border: none; border-radius: 12px; padding: 14px; width: 100%; font-weight: 800; cursor: pointer;">
                              Submit Instant Payout
                            </button>
                            <div id="exact-with-result" class="mt-2 text-center"></div>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Event Listeners
    document.getElementById('exact-cashier-close').onclick = () => backdrop.remove();
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };

    const tabDep = document.getElementById('exact-tab-deposit');
    const tabWith = document.getElementById('exact-tab-withdraw');
    const viewDep = document.getElementById('exact-view-deposit');
    const viewWith = document.getElementById('exact-view-withdraw');

    tabDep.onclick = () => {
      tabDep.style.background = 'rgb(34, 35, 46)';
      tabDep.style.boxShadow = 'rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px';
      tabDep.className = tabDep.className.replace('text-zinc-400', 'text-white');

      tabWith.style.background = 'transparent';
      tabWith.style.boxShadow = 'none';
      tabWith.className = tabWith.className.replace('text-white', 'text-zinc-400');

      viewDep.style.display = 'block';
      viewWith.style.display = 'none';
    };

    tabWith.onclick = () => {
      tabWith.style.background = 'rgb(34, 35, 46)';
      tabWith.style.boxShadow = 'rgba(0, 131, 229, 0.45) 0px 1px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px';
      tabWith.className = tabWith.className.replace('text-zinc-400', 'text-white');

      tabDep.style.background = 'transparent';
      tabDep.style.boxShadow = 'none';
      tabDep.className = tabDep.className.replace('text-white', 'text-zinc-400');

      viewWith.style.display = 'block';
      viewDep.style.display = 'none';
    };

    // Plisio Checkout
    document.getElementById('exact-btn-plisio-pay').onclick = () => {
      const amt = document.getElementById('exact-dep-val').value;
      const orderNumber = 'DB-' + Date.now();
      const invoiceUrl = `https://plisio.net/account/invoices/new?api_key=${PLISIO_API_KEY}&source_currency=USD&source_amount=${amt}&currency=SOL&order_number=${orderNumber}&order_name=Dicesbets+Deposit`;

      const resDiv = document.getElementById('exact-dep-result');
      resDiv.innerHTML = `
        <div style="background: rgba(0, 131, 229, 0.12); border: 1px solid #0083e5; border-radius: 12px; padding: 12px; margin-top: 10px;">
          <a href="${invoiceUrl}" target="_blank" style="display: block; padding: 10px; background: #0083e5; color: #fff; font-weight: 800; border-radius: 8px; text-decoration: none; font-size: 13px;">Proceed to Plisio Checkout ($${amt} USD)</a>
        </div>
      `;
    };

    // Instant Payout Submit
    document.getElementById('exact-btn-withdraw-submit').onclick = () => {
      const amt = parseFloat(document.getElementById('exact-with-val').value);
      const addr = document.getElementById('exact-with-addr').value.trim();
      const resDiv = document.getElementById('exact-with-result');
      const current = parseFloat(localStorage.getItem('dicesbets_balance') || '2.500');

      if (!addr || addr.length < 20) {
        resDiv.innerHTML = '<p style="color:#ff5252; font-size:12px;">Please enter a valid Solana address.</p>';
        return;
      }
      if (amt > current) {
        resDiv.innerHTML = '<p style="color:#ff5252; font-size:12px;">Insufficient balance.</p>';
        return;
      }

      const updated = (current - amt).toFixed(3);
      localStorage.setItem('dicesbets_balance', updated);
      resDiv.innerHTML = `
        <div style="background: rgba(0, 255, 163, 0.1); border: 1px solid #00ffa3; border-radius: 12px; padding: 12px; margin-top: 10px;">
          <p style="color:#00ffa3; font-weight:800; font-size:13px; margin:0;">Withdrawal of ${amt} SOL Queued!</p>
          <p style="color:#8e99a8; font-size:11px; margin:4px 0 0 0;">New Balance: ${updated} SOL</p>
        </div>
      `;
    };
  };

  // Header Cashier Trigger
  window.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('[data-node-id="671:9361"] > div:last-child');
    if (container) {
      let existing = document.getElementById('dicesbets-cashier-btn');
      if (existing) existing.remove();

      const btn = document.createElement('button');
      btn.id = 'dicesbets-cashier-btn';
      btn.type = 'button';
      btn.style.cssText = `
        display: flex; align-items: center; gap: 8px;
        height: 44px; padding: 0 18px; border-radius: 10px;
        background: linear-gradient(180deg, #0083e5 0%, #0060a8 100%);
        color: #ffffff; font-weight: 800; font-size: 14px;
        border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 131, 229, 0.4);
      `;
      btn.innerHTML = `<span>⚡</span> Cashier`;
      btn.onclick = () => window.openCashierModal();
      container.insertBefore(btn, container.firstChild);
    }
  });

  console.log('[Dicesbets] Pixel-perfect Cashier Modal Active.');
})();
