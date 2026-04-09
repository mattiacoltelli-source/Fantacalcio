// ui.js — Rendering UI (FIXED + GLOBAL)

window.UI = {

  render() {
    UI.renderBudgetBar();
    UI.renderTabs();
    UI.renderFilters();
    UI.renderPlayerList();
    UI.renderWatchlist();
    UI.renderSquad();
  },

  // ─── BUDGET BAR ─────────────────────────────────

  renderBudgetBar() {
    try {
      const total = AppState.settings.totalBudget;
      const spent = Utils.getTotalSpent(AppState.squad);
      const rem   = total - spent;
      const avg   = Utils.avgBudgetPerSlot(AppState.squad, total);
      const slots = Utils.getRemainingSlots(AppState.squad);
      const pct   = Math.min(100, Math.round((spent / total) * 100));

      const bar = document.getElementById('budget-bar');
      if (!bar) return;

      bar.innerHTML = `
        <div class="budget-grid">
          <div class="budget-item"><span>Totale</span><strong>${total} cr</strong></div>
          <div class="budget-item"><span>Speso</span><strong>${spent} cr</strong></div>
          <div class="budget-item"><span>Rimasto</span><strong>${rem} cr</strong></div>
          <div class="budget-item"><span>Media</span><strong>${avg} cr</strong></div>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
      `;
    } catch (e) {
      console.error("renderBudgetBar", e);
    }
  },

  // ─── TABS ─────────────────────────────────

  renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === AppState.activeTab)
    );

    const map = ['players','watchlist','squad'];

    map.forEach(tab => {
      const el = document.getElementById(`view-${tab}`);
      if (el) el.style.display = AppState.activeTab === tab ? 'block' : 'none';
    });
  },

  // ─── FILTRI ─────────────────────────────────

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

  // ─── PLAYER LIST ─────────────────────────────────

  renderPlayerList() {
    const container = document.getElementById('player-list');
    if (!container) return;

    try {
      const squadIds  = new Set(AppState.squad.map(p => p.id));
      const beatenIds = new Set(AppState.beaten || []);

      let players = Utils.filterPlayers(AppState.players, AppState.filters)
        .filter(p => !squadIds.has(p.id) && !beatenIds.has(p.id));

      players = Utils.sortPlayers(players, AppState.sort);

      const count = document.getElementById('player-count');
      if (count) count.textContent = `${players.length} giocatori`;

      if (players.length === 0) {
        container.innerHTML = `<div class="empty-state">Nessun giocatore trovato.</div>`;
        return;
      }

      container.innerHTML = players.map(p => UI.playerCard(p)).join('');
    } catch (e) {
      console.error("renderPlayerList", e);
    }
  },

  // ─── CARD ─────────────────────────────────

  playerCard(player) {
    return `
      <div class="player-card">
        <div class="player-name">${player.name}</div>
        <div>${player.team}</div>
      </div>
    `;
  },

  // ─── WATCHLIST ─────────────────────────────────

  renderWatchlist() {
    const el = document.getElementById('watchlist-list');
    if (!el) return;

    el.innerHTML = Object.keys(AppState.watchlist || {}).length === 0
      ? `<div class="empty-state">Nessun giocatore in watchlist</div>`
      : `<div>Watchlist attiva</div>`;
  },

  // ─── SQUAD ─────────────────────────────────

  renderSquad() {
    const el = document.getElementById('squad-list');
    if (!el) return;

    if (!AppState.squad.length) {
      el.innerHTML = `<div class="empty-state">Nessun giocatore acquistato</div>`;
      return;
    }

    el.innerHTML = AppState.squad.map(p => `
      <div class="player-card">
        ${p.name} - ${p.price} cr
      </div>
    `).join('');
  },

  // ─── AUCTION ─────────────────────────────────

  evaluateAuction(playerId) {
    console.log("evaluate", playerId);
  },

  showResultBox() {},

  renderFocus() {},
  closeFocus() {}

};