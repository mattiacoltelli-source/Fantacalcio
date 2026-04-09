// ui.js \u2014 Rendering UI

const UI = {

  render() {
    UI.renderBudgetBar();
    UI.renderTabs();
    UI.renderFilters();
    UI.renderPlayerList();
    UI.renderWatchlist();
    UI.renderSquad();
  },

  // \u2500\u2500\u2500 BUDGET BAR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  renderBudgetBar() {
    const total = AppState.settings.totalBudget;
    const spent = Utils.getTotalSpent(AppState.squad);
    const rem   = total - spent;
    const avg   = Utils.avgBudgetPerSlot(AppState.squad, total);
    const slots = Utils.getRemainingSlots(AppState.squad);
    const pct   = Math.min(100, Math.round((spent / total) * 100));
    const bar   = document.getElementById('budget-bar');
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
        <div class="slot-item"><span class="slot-role por">POR</span><span>${3 - slots.POR}/3</span></div>
        <div class="slot-item"><span class="slot-role dif">DIF</span><span>${8 - slots.DIF}/8</span></div>
        <div class="slot-item"><span class="slot-role cen">CEN</span><span>${8 - slots.CEN}/8</span></div>
        <div class="slot-item"><span class="slot-role att">ATT</span><span>${6 - slots.ATT}/6</span></div>
        <div class="slot-item"><span class="slot-role total">TOT</span><span>${AppState.squad.length}/25</span></div>
      </div>`;
  },

  // \u2500\u2500\u2500 TABS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === AppState.activeTab));
    document.getElementById('view-players').style.display   = AppState.activeTab === 'players'   ? 'block' : 'none';
    document.getElementById('view-watchlist').style.display = AppState.activeTab === 'watchlist' ? 'block' : 'none';
    document.getElementById('view-squad').style.display     = AppState.activeTab === 'squad'     ? 'block' : 'none';
  },

  // \u2500\u2500\u2500 FILTRI \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  renderFilters() {
    const set    = (id, val) => { const el = document.getElementById(id); if (el) el.value   = val; };
    const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
    set('filter-role',     AppState.filters.role);
    set('filter-tag',      AppState.filters.tag);
    set('sort-by',         AppState.sort);
    set('search-input',    AppState.filters.search);
    setChk('filter-penalties', AppState.filters.penalties);
  },

  // \u2500\u2500\u2500 PLAYER LIST \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  renderPlayerList() {
    const container = document.getElementById('player-list');
    if (!container) return;
    const squadIds  = new Set(AppState.squad.map(p => p.id));
    const beatenIds = new Set(AppState.beaten || []);
    let players = Utils.filterPlayers(AppState.players, AppState.filters)
                       .filter(p => !squadIds.has(p.id) && !beatenIds.has(p.id));
    players = Utils.sortPlayers(players, AppState.sort);
    const count = document.getElementById('player-count');
    if (count) count.textContent = `${players.length} giocatori`;
    if (players.length === 0) {
      container.innerHTML = '<div class="empty-state">Nessun giocatore trovato.</div>';
      return;
    }
    container.innerHTML = players.map(p => UI.playerCard(p)).join('');
  },

  // \u2500\u2500\u2500 PLAYER CARD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  playerCard(player) {
    const wStatus   = AppState.watchlist[player.id] || null;
    const note      = AppState.notes[player.id] || '';
    const maxNow    = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);
    const roleStyle = 'background:' + Utils.roleColor(player.role) + '22;color:' + Utils.roleColor(player.role) + ';border:1px solid ' + Utils.roleColor(player.role) + '44';
    const sp        = player.stats_prev || player.stats || {};
    const sc        = player.stats_curr || null;
    const isOff     = ['ATT','CEN'].includes(player.role) && ((sp.goals || 0) >= 5 || (sp.assists || 0) >= 5);

    const statusIcon = { starter: '\ud83d\udfe2', risk: '\ud83d\udfe1', bench: '\ud83d\udd34' };
    const statusTip  = { starter: 'Titolare fisso', risk: 'Ballottaggio', bench: 'Rischio panchina' };

    const badges = [
      player.tag === 'sleeper' ? '<span class="badge badge-sleeper">SLEEPER</span>' : '',
      player.tag === 'hype'    ? '<span class="badge badge-hype">HYPE</span>' : '',
      player.on_penalties      ? '<span class="badge-icon" title="Rigorista">\ud83c\udfaf</span>' : '',
      isOff                    ? '<span class="badge-icon" title="Ruolo offensivo">\u26a1</span>' : '',
      player.status            ? '<span class="badge-icon" title="' + (statusTip[player.status] || '') + '">' + (statusIcon[player.status] || '') + '</span>' : '',
      player.injury_prone      ? '<span class="badge-icon" title="Si infortuna spesso">\ud83e\ude79</span>' : ''
    ].join('');

    const wBtns = [
      { s: 'want',  i: '\u2b50', l: 'Voglio'  },
      { s: 'watch', i: '\ud83d\udc40', l: 'Osservo' },
      { s: 'avoid', i: '\u274c', l: 'Evito'   }
    ].map(b => '<button class="wl-btn ' + (wStatus === b.s ? 'wl-active-' + b.s : '') + '" onclick="App.setWatchlist(\'' + player.id + '\',\'' + b.s + '\')" title="' + b.l + '">' + b.i + '</button>').join('');

    const currSection = (sc && sc.matches > 0)
      ? '<div class="card-stats-section-label card-stats-curr-label">\ud83d\udd25 Stagione in corso (' + sc.matches + ' pres.)</div>' +
        '<div class="card-stats">' +
        '<div class="stat"><span class="stat-label">FV media</span><span class="stat-val curr-val">' + sc.fantavote + '</span></div>' +
        '<div class="stat"><span class="stat-label">Gol</span><span class="stat-val curr-val">' + sc.goals + '</span></div>' +
        '<div class="stat"><span class="stat-label">Assist</span><span class="stat-val curr-val">' + sc.assists + '</span></div>' +
        '</div>'
      : '';

    return `
    <div class="player-card" id="card-${player.id}">
      <div class="card-header">
        <div class="card-meta">
          <span class="role-pill" style="${roleStyle}">${player.role}</span>
          <span class="advanced-role">${player.advanced_role}</span>
        </div>
        <div class="card-badges">${badges}</div>
      </div>
      <div class="card-body">
        <div class="player-name">${player.name}</div>
        <div class="player-team">${player.team}</div>
        <div class="card-stats">
          <div class="stat"><span class="stat-label">Valore</span><span class="stat-val value">${player.value_estimated} cr</span></div>
          <div class="stat"><span class="stat-label">Quotaz.</span><span class="stat-val">${player.price_initial} cr</span></div>
          <div class="stat max-now-stat"><span class="stat-label">\ud83d\udcb0 Max ora</span><span class="stat-val max-now-val">${maxNow} cr</span></div>
        </div>
        <div class="card-stats-section-label">\ud83d\udcc5 Stagione precedente</div>
        <div class="card-stats">
          <div class="stat"><span class="stat-label">FV media</span><span class="stat-val">${sp.fantavote || '-'}</span></div>
          <div class="stat"><span class="stat-label">Gol</span><span class="stat-val">${sp.goals || 0}</span></div>
          <div class="stat"><span class="stat-label">Assist</span><span class="stat-val">${sp.assists || 0}</span></div>
          <div class="stat"><span class="stat-label">Presenze</span><span class="stat-val">${sp.matches || 0}</span></div>
        </div>
        ${currSection}
      </div>
      <div class="card-watchlist-row">
        <span class="wl-label">Watchlist:</span>
        <div class="wl-buttons">${wBtns}</div>
        ${wStatus ? `<input