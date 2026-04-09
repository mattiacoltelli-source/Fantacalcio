// ui.js — VERSIONE PRO STABILE + COMPLETA

console.log("UI READY");

window.UI = {

  render() {
    this.renderBudgetBar();
    this.renderTabs();
    this.renderFilters();
    this.renderPlayerList();
    this.renderWatchlist();
    this.renderSquad();
  },

  // ───────── BUDGET ─────────
  renderBudgetBar() {
    const bar = document.getElementById('budget-bar');
    if (!bar) return;

    const total = AppState.settings.totalBudget || 0;
    const spent = Utils.getTotalSpent(AppState.squad || []);
    const rem = total - spent;

    bar.innerHTML = `
      <div style="padding:10px;">
        💰 ${spent} / ${total} — Rimasti: ${rem}
      </div>
    `;
  },

  // ───────── TABS ─────────
  renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === AppState.activeTab)
    );

    ['players','watchlist','squad'].forEach(tab => {
      const el = document.getElementById(`view-${tab}`);
      if (el) el.style.display = AppState.activeTab === tab ? 'block' : 'none';
    });
  },

  // ───────── FILTRI ─────────
  renderFilters() {
    const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.value=val; };
    const setChk = (id,val)=>{ const el=document.getElementById(id); if(el) el.checked=val; };

    set('filter-role', AppState.filters.role);
    set('filter-tag', AppState.filters.tag);
    set('sort-by', AppState.sort);
    set('search-input', AppState.filters.search);
    setChk('filter-penalties', AppState.filters.penalties);
  },

  // ───────── PLAYER LIST ─────────
  renderPlayerList() {
    const container = document.getElementById('player-list');
    if (!container) return;

    let players = Utils.filterPlayers(AppState.players || [], AppState.filters || {});
    players = Utils.sortPlayers(players, AppState.sort);

    const count = document.getElementById('player-count');
    if (count) count.textContent = `${players.length} giocatori`;

    if (!players.length) {
      container.innerHTML = `<div class="empty-state">Nessun giocatore</div>`;
      return;
    }

    container.innerHTML = players.map(p => this.playerCard(p)).join('');
  },

  // ───────── PLAYER CARD ─────────
  playerCard(p) {

    const stats = p.stats || {};
    const value = p.value_estimated || 0;
    const price = p.price_initial || 0;
    const maxNow = Utils.calcMaxOfferNow(p, AppState.squad, AppState.settings.totalBudget);

    const w = AppState.watchlist[p.id];

    return `
    <div class="player-card">

      <div class="card-header">
        <div>
          <div class="player-name">${p.name}</div>
          <div class="player-team">${p.team}</div>
        </div>
        <div>${p.role}</div>
      </div>

      <div class="card-badges">
        ${p.tag === 'sleeper' ? '<span class="badge badge-sleeper">SLEEPER</span>' : ''}
        ${p.tag === 'hype' ? '<span class="badge badge-hype">HYPE</span>' : ''}
        ${p.on_penalties ? '🎯' : ''}
      </div>

      <div class="card-stats">
        <div>💎 ${value}</div>
        <div>💰 ${price}</div>
        <div>🔥 ${stats.fantavote || '-'}</div>
      </div>

      <div class="card-extra">
        ⚽ ${stats.goals || 0} • 🎯 ${stats.assists || 0}
      </div>

      <div class="card-max">
        💰 Max: ${maxNow}
      </div>

      <div class="card-actions">
        <button class="${w==='want'?'active':''}" onclick="App.setWatchlist('${p.id}','want')">⭐</button>
        <button class="${w==='watch'?'active':''}" onclick="App.setWatchlist('${p.id}','watch')">👀</button>
        <button class="${w==='avoid'?'active':''}" onclick="App.setWatchlist('${p.id}','avoid')">❌</button>
      </div>

      <div class="auction-row">
        <input 
          type="number"
          placeholder="Prezzo"
          id="price-${p.id}"
          oninput="UI.evaluateAuction('${p.id}')"
        />
        <div id="result-${p.id}" class="auction-result"></div>
      </div>

    </div>
    `;
  },

  // ───────── VALUTAZIONE ─────────
  evaluateAuction(id) {
    const p = AppState.players.find(x=>x.id===id);
    if (!p) return;

    const input = document.getElementById(`price-${id}`);
    const box = document.getElementById(`result-${id}`);
    if (!input || !box) return;

    const price = parseInt(input.value);
    if (!price) {
      box.innerHTML='';
      return;
    }

    const status = Utils.evaluatePurchase(p, price);
    const max = Utils.calcMaxOfferNow(p, AppState.squad, AppState.settings.totalBudget);

    box.innerHTML = `<div>${status} • max ${max}</div>`;
  },

  // ───────── WATCHLIST ─────────
  renderWatchlist() {
    const el = document.getElementById('watchlist-list');
    if (!el) return;

    const list = Object.entries(AppState.watchlist || {});
    if (!list.length) {
      el.innerHTML = `<div class="empty-state">Watchlist vuota</div>`;
      return;
    }

    el.innerHTML = list.map(([id,status])=>{
      const p = AppState.players.find(x=>x.id===id);
      if (!p) return '';
      return `<div class="player-card">${p.name} (${status})</div>`;
    }).join('');
  },

  // ───────── SQUAD ─────────
  renderSquad() {
    const el = document.getElementById('squad-list');
    if (!el) return;

    if (!AppState.squad.length) {
      el.innerHTML = `<div class="empty-state">Rosa vuota</div>`;
      return;
    }

    el.innerHTML = AppState.squad.map(p=>`
      <div class="player-card">
        ${p.name} — ${p.paid} cr
        <button onclick="App.removePlayer('${p.id}')">❌</button>
      </div>
    `).join('');
  },

  // ───────── TOAST ─────────
  showToast(msg,type='info'){
    console.log("TOAST:", msg);
  },

  showError(msg){
    console.error(msg);
  },

  renderFocus(){},
  closeFocus(){}

};