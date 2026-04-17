// scoring.js — Undervalue Scoring Engine per FantAssist
// Compatibile con la struttura dati players.js (stats_prev / stats_curr)
// Logica: identifica giocatori con alto potenziale e basso prezzo
// Nessuna dipendenza esterna. Vanilla JS puro.

// ─── CONFIGURAZIONE PESI ──────────────────────────────────────────────────────
var SCORING_CONFIG = {
  weights: {
    xg:     0.35,
    xa:     0.25,
    goals:  0.20,
    shots:  0.10,
    xa_raw: 0.10
  },
  minMinutesHard:       300,
  minMinutesSoft:       600,
  potentialBoostFactor: 0.35,
  priceExponent:        0.75,
  maxRawScore: {
    ATT: 2.8,
    CEN: 2.0,
    DIF: 1.4,
    POR: 0.0
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function _getStats(player) {
  if (player.stats_curr && player.stats_curr.matches > 0) return player.stats_curr;
  if (player.stats_prev) return player.stats_prev;
  return player.stats || {};
}

function _estimateMinutes(stats) {
  if (stats.minutes) return stats.minutes;
  return (stats.matches || 0) * 80;
}

function _safe(val) {
  var n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function _clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function _reliabilityFactor(minutes) {
  var hard = SCORING_CONFIG.minMinutesHard;
  var soft = SCORING_CONFIG.minMinutesSoft;
  if (minutes < hard) return null;
  if (minutes >= soft) return 1.0;
  var ratio = (minutes - hard) / (soft - hard);
  return 0.4 + ratio * 0.6;
}

// ─── SCORE PORTIERI ───────────────────────────────────────────────────────────

function _goalkeeperScore(player) {
  var stats   = _getStats(player);
  var price   = _safe(player.price_initial) || 1;
  var fv      = _safe(stats.fantavote);
  var matches = _safe(stats.matches);

  if (matches < 4) return null;

  var perfScore  = _clamp((fv - 6.0) / 1.5, 0, 1);
  var valueScore = perfScore / Math.pow(price, SCORING_CONFIG.priceExponent);

  return {
    raw:          perfScore,
    value:        valueScore,
    reliability:  _clamp(matches / 25, 0.1, 1.0),
    isGoalkeeper: true,
    excluded:     false
  };
}

// ─── CORE: calculateScore ─────────────────────────────────────────────────────

function calculateScore(player) {
  if (player.role === 'POR') return _goalkeeperScore(player);

  var stats   = _getStats(player);
  var minutes = _estimateMinutes(stats);
  var price   = _safe(player.price_initial) || 1;

  var reliability = _reliabilityFactor(minutes);
  if (reliability === null) {
    return { excluded: true, reason: 'Minuti insufficienti (stima: ' + minutes + ')' };
  }

  var xg       = _safe(stats.xg);
  var xa       = _safe(stats.xa);
  var goals    = _safe(stats.goals);
  var assists  = _safe(stats.assists);
  var shotsP90 = _safe(stats.shots_per90);

  var minutesFactor = minutes / 90;
  var xgP90    = minutesFactor > 0 ? xg / minutesFactor      : 0;
  var xaP90    = minutesFactor > 0 ? xa / minutesFactor      : 0;
  var goalsP90 = minutesFactor > 0 ? goals / minutesFactor   : 0;
  var assP90   = minutesFactor > 0 ? assists / minutesFactor : 0;

  var w = SCORING_CONFIG.weights;
  var perfScore =
    xgP90    * w.xg     +
    xaP90    * w.xa     +
    goalsP90 * w.goals  +
    shotsP90 * w.shots  +
    assP90   * w.xa_raw;

  var xgGap          = Math.max(0, xg - goals);
  var xaGap          = Math.max(0, xa - assists);
  var potentialRaw   = (xgGap * 0.65 + xaGap * 0.35) / Math.max(minutesFactor, 1);
  var potentialBoost = potentialRaw * SCORING_CONFIG.potentialBoostFactor;

  var combinedScore   = (perfScore + potentialBoost) * reliability;
  var maxRaw          = SCORING_CONFIG.maxRawScore[player.role] || 2.0;
  var normalizedScore = _clamp(combinedScore / maxRaw, 0, 1);
  var valueScore      = normalizedScore / Math.pow(price, SCORING_CONFIG.priceExponent);

  return {
    normalized:     Math.round(normalizedScore * 100) / 100,
    value:          Math.round(valueScore * 10000) / 10000,
    perfScore:      Math.round(perfScore * 1000) / 1000,
    potentialBoost: Math.round(potentialBoost * 1000) / 1000,
    potentialRaw:   Math.round(potentialRaw * 1000) / 1000,
    reliability:    Math.round(reliability * 100) / 100,
    combinedScore:  Math.round(combinedScore * 1000) / 1000,
    price:          price,
    minutes:        minutes,
    xgP90:          Math.round(xgP90 * 100) / 100,
    xaP90:          Math.round(xaP90 * 100) / 100,
    goalsP90:       Math.round(goalsP90 * 100) / 100,
    assP90:         Math.round(assP90 * 100) / 100,
    shotsP90:       Math.round(shotsP90 * 100) / 100,
    xgGap:          Math.round(xgGap * 10) / 10,
    xaGap:          Math.round(xaGap * 10) / 10,
    excluded:       false,
    isGoalkeeper:   false
  };
}

// ─── EXPLAIN SCORE ────────────────────────────────────────────────────────────

function explainScore(player) {
  var result = calculateScore(player);

  if (!result) {
    return { name: player.name, excluded: true, reason: 'Nessun dato disponibile' };
  }
  if (result.excluded) {
    return { name: player.name, team: player.team, role: player.role, price: player.price_initial, excluded: true, reason: result.reason };
  }

  // ── Portieri ──
  if (result.isGoalkeeper) {
    var stats = _getStats(player);
    return {
      name:       player.name,
      team:       player.team,
      role:       'POR',
      price:      player.price_initial,
      excluded:   false,
      normalized: Math.round(result.raw * 100) / 100,
      value:      Math.round(result.value * 10000) / 10000,
      breakdown: [
        { label: '🧤 Fantavoto medio', value: _safe(stats.fantavote).toFixed(2), detail: 'proxy affidabilità portiere' },
        { label: '📋 Presenze',        value: String(_safe(stats.matches)),       detail: 'stagione di riferimento' },
        { label: '💰 Prezzo iniziale', value: player.price_initial + ' cr',       detail: 'quotazione asta' },
        { label: '⚡ Affidabilità',    value: (result.reliability * 100).toFixed(0) + '%', detail: 'basata su presenze' }
      ],
      flags:   _buildGoalkeeperFlags(player, result),
      verdict: _getVerdict(result.value, result.raw, 'POR'),
      verdictFull: _getVerdictFull(result.value, result.raw, 'POR')
    };
  }

  // ── Outfielders ──
  var w    = SCORING_CONFIG.weights;
  var perf = result.perfScore > 0 ? result.perfScore : 0.001;

  var xgContrib    = result.xgP90    * w.xg     / perf * 100;
  var xaContrib    = result.xaP90    * w.xa     / perf * 100;
  var goalsContrib = result.goalsP90 * w.goals  / perf * 100;
  var shotsContrib = result.shotsP90 * w.shots  / perf * 100;
  var assContrib   = result.assP90   * w.xa_raw / perf * 100;

  var breakdown = [
    { label: '⚽ xG per 90',    value: result.xgP90.toFixed(2),    weight: (w.xg*100).toFixed(0)+'%',     contrib: xgContrib.toFixed(1)+'%',    detail: 'gol attesi per 90 min — predittore principale' },
    { label: '🎯 xA per 90',    value: result.xaP90.toFixed(2),    weight: (w.xa*100).toFixed(0)+'%',     contrib: xaContrib.toFixed(1)+'%',    detail: 'assist attesi per 90 min' },
    { label: '🥅 Gol per 90',   value: result.goalsP90.toFixed(2), weight: (w.goals*100).toFixed(0)+'%', contrib: goalsContrib.toFixed(1)+'%', detail: 'gol reali per 90 min' },
    { label: '👟 Assist per 90',value: result.assP90.toFixed(2),   weight: (w.xa_raw*100).toFixed(0)+'%',contrib: assContrib.toFixed(1)+'%',   detail: 'assist reali per 90 min' },
    { label: '🔫 Tiri per 90',  value: result.shotsP90.toFixed(2), weight: (w.shots*100).toFixed(0)+'%', contrib: shotsContrib.toFixed(1)+'%', detail: 'volume offensivo' },
    { label: '🔮 Potential boost', value: '+' + result.potentialBoost.toFixed(3), detail: 'xG non convertiti: ' + result.xgGap + ' · xA non convertiti: ' + result.xaGap },
    { label: '⏱️ Affidabilità',    value: (result.reliability * 100).toFixed(0) + '%', detail: '~' + result.minutes + ' min stimati' },
    { label: '💰 Impatto prezzo',  value: player.price_initial + ' cr', detail: 'divisore prezzo^' + SCORING_CONFIG.priceExponent + ' = ×' + (1 / Math.pow(player.price_initial, SCORING_CONFIG.priceExponent)).toFixed(4) }
  ];

  var flags = [];
  if (result.xgGap > 2)         flags.push('🍀 xG non convertiti (' + result.xgGap + ') — può sbloccarsi');
  if (result.xaGap > 2)         flags.push('🎪 xA non convertiti (' + result.xaGap + ') — assist in arrivo');
  if (result.reliability < 0.7) flags.push('⚠️ Pochi minuti — campione limitato');
  if (player.on_penalties)      flags.push('🎯 Rigorista — bonus penalty garantiti');
  if (player.tag === 'sleeper') flags.push('💎 Tag SLEEPER — già segnalato come undervalue');
  if (player.status === 'risk') flags.push('🟡 Ballottaggio — titolarità incerta');
  if (player.injury_prone)      flags.push('🩹 Infortuni frequenti — rischio discontinuità');

  return {
    name:        player.name,
    team:        player.team,
    role:        player.role,
    price:       player.price_initial,
    excluded:    false,
    normalized:  result.normalized,
    value:       result.value,
    breakdown:   breakdown,
    flags:       flags,
    verdict:     _getVerdict(result.value, result.normalized, player.role),
    verdictFull: _getVerdictFull(result.value, result.normalized, player.role)
  };
}

function _buildGoalkeeperFlags(player, result) {
  var flags = [];
  if (result.reliability < 0.5) flags.push('⚠️ Poche presenze — campione limitato');
  if (player.status === 'risk') flags.push('🟡 Ballottaggio — titolarità incerta');
  if (player.injury_prone)      flags.push('🩹 Infortuni frequenti');
  if (player.tag === 'sleeper') flags.push('💎 Tag SLEEPER');
  return flags;
}

// ─── VERDICT ──────────────────────────────────────────────────────────────────

function _getVerdict(valueScore, normalizedScore, role) {
  var t = { ATT:{gem:0.025,good:0.015,meh:0.008}, CEN:{gem:0.022,good:0.013,meh:0.007}, DIF:{gem:0.018,good:0.010,meh:0.005}, POR:{gem:0.020,good:0.012,meh:0.006} };
  var r = t[role] || t.ATT;
  if (valueScore >= r.gem)  return '💎 GEM';
  if (valueScore >= r.good) return '✅ BUONO';
  if (valueScore >= r.meh)  return '⚖️ MEDIA';
  return '⚠️ CARO';
}

function _getVerdictFull(valueScore, normalizedScore, role) {
  var t = { ATT:{gem:0.025,good:0.015,meh:0.008}, CEN:{gem:0.022,good:0.013,meh:0.007}, DIF:{gem:0.018,good:0.010,meh:0.005}, POR:{gem:0.020,good:0.012,meh:0.006} };
  var r = t[role] || t.ATT;
  if (valueScore >= r.gem)  return '💎 GEM — undervalue eccezionale';
  if (valueScore >= r.good) return '✅ BUONO — buon rapporto qualità/prezzo';
  if (valueScore >= r.meh)  return '⚖️ NELLA MEDIA — prezzo in linea';
  return '⚠️ OVERVALUED — non conveniente';
}

// ─── RANK ─────────────────────────────────────────────────────────────────────

function rankPlayers(players) {
  return players
    .map(function(p) { return { player: p, score: calculateScore(p), explanation: explainScore(p) }; })
    .filter(function(item) { return item.score && !item.score.excluded; })
    .sort(function(a, b) { return (b.score.value || 0) - (a.score.value || 0); });
}

function rankPlayersByRole(players, role) {
  return rankPlayers(players.filter(function(p) { return p.role === role; }));
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

window.Scoring = {
  calculateScore:    calculateScore,
  explainScore:      explainScore,
  rankPlayers:       rankPlayers,
  rankPlayersByRole: rankPlayersByRole,
  getVerdict:        _getVerdict,
  getVerdictFull:    _getVerdictFull,
  SCORING_CONFIG:    SCORING_CONFIG
};
