// scoring.js — Undervalue Scoring Engine v4 per FantAssist
// Novita v4:
//   - Fusione stats_prev + stats_curr con peso dinamico
//     Le prime giornate della stagione corrente valgono poco,
//     ma segnalano trend. La stagione precedente fa da base solida.
//   - Fix caratteri rotti su Android (emoji via entita HTML o testo puro)
// Vanilla JS, zero dipendenze.

// ─── CONFIGURAZIONE ───────────────────────────────────────────────────────────

var SCORING_CONFIG = {

  weights: {
    xg:     0.35,
    xa:     0.25,
    goals:  0.20,
    shots:  0.10,
    xa_raw: 0.10
  },

  minMinutesHard: 300,
  minMinutesSoft: 600,

  // Smorzamento Bayesiano
  shrinkBase: 300,
  priorByRole: {
    ATT: { xg: 0.30, xa: 0.15, goals: 0.25, assists: 0.10, shots: 2.5 },
    CEN: { xg: 0.18, xa: 0.18, goals: 0.12, assists: 0.12, shots: 1.6 },
    DIF: { xg: 0.08, xa: 0.12, goals: 0.06, assists: 0.10, shots: 0.8 },
    POR: { xg: 0.00, xa: 0.00, goals: 0.00, assists: 0.00, shots: 0.0 }
  },

  // Fusione prev+curr (v4)
  // weightCurrMax = peso massimo che le giornate correnti possono avere (40%)
  // weightCurrPerMatch = quanto cresce il peso per ogni partita giocata
  // Con 4 partite: peso curr = min(4 * 0.08, 0.40) = 0.32 → prev = 0.68
  // Con 0 partite: peso curr = 0 → solo prev
  // Con 10+ partite: peso curr = 0.40 → prev = 0.60
  weightCurrMax:      0.40,
  weightCurrPerMatch: 0.08,

  potentialBoostFactor: 0.28,
  potentialMaxBoost:    0.40,

  priceExponent: 0.75,

  maxRawScore: {
    ATT: 1.6,
    CEN: 1.1,
    DIF: 0.75,
    POR: 0.0
  },

  priceTiers: [
    { label: 'Low',   min: 1,  max: 10   },
    { label: 'Mid',   min: 11, max: 20   },
    { label: 'High',  min: 21, max: 35   },
    { label: 'Elite', min: 36, max: 9999 }
  ]
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function _safe(val) {
  var n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function _clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function _estimateMinutes(stats) {
  if (stats && stats.minutes) return stats.minutes;
  return (stats ? _safe(stats.matches) : 0) * 80;
}

function _getPriceTier(price) {
  var tiers = SCORING_CONFIG.priceTiers;
  for (var i = 0; i < tiers.length; i++) {
    if (price >= tiers[i].min && price <= tiers[i].max) return tiers[i].label;
  }
  return 'Elite';
}

function _reliabilityFactor(minutes) {
  var hard = SCORING_CONFIG.minMinutesHard;
  var soft = SCORING_CONFIG.minMinutesSoft;
  if (minutes < hard) return null;
  if (minutes >= soft) return 1.0;
  var ratio = (minutes - hard) / (soft - hard);
  return 0.3 + ratio * ratio * 0.7;
}

function _shrink(observed, prior, minutes) {
  var base = SCORING_CONFIG.shrinkBase;
  return (observed * minutes + prior * base) / (minutes + base);
}

// ─── FUSIONE STATS (v4) ───────────────────────────────────────────────────────
//
// Restituisce un oggetto stats "fuso" che combina stagione precedente e corrente.
// Il peso della stagione corrente cresce con le partite giocate:
//   - 0 partite curr  → 100% prev
//   - 4 partite curr  → ~32% curr, 68% prev
//   - 10+ partite     → 40% curr, 60% prev (cap)
//
// Questo risolve il problema asta a inizio stagione: i dati prev sono la base,
// i dati curr aggiustano il segnale proporzionalmente a quanto sono affidabili.

function _mergeStats(player) {
  var prev = player.stats_prev || player.stats || {};
  var curr = player.stats_curr || null;

  // Se non ci sono dati correnti usa solo prev
  if (!curr || _safe(curr.matches) === 0) {
    return { stats: prev, minutesCurr: 0, weightCurr: 0, source: 'prev' };
  }

  var matchesCurr = _safe(curr.matches);
  var cfg         = SCORING_CONFIG;

  // Peso dinamico della stagione corrente
  var weightCurr = Math.min(matchesCurr * cfg.weightCurrPerMatch, cfg.weightCurrMax);
  var weightPrev = 1 - weightCurr;

  // Helper: media pesata sicura
  function mix(vPrev, vCurr) {
    return _safe(vPrev) * weightPrev + _safe(vCurr) * weightCurr;
  }

  // Minuti: prev completi + curr reali
  var minutesPrev = _estimateMinutes(prev);
  var minutesCurr = _estimateMinutes(curr);

  // Per i valori totali (xg, xa, gol, assist) calcoliamo il per90 di ciascuna
  // stagione e poi li fondiamo, perché le scale temporali sono diverse
  var mpPrev = minutesPrev / 90;
  var mpCurr = minutesCurr / 90;

  function toP90Prev(v) { return mpPrev > 0 ? _safe(v) / mpPrev : 0; }
  function toP90Curr(v) { return mpCurr > 0 ? _safe(v) / mpCurr : 0; }

  var xgP90   = mix(toP90Prev(prev.xg),      toP90Curr(curr.xg));
  var xaP90   = mix(toP90Prev(prev.xa),      toP90Curr(curr.xa));
  var gP90    = mix(toP90Prev(prev.goals),   toP90Curr(curr.goals));
  var aP90    = mix(toP90Prev(prev.assists), toP90Curr(curr.assists));
  var sP90    = mix(_safe(prev.shots_per90), _safe(curr.shots_per90 || prev.shots_per90));
  var fv      = mix(_safe(prev.fantavote),   _safe(curr.fantavote));
  var avgvote = mix(_safe(prev.avg_vote),    _safe(curr.avg_vote));

  // Per i totali stagionali (usati nel potential boost) usiamo solo prev
  // perché il gap xG-gol ha senso su una stagione intera, non su 4 partite
  var xgTot  = _safe(prev.xg);
  var xaTot  = _safe(prev.xa);
  var golTot = _safe(prev.goals);
  var astTot = _safe(prev.assists);

  // Minuti di riferimento per affidabilità: usiamo il maggiore tra i due
  // (prev è sempre più lungo, quindi è lui a determinare la reliability)
  var minutesRef = Math.max(minutesPrev, minutesPrev * weightPrev + minutesCurr * weightCurr);

  return {
    stats: {
      // Valori per90 già fusi — il calculateScore li userà direttamente
      _xgP90_merged:   xgP90,
      _xaP90_merged:   xaP90,
      _gP90_merged:    gP90,
      _aP90_merged:    aP90,
      _sP90_merged:    sP90,
      // Totali per potential boost (stagione precedente)
      xg:       xgTot,
      xa:       xaTot,
      goals:    golTot,
      assists:  astTot,
      shots_per90: sP90,
      // Meta
      fantavote: fv,
      avg_vote:  avgvote,
      matches:   _safe(prev.matches),
      _merged:   true
    },
    minutesRef:  minutesRef,
    minutesCurr: minutesCurr,
    matchesCurr: matchesCurr,
    weightCurr:  weightCurr,
    source:      weightCurr > 0 ? 'merged' : 'prev'
  };
}

// ─── SCORE PORTIERI ───────────────────────────────────────────────────────────

function _goalkeeperScore(player) {
  var merged  = _mergeStats(player);
  var stats   = merged.stats;
  var price   = _safe(player.price_initial) || 1;
  var fv      = _safe(stats.fantavote);
  var matches = _safe(stats.matches);
  var minutes = merged.minutesRef || _estimateMinutes(stats);

  if (matches < 4) return null;

  var fvShrunk    = _shrink(fv, 6.5, minutes);
  var perfScore   = _clamp((fvShrunk - 6.0) / 1.5, 0, 1);
  var reliability = _clamp(matches / 25, 0.1, 1.0);
  var valueScore  = (perfScore * reliability) / Math.pow(price, SCORING_CONFIG.priceExponent);
  var score100    = Math.round(_clamp(perfScore * reliability * 100, 0, 100));

  return {
    raw:          Math.round(perfScore * 100) / 100,
    value:        valueScore,
    reliability:  reliability,
    score100:     score100,
    priceTier:    _getPriceTier(price),
    weightCurr:   merged.weightCurr,
    source:       merged.source,
    isGoalkeeper: true,
    excluded:     false
  };
}

// ─── CORE: calculateScore ─────────────────────────────────────────────────────

function calculateScore(player) {
  if (player.role === 'POR') return _goalkeeperScore(player);

  var merged  = _mergeStats(player);
  var stats   = merged.stats;
  var minutes = merged.minutesRef || _estimateMinutes(stats);
  var price   = _safe(player.price_initial) || 1;
  var role    = player.role;

  var reliability = _reliabilityFactor(minutes);
  if (reliability === null) {
    return { excluded: true, reason: 'Minuti insufficienti (stima: ' + minutes + ')' };
  }

  var prior = SCORING_CONFIG.priorByRole[role] || SCORING_CONFIG.priorByRole.ATT;

  // Se le stats sono già fuse, usa i valori pre-calcolati
  // Altrimenti calcola i per90 dal grezzo
  var mf = minutes / 90;
  var xgP90Raw, xaP90Raw, goalsP90Raw, assP90Raw, shotsP90Raw;

  if (stats._merged) {
    xgP90Raw    = stats._xgP90_merged;
    xaP90Raw    = stats._xaP90_merged;
    goalsP90Raw = stats._gP90_merged;
    assP90Raw   = stats._aP90_merged;
    shotsP90Raw = stats._sP90_merged;
  } else {
    xgP90Raw    = mf > 0 ? _safe(stats.xg)      / mf : 0;
    xaP90Raw    = mf > 0 ? _safe(stats.xa)      / mf : 0;
    goalsP90Raw = mf > 0 ? _safe(stats.goals)   / mf : 0;
    assP90Raw   = mf > 0 ? _safe(stats.assists) / mf : 0;
    shotsP90Raw = _safe(stats.shots_per90);
  }

  // Smorzamento Bayesiano (opera sui per90 fusi)
  var xgP90    = _shrink(xgP90Raw,    prior.xg,      minutes);
  var xaP90    = _shrink(xaP90Raw,    prior.xa,      minutes);
  var goalsP90 = _shrink(goalsP90Raw, prior.goals,   minutes);
  var assP90   = _shrink(assP90Raw,   prior.assists, minutes);
  var shotsP90 = _shrink(shotsP90Raw, prior.shots,   minutes);

  var w = SCORING_CONFIG.weights;
  var perfScore =
    xgP90    * w.xg     +
    xaP90    * w.xa     +
    goalsP90 * w.goals  +
    shotsP90 * w.shots  +
    assP90   * w.xa_raw;

  // Potential boost: usa i totali della stagione prev (più affidabili)
  var xg      = _safe(stats.xg);
  var xa      = _safe(stats.xa);
  var goals   = _safe(stats.goals);
  var assists = _safe(stats.assists);
  var xgGap   = Math.max(0, xg - goals);
  var xaGap   = Math.max(0, xa - assists);
  var xgRatio = xg > 0.5 ? xgGap / xg : 0;
  var xaRatio = xa > 0.5 ? xaGap / xa : 0;
  var potentialRaw   = (xgRatio * 0.65 + xaRatio * 0.35) * perfScore;
  var potentialBoost = _clamp(
    potentialRaw * SCORING_CONFIG.potentialBoostFactor,
    0,
    perfScore * SCORING_CONFIG.potentialMaxBoost
  );

  var combinedScore   = (perfScore + potentialBoost) * reliability;
  var maxRaw          = SCORING_CONFIG.maxRawScore[role] || 1.6;
  var normalizedScore = _clamp(combinedScore / maxRaw, 0, 1);
  var valueScore      = normalizedScore / Math.pow(price, SCORING_CONFIG.priceExponent);
  var score100        = Math.round(normalizedScore * 100);

  return {
    normalized:     Math.round(normalizedScore * 100) / 100,
    score100:       score100,
    value:          Math.round(valueScore * 10000) / 10000,
    perfScore:      Math.round(perfScore * 1000) / 1000,
    potentialBoost: Math.round(potentialBoost * 1000) / 1000,
    reliability:    Math.round(reliability * 100) / 100,
    combinedScore:  Math.round(combinedScore * 1000) / 1000,
    xgP90:          Math.round(xgP90 * 100) / 100,
    xaP90:          Math.round(xaP90 * 100) / 100,
    goalsP90:       Math.round(goalsP90 * 100) / 100,
    assP90:         Math.round(assP90 * 100) / 100,
    shotsP90:       Math.round(shotsP90 * 100) / 100,
    xgGap:          Math.round(xgGap * 10) / 10,
    xaGap:          Math.round(xaGap * 10) / 10,
    xgRatio:        Math.round(xgRatio * 100),
    xaRatio:        Math.round(xaRatio * 100),
    price:          price,
    minutes:        minutes,
    priceTier:      _getPriceTier(price),
    weightCurr:     merged.weightCurr,
    matchesCurr:    merged.matchesCurr || 0,
    source:         merged.source,
    excluded:       false,
    isGoalkeeper:   false
  };
}

// ─── FASCE PREZZO + PERCENTILE ────────────────────────────────────────────────

function computeTierRankings(players) {
  var map    = {};
  var byTier = {};

  players.forEach(function(p) {
    var sc = calculateScore(p);
    if (!sc || sc.excluded) return;
    var tier = _getPriceTier(_safe(p.price_initial));
    if (!byTier[tier]) byTier[tier] = [];
    byTier[tier].push({ id: p.id, value: sc.value || 0, score100: sc.score100 || 0 });
  });

  Object.keys(byTier).forEach(function(tier) {
    var arr = byTier[tier].sort(function(a, b) { return b.value - a.value; });
    var n   = arr.length;
    arr.forEach(function(item, idx) {
      var rank = idx + 1;
      var pct  = Math.round(((n - idx) / n) * 100);
      map[item.id] = {
        tier:      tier,
        tierRank:  rank,
        tierTotal: n,
        tierPct:   pct,
        tierLabel: _tierPctLabel(pct)
      };
    });
  });

  return map;
}

function _tierPctLabel(pct) {
  if (pct >= 90) return 'Top 10% fascia';
  if (pct >= 75) return 'Top 25% fascia';
  if (pct >= 50) return 'Nella media fascia';
  return 'Sotto media fascia';
}

// ─── EXPLAIN SCORE ────────────────────────────────────────────────────────────

function explainScore(player, tierMap) {
  var result = calculateScore(player);
  tierMap    = tierMap || null;

  if (!result) {
    return { name: player.name, excluded: true, reason: 'Nessun dato disponibile' };
  }
  if (result.excluded) {
    return { name: player.name, team: player.team, role: player.role, price: player.price_initial, excluded: true, reason: result.reason };
  }

  var tierInfo = tierMap ? (tierMap[player.id] || null) : null;

  // Etichetta fonte dati per mostrare in UI
  var sourceLabel = result.source === 'merged'
    ? 'prev + curr (' + Math.round(result.weightCurr * 100) + '% giornate ' + result.matchesCurr + ')'
    : 'stagione precedente';

  // ── Portieri ──
  if (result.isGoalkeeper) {
    var merged = _mergeStats(player);
    var stats  = merged.stats;
    var label  = _getLabel(result.score100, 'POR');
    return {
      name:        player.name,
      team:        player.team,
      role:        'POR',
      price:       player.price_initial,
      excluded:    false,
      normalized:  result.raw,
      score100:    result.score100,
      value:       result.value,
      label:       label,
      verdict:     _getVerdict(result.value, result.raw, 'POR'),
      verdictFull: _getVerdictFull(result.score100, 'POR'),
      tierInfo:    tierInfo,
      breakdown: [
        { label: 'Fantavoto medio',  value: _safe(stats.fantavote).toFixed(2), detail: 'smorzato verso 6.5 su sample piccoli' },
        { label: 'Presenze',         value: String(_safe(stats.matches)),       detail: 'stagione di riferimento' },
        { label: 'Prezzo iniziale',  value: player.price_initial + ' cr',       detail: 'quotazione asta' },
        { label: 'Affidabilita',     value: (result.reliability * 100).toFixed(0) + '%', detail: 'integrata nel calcolo' },
        { label: 'Fonte dati',       value: sourceLabel }
      ],
      flags: _buildGoalkeeperFlags(player, result)
    };
  }

  // ── Outfielders ──
  var w    = SCORING_CONFIG.weights;
  var perf = result.perfScore > 0 ? result.perfScore : 0.001;
  var label = _getLabel(result.score100, player.role);

  var xgContrib    = result.xgP90    * w.xg     / perf * 100;
  var xaContrib    = result.xaP90    * w.xa     / perf * 100;
  var goalsContrib = result.goalsP90 * w.goals  / perf * 100;
  var shotsContrib = result.shotsP90 * w.shots  / perf * 100;
  var assContrib   = result.assP90   * w.xa_raw / perf * 100;

  // Nota: tutti i label sono testo puro senza emoji per evitare corruzione su Android
  // Le emoji sono gestite solo nella UI (ui.js) dove vengono inserite come entita HTML
  var breakdown = [
    { label: 'xG per 90',     value: result.xgP90.toFixed(2),    weight: (w.xg*100).toFixed(0)+'%',     contrib: xgContrib.toFixed(1)+'%',    detail: 'smorzato su sample piccoli - predittore principale' },
    { label: 'xA per 90',     value: result.xaP90.toFixed(2),    weight: (w.xa*100).toFixed(0)+'%',     contrib: xaContrib.toFixed(1)+'%',    detail: 'assist attesi per 90 min (smorzato)' },
    { label: 'Gol per 90',    value: result.goalsP90.toFixed(2), weight: (w.goals*100).toFixed(0)+'%', contrib: goalsContrib.toFixed(1)+'%', detail: 'gol reali per 90 min (smorzato)' },
    { label: 'Assist per 90', value: result.assP90.toFixed(2),   weight: (w.xa_raw*100).toFixed(0)+'%',contrib: assContrib.toFixed(1)+'%',   detail: 'assist reali per 90 min (smorzato)' },
    { label: 'Tiri per 90',   value: result.shotsP90.toFixed(2), weight: (w.shots*100).toFixed(0)+'%', contrib: shotsContrib.toFixed(1)+'%', detail: 'volume offensivo (smorzato)' },
    {
      label: 'Potential boost',
      value: '+' + result.potentialBoost.toFixed(3),
      detail: result.xgRatio > 0 || result.xaRatio > 0
        ? result.xgRatio + '% xG non convertiti - ' + result.xaRatio + '% xA non convertiti'
        : 'nessun gap significativo'
    },
    {
      label: 'Affidabilita',
      value: (result.reliability * 100).toFixed(0) + '%',
      detail: '~' + result.minutes + ' min - integrata nel calcolo'
    },
    {
      label: 'Impatto prezzo',
      value: player.price_initial + ' cr',
      detail: 'fascia ' + result.priceTier + ' - divisore prezzo^' + SCORING_CONFIG.priceExponent
    },
    {
      label: 'Fonte dati',
      value: sourceLabel,
      detail: result.source === 'merged'
        ? 'stagione prev (base) + giornate correnti (segnale)'
        : 'solo stagione precedente'
    }
  ];

  var flags = [];
  if (result.xgRatio > 30)       flags.push(result.xgRatio + '% xG non convertiti - puo sbloccarsi');
  if (result.xaRatio > 30)       flags.push(result.xaRatio + '% xA non convertiti - assist in arrivo');
  if (result.reliability < 0.65) flags.push('Pochi minuti - campione parziale, smorzamento attivo');
  if (player.on_penalties)       flags.push('Rigorista - bonus penalty garantiti');
  if (player.tag === 'sleeper')  flags.push('Tag SLEEPER - gia segnalato come undervalue');
  if (player.status === 'risk')  flags.push('Ballottaggio - titolarita incerta');
  if (player.injury_prone)       flags.push('Infortuni frequenti - rischio discontinuita');

  return {
    name:        player.name,
    team:        player.team,
    role:        player.role,
    price:       player.price_initial,
    excluded:    false,
    normalized:  result.normalized,
    score100:    result.score100,
    value:       result.value,
    label:       label,
    verdict:     _getVerdict(result.value, result.normalized, player.role),
    verdictFull: _getVerdictFull(result.score100, player.role),
    tierInfo:    tierInfo,
    breakdown:   breakdown,
    flags:       flags
  };
}

function _buildGoalkeeperFlags(player, result) {
  var flags = [];
  if (result.reliability < 0.5) flags.push('Poche presenze - campione limitato');
  if (player.status === 'risk') flags.push('Ballottaggio - titolarita incerta');
  if (player.injury_prone)      flags.push('Infortuni frequenti');
  if (player.tag === 'sleeper') flags.push('Tag SLEEPER');
  return flags;
}

// ─── LABEL QUALITATIVE ────────────────────────────────────────────────────────

function _getLabel(score100, role) {
  var t = {
    ATT: { elite: 72, ottimo: 52, buono: 35, medio: 18 },
    CEN: { elite: 68, ottimo: 48, buono: 32, medio: 16 },
    DIF: { elite: 60, ottimo: 42, buono: 28, medio: 14 },
    POR: { elite: 65, ottimo: 45, buono: 30, medio: 15 }
  };
  var r = t[role] || t.ATT;
  // Testo puro: le emoji vengono aggiunte dalla UI
  if (score100 >= r.elite)  return 'Elite';
  if (score100 >= r.ottimo) return 'Ottimo affare';
  if (score100 >= r.buono)  return 'Buono';
  if (score100 >= r.medio)  return 'Medio';
  return 'Scarso';
}

// ─── VERDICT ──────────────────────────────────────────────────────────────────

function _getVerdict(valueScore, normalizedScore, role) {
  var t = { ATT:{gem:0.025,good:0.015,meh:0.008}, CEN:{gem:0.022,good:0.013,meh:0.007}, DIF:{gem:0.018,good:0.010,meh:0.005}, POR:{gem:0.020,good:0.012,meh:0.006} };
  var r = t[role] || t.ATT;
  if (valueScore >= r.gem)  return 'GEM';
  if (valueScore >= r.good) return 'BUONO';
  if (valueScore >= r.meh)  return 'MEDIA';
  return 'CARO';
}

function _getVerdictFull(score100, role) {
  return _getLabel(score100, role);
}

// ─── RANK ─────────────────────────────────────────────────────────────────────

function rankPlayers(players) {
  var tierMap = computeTierRankings(players);
  return players
    .map(function(p) {
      var score       = calculateScore(p);
      var explanation = explainScore(p, tierMap);
      return { player: p, score: score, explanation: explanation };
    })
    .filter(function(item) { return item.score && !item.score.excluded; })
    .sort(function(a, b) { return (b.score.value || 0) - (a.score.value || 0); });
}

function rankPlayersByRole(players, role) {
  return rankPlayers(players.filter(function(p) { return p.role === role; }));
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

window.Scoring = {
  calculateScore:      calculateScore,
  explainScore:        explainScore,
  rankPlayers:         rankPlayers,
  rankPlayersByRole:   rankPlayersByRole,
  computeTierRankings: computeTierRankings,
  getVerdict:          _getVerdict,
  getVerdictFull:      _getVerdictFull,
  getLabel:            _getLabel,
  SCORING_CONFIG:      SCORING_CONFIG
};
