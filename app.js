// app.js — Logica principale, AppState, localStorage

window.AppState = {
  players: [],
  squad: [],
  budget: 250,
  settings: {
    totalBudget: 250,
    formation: '3-4-3'
  },
  watchlist:    {},  // { playerId: 'want'|'watch'|'avoid' }
  targetPrices: {},  // { playerId: number }
  priorities:   {},  // { playerId: 1|2|3|4|5 }
  beaten:       [],  // [ playerId ] — giocatori già aggiudicati ad altri
  notes:        {},  // { playerId: string }
  filters: {
    role: 'ALL',
    tag: 'ALL',
    penalties: false,
    search: ''
  },
  sort: 'value_estimated',
  activeTab: 'players',  // 'players' | 'watchlist' | 'squad'
  focusPlayerId: null
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────

const Storage = {
  KEY: 'fantacalcio_state',

  save() {
    try {
      localStorage.setItem(Storage.KEY, JSON.stringify({
        squad:        AppState.squad,
        budget:       AppState.budget,
        settings:     AppState.settings,
        watchlist:    AppState.watchlist,
        targetPrices: AppState.targetPrices,
        priorities:   AppState.priorities,
        beaten:       AppState.beaten,
        notes:        AppState.notes
      }));
    } catch(e) { console.error('Storage save:', e); }
  },

  load() {
    try {
      const raw = localStorage.getItem(Storage.KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.squad)        AppState.squad        = d.squad;
      if (d.budget)       AppState.budget       = d.budget;
      if (d.settings)     AppState.settings     = { ...AppState.settings, ...d.settings };
      if (d.watchlist)    AppState.watchlist    = d.watchlist;
      if (d.targetPrices) AppState.targetPrices = d.targetPrices;
      if (d.priorities)   AppState.priorities   = d.priorities;
      if (d.beaten)       AppState.beaten       = d.beaten;
      if (d.notes)        AppState.notes        = d.notes;
    } catch(e) { console.error('Storage load:', e); }
  },

  clear() { localStorage.removeItem(Storage.KEY); }
};

// ─── LOAD PLAYERS ─────────────────────────────────────────────────────────────

async function loadPlayers() {
  if (window.PLAYERS && window.PLAYERS.length > 0) {
    AppState.players = window.PLAYERS;
  } else {
    AppState.players = [];
    UI.showError('Impossibile caricare i dati dei giocatori.');
  }
}

// ─── AZIONI ───────────────────────────────────────────────────────────────────

const App = {

  // ACQUISTA
  buyPlayer(playerId, price) {
    const player = AppState.players.find(p => p.id === playerId);
    if (!player) return;
    const check = Utils.canBuy(player, AppState.squad, AppState.settings.totalBudget);
    if (!check.ok) { UI.showToast(check.reason, 'error'); return; }
    const remaining = AppState.settings.totalBudget - Utils.getTotalSpent(AppState.squad);
    if (price > remaining) { UI.showToast('Budget insufficiente!', 'error'); return; }
    AppState.squad.push({ ...player, paid: price });
    AppState.budget = AppState.settings.totalBudget - Utils.getTotalSpent(AppState.squad);
    Storage.save();
    UI.closeFocus();
    UI.render();
    UI.showToast(`${player.name} acquistato per ${price} cr!`, 'success');
  },

  // RIMUOVI
  removePlayer(playerId) {
    AppState.squad = AppState.squad.filter(p => p.id !== playerId);
    AppState.budget = AppState.settings.totalBudget - Utils.getTotalSpent(AppState.squad);
    Storage.save();
    UI.render();
    UI.showToast('Giocatore rimosso dalla rosa.', 'info');
  },

  // BUDGET
  updateBudget(val) {
    AppState.settings.totalBudget = val;
    AppState.budget = val - Utils.getTotalSpent(AppState.squad);
    Storage.save();
    UI.renderBudgetBar();
  },

  // FORMAZIONE
  updateFormation(val) {
    AppState.settings.formation = val;
    Storage.save();
  },

  // FILTRO
  setFilter(key, val) {
    AppState.filters[key] = val;
    UI.renderPlayerList();
  },

  // SORT
  setSort(val) {
    AppState.sort = val;
    UI.renderPlayerList();
  },

  // TAB
  setTab(tab) {
    AppState.activeTab = tab;
    UI.renderTabs();
  },

  // WATCHLIST
  setWatchlist(playerId, status) {
    if (!status || AppState.watchlist[playerId] === status) {
      delete AppState.watchlist[playerId];
    } else {
      AppState.watchlist[playerId] = status;
    }
    Storage.save();
    UI.renderPlayerList();
    UI.renderWatchlist();
  },

  // PREZZO TARGET
  saveTargetPrice(playerId, val) {
    const price = parseInt(val);
    if (!price || price < 1) delete AppState.targetPrices[playerId];
    else AppState.targetPrices[playerId] = price;
    Storage.save();
    UI.renderWatchlist();
  },

  // NOTE
  saveNote(playerId, text) {
    if (!text || !text.trim()) delete AppState.notes[playerId];
    else AppState.notes[playerId] = text.trim();
    Storage.save();
  },

  // GIOCATORE BATTUTO
  markBeaten(playerId) {
    if (!AppState.beaten.includes(playerId)) {
      AppState.beaten.push(playerId);
      Storage.save();
      UI.renderPlayerList();
      const p = AppState.players.find(p => p.id === playerId);
      UI.showToast(`${p ? p.name : 'Giocatore'} segnato come battuto.`, 'info');
    }
  },

  unmarkBeaten(playerId) {
    AppState.beaten = AppState.beaten.filter(id => id !== playerId);
    Storage.save();
    UI.renderPlayerList();
    UI.renderBeaten();
  },

  // PRIORITÀ WATCHLIST
  setPriority(playerId, value) {
    const p = parseInt(value);
    if (!p || p < 1 || p > 5) delete AppState.priorities[playerId];
    else AppState.priorities[playerId] = p;
    Storage.save();
    UI.renderWatchlist();
  },

  // FOCUS MODE
  openFocus(playerId) {
    AppState.focusPlayerId = playerId;
    UI.renderFocus();
  },

  closeFocus() {
    AppState.focusPlayerId = null;
    UI.closeFocus();
  },

  // EXPORT BACKUP
  exportBackup() {
    const blob = new Blob([JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      squad: AppState.squad,
      budget: AppState.budget,
      settings: AppState.settings,
      watchlist: AppState.watchlist,
      targetPrices: AppState.targetPrices,
      priorities: AppState.priorities,
      beaten: AppState.beaten,
      notes: AppState.notes
    }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fantassist-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    UI.showToast('Backup esportato!', 'success');
  },

  // IMPORT BACKUP
  importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const d = JSON.parse(e.target.result);
        if (!d.version) throw new Error('invalid');
        if (d.squad)        AppState.squad        = d.squad;
        if (d.budget)       AppState.budget       = d.budget;
        if (d.settings)     AppState.settings     = { ...AppState.settings, ...d.settings };
        if (d.watchlist)    AppState.watchlist    = d.watchlist;
        if (d.targetPrices) AppState.targetPrices = d.targetPrices;
        if (d.priorities)   AppState.priorities   = d.priorities;
        if (d.beaten)       AppState.beaten       = d.beaten;
        if (d.notes)        AppState.notes        = d.notes;
        Storage.save();
        UI.render();
        const be = document.getElementById('setting-budget');
        const fe = document.getElementById('setting-formation');
        if (be) be.value = AppState.settings.totalBudget;
        if (fe) fe.value = AppState.settings.formation;
        UI.showToast('Backup importato!', 'success');
      } catch { UI.showToast('File non valido.', 'error'); }
    };
    reader.readAsText(file);
  },

  // RESET
  resetAll() {
    if (!confirm('Sei sicuro? Perderai rosa, watchlist e appunti.')) return;
    AppState.squad = [];
    AppState.budget = AppState.settings.totalBudget;
    AppState.watchlist = {};
    AppState.targetPrices = {};
    AppState.priorities = {};
    AppState.beaten = [];
    AppState.notes = {};
    Storage.clear();
    UI.render();
    UI.showToast('Reset completato.', 'info');
  }
};

// ─── INIT ─────────────────────────────────────────────────────────────────────

async function init() {
  Storage.load();
  await loadPlayers();
  UI.render();
}

document.addEventListener('DOMContentLoaded', init);