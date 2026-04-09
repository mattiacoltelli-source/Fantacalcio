// ui.js — VERSIONE STABILE + GLOBALE

console.log("UI FILE CARICATO");

window.UI = {

  // ───────── INIT RENDER ─────────
  render() {
    try {
      this.renderBudgetBar();
      this.renderTabs();
      this.renderFilters();
      this.renderPlayerList();
      this.renderWatchlist();
      this.renderSquad();
    } catch (e) {
      console.error("UI.render error", e);
    }
  },

  // ───────── BUDGET ─────────
  renderBudgetBar() {
    const bar = document.getElementById('budget-bar');
    if (!bar) return;

    try {
      const total = AppState.settings.totalBudget;
      const spent = Utils.getTotalSpent(AppState.squad);
      const rem   = total - spent;

      bar.innerHTML = `
        <div style="padding:10px;">
          💰 ${spent} / ${total} cr — Rimasti: ${rem}
        </div>
      `;
    } catch (e) {
      console.error("budget error", e);
    }
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
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = val;
    };

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

    try {
      if (!AppState.players || AppState.players.length === 0) {
        container.innerHTML = `<div class="empty-state">Nessun giocatore</div>`;
        return;
      }

      let players = Utils.filterPlayers(AppState.players, AppState.filters);
      players = Utils.sortPlayers(players, AppState.sort);

      const count = document.getElementById('player-count');
      if (count) count.textContent = `${players.length} giocatori`;

      container.innerHTML = players.map(p => this.playerCard(p)).join('');

    } catch (e) {
      console.error("player list error", e);
    }
  },

  // ───────── PLAYER CARD ─────────
  playerCard(player) {
    const value = player.value_estimated || 0;
    const price = player.price_initial || 0;

    return `
      <div class="player-card">
        <div class="player-name">${player.name}</div>
        <div class="player-team">${player.team}</div>

        <div style="margin-top:8px;">
          💎 ${value} cr — 💰 ${price} cr
        </div>

        <div style="margin-top:10px;">
          <button onclick="App.buyPlayer('${player.id}',1)">Compra</button>
        </div>
      </div>
    `;
  },

  // ───────── WATCHLIST ─────────
  renderWatchlist() {
    const el = document.getElementById('watchlist-list');
    if (!el) return;

    const items = Object.keys(AppState.watchlist || {});
    if (items.length === 0) {
      el.innerHTML = `<div class="empty-state">Watchlist vuota</div>`;
      return;
    }

    el.innerHTML = items.map(id => {
      const p = AppState.players.find(x => x.id === id);
      if (!p) return '';
      return `<div class="player-card">${p.name}</div>`;
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

    el.innerHTML = AppState.squad.map(p => `
      <div class="player-card">
        ${p.name} — ${p.price} cr
      </div>
    `).join('');
  },

  // ───────── PLACEHOLDER FUNZIONI ─────────
  evaluateAuction() {},
  showResultBox() {},
  renderFocus() {},
  closeFocus() {}

};