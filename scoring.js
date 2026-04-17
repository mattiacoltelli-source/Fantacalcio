// scoring.js — Undervalue Scoring Engine v3 per FantAssist
// Miglioramenti v3:
//   1. Smorzamento su sample piccoli (Bayesian shrinkage) — elimina falsi positivi
//   2. Reliability integrata nella formula (non solo informativa)
//   3. Potential boost più preciso (pesa xG gap per volume, non solo differenza)
//   4. Score normalizzato 0–100 (leggibile)
//   5. Fasce prezzo + ranking relativo dentro la fascia
//   6. Etichette qualitative: Elite / Ottimo / Buono / Medio / Scarso
// Vanilla JS, zero dipendenze.

//  CONFIGURAZIONE 

var SCORING_CONFIG = {

  // Pesi performance offensiva
  // xG e xA pesano di più: vogliamo potenziale, non storia
  weights: {
    xg:     0.35,
    xa:     0.25,
    goals:  0.20,
    shots:  0.10,
    xa_raw: 0.10
  },

  // Soglie minuti — sotto hard: escluso; tra hard e soft: penalità
  minMinutesHard: 300,
  minMinutesSoft: 600,

  // Smorzamento Bayesiano (v3)
  // Quando il sample è piccolo, tiriamo i valori per90 verso la media "prior"
  // prior = valore tipico atteso per ruolo. Più è alto shrinkFactor, più forte lo smorzamento.
  // shrinkBase = minuti equivalenti "prior" (300 = equivalente a ~3-4 partite complete)
  shrinkBase: 300,
  priorByRole: {
    // xgP90, xaP90, goalsP90, assP90, shotsP90
    ATT: { xg: 0.30, xa: 0.15, goals: 0.25, assists: 0.10, shots: 2.5 },
    CEN: { xg: 0.18, xa: 0.18, goals: 0.12, assists: 0.12, shots: 1.6 },
    DIF: { xg: 0.08, xa: 0.12, goals: 0.06, assists: 0.10, shots: 0.8 },
    POR: { xg: 0.00, xa: 0.00, goals: 0.00, assists: 0.00, shots: 0.0 }
  },

  // Potential boost (v3)
  // Il gap xG-gol viene pesato anche per il volume: un gap su 2 gol attesi
  // è più significativo di un gap su 20. Usiamo ratio invece di differenza assoluta.
  potentialBoostFactor: 0.28,
  potentialMaxBoost:    0.40,  // cap: il boost non può superare il 40% del perfScore

  // Value score
  priceExponent: 0.75,

  // Normalizzazione per ruolo (massimi attesi con formula v3)
  maxRawScore: {
    ATT: 1.6,
    CEN: 1.1,
    DIF: 0.75,
    POR: 0.0
  },

  // Fasce prezzo (in crediti fantacalcio)
  priceTiers: [
    { label: 'Low',    min: 1,  max: 10  },
    { label: 'Mid',    min: 11, max: 20  },
    { label: 'High',   min: 21, max: 35  },
    { label: 'Elite',  min: 36, max: 9999}
  ]
};

//  HELPERS 

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

// Reliability: penalità progressiva sotto minMinutesSoft
// v3: curva quadratica invece di lineare — penalizza più aggressivamente i sample piccoli
function _reliabilityFactor(minutes) {
  var hard = SCORING_CONFIG.minMinutesHard;
  var soft = SCORING_CONFIG.minMinutesSoft;
  if (minutes < hard) return null;
  if (minutes >= soft) return 1.0;
  var ratio = (minutes - hard) / (soft - hard);
  // Curva quadratica: sale più lentamente vicino a hard, più velocemente vicino a soft
  return 0.3 + ratio * ratio * 0.7;
}

// Smorzamento Bayesiano (v3)
// Restituisce un valore per90 smorzato verso il prior del ruolo
// Formula: (observed * minutes + prior * shrinkBase) / (minutes + shrinkBase)
// Con minutes piccoli  tende al prior. Con minutes grandi  tende all'osservato.
function _shrink(observed, prior, minutes) {
  var base = SCORING_CONFIG.shrinkBase;
  return (observed * minutes + prior * base) / (minutes + base);
}

// Fascia prezzo del giocatore
function _getPriceTier(price) {
  var tiers = SCORING_CONFIG.priceTiers;
  for (var i = 0; i < tiers.length; i++) {
    if (price >= tiers[i].min && price <= tiers[i].max) return tiers[i].label;
  }
  return 'Elite';
}

//  SCORE PORTIERI 

function _goalkeeperScore(player) {
  var stats   = _getStats(player);
  var price   = _safe(player.price_initial) || 1;
  var fv      = _safe(stats.fantavote);
  var matches = _safe(stats.matches);
  var minutes = _estimateMinutes(stats);

  if (matches < 4) return null;

  // Smorzamento anche per portieri: fv verso prior di 6.5 su sample piccoli
  var fvShrunk   = _shrink(fv, 6.5, minutes);
  var perfScore  = _clamp((fvShrunk - 6.0) / 1.5, 0, 1);
  var reliability = _clamp(matches / 25, 0.1, 1.0);
  var valueScore  = (perfScore * reliability) / Math.pow(price, SCORING_CONFIG.priceExponent);

  // Score 0–100
  var score100 = Math.round(_clamp(perfScore * reliability * 100, 0, 100));

  return {
    raw:          Math.round(perfScore * 100) / 100,
    value:        valueScore,
    reliability:  reliability,
    score100:     score100,
    priceTier:    _getPriceTier(price),
    isGoalkeeper: true,
    excluded:     false
  };
}

//  CORE: calculateScore 

function calculateScore(player) {
  if (player.role === 'POR') return _goalkeeperScore(player);

  var stats   = _getStats(player);
  var minutes = _estimateMinutes(stats);
  var price   = _safe(player.price_initial) || 1;
  var role    = player.role;

  var reliability = _reliabilityFactor(minutes);
  if (reliability === null) {
    return { excluded: true, reason: 'Minuti insufficienti (stima: ' + minutes + ')' };
  }

  var prior = SCORING_CONFIG.priorByRole[role] || SCORING_CONFIG.priorByRole.ATT;

  // Valori grezzi stagionali
  var xg      = _safe(stats.xg);
  var xa      = _safe(stats.xa);
  var goals   = _safe(stats.goals);
  var assists = _safe(stats.assists);

  // Per90 grezzi
  var mf = minutes / 90;
  var xgP90Raw    = mf > 0 ? xg / mf      : 0;
  var xaP90Raw    = mf > 0 ? xa / mf      : 0;
  var goalsP90Raw = mf > 0 ? goals / mf   : 0;
  var assP90Raw   = mf > 0 ? assists / mf : 0;
  var shotsP90Raw = _safe(stats.shots_per90);

  //  v3: Smorzamento Bayesiano 
  // I valori per90 vengono tirati verso il prior del ruolo
  // proporzionalmente ai minuti giocati. Sample piccoli  più smorzamento.
  var xgP90    = _shrink(xgP90Raw,    prior.xg,      minutes);
  var xaP90    = _shrink(xaP90Raw,    prior.xa,      minutes);
  var goalsP90 = _shrink(goalsP90Raw, prior.goals,   minutes);
  var assP90   = _shrink(assP90Raw,   prior.assists, minutes);
  var shotsP90 = _shrink(shotsP90Raw, prior.shots,   minutes);

  //  Performance score 
  var w = SCORING_CONFIG.weights;
  var perfScore =
    xgP90    * w.xg     +
    xaP90    * w.xa     +
    goalsP90 * w.goals  +
    shotsP90 * w.shots  +
    assP90   * w.xa_raw;

  //  v3: Potential boost migliorato 
  // Usa il RATIO tra gap e volume atteso (non la differenza assoluta)
  // Questo evita che gap grandi su volumi grandi pesino troppo
  var xgGap  = Math.max(0, xg - goals);
  var xaGap  = Math.max(0, xa - assists);
  // Normalizzo il gap rispetto all'xG/xA totale (evita boost infiniti su pochi dati)
  var xgRatio = xg > 0.5 ? xgGap / xg : 0;  // % di xG non convertiti
  var xaRatio = xa > 0.5 ? xaGap / xa : 0;  // % di xA non convertiti
  var potentialRaw   = (xgRatio * 0.65 + xaRatio * 0.35) * perfScore;
  var potentialBoost = _clamp(
    potentialRaw * SCORING_CONFIG.potentialBoostFactor,
    0,
    perfScore * SCORING_CONFIG.potentialMaxBoost
  );

  //  Score combinato con reliability integrata 
  // v3: reliability moltiplica tutto (non solo alla fine)
  //  un giocatore con pochi minuti non può mai essere GEM
  var combinedScore   = (perfScore + potentialBoost) * reliability;
  var maxRaw          = SCORING_CONFIG.maxRawScore[role] || 1.6;
  var normalizedScore = _clamp(combinedScore / maxRaw, 0, 1);
  var valueScore      = normalizedScore / Math.pow(price, SCORING_CONFIG.priceExponent);

  //  Score 0–100 
  var score100 = Math.round(normalizedScore * 100);

  return {
    // Scores principali
    normalized:     Math.round(normalizedScore * 100) / 100,
    score100:       score100,
    value:          Math.round(valueScore * 10000) / 10000,

    // Componenti
    perfScore:      Math.round(perfScore * 1000) / 1000,
    potentialBoost: Math.round(potentialBoost * 1000) / 1000,
    reliability:    Math.round(reliability * 100) / 100,
    combinedScore:  Math.round(combinedScore * 1000) / 1000,

    // Per90 smorzati (usati nel calcolo)
    xgP90:    Math.round(xgP90 * 100) / 100,
    xaP90:    Math.round(xaP90 * 100) / 100,
    goalsP90: Math.round(goalsP90 * 100) / 100,
    assP90:   Math.round(assP90 * 100) / 100,
    shotsP90: Math.round(shotsP90 * 100) / 100,

    // Gap potential
    xgGap:   Math.round(xgGap * 10) / 10,
    xaGap:   Math.round(xaGap * 10) / 10,
    xgRatio: Math.round(xgRatio * 100),  // % xG non convertiti
    xaRatio: Math.round(xaRatio * 100),  // % xA non convertiti

    price:        price,
    minutes:      minutes,
    priceTier:    _getPriceTier(price),
    excluded:     false,
    isGoalkeeper: false
  };
}

//  FASCE PREZZO + PERCENTILE 
// Calcola per ogni giocatore la sua posizione relativa DENTRO la sua fascia prezzo.
// Input: array completo di player
// Output: Map{ playerId -> { tierRank, tierTotal, tierPct, tierLabel } }

function computeTierRankings(players) {
  var map = {};

  // Raggruppa per fascia
  var byTier = {};
  players.forEach(function(p) {
    var sc = calculateScore(p);
    if (!sc || sc.excluded) return;
    var tier = _getPriceTier(_safe(p.price_initial));
    if (!byTier[tier]) byTier[tier] = [];
    byTier[tier].push({ id: p.id, value: sc.value || 0, score100: sc.score100 || 0 });
  });

  // Ordina ogni fascia per value score e assegna rank
  Object.keys(byTier).forEach(function(tier) {
    var arr = byTier[tier].sort(function(a, b) { return b.value - a.value; });
    var n   = arr.length;
    arr.forEach(function(item, idx) {
      var rank   = idx + 1;
      var pct    = Math.round(((n - idx) / n) * 100); // top X%
      map[item.id] = {
        tier:       tier,
        tierRank:   rank,
        tierTotal:  n,
        tierPct:    pct,  // es: 85 = top 85% (basso) … 100 = il migliore
        tierLabel:  _tierPctLabel(pct)
      };
    });
  });

  return map;
}

function _tierPctLabel(pct) {
  if (pct >= 90) return ' Top 10% fascia';
  if (pct >= 75) return ' Top 25% fascia';
  if (pct >= 50) return ' Nella media fascia';
  return ' Sotto media fascia';
}

//  EXPLAIN SCORE 

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

  //  Portieri 
  if (result.isGoalkeeper) {
    var stats = _getStats(player);
    var label = _getLabel(result.score100, 'POR');
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
        { label: ' Fantavoto medio (smorzato)', value: _safe(stats.fantavote).toFixed(2), detail: 'smorzato verso 6.5 su sample piccoli' },
        { label: ' Presenze',        value: String(_safe(stats.matches)),       detail: 'stagione di riferimento' },
        { label: ' Prezzo iniziale', value: player.price_initial + ' cr',       detail: 'quotazione asta' },
        { label: ' Affidabilità',    value: (result.reliability * 100).toFixed(0) + '%', detail: 'integrata nel calcolo' }
      ],
      flags: _buildGoalkeeperFlags(player, result)
    };
  }

  //  Outfielders 
  var w    = SCORING_CONFIG.weights;
  var perf = result.perfScore > 0 ? result.perfScore : 0.001;
  var label = _getLabel(result.score100, player.role);

  var xgContrib    = result.xgP90    * w.xg     / perf * 100;
  var xaContrib    = result.xaP90    * w.xa     / perf * 100;
  var goalsContrib = result.goalsP90 * w.goals  / perf * 100;
  var shotsContrib = result.shotsP90 * w.shots  / perf * 100;
  var assContrib   = result.assP90   * w.xa_raw / perf * 100;

  var breakdown = [
    { label: ' xG per 90',     value: result.xgP90.toFixed(2),    weight: (w.xg*100).toFixed(0)+'%',     contrib: xgContrib.toFixed(1)+'%',    detail: 'smorzato su sample piccoli — predittore principale' },
    { label: ' xA per 90',     value: result.xaP90.toFixed(2),    weight: (w.xa*100).toFixed(0)+'%',     contrib: xaContrib.toFixed(1)+'%',    detail: 'assist attesi per 90 min (smorzato)' },
    { label: ' Gol per 90',    value: result.goalsP90.toFixed(2), weight: (w.goals*100).toFixed(0)+'%', contrib: goalsContrib.toFixed(1)+'%', detail: 'gol reali per 90 min (smorzato)' },
    { label: ' Assist per 90', value: result.assP90.toFixed(2),   weight: (w.xa_raw*100).toFixed(0)+'%',contrib: assContrib.toFixed(1)+'%',   detail: 'assist reali per 90 min (smorzato)' },
    { label: ' Tiri per 90',   value: result.shotsP90.toFixed(2), weight: (w.shots*100).toFixed(0)+'%', contrib: shotsContrib.toFixed(1)+'%', detail: 'volume offensivo (smorzato)' },
    {
      label:  ' Potential boost',
      value:  '+' + result.potentialBoost.toFixed(3),
      detail: result.xgRatio > 0 || result.xaRatio > 0
        ? result.xgRatio + '% xG non convertiti · ' + result.xaRatio + '% xA non convertiti'
        : 'nessun gap significativo'
    },
    {
      label:  ' Affidabilità',
      value:  (result.reliability * 100).toFixed(0) + '%',
      detail: '~' + result.minutes + ' min · integrata direttamente nel calcolo'
    },
    {
      label:  ' Impatto prezzo',
      value:  player.price_initial + ' cr',
      detail: 'fascia ' + result.priceTier + ' · divisore ÷prezzo^' + SCORING_CONFIG.priceExponent
    }
  ];

  var flags = [];
  if (result.xgRatio > 30)        flags.push(' ' + result.xgRatio + '% xG non convertiti — può sbloccarsi');
  if (result.xaRatio > 30)        flags.push(' ' + result.xaRatio + '% xA non convertiti — assist in arrivo');
  if (result.reliability < 0.65)  flags.push(' Pochi minuti — campione parziale, smorzamento attivo');
  if (player.on_penalties)        flags.push(' Rigorista — bonus penalty garantiti');
  if (player.tag === 'sleeper')   flags.push(' Tag SLEEPER — già segnalato come undervalue');
  if (player.status === 'risk')   flags.push(' Ballottaggio — titolarità incerta');
  if (player.injury_prone)        flags.push(' Infortuni frequenti — rischio discontinuità');

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
  if (result.reliability < 0.5) flags.push(' Poche presenze — campione limitato');
  if (player.status === 'risk') flags.push(' Ballottaggio — titolarità incerta');
  if (player.injury_prone)      flags.push(' Infortuni frequenti');
  if (player.tag === 'sleeper') flags.push(' Tag SLEEPER');
  return flags;
}

//  LABEL QUALITATIVE (0–100) 
// Etichette leggibili basate su score100.
// Le soglie sono calibrate per ruolo: un ATT da 60 è più raro di un DIF da 60.

function _getLabel(score100, role) {
  var t = {
    ATT: { elite: 72, ottimo: 52, buono: 35, medio: 18 },
    CEN: { elite: 68, ottimo: 48, buono: 32, medio: 16 },
    DIF: { elite: 60, ottimo: 42, buono: 28, medio: 14 },
    POR: { elite: 65, ottimo: 45, buono: 30, medio: 15 }
  };
  var r = t[role] || t.ATT;
  if (score100 >= r.elite)  return ' Elite';
  if (score100 >= r.ottimo) return ' Ottimo affare';
  if (score100 >= r.buono)  return ' Buono';
  if (score100 >= r.medio)  return ' Medio';
  return ' Scarso';
}

//  VERDICT (compatibilità badge UI) 

function _getVerdict(valueScore, normalizedScore, role) {
  var t = { ATT:{gem:0.025,good:0.015,meh:0.008}, CEN:{gem:0.022,good:0.013,meh:0.007}, DIF:{gem:0.018,good:0.010,meh:0.005}, POR:{gem:0.020,good:0.012,meh:0.006} };
  var r = t[role] || t.ATT;
  if (valueScore >= r.gem)  return ' GEM';
  if (valueScore >= r.good) return ' BUONO';
  if (valueScore >= r.meh)  return ' MEDIA';
  return ' CARO';
}

// verdictFull ora usa score100 + label qualitativa
function _getVerdictFull(score100, role) {
  var label = _getLabel(score100, role);
  return label;  // es: " Elite", " Ottimo affare", ecc.
}

//  RANK 

function rankPlayers(players) {
  // Calcola tier map una sola volta per tutto il dataset
  var tierMap = computeTierRankings(players);
  return players
    .map(function(p) {
      var score = calculateScore(p);
      var explanation = explainScore(p, tierMap);
      return { player: p, score: score, explanation: explanation };
    })
    .filter(function(item) { return item.score && !item.score.excluded; })
    .sort(function(a, b) { return (b.score.value || 0) - (a.score.value || 0); });
}

function rankPlayersByRole(players, role) {
  return rankPlayers(players.filter(function(p) { return p.role === role; }));
}

//  EXPORT 

window.Scoring = {
  calculateScore:       calculateScore,
  explainScore:         explainScore,
  rankPlayers:          rankPlayers,
  rankPlayersByRole:    rankPlayersByRole,
  computeTierRankings:  computeTierRankings,
  getVerdict:           _getVerdict,
  getVerdictFull:       _getVerdictFull,
  getLabel:             _getLabel,
  SCORING_CONFIG:       SCORING_CONFIG
};
