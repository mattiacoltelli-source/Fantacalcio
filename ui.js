// ui.js — Rendering UI

const UI = {

  render() {
    UI.renderBudgetBar();
    UI.renderTabs();
    UI.renderFilters();
    UI.renderPlayerList();
    UI.renderWatchlist();
    UI.renderSquad();
  },

  // ─── BUDGET BAR ─────────────────────────────────────────────────────────────

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

  // ─── TABS ────────────────────────────────────────────────────────────────────

  renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === AppState.activeTab));
    document.getElementById('view-players').style.display   = AppState.activeTab === 'players'   ? 'block' : 'none';
    document.getElementById('view-watchlist').style.display = AppState.activeTab === 'watchlist' ? 'block' : 'none';
    document.getElementById('view-squad').style.display     = AppState.activeTab === 'squad'     ? 'block' : 'none';
  },

  // ─── FILTRI ──────────────────────────────────────────────────────────────────

  renderFilters() {
    const set    = (id, val) => { const el = document.getElementById(id); if (el) el.value   = val; };
    const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
    set('filter-role',     AppState.filters.role);
    set('filter-tag',      AppState.filters.tag);
    set('sort-by',         AppState.sort);
    set('search-input',    AppState.filters.search);
    setChk('filter-penalties', AppState.filters.penalties);
  },

  // ─── PLAYER LIST ─────────────────────────────────────────────────────────────

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
      container.innerHTML = `<div class="empty-state">Nessun giocatore trovato.</div>`;
      return;
    }
    container.innerHTML = players.map(p => UI.playerCard(p)).join('');
  },

  // ─── PLAYER CARD ─────────────────────────────────────────────────────────────

  playerCard(player) {
    const wStatus  = AppState.watchlist[player.id] || null;
    const note     = AppState.notes[player.id] || '';
    const maxNow   = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);
    const roleStyle = `background:${Utils.roleColor(player.role)}22;color:${Utils.roleColor(player.role)};border:1px solid ${Utils.roleColor(player.role)}44`;
    const isOff    = ['ATT','CEN'].includes(player.role) && (player.stats.goals >= 5 || player.stats.assists >= 5);

    const statusIcon = { starter: '🟢', risk: '🟡', bench: '🔴' };
    const statusTip  = { starter: 'Titolare fisso', risk: 'Ballottaggio', bench: 'Rischio panchina' };
    const badges = [
      player.tag === 'sleeper' ? '<span class="badge badge-sleeper">SLEEPER</span>' : '',
      player.tag === 'hype'    ? '<span class="badge badge-hype">HYPE</span>'       : '',
      player.on_penalties      ? '<span class="badge-icon" title="Rigorista">🎯</span>'       : '',
      isOff                    ? '<span class="badge-icon" title="Ruolo offensivo">⚡</span>' : '',
      player.status            ? '<span class="badge-icon" title="' + (statusTip[player.status]||'') + '">' + (statusIcon[player.status]||'') + '</span>' : '',
      player.injury_prone      ? '<span class="badge-icon" title="Si infortuna spesso">🩹</span>' : ''
    ].join('');

    const wBtns = [
      { s: 'want',  i: '⭐', l: 'Voglio'  },
      { s: 'watch', i: '👀', l: 'Osservo' },
      { s: 'avoid', i: '❌', l: 'Evito'   }
    ].map(b => `<button class="wl-btn ${wStatus===b.s?'wl-active-'+b.s:''}" onclick="App.setWatchlist('${player.id}','${b.s}')" title="${b.l}">${b.i}</button>`).join('');

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
          <div class="stat max-now-stat"><span class="stat-label">💰 Max ora</span><span class="stat-val max-now-val">${maxNow} cr</span></div>
        </div>
        <div class="card-stats-section-label">📅 Stagione precedente</div>
        <div class="card-stats">
          <div class="stat"><span class="stat-label">FV media</span><span class="stat-val">${(player.stats_prev||player.stats).fantavote}</span></div>
          <div class="stat"><span class="stat-label">Gol</span><span class="stat-val">${(player.stats_prev||player.stats).goals}</span></div>
          <div class="stat"><span class="stat-label">Assist</span><span class="stat-val">${(player.stats_prev||player.stats).assists}</span></div>
          <div class="stat"><span class="stat-label">Presenze</span><span class="stat-val">${(player.stats_prev||player.stats).matches}</span></div>
        </div>
        ${player.stats_curr && player.stats_curr.matches > 0 ? \`
        <div class="card-stats-section-label card-stats-curr-label">🔥 Stagione in corso (${player.stats_curr.matches} pres.)</div>
        <div class="card-stats">
          <div class="stat"><span class="stat-label">FV media</span><span class="stat-val curr-val">\${player.stats_curr.fantavote}</span></div>
          <div class="stat"><span class="stat-label">Gol</span><span class="stat-val curr-val">\${player.stats_curr.goals}</span></div>
          <div class="stat"><span class="stat-label">Assist</span><span class="stat-val curr-val">\${player.stats_curr.assists}</span></div>
        </div>\` : ''}
      </div>
      <div class="card-watchlist-row">
        <span class="wl-label">Watchlist:</span>
        <div class="wl-buttons">${wBtns}</div>
        ${wStatus ? `<input type="number" class="wl-target-input" placeholder="Max cr" value="${AppState.targetPrices[player.id]||''}" onblur="App.saveTargetPrice('${player.id}',this.value)" min="1"/>` : ''}
      </div>
      <div class="card-note-row">
        <textarea class="note-input" placeholder="Appunti..." onblur="App.saveNote('${player.id}',this.value)">${note}</textarea>
      </div>
      <div class="card-auction">
        <div class="auction-input-row">
          <input
            type="number"
            class="price-input"
            id="price-${player.id}"
            placeholder="Prezzo asta"
            min="1"
            oninput="UI.evaluateAuction('${player.id}')"
            onkeydown="if(event.key==='Enter') UI.evaluateAuction('${player.id}')"
          />
          <button class="btn-focus" onclick="App.openFocus('${player.id}')" title="Modalità focus">🔍</button>
          <button class="btn-beaten" onclick="App.markBeaten('${player.id}')" title="Già battuto — rimuovi dalla lista">🔨</button>
        </div>
        <div class="auction-result" id="result-${player.id}"></div>
      </div>
    </div>`;
  },

  // ─── VALUTAZIONE ─────────────────────────────────────────────────────────────

  evaluateAuction(playerId, targetBoxId) {
    const player   = AppState.players.find(p => p.id === playerId);
    if (!player) return;
    const inputId  = targetBoxId ? `focus-price-${playerId}` : `price-${playerId}`;
    const resultId = targetBoxId || `result-${playerId}`;
    const price    = parseInt(document.getElementById(inputId)?.value);

    const box = document.getElementById(resultId);
    if (!box) return;

    if (!price || price < 1) {
      box.innerHTML = '';
      return;
    }

    const status  = Utils.evaluatePurchase(player, price);
    const advice  = Utils.getBudgetAdvice(player, price, AppState.squad, AppState.settings.totalBudget);
    const alert   = Utils.getSmartAlert(player, price, AppState.squad, AppState.settings.totalBudget);
    const maxNow  = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);

    UI.showResultBox(resultId, playerId, status, advice, alert, maxNow, price);
  },

  showResultBox(boxId, playerId, status, advice, alert, maxNow, price) {
    const box = document.getElementById(boxId);
    if (!box) return;

    const sMap = {
      AFFARE:  { cls: 'green',  icon: '🟢', label: 'AFFARE'  },
      OK:      { cls: 'yellow', icon: '🟡', label: 'OK'      },
      OVERPAY: { cls: 'red',    icon: '🔴', label: 'OVERPAY' }
    };
    const aMap = {
      OK:          { cls: 'green',  label: 'Budget OK'         },
      ATTENTO:     { cls: 'yellow', label: 'Attento al budget' },
      NON_COMPRARE:{ cls: 'red',    label: 'Non comprare'      }
    };

    const s = sMap[status] || { cls: 'neutral', icon: '⚪', label: status };
    const a = aMap[advice]  || { cls: 'neutral', label: advice };

    // Colore dominante per il box: se entrambi OK → verde, se uno rosso → rosso
    const domCls = (advice === 'NON_COMPRARE' || status === 'OVERPAY') ? 'red'
                 : (advice === 'ATTENTO' || status === 'OK')           ? 'yellow'
                 : 'green';

    box.innerHTML = `
      <div class="result-decision result-${domCls}">
        <div class="result-top-row">
          <span class="result-status-badge">${s.icon} ${s.label}</span>
          <span class="result-budget-badge result-${a.cls}">${a.label}</span>
        </div>
        <div class="result-alert">${alert}</div>
        <div class="result-max-now">💰 Max ora: <strong>${maxNow} cr</strong></div>
      </div>
      <button class="btn-buy ${domCls === 'red' ? 'btn-buy-disabled' : ''}"
        onclick="App.buyPlayer('${playerId}', ${price})">
        Acquista per ${price} cr
      </button>`;
  },

  // ─── FOCUS MODE ──────────────────────────────────────────────────────────────

  renderFocus() {
    const playerId = AppState.focusPlayerId;
    const player   = AppState.players.find(p => p.id === playerId);
    if (!player) return;

    const maxNow    = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);
    const target    = AppState.targetPrices[player.id] || null;
    const note      = AppState.notes[player.id] || '';
    const wStatus   = AppState.watchlist[player.id] || null;
    const roleStyle = `background:${Utils.roleColor(player.role)}22;color:${Utils.roleColor(player.role)};border:1px solid ${Utils.roleColor(player.role)}44`;
    const inSquad   = AppState.squad.some(p => p.id === playerId);
    const isOff     = ['ATT','CEN'].includes(player.role) && (player.stats.goals >= 5 || player.stats.assists >= 5);

    const badges = [
      player.tag === 'sleeper' ? '<span class="badge badge-sleeper">SLEEPER</span>' : '',
      player.tag === 'hype'    ? '<span class="badge badge-hype">HYPE</span>'       : '',
      player.on_penalties      ? '<span class="badge-icon">🎯</span>'              : '',
      isOff                    ? '<span class="badge-icon">⚡</span>'              : ''
    ].join('');

    const total = AppState.settings.totalBudget;
    const spent = Utils.getTotalSpent(AppState.squad);
    const rem   = total - spent;
    const avg   = Utils.avgBudgetPerSlot(AppState.squad, total);

    let overlay = document.getElementById('focus-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'focus-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="focus-backdrop" onclick="App.closeFocus()"></div>
      <div class="focus-panel">
        <div class="focus-header">
          <div class="focus-title-row">
            <div>
              <div class="focus-player-name">${player.name}</div>
              <div class="focus-player-sub">${player.team} · ${player.advanced_role}</div>
            </div>
            <button class="focus-close" onclick="App.closeFocus()">✕</button>
          </div>
          <div class="focus-badges-row">
            <span class="role-pill" style="${roleStyle}">${player.role}</span>
            ${badges}
            ${wStatus ? `<span class="focus-wl-badge wl-badge-${wStatus}">${{want:'⭐ Voglio',watch:'👀 Osservo',avoid:'❌ Evito'}[wStatus]}</span>` : ''}
            ${inSquad ? '<span class="focus-bought-badge">✅ In rosa</span>' : ''}
          </div>
        </div>

        <div class="focus-body">
          <!-- STATS GRID -->
          <div class="focus-stats">
            <div class="focus-stat highlight">
              <span class="focus-stat-label">Valore stimato</span>
              <span class="focus-stat-val">${player.value_estimated} cr</span>
            </div>
            <div class="focus-stat highlight-max">
              <span class="focus-stat-label">💰 Max ora</span>
              <span class="focus-stat-val">${maxNow} cr</span>
            </div>
            ${target ? `<div class="focus-stat highlight-target"><span class="focus-stat-label">Tuo max</span><span class="focus-stat-val">${target} cr</span></div>` : ''}
            <div class="focus-stat">
              <span class="focus-stat-label">Quotazione</span>
              <span class="focus-stat-val">${player.price_initial} cr</span>
            </div>
            <div class="focus-stat">
              <span class="focus-stat-label">FV media</span>
              <span class="focus-stat-val">${player.stats.fantavote}</span>
            </div>
            <div class="focus-stat">
              <span class="focus-stat-label">Gol</span>
              <span class="focus-stat-val">${player.stats.goals}</span>
            </div>
            <div class="focus-stat">
              <span class="focus-stat-label">Assist</span>
              <span class="focus-stat-val">${player.stats.assists}</span>
            </div>
            <div class="focus-stat">
              <span class="focus-stat-label">Presenze</span>
              <span class="focus-stat-val">${player.stats.matches}</span>
            </div>
          </div>

          <!-- BUDGET LIVE -->
          <div class="focus-budget-row">
            <div class="focus-budget-item"><span>Rimasto</span><strong>${rem} cr</strong></div>
            <div class="focus-budget-item"><span>Media/slot</span><strong>${avg} cr</strong></div>
            <div class="focus-budget-item"><span>Giocatori</span><strong>${AppState.squad.length}/25</strong></div>
          </div>

          ${note ? `<div class="focus-note">"${note}"</div>` : ''}

          <!-- ASTA INPUT — auto-eval, niente bottone Valuta -->
          <div class="focus-auction">
            <input
              type="number"
              id="focus-price-${player.id}"
              class="focus-price-input"
              placeholder="Inserisci prezzo asta..."
              min="1"
              max="${total}"
              ${target ? `value="${target}"` : ''}
              oninput="UI.evaluateAuction('${player.id}','focus-result-${player.id}')"
              onkeydown="if(event.key==='Enter') UI.evaluateAuction('${player.id}','focus-result-${player.id}')"
            />
            <div id="focus-result-${player.id}" class="focus-result"></div>
          </div>
        </div>
      </div>`;

    overlay.style.display = 'flex';
    setTimeout(() => {
      const inp = document.getElementById(`focus-price-${player.id}`);
      if (inp) {
        inp.focus();
        // Se c'è già un valore (target price), lancia subito la valutazione
        if (inp.value) UI.evaluateAuction(player.id, `focus-result-${player.id}`);
      }
    }, 50);
  },

  closeFocus() {
    const overlay = document.getElementById('focus-overlay');
    if (overlay) overlay.style.display = 'none';
    AppState.focusPlayerId = null;
  },

  // ─── WATCHLIST VIEW ──────────────────────────────────────────────────────────

  renderWatchlist() {
    const container = document.getElementById('watchlist-list');
    if (!container) return;
    const groups = { want: [], watch: [], avoid: [] };
    Object.entries(AppState.watchlist).forEach(([id, status]) => {
      const p = AppState.players.find(p => p.id === id);
      if (p) groups[status]?.push(p);
    });
    Object.keys(groups).forEach(k =>
      groups[k].sort((a, b) => (AppState.priorities[b.id] || 0) - (AppState.priorities[a.id] || 0))
    );
    const total = Object.values(groups).flat().length;
    if (total === 0) {
      container.innerHTML = `<div class="empty-state">Nessun giocatore in watchlist.<br><small>Usa ⭐ 👀 ❌ nelle card per aggiungerli.</small></div>`;
      return;
    }
    const labels = {
      want:  { icon: '⭐', title: 'Voglio',  cls: 'want'  },
      watch: { icon: '👀', title: 'Osservo', cls: 'watch' },
      avoid: { icon: '❌', title: 'Evito',   cls: 'avoid' }
    };
    container.innerHTML = Object.entries(groups).map(([key, players]) => {
      if (!players.length) return '';
      const lbl = labels[key];
      return `
        <div class="wl-section">
          <h3 class="wl-section-title wl-title-${lbl.cls}">${lbl.icon} ${lbl.title} (${players.length})</h3>
          ${players.map(p => {
            const note    = AppState.notes[p.id] || '';
            const target  = AppState.targetPrices[p.id] || null;
            const inSquad = AppState.squad.some(s => s.id === p.id);
            return `
            <div class="wl-row ${inSquad ? 'wl-bought' : ''}">
              <div class="wl-player-info">
                <span class="wl-name">${p.name}</span>
                <span class="wl-meta" style="color:${Utils.roleColor(p.role)}">${p.role}</span>
                <span class="wl-team">${p.team}</span>
                ${inSquad ? '<span class="wl-badge-bought">✅ Acquistato</span>' : ''}
              </div>
              <div class="wl-priority-row">
                <span class="wl-priority-label">Priorità:</span>
                ${[1,2,3,4,5].map(n => `<button class="wl-prio-btn ${(AppState.priorities[p.id]||0)===n?'wl-prio-active':''}" onclick="App.setPriority('${p.id}',${n})">${n}</button>`).join('')}
              </div>
              <div class="wl-player-right">
                <div class="wl-prices">
                  <span class="wl-value">${p.value_estimated} cr</span>
                  ${target ? `<span class="wl-target">max: ${target} cr</span>` : ''}
                </div>
                <button class="btn-focus-sm" onclick="App.openFocus('${p.id}')" title="Focus">🎯</button>
                <button class="btn-remove" onclick="App.setWatchlist('${p.id}',null)">✕</button>
              </div>
              ${note ? `<div class="wl-note">"${note}"</div>` : ''}
            </div>`;
          }).join('')}
        </div>`;
    }).join('');
  },

  // ─── SQUADRA ─────────────────────────────────────────────────────────────────

  renderSquad() {
    const container = document.getElementById('squad-list');
    if (!container) return;
    if (!AppState.squad.length) {
      container.innerHTML = `<div class="empty-state">Nessun giocatore acquistato ancora.</div>`;
      return;
    }
    const byRole = { POR: [], DIF: [], CEN: [], ATT: [] };
    AppState.squad.forEach(p => byRole[p.role]?.push(p));
    const totalSpent = Utils.getTotalSpent(AppState.squad);
    container.innerHTML = `
      <div class="squad-summary">
        <span>Totale speso: <strong>${totalSpent} cr</strong></span>
        <span>Giocatori: <strong>${AppState.squad.length}/25</strong></span>
      </div>
      ${Object.entries(byRole).map(([role, players]) => {
        if (!players.length) return '';
        return `
          <div class="squad-section">
            <h3 class="squad-role-title" style="color:${Utils.roleColor(role)}">${Utils.roleLabel(role)} (${players.length})</h3>
            ${players.map(p => `
              <div class="squad-row">
                <div class="squad-player-info">
                  <span class="squad-name">${p.name}</span>
                  <span class="squad-team">${p.team}</span>
                </div>
                <div class="squad-player-right">
                  <span class="squad-paid">${p.paid} cr</span>
                  <button class="btn-remove" onclick="App.removePlayer('${p.id}')">✕</button>
                </div>
              </div>`).join('')}
          </div>`;
      }).join('')}`;
  },

  // ─── TOAST ───────────────────────────────────────────────────────────────────

  showToast(msg, type = 'info') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.className = `toast toast-${type} show`;
    t.textContent = msg;
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 2800);
  },

  showError(msg) {
    const c = document.getElementById('player-list');
    if (c) c.innerHTML = `<div class="empty-state error">${msg}</div>`;
  }
};