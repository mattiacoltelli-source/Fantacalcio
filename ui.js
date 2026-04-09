// ui.js — VERSIONE FINALE STABILE (UI ORIGINALE + FIX)

console.log("UI FINAL READY");

window.UI = {

  render() {
    this.renderBudgetBar();
    this.renderTabs();
    this.renderFilters();
    this.renderPlayerList();
    this.renderWatchlist();
    this.renderSquad();
  },

  renderBudgetBar() {
    const total = AppState.settings?.totalBudget || 0;
    const spent = Utils.getTotalSpent(AppState.squad || []);
    const rem   = total - spent;
    const avg   = Utils.avgBudgetPerSlot(AppState.squad || [], total);
    const slots = Utils.getRemainingSlots(AppState.squad || []);
    const pct   = total ? Math.min(100, Math.round((spent / total) * 100)) : 0;

    const bar = document.getElementById('budget-bar');
    if (!bar) return;

    bar.innerHTML = `
      <div class="budget-grid">
        <div class="budget-item"><span class="budget-label">Totale</span><span class="budget-value">${total} cr</span></div>
        <div class="budget-item"><span class="budget-label">Speso</span><span class="budget-value spent">${spent} cr</span></div>
        <div class="budget-item"><span class="budget-label">Rimasto</span><span class="budget-value remaining">${rem} cr</span></div>
        <div class="budget-item"><span class="budget-label">Media/slot</span><span class="budget-value">${avg} cr</span></div>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
      <div class="slots-grid">
        <div class="slot-item"><span class="slot-role por">POR</span><span>${3 - (slots.POR||0)}/3</span></div>
        <div class="slot-item"><span class="slot-role dif">DIF</span><span>${8 - (slots.DIF||0)}/8</span></div>
        <div class="slot-item"><span class="slot-role cen">CEN</span><span>${8 - (slots.CEN||0)}/8</span></div>
        <div class="slot-item"><span class="slot-role att">ATT</span><span>${6 - (slots.ATT||0)}/6</span></div>
        <div class="slot-item"><span class="slot-role total">TOT</span><span>${AppState.squad.length}/25</span></div>
      </div>`;
  },

  renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === AppState.activeTab));

    document.getElementById('view-players').style.display   = AppState.activeTab === 'players'   ? 'block' : 'none';
    document.getElementById('view-watchlist').style.display = AppState.activeTab === 'watchlist' ? 'block' : 'none';
    document.getElementById('view-squad').style.display     = AppState.activeTab === 'squad'     ? 'block' : 'none';
  },

  renderFilters() {
    const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.value=val; };
    const setChk = (id,val)=>{ const el=document.getElementById(id); if(el) el.checked=val; };

    set('filter-role', AppState.filters.role);
    set('filter-tag', AppState.filters.tag);
    set('sort-by', AppState.sort);
    set('search-input', AppState.filters.search);
    setChk('filter-penalties', AppState.filters.penalties);
  },

  renderPlayerList() {
    const container = document.getElementById('player-list');
    if (!container) return;

    const squadIds  = new Set((AppState.squad||[]).map(p => p.id));
    const beatenIds = new Set(AppState.beaten || []);

    let players = Utils.filterPlayers(AppState.players || [], AppState.filters || {})
      .filter(p => !squadIds.has(p.id) && !beatenIds.has(p.id));

    players = Utils.sortPlayers(players, AppState.sort);

    const count = document.getElementById('player-count');
    if (count) count.textContent = `${players.length} giocatori`;

    if (!players.length) {
      container.innerHTML = `<div class="empty-state">Nessun giocatore trovato.</div>`;
      return;
    }

    container.innerHTML = players.map(p => this.playerCard(p)).join('');
  },

  playerCard(player) {

    const stats = player.stats || {};
    const statsPrev = player.stats_prev || stats;
    const statsCurr = player.stats_curr || null;

    const wStatus  = AppState.watchlist[player.id] || null;
    const note     = AppState.notes[player.id] || '';

    const maxNow = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);

    const roleColor = Utils.roleColor(player.role);
    const roleStyle = `background:${roleColor}22;color:${roleColor};border:1px solid ${roleColor}44`;

    const isOff = ['ATT','CEN'].includes(player.role) && ((stats.goals||0) >= 5 || (stats.assists||0) >= 5);

    const badges = [
      player.tag === 'sleeper' ? '<span class="badge badge-sleeper">SLEEPER</span>' : '',
      player.tag === 'hype'    ? '<span class="badge badge-hype">HYPE</span>' : '',
      player.on_penalties ? '<span class="badge-icon">🎯</span>' : '',
      isOff ? '<span class="badge-icon">⚡</span>' : ''
    ].join('');

    const wBtns = ['want','watch','avoid'].map(s =>
      `<button class="wl-btn ${wStatus===s?'wl-active-'+s:''}" onclick="App.setWatchlist('${player.id}','${s}')">
        ${s==='want'?'⭐':s==='watch'?'👀':'❌'}
      </button>`
    ).join('');

    return `
    <div class="player-card">

      <div class="card-header">
        <div class="card-meta">
          <span class="role-pill" style="${roleStyle}">${player.role}</span>
          <span class="advanced-role">${player.advanced_role||''}</span>
        </div>
        <div class="card-badges">${badges}</div>
      </div>

      <div class="card-body">
        <div class="player-name">${player.name}</div>
        <div class="player-team">${player.team}</div>

        <div class="card-stats">
          <div class="stat"><span>Valore</span><span>${player.value_estimated||0}</span></div>
          <div class="stat"><span>Quotaz.</span><span>${player.price_initial||0}</span></div>
          <div class="stat"><span>Max</span><span>${maxNow}</span></div>
        </div>

        <div class="card-stats">
          <div class="stat"><span>FV</span><span>${statsPrev.fantavote||'-'}</span></div>
          <div class="stat"><span>Gol</span><span>${statsPrev.goals||0}</span></div>
          <div class="stat"><span>Assist</span><span>${statsPrev.assists||0}</span></div>
        </div>

        ${statsCurr && statsCurr.matches>0 ? `
          <div class="card-stats">
            <div class="stat"><span>FV</span><span>${statsCurr.fantavote}</span></div>
            <div class="stat"><span>Gol</span><span>${statsCurr.goals}</span></div>
            <div class="stat"><span>Assist</span><span>${statsCurr.assists}</span></div>
          </div>
        `:''}
      </div>

      <div class="card-watchlist-row">
        ${wBtns}
      </div>

      <div class="card-auction">
        <input type="number" id="price-${player.id}" placeholder="Prezzo"
          oninput="UI.evaluateAuction('${player.id}')">
        <div id="result-${player.id}"></div>
      </div>

    </div>`;
  },

  evaluateAuction(id) {
    const p = AppState.players.find(x=>x.id===id);
    if (!p) return;

    const input = document.getElementById(`price-${id}`);
    const box = document.getElementById(`result-${id}`);
    if (!input || !box) return;

    const price = parseInt(input.value);
    if (!price) { box.innerHTML=''; return; }

    const status = Utils.evaluatePurchase(p, price);
    const max = Utils.calcMaxOfferNow(p, AppState.squad, AppState.settings.totalBudget);

    box.innerHTML = `<div>${status} • max ${max}</div>`;
  },

  renderWatchlist(){},
  renderSquad(){},

  showToast(msg){ console.log(msg); },
  showError(msg){ console.error(msg); }

};