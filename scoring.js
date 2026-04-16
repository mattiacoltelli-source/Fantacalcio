// scoring.js — Undervalue Scoring Engine per FantAssist
// Compatibile con la struttura dati players.js (stats_prev / stats_curr)
// Logica: identifica giocatori con alto potenziale e basso prezzo
// Nessuna dipendenza esterna. Vanilla JS puro.

// ─── CONFIGURAZIONE PESI ──────────────────────────────────────────────────────
//
// Puoi modificare questi pesi per calibrare lo scoring.
// La somma dei pesi base (xg, xa, goals, shots) non deve essere 1,
// vengono normalizzati internamente.
//
const SCORING_CONFIG = {

  // ── Pesi performance offensiva ──────────────────────────────────────────────
  // xG e xA pesano di più dei gol/assist reali: vogliamo potenziale, non storia.
  weights: {
    xg:     0.35,   // xG per 90 — il dato più predittivo
    xa:     0.25,   // xA per 90 — qualità dei passaggi chiave
    goals:  0.20,   // gol per 90 — producono fantapunti
    shots:  0.10,   // tiri per 90 — proxy del volume offensivo
    xa_raw: 0.10    // assist per 90 — meno predittivo dell'xA ma concreto
  },

  // ── Soglie minuti ────────────────────────────────────────────────────────────
  // Sotto MIN_MINUTES_HARD il giocatore viene escluso dallo score (troppo poco campione)
  // Tra MIN_MINUTES_HARD e MIN_MINUTES_SOFT lo score viene penalizzato
  minMinutesHard: 300,   // esclusione se sotto questa soglia
  minMinutesSoft: 600,   // penalità progressiva fino a questa soglia

  // ── Potential boost ──────────────────────────────────────────────────────────
  // Amplifica il divario xG/xA vs gol/assist reali.
  // Più è alto, più vengono premiati giocatori "unlucky"
  potentialBoostFactor: 0.35,

  // ── Value score ─────────────────────────────────────────────────────────────
  // Esponente del divisore prezzo. 1 = lineare, <1 = penalizza meno i cari
  // 0.75 dà un boost decente ai low-cost senza schiacciare troppo i medi
  priceExponent: 0.75,

  // ── Portieri ─────────────────────────────────────────────────────────────────
  // I portieri non hanno dati offensivi utili: li gestiamo separatamente
  // con fantavoto medio come proxy
  goalkeeperFantavoteWeight: 1.0,

  // ── Normalizzazione per ruolo ─────────────────────────────────────────────
  // Valori massimi attesi per role (per normalizzare 0-1 lo score grezzo)
  // Aggiusta se i dati cambiano molto
  maxRawScore: {
    ATT: 2.8,
    CEN: 2.0,
    DIF: 1.4,
    POR: 0.0   // i POR usano altra logica
  }
};

// ─── HELPER: LEGGI LE STATS CORRETTE ──────────────────────────────────────────
// Usa stats_curr se ha presenze, altrimenti stats_prev
// (compatibile con Utils.getStats di utils.js)

function _getStats(player) {
  if (player.stats_curr && player.stats_curr.matches > 0) return player.stats_curr;
  if (player.stats_prev) return player.stats_prev;
  return player.stats || {};
}

// ─── HELPER: MINUTI STIMATI ────────────────────────────────────────────────────
// Stima i minuti giocati da matches (presenze).
// La media Serie A per titolare è ~80 min/partita.

function _estimateMinutes(stats) {
  if (stats.minutes) return stats.minutes; // se presente direttamente
  return (stats.matches || 0) * 80;
}

// ─── HELPER: SAFE NUMERIC ─────────────────────────────────────────────────────

function _safe(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

// ─── HELPER: CLAMP ────────────────────────────────────────────────────────────

function _clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ─── RELIABILITY FACTOR ───────────────────────────────────────────────────────
// Restituisce un moltiplicatore 0–1 basato sui minuti giocati.
// Sotto la soglia hard → null (escludi il giocatore)
// Tra hard e soft → penalità progressiva (interpolazione lineare)
// Sopra soft → 1.0 (nessuna penalità)

function _reliabilityFactor(minutes) {
  const { minMinutesHard, minMinutesSoft } = SCORING_CONFIG;
  if (minutes < minMinutesHard) return null; // escludi
  if (minutes >= minMinutesSoft) return 1.0;
  // interpolazione lineare tra Hard (→0.4) e Soft (→1.0)
  const ratio = (minutes - minMinutesHard) / (minMinutesSoft - minMinutesHard);
  return 0.4 + ratio * 0.6;
}

// ─── SCORE PORTIERI ────────────────────────────────────────────────────────────
// Per i POR usiamo fantavoto medio come proxy (nessun dato offensivo utile).
// Restituisce un value score normalizzato su prezzo.

function _goalkeeperScore(player) {
  const stats    = _getStats(player);
  const minutes  = _estimateMinutes(stats);
  const price    = _safe(player.price_initial) || 1;
  const fv       = _safe(stats.fantavote);
  const matches  = _safe(stats.matches);

  if (matches < 4) return null; // troppo pochi dati

  // Performance portiere: fantavoto normalizzato (range tipico 6.0–7.5)
  const perfScore = _clamp((fv - 6.0) / 1.5, 0, 1);

  // Value score: performance / prezzo^esponente
  const valueScore = perfScore / Math.pow(price, SCORING_CONFIG.priceExponent);

  return {
    raw:          perfScore,
    value:        valueScore,
    reliability:  _clamp(matches / 25, 0.1, 1.0),
    isGoalkeeper: true,
    excluded:     false
  };
}

// ─── CORE: calculateScore ─────────────────────────────────────────────────────
//
// Input:  oggetto player (struttura players.js)
// Output: oggetto con tutti i valori intermedi, oppure null se escluso
//
// I portieri seguono logica separata.

function calculateScore(player) {

  // ── Portieri ──
  if (player.role === 'POR') return _goalkeeperScore(player);

  const stats   = _getStats(player);
  const minutes = _estimateMinutes(stats);
  const price   = _safe(player.price_initial) || 1;

  // ── 1. RELIABILITY ──
  const reliability = _reliabilityFactor(minutes);
  if (reliability === null) {
    return { excluded: true, reason: `Minuti insufficienti (stima: ${minutes})` };
  }

  // ── Leggi i valori numerici rilevanti ──
  const xg     = _safe(stats.xg);       // xG totali (non per 90: sommiamo stagione)
  const xa     = _safe(stats.xa);       // xA totali
  const goals  = _safe(stats.goals);    // gol totali
  const assists= _safe(stats.assists);  // assist totali
  const shotsP90 = _safe(stats.shots_per90); // tiri per 90 (presente in stats_prev)

  // Per uniformità lavoriamo su valori per 90 stimati
  const minutesFactor = minutes / 90;  // presenze equivalenti da 90'
  const xgP90    = minutesFactor > 0 ? xg / minutesFactor     : 0;
  const xaP90    = minutesFactor > 0 ? xa / minutesFactor     : 0;
  const goalsP90 = minutesFactor > 0 ? goals / minutesFactor  : 0;
  const assP90   = minutesFactor > 0 ? assists / minutesFactor: 0;

  // ── 2. PERFORMANCE BASE ──
  // Score offensivo ponderato (non normalizzato qui, lo facciamo dopo)
  const w = SCORING_CONFIG.weights;
  const perfScore =
    xgP90    * w.xg     +
    xaP90    * w.xa     +
    goalsP90 * w.goals  +
    shotsP90 * w.shots  +
    assP90   * w.xa_raw;

  // ── 3. POTENTIAL BOOST ──
  // Premia i giocatori che hanno prodotto tanto in xG/xA ma pochi gol/assist
  // (stanno per "sbloccarsi" o sono stati sfortunati)
  const xgGap  = Math.max(0, xg - goals);    // xG non ancora convertiti
  const xaGap  = Math.max(0, xa - assists);  // xA non ancora convertiti
  // Normalizziamo per minuti (più minuti = gap più grande è normale)
  const potentialRaw = (xgGap * 0.65 + xaGap * 0.35) / Math.max(minutesFactor, 1);
  const potentialBoost = potentialRaw * SCORING_CONFIG.potentialBoostFactor;

  // ── 4. SCORE COMBINATO (prima del prezzo) ──
  const combinedScore = (perfScore + potentialBoost) * reliability;

  // ── 5. NORMALIZZAZIONE PER RUOLO ──
  // Porta lo score in un range comparabile tra ruoli (0–1 indicativo)
  const maxRaw = SCORING_CONFIG.maxRawScore[player.role] || 2.0;
  const normalizedScore = _clamp(combinedScore / maxRaw, 0, 1);

  // ── 6. VALUE SCORE ──
  // Score finale che premia giocatori economici con buoni numeri
  const valueScore = normalizedScore / Math.pow(price, SCORING_CONFIG.priceExponent);

  return {
    // ── Score finali ──
    normalized:   Math.round(normalizedScore * 100) / 100,  // 0–1
    value:        Math.round(valueScore * 10000) / 10000,   // score value (confrontabile)

    // ── Componenti intermedie (per explainScore) ──
    perfScore:      Math.round(perfScore * 1000) / 1000,
    potentialBoost: Math.round(potentialBoost * 1000) / 1000,
    potentialRaw:   Math.round(potentialRaw * 1000) / 1000,
    reliability:    Math.round(reliability * 100) / 100,
    combinedScore:  Math.round(combinedScore * 1000) / 1000,
    price,
    minutes,

    // ── Valori per 90 usati nel calcolo ──
    xgP90:    Math.round(xgP90 * 100) / 100,
    xaP90:    Math.round(xaP90 * 100) / 100,
    goalsP90: Math.round(goalsP90 * 100) / 100,
    assP90:   Math.round(assP90 * 100) / 100,
    shotsP90: Math.round(shotsP90 * 100) / 100,
    xgGap:    Math.round(xgGap * 10) / 10,
    xaGap:    Math.round(xaGap * 10) / 10,

    excluded: false,
    isGoalkeeper: false
  };
}

// ─── EXPLAIN SCORE ────────────────────────────────────────────────────────────
//
// Restituisce un oggetto leggibile con breakdown dello score.
// Pensato per essere mostrato in UI o console.
//
// Input:  oggetto player
// Output: oggetto con label, score totale, breakdown array, flags

function explainScore(player) {
  const result = calculateScore(player);

  if (!result) {
    return { name: player.name, excluded: true, reason: 'Nessun dato disponibile' };
  }

  if (result.excluded) {
    return {
      name:     player.name,
      team:     player.team,
      role:     player.role,
      price:    player.price_initial,
      excluded: true,
      reason:   result.reason
    };
  }

  // ── Portieri: output semplificato ──
  if (result.isGoalkeeper) {
    const stats = _getStats(player);
    return {
      name:       player.name,
      team:       player.team,
      role:       'POR',
      price:      player.price_initial,
      excluded:   false,
      normalized: Math.round(result.raw * 100) / 100,
      value:      Math.round(result.value * 10000) / 10000,
      breakdown:  [
        { label: '🧤 Fantavoto medio',  value: _safe(_getStats(player).fantavote).toFixed(2) },
        { label: '📋 Presenze',         value: _safe(stats.matches) },
        { label: '💰 Prezzo iniziale',  value: player.price_initial + ' cr' },
        { label: '⚡ Affidabilità',     value: (result.reliability * 100).toFixed(0) + '%' }
      ],
      verdict: _getVerdict(result.value, result.normalized, player.role)
    };
  }

  // ── Contributi percentuali sul perfScore ──
  const w = SCORING_CONFIG.weights;
  const perf = result.perfScore;
  const xgContrib    = perf > 0 ? (result.xgP90 * w.xg / perf * 100)    : 0;
  const xaContrib    = perf > 0 ? (result.xaP90 * w.xa / perf * 100)    : 0;
  const goalsContrib = perf > 0 ? (result.goalsP90 * w.goals / perf * 100) : 0;
  const shotsContrib = perf > 0 ? (result.shotsP90 * w.shots / perf * 100) : 0;
  const assContrib   = perf > 0 ? (result.assP90 * w.xa_raw / perf * 100) : 0;

  // ── Costruisci breakdown ──
  const breakdown = [
    {
      label:   '⚽ Contributo xG (per 90)',
      value:   result.xgP90.toFixed(2),
      weight:  (w.xg * 100).toFixed(0) + '%',
      contrib: xgContrib.toFixed(1) + '%'
    },
    {
      label:   '🎯 Contributo xA (per 90)',
      value:   result.xaP90.toFixed(2),
      weight:  (w.xa * 100).toFixed(0) + '%',
      contrib: xaContrib.toFixed(1) + '%'
    },
    {
      label:   '🥅 Gol per 90',
      value:   result.goalsP90.toFixed(2),
      weight:  (w.goals * 100).toFixed(0) + '%',
      contrib: goalsContrib.toFixed(1) + '%'
    },
    {
      label:   '👟 Assist per 90',
      value:   result.assP90.toFixed(2),
      weight:  (w.xa_raw * 100).toFixed(0) + '%',
      contrib: assContrib.toFixed(1) + '%'
    },
    {
      label:   '🔫 Tiri per 90',
      value:   result.shotsP90.toFixed(2),
      weight:  (w.shots * 100).toFixed(0) + '%',
      contrib: shotsContrib.toFixed(1) + '%'
    },
    {
      label: '🔮 Potential boost (xG/xA gap)',
      value: '+' + result.potentialBoost.toFixed(3),
      detail: `xG-gol: ${result.xgGap}, xA-assist: ${result.xaGap}`
    },
    {
      label: '⏱️ Affidabilità (minuti)',
      value: (result.reliability * 100).toFixed(0) + '%',
      detail: `~${result.minutes} min stimati`
    },
    {
      label: '💰 Impatto prezzo',
      value: player.price_initial + ' cr',
      detail: `÷ prezzo^${SCORING_CONFIG.priceExponent} = ×${(1 / Math.pow(player.price_initial, SCORING_CONFIG.priceExponent)).toFixed(4)}`
    }
  ];

  // ── Flags situazionali ──
  const flags = [];
  if (result.xgGap > 2)    flags.push('🍀 Potenziale nascosto: xG non convertiti (' + result.xgGap + ')');
  if (result.xaGap > 2)    flags.push('🎪 Assist mancati: xA non convertiti (' + result.xaGap + ')');
  if (result.reliability < 0.7) flags.push('⚠️ Bassa continuità: pochi minuti');
  if (player.on_penalties) flags.push('🎯 Rigorista: bonus sicuro sui penalty');
  if (player.tag === 'sleeper') flags.push('💎 Tag SLEEPER: già segnalato come undervalue');
  if (player.status === 'risk') flags.push('🟡 Ballottaggio: titolarità non garantita');
  if (player.injury_prone)  flags.push('🩹 Infortuni frequenti: rischio discontinuità');

  return {
    name:       player.name,
    team:       player.team,
    role:       player.role,
    price:      player.price_initial,
    excluded:   false,

    // Score finali
    normalized: result.normalized,  // 0–1, confrontabile per ruolo
    value:      result.value,        // score aggiustato per prezzo

    breakdown,
    flags,
    verdict: _getVerdict(result.value, result.normalized, player.role)
  };
}

// ─── HELPER: VERDICT ──────────────────────────────────────────────────────────
// Restituisce una stringa di giudizio leggibile basata sullo score

function _getVerdict(valueScore, normalizedScore, role) {
  // Le soglie per il value score dipendono dall'esponente prezzo e dal ruolo.
  // Calibrate empiricamente su un dataset di ~78 giocatori.
  const thresholds = {
    ATT: { gem: 0.025, good: 0.015, meh: 0.008 },
    CEN: { gem: 0.022, good: 0.013, meh: 0.007 },
    DIF: { gem: 0.018, good: 0.010, meh: 0.005 },
    POR: { gem: 0.020, good: 0.012, meh: 0.006 }
  };
  const t = thresholds[role] || thresholds.ATT;

  if (valueScore >= t.gem)  return '💎 GEM — undervalue eccezionale';
  if (valueScore >= t.good) return '✅ BUONO — buon rapporto qualità/prezzo';
  if (valueScore >= t.meh)  return '⚖️ NELLA MEDIA — prezzo in linea';
  return '⚠️ OVERVALUED — non conveniente al prezzo attuale';
}

// ─── RANK ALL PLAYERS ─────────────────────────────────────────────────────────
//
// Funzione di utilità: calcola lo score per tutti i giocatori e li restituisce
// ordinati per value score (dal più undervalued al meno).
//
// Input:  array di player (AppState.players)
// Output: array di { player, score, explanation } ordinato
//
// Uso: const ranking = rankPlayers(AppState.players);

function rankPlayers(players) {
  return players
    .map(function(player) {
      const score = calculateScore(player);
      const explanation = explainScore(player);
      return { player, score, explanation };
    })
    .filter(function(item) {
      return item.score && !item.score.excluded;
    })
    .sort(function(a, b) {
      return (b.score.value || 0) - (a.score.value || 0);
    });
}

// ─── RANK BY ROLE ─────────────────────────────────────────────────────────────
//
// Come rankPlayers, ma filtrato per ruolo.
// Utile per trovare i migliori undervalue per ciascun reparto.

function rankPlayersByRole(players, role) {
  return rankPlayers(players.filter(function(p) { return p.role === role; }));
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
// Rende le funzioni accessibili globalmente (come gli altri file dell'app)

window.Scoring = {
  calculateScore,
  explainScore,
  rankPlayers,
  rankPlayersByRole,
  SCORING_CONFIG
};

// ─── ESEMPIO DI UTILIZZO (decommentare in console per testare) ────────────────
/*

// Score singolo giocatore
const frattesi = window.PLAYERS.find(p => p.id === 'cen_004');
console.log(Scoring.calculateScore(frattesi));

// Spiegazione completa
const explain = Scoring.explainScore(frattesi);
console.log(explain.verdict);
explain.breakdown.forEach(b => console.log(b.label, '→', b.value));
explain.flags.forEach(f => console.log(f));

// Top 10 undervalue generali
const top10 = Scoring.rankPlayers(window.PLAYERS).slice(0, 10);
top10.forEach((item, i) => {
  console.log(`${i+1}. ${item.player.name} (${item.player.role}) | value: ${item.score.value} | ${item.explanation.verdict}`);
});

// Top 5 centrocampisti undervalue
const topCen = Scoring.rankPlayersByRole(window.PLAYERS, 'CEN').slice(0, 5);
topCen.forEach((item, i) => {
  console.log(`${i+1}. ${item.player.name} | score: ${item.score.normalized} | ${item.explanation.verdict}`);
});

*/
