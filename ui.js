// ui.js — Rendering UI

const UI = {

  render() {
    UI.renderBudgetBar();
    UI.renderTabs();
    UI.renderFilters();
    UI.renderPlayerList();
    UI.renderBeaten();
    UI.renderWatchlist();
    UI.renderSquad();
  },

  renderBudgetBar() {
    var total = AppState.settings.totalBudget;
    var spent = Utils.getTotalSpent(AppState.squad);
    var rem   = total - spent;
    var avg   = Utils.avgBudgetPerSlot(AppState.squad, total);
    var slots = Utils.getRemainingSlots(AppState.squad);
    var pct   = Math.min(100, Math.round((spent / total) * 100));
    var bar   = document.getElementById('budget-bar');
    if (!bar) return;
    bar.innerHTML =
      '<div class="budget-grid">' +
        '<div class="budget-item"><span class="budget-label">Totale</span><span class="budget-value">' + total + ' cr</span></div>' +
        '<div class="budget-item"><span class="budget-label">Speso</span><span class="budget-value spent">' + spent + ' cr</span></div>' +
        '<div class="budget-item"><span class="budget-label">Rimasto</span><span class="budget-value remaining">' + rem + ' cr</span></div>' +
        '<div class="budget-item"><span class="budget-label">Media/slot</span><span class="budget-value">' + avg + ' cr</span></div>' +
      '</div>' +
      '<div class="progress-bar-wrap"><div class="progress-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="slots-grid">' +
        '<div class="slot-item"><span class="slot-role por">POR</span><span>' + (3 - slots.POR) + '/3</span></div>' +
        '<div class="slot-item"><span class="slot-role dif">DIF</span><span>' + (8 - slots.DIF) + '/8</span></div>' +
        '<div class="slot-item"><span class="slot-role cen">CEN</span><span>' + (8 - slots.CEN) + '/8</span></div>' +
        '<div class="slot-item"><span class="slot-role att">ATT</span><span>' + (6 - slots.ATT) + '/6</span></div>' +
        '<div class="slot-item"><span class="slot-role total">TOT</span><span>' + AppState.squad.length + '/25</span></div>' +
      '</div>';
  },

  renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(function(t) {
      t.classList.toggle('active', t.dataset.tab === AppState.activeTab);
    });
    document.getElementById('view-players').style.display   = AppState.activeTab === 'players'   ? 'block' : 'none';
    document.getElementById('view-watchlist').style.display = AppState.activeTab === 'watchlist' ? 'block' : 'none';
    document.getElementById('view-squad').style.display     = AppState.activeTab === 'squad'     ? 'block' : 'none';
  },

  renderFilters() {
    var set    = function(id, val) { var el = document.getElementById(id); if (el) el.value   = val; };
    var setChk = function(id, val) { var el = document.getElementById(id); if (el) el.checked = val; };
    set('filter-role',     AppState.filters.role);
    set('filter-tag',      AppState.filters.tag);
    set('sort-by',         AppState.sort);
    set('search-input',    AppState.filters.search);
    setChk('filter-penalties', AppState.filters.penalties);
  },

  renderPlayerList() {
    var container = document.getElementById('player-list');
    if (!container) return;
    var squadIds  = new Set(AppState.squad.map(function(p){ return p.id; }));
    var beatenIds = new Set(AppState.beaten || []);
    var players = Utils.filterPlayers(AppState.players, AppState.filters)
                       .filter(function(p){ return !squadIds.has(p.id) && !beatenIds.has(p.id); });
    players = Utils.sortPlayers(players, AppState.sort);
    var count = document.getElementById('player-count');
    if (count) count.textContent = players.length + ' giocatori';
    if (players.length === 0) {
      container.innerHTML = '<div class="empty-state">Nessun giocatore trovato.</div>';
      return;
    }
    container.innerHTML = players.map(function(p){ return UI.playerCard(p); }).join('');
  },

  // ─── BATTUTI ────────────────────────────────────────────────────────────────

  renderBeaten() {
    var container = document.getElementById('beaten-list');
    if (!container) return;
    var beaten = (AppState.beaten || []).map(function(id) {
      return AppState.players.find(function(p){ return p.id === id; });
    }).filter(Boolean);
    if (beaten.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:16px;">Nessun giocatore battuto.</div>';
      return;
    }
    var html = '';
    beaten.forEach(function(p) {
      var rc = Utils.roleColor(p.role);
      html +=
        '<div class="beaten-row">' +
          '<span class="role-pill" style="background:' + rc + '22;color:' + rc + ';border:1px solid ' + rc + '44;font-size:.7rem;padding:2px 7px;">' + p.role + '</span>' +
          '<span class="beaten-name">' + p.name + '</span>' +
          '<span class="beaten-team">' + p.team + '</span>' +
          '<button class="btn-unbeaten" onclick="App.unmarkBeaten(\'' + p.id + '\')" title="Rimetti in lista">&#8635;</button>' +
        '</div>';
    });
    container.innerHTML = html;
  },

  // ─── PLAYER CARD ────────────────────────────────────────────────────────────

  playerCard(player) {
    var wStatus   = AppState.watchlist[player.id] || null;
    var note      = AppState.notes[player.id] || '';
    var maxNow    = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);
    var rc        = Utils.roleColor(player.role);
    var roleStyle = 'background:' + rc + '22;color:' + rc + ';border:1px solid ' + rc + '44';
    var sp        = player.stats_prev || player.stats || {};
    var sc        = player.stats_curr || null;
    var isOff     = ['ATT','CEN'].includes(player.role) && ((sp.goals || 0) >= 5 || (sp.assists || 0) >= 5);
    var statusIcon = { starter: '🟢', risk: '🟡', bench: '🔴' };
    var statusTip  = { starter: 'Titolare fisso', risk: 'Ballottaggio', bench: 'Rischio panchina' };

    var badges = '';
    if (player.tag === 'sleeper') badges += '<span class="badge badge-sleeper">SLEEPER</span>';
    if (player.tag === 'hype')    badges += '<span class="badge badge-hype">HYPE</span>';
    if (player.on_penalties)      badges += '<span class="badge-icon" title="Rigorista">&#127919;</span>';
    if (isOff)                    badges += '<span class="badge-icon" title="Offensivo">&#9889;</span>';
    if (player.status)            badges += '<span class="badge-icon" title="' + (statusTip[player.status]||'') + '">' + (statusIcon[player.status]||'') + '</span>';
    if (player.injury_prone)      badges += '<span class="badge-icon" title="Si infortuna spesso">&#129657;</span>';

    var wBtns = '';
    var wArr = [{s:'want',i:'⭐',l:'Voglio'},{s:'watch',i:'👀',l:'Osservo'},{s:'avoid',i:'❌',l:'Evito'}];
    for (var i=0; i<wArr.length; i++) {
      var b = wArr[i];
      wBtns += '<button class="wl-btn ' + (wStatus===b.s?'wl-active-'+b.s:'') + '" onclick="App.setWatchlist(\'' + player.id + '\',\'' + b.s + '\')" title="' + b.l + '">' + b.i + '</button>';
    }

    var currSection = '';
    if (sc && sc.matches > 0) {
      currSection =
        '<div class="card-stats-section-label card-stats-curr-label">&#128293; Stagione in corso (' + sc.matches + ' pres.)</div>' +
        '<div class="card-stats">' +
          '<div class="stat"><span class="stat-label">FV media</span><span class="stat-val curr-val">' + sc.fantavote + '</span></div>' +
          '<div class="stat"><span class="stat-label">Gol</span><span class="stat-val curr-val">' + sc.goals + '</span></div>' +
          '<div class="stat"><span class="stat-label">Assist</span><span class="stat-val curr-val">' + sc.assists + '</span></div>' +
        '</div>';
    }

    var targetInput = wStatus ? '<input type="number" class="wl-target-input" placeholder="Max cr" value="' + (AppState.targetPrices[player.id]||'') + '" onblur="App.saveTargetPrice(\'' + player.id + '\',this.value)" min="1"/>' : '';

    return '<div class="player-card" id="card-' + player.id + '">' +
      '<div class="card-header">' +
        '<div class="card-meta">' +
          '<span class="role-pill" style="' + roleStyle + '">' + player.role + '</span>' +
          '<span class="advanced-role">' + player.advanced_role + '</span>' +
        '</div>' +
        '<div class="card-badges">' + badges + '</div>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="player-name">' + player.name + '</div>' +
        '<div class="player-team">' + player.team + '</div>' +
        '<div class="card-stats">' +
          '<div class="stat"><span class="stat-label">Valore</span><span class="stat-val value">' + player.value_estimated + ' cr</span></div>' +
          '<div class="stat"><span class="stat-label">Quotaz.</span><span class="stat-val">' + player.price_initial + ' cr</span></div>' +
          '<div class="stat max-now-stat"><span class="stat-label">&#128176; Max ora</span><span class="stat-val max-now-val">' + maxNow + ' cr</span></div>' +
        '</div>' +
        '<div class="card-stats-section-label">&#128197; Stagione precedente</div>' +
        '<div class="card-stats">' +
          '<div class="stat"><span class="stat-label">FV media</span><span class="stat-val">' + (sp.fantavote||'-') + '</span></div>' +
          '<div class="stat"><span class="stat-label">Voto medio</span><span class="stat-val">' + (sp.avg_vote||'-') + '</span></div>' +
          '<div class="stat"><span class="stat-label">Gol</span><span class="stat-val">' + (sp.goals||0) + '</span></div>' +
          '<div class="stat"><span class="stat-label">Assist</span><span class="stat-val">' + (sp.assists||0) + '</span></div>' +
          '<div class="stat"><span class="stat-label">Presenze</span><span class="stat-val">' + (sp.matches||0) + '</span></div>' +
        '</div>' +
        currSection +
      '</div>' +
      '<div class="card-watchlist-row">' +
        '<span class="wl-label">Watchlist:</span>' +
        '<div class="wl-buttons">' + wBtns + '</div>' +
        targetInput +
      '</div>' +
      '<div class="card-note-row">' +
        '<textarea class="note-input" placeholder="Appunti..." onblur="App.saveNote(\'' + player.id + '\',this.value)">' + note + '</textarea>' +
      '</div>' +
      '<div class="card-auction">' +
        '<div class="auction-input-row">' +
          '<input type="number" class="price-input" id="price-' + player.id + '" placeholder="Prezzo asta" min="1" oninput="UI.evaluateAuction(\'' + player.id + '\')" onkeydown="if(event.key===\'Enter\') UI.evaluateAuction(\'' + player.id + '\')" />' +
          '<button class="btn-focus" onclick="App.openFocus(\'' + player.id + '\')" title="Focus">&#128269;</button>' +
          '<button class="btn-beaten" onclick="App.markBeaten(\'' + player.id + '\')" title="Battuto">&#128296;</button>' +
        '</div>' +
        '<div class="auction-result" id="result-' + player.id + '"></div>' +
      '</div>' +
    '</div>';
  },

  // ─── VALUTAZIONE ────────────────────────────────────────────────────────────

  evaluateAuction(playerId, targetBoxId) {
    var player  = AppState.players.find(function(p){ return p.id === playerId; });
    if (!player) return;
    var inputId  = targetBoxId ? 'focus-price-' + playerId : 'price-' + playerId;
    var resultId = targetBoxId || 'result-' + playerId;
    var inputEl  = document.getElementById(inputId);
    var price    = inputEl ? parseInt(inputEl.value) : 0;
    var box      = document.getElementById(resultId);
    if (!box) return;
    if (!price || price < 1) { box.innerHTML = ''; return; }
    var status = Utils.evaluatePurchase(player, price);
    var advice = Utils.getBudgetAdvice(player, price, AppState.squad, AppState.settings.totalBudget);
    var alert  = Utils.getSmartAlert(player, price, AppState.squad, AppState.settings.totalBudget);
    var maxNow = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);
    UI.showResultBox(resultId, playerId, status, advice, alert, maxNow, price);
  },

  showResultBox(boxId, playerId, status, advice, alert, maxNow, price) {
    var box = document.getElementById(boxId);
    if (!box) return;
    var sMap = { AFFARE:{cls:'green',icon:'🟢',label:'AFFARE'}, OK:{cls:'yellow',icon:'🟡',label:'OK'}, OVERPAY:{cls:'red',icon:'🔴',label:'OVERPAY'} };
    var aMap = { OK:{cls:'green',label:'Budget OK'}, ATTENTO:{cls:'yellow',label:'Attento al budget'}, NON_COMPRARE:{cls:'red',label:'Non comprare'} };
    var s = sMap[status] || {cls:'neutral',icon:'⚪',label:status};
    var a = aMap[advice]  || {cls:'neutral',label:advice};
    var domCls = (advice==='NON_COMPRARE'||status==='OVERPAY') ? 'red' : (advice==='ATTENTO'||status==='OK') ? 'yellow' : 'green';
    box.innerHTML =
      '<div class="result-decision result-' + domCls + '">' +
        '<div class="result-top-row">' +
          '<span class="result-status-badge">' + s.icon + ' ' + s.label + '</span>' +
          '<span class="result-budget-badge result-' + a.cls + '">' + a.label + '</span>' +
        '</div>' +
        '<div class="result-alert">' + alert + '</div>' +
        '<div class="result-max-now">&#128176; Max ora: <strong>' + maxNow + ' cr</strong></div>' +
      '</div>' +
      '<button class="btn-buy ' + (domCls==='red'?'btn-buy-disabled':'') + '" onclick="App.buyPlayer(\'' + playerId + '\',' + price + ')">Acquista per ' + price + ' cr</button>';
  },

  // ─── FOCUS MODE ─────────────────────────────────────────────────────────────

  renderFocus() {
    var playerId = AppState.focusPlayerId;
    var player   = AppState.players.find(function(p){ return p.id === playerId; });
    if (!player) return;
    var maxNow  = Utils.calcMaxOfferNow(player, AppState.squad, AppState.settings.totalBudget);
    var target  = AppState.targetPrices[player.id] || null;
    var note    = AppState.notes[player.id] || '';
    var wStatus = AppState.watchlist[player.id] || null;
    var rc      = Utils.roleColor(player.role);
    var roleStyle = 'background:' + rc + '22;color:' + rc + ';border:1px solid ' + rc + '44';
    var inSquad = AppState.squad.some(function(p){ return p.id === playerId; });
    var sp      = player.stats_prev || player.stats || {};
    var isOff   = ['ATT','CEN'].includes(player.role) && ((sp.goals||0)>=5||(sp.assists||0)>=5);
    var total   = AppState.settings.totalBudget;
    var spent   = Utils.getTotalSpent(AppState.squad);
    var rem     = total - spent;
    var avg     = Utils.avgBudgetPerSlot(AppState.squad, total);
    var wLabels = {want:'⭐ Voglio',watch:'👀 Osservo',avoid:'❌ Evito'};
    var focusStatusIcon = { starter: '🟢', risk: '🟡', bench: '🔴' };
    var focusStatusTip  = { starter: 'Titolare fisso', risk: 'Ballottaggio', bench: 'Rischio panchina' };

    var badges = '';
    if (player.tag==='sleeper') badges += '<span class="badge badge-sleeper">SLEEPER</span>';
    if (player.tag==='hype')    badges += '<span class="badge badge-hype">HYPE</span>';
    if (player.on_penalties)    badges += '<span class="badge-icon" title="Rigorista">&#127919;</span>';
    if (isOff)                  badges += '<span class="badge-icon" title="Offensivo">&#9889;</span>';
    if (player.status)          badges += '<span class="badge-icon" title="' + (focusStatusTip[player.status]||'') + '">' + (focusStatusIcon[player.status]||'') + '</span>';
    if (player.injury_prone)    badges += '<span class="badge-icon" title="Si infortuna spesso">&#129657;</span>';

    // Watchlist badge nel focus
    var wlBadge = wStatus ? '<span class="focus-wl-badge wl-badge-' + wStatus + '">' + (wLabels[wStatus]||'') + '</span>' : '';

    var overlay = document.getElementById('focus-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'focus-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML =
      '<div class="focus-backdrop" onclick="App.closeFocus()"></div>' +
      '<div class="focus-panel">' +
        '<div class="focus-header">' +
          '<div class="focus-title-row">' +
            '<div>' +
              '<div class="focus-player-name">' + player.name + '</div>' +
              '<div class="focus-player-sub">' + player.team + ' · ' + player.advanced_role + '</div>' +
            '</div>' +
            '<button class="focus-close" onclick="App.closeFocus()">✕</button>' +
          '</div>' +
          '<div class="focus-badges-row">' +
            '<span class="role-pill" style="' + roleStyle + '">' + player.role + '</span>' +
            badges +
            wlBadge +
            (inSquad ? '<span class="focus-bought-badge">✅ In rosa</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="focus-body">' +
          '<div class="focus-stats">' +
            '<div class="focus-stat highlight"><span class="focus-stat-label">Valore stimato</span><span class="focus-stat-val">' + player.value_estimated + ' cr</span></div>' +
            '<div class="focus-stat highlight-max"><span class="focus-stat-label">&#128176; Max ora</span><span class="focus-stat-val">' + maxNow + ' cr</span></div>' +
            (target ? '<div class="focus-stat highlight-target"><span class="focus-stat-label">Tuo max</span><span class="focus-stat-val">' + target + ' cr</span></div>' : '') +
            '<div class="focus-stat"><span class="focus-stat-label">Quotazione</span><span class="focus-stat-val">' + player.price_initial + ' cr</span></div>' +
            '<div class="focus-stat"><span class="focus-stat-label">FV media</span><span class="focus-stat-val">' + (sp.fantavote||'-') + '</span></div>' +
            '<div class="focus-stat"><span class="focus-stat-label">Voto medio</span><span class="focus-stat-val">' + (sp.avg_vote||'-') + '</span></div>' +
            '<div class="focus-stat"><span class="focus-stat-label">Gol</span><span class="focus-stat-val">' + (sp.goals||0) + '</span></div>' +
            '<div class="focus-stat"><span class="focus-stat-label">Assist</span><span class="focus-stat-val">' + (sp.assists||0) + '</span></div>' +
            '<div class="focus-stat"><span class="focus-stat-label">Presenze</span><span class="focus-stat-val">' + (sp.matches||0) + '</span></div>' +
          '</div>' +
          '<div class="focus-budget-row">' +
            '<div class="focus-budget-item"><span>Rimasto</span><strong>' + rem + ' cr</strong></div>' +
            '<div class="focus-budget-item"><span>Media/slot</span><strong>' + avg + ' cr</strong></div>' +
            '<div class="focus-budget-item"><span>Giocatori</span><strong>' + AppState.squad.length + '/25</strong></div>' +
          '</div>' +
          (note ? '<div class="focus-note">"' + note + '"</div>' : '') +
          '<div class="focus-auction">' +
            '<input type="number" id="focus-price-' + player.id + '" class="focus-price-input" placeholder="Inserisci prezzo asta..." min="1" max="' + total + '" ' + (target?'value="'+target+'"':'') + ' oninput="UI.evaluateAuction(\'' + player.id + '\',\'focus-result-' + player.id + '\')" onkeydown="if(event.key===\'Enter\') UI.evaluateAuction(\'' + player.id + '\',\'focus-result-' + player.id + '\')" />' +
            '<div id="focus-result-' + player.id + '" class="focus-result"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    overlay.style.display = 'flex';
    setTimeout(function() {
      var inp = document.getElementById('focus-price-' + player.id);
      if (inp) {
        inp.focus();
        if (inp.value) UI.evaluateAuction(player.id, 'focus-result-' + player.id);
      }
    }, 50);
  },

  closeFocus() {
    var overlay = document.getElementById('focus-overlay');
    if (overlay) overlay.style.display = 'none';
    AppState.focusPlayerId = null;
  },

  // ─── WATCHLIST ──────────────────────────────────────────────────────────────

  renderWatchlist() {
    var container = document.getElementById('watchlist-list');
    if (!container) return;
    var groups = { want: [], watch: [], avoid: [] };
    Object.entries(AppState.watchlist).forEach(function(entry) {
      var id = entry[0], status = entry[1];
      var p = AppState.players.find(function(p){ return p.id === id; });
      if (p && groups[status]) groups[status].push(p);
    });
    Object.keys(groups).forEach(function(k) {
      groups[k].sort(function(a,b){ return (AppState.priorities[b.id]||0)-(AppState.priorities[a.id]||0); });
    });
    var total = Object.values(groups).flat().length;
    if (total === 0) {
      container.innerHTML = '<div class="empty-state">Nessun giocatore in watchlist.<br><small>Usa ⭐ 👀 ❌ nelle card per aggiungerli.</small></div>';
      return;
    }
    var labels = { want:{icon:'⭐',title:'Voglio',cls:'want'}, watch:{icon:'👀',title:'Osservo',cls:'watch'}, avoid:{icon:'❌',title:'Evito',cls:'avoid'} };
    var html = '';
    Object.entries(groups).forEach(function(entry) {
      var key = entry[0], players = entry[1];
      if (!players.length) return;
      var lbl = labels[key];
      html += '<div class="wl-section"><h3 class="wl-section-title wl-title-' + lbl.cls + '">' + lbl.icon + ' ' + lbl.title + ' (' + players.length + ')</h3>';
      players.forEach(function(p) {
        var pnote   = AppState.notes[p.id] || '';
        var ptarget = AppState.targetPrices[p.id] || null;
        var inSquad = AppState.squad.some(function(s){ return s.id === p.id; });
        var maxNow  = Utils.calcMaxOfferNow(p, AppState.squad, AppState.settings.totalBudget);
        var prioHtml = '';
        for (var n=1;n<=5;n++) prioHtml += '<button class="wl-prio-btn ' + ((AppState.priorities[p.id]||0)===n?'wl-prio-active':'') + '" onclick="App.setPriority(\'' + p.id + '\',' + n + ')">' + n + '</button>';
        html +=
          '<div class="wl-row ' + (inSquad?'wl-bought':'') + '">' +
            '<div class="wl-player-info">' +
              '<span class="wl-name">' + p.name + '</span>' +
              '<span class="wl-meta" style="color:' + Utils.roleColor(p.role) + '">' + p.role + '</span>' +
              '<span class="wl-team">' + p.team + '</span>' +
              (inSquad ? '<span class="wl-badge-bought">✅ Acquistato</span>' : '') +
            '</div>' +
            '<div class="wl-priority-row"><span class="wl-priority-label">Priorità:</span>' + prioHtml + '</div>' +
            '<div class="wl-player-right">' +
              '<div class="wl-prices">' +
                '<span class="wl-value">' + p.value_estimated + ' cr</span>' +
                '<span class="wl-maxnow">Max ora: <strong>' + maxNow + ' cr</strong></span>' +
                (ptarget?'<span class="wl-target">tuo max: '+ptarget+' cr</span>':'') +
              '</div>' +
              '<button class="btn-focus-sm" onclick="App.openFocus(\'' + p.id + '\')" title="Focus">&#128269;</button>' +
              '<button class="btn-remove" onclick="App.setWatchlist(\'' + p.id + '\',null)">✕</button>' +
            '</div>' +
            (pnote ? '<div class="wl-note">"' + pnote + '"</div>' : '') +
          '</div>';
      });
      html += '</div>';
    });
    container.innerHTML = html;
  },

  // ─── SQUADRA ────────────────────────────────────────────────────────────────

  renderSquad() {
    var container = document.getElementById('squad-list');
    if (!container) return;
    if (!AppState.squad.length) {
      container.innerHTML = '<div class="empty-state">Nessun giocatore acquistato ancora.</div>';
      return;
    }
    var byRole = { POR:[], DIF:[], CEN:[], ATT:[] };
    AppState.squad.forEach(function(p){ if(byRole[p.role]) byRole[p.role].push(p); });
    var totalSpent = Utils.getTotalSpent(AppState.squad);
    var html = '<div class="squad-summary"><span>Totale speso: <strong>' + totalSpent + ' cr</strong></span><span>Giocatori: <strong>' + AppState.squad.length + '/25</strong></span></div>';
    Object.entries(byRole).forEach(function(entry) {
      var role = entry[0], players = entry[1];
      if (!players.length) return;
      html += '<div class="squad-section"><h3 class="squad-role-title" style="color:' + Utils.roleColor(role) + '">' + Utils.roleLabel(role) + ' (' + players.length + ')</h3>';
      players.forEach(function(p) {
        html += '<div class="squad-row"><div class="squad-player-info"><span class="squad-name">' + p.name + '</span><span class="squad-team">' + p.team + '</span></div><div class="squad-player-right"><span class="squad-paid">' + p.paid + ' cr</span><button class="btn-remove" onclick="App.removePlayer(\'' + p.id + '\')">✕</button></div></div>';
      });
      html += '</div>';
    });
    container.innerHTML = html;
  },

  showToast(msg, type) {
    type = type || 'info';
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.className = 'toast toast-' + type + ' show';
    t.textContent = msg;
    clearTimeout(t._t);
    t._t = setTimeout(function(){ t.classList.remove('show'); }, 2800);
  },

  showError(msg) {
    var c = document.getElementById('player-list');
    if (c) c.innerHTML = '<div class="empty-state error">' + msg + '</div>';
  }
};
