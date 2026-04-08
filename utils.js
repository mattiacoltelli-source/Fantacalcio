// utils.js — Funzioni pure di calcolo, nessun side effect

const Utils = {

  calcMaxPrice(player) {
    let base = player.value_estimated;

    // ── Bonus/malus ruolo ──────────────────────────────────────────────────────
    const roleM = { ATT: 1.15, DIF: 1.00, CEN: 1.00, POR: 0.90 };
    base *= (roleM[player.role] || 1.00);

    // ── Bonus/malus tag ────────────────────────────────────────────────────────
    const tagM = { sleeper: 1.10, hype: 0.85, normal: 1.00 };
    base *= (tagM[player.tag] || 1.00);

    // ── Bonus rendimento: fantavoto ────────────────────────────────────────────
    const fv = player.stats?.fantavote || 0;
    if (fv >= 7.0)      base *= 1.12;
    else if (fv >= 6.5) base *= 1.06;
    else if (fv >= 6.0) base *= 1.02;
    else if (fv < 5.5)  base *= 0.92;

    // ── Bonus gol ─────────────────────────────────────────────────────────────
    const goals = player.stats?.goals || 0;
    if (goals >= 15)      base *= 1.15;
    else if (goals >= 10) base *= 1.10;
    else if (goals >= 6)  base *= 1.06;
    else if (goals >= 3)  base *= 1.02;

    // ── Bonus assist ──────────────────────────────────────────────────────────
    const assists = player.stats?.assists || 0;
    if (assists >= 10)    base *= 1.08;
    else if (assists >= 6) base *= 1.05;
    else if (assists >= 3) base *= 1.02;

    // ── Bonus rigorista ────────────────────────────────────────────────────────
    if (player.on_penalties) base *= 1.08;

    // ── Bonus DIF per avg_vote (modificatore difesa) ───────────────────────────
    if (player.role === 'DIF') {
      const avg = player.stats?.avg_vote || 0;
      if (avg >= 6.5)       base *= 1.15;
      else if (avg >= 6.25) base *= 1.10;
      else if (avg >= 6.0)  base *= 1.05;
    }

    return Math.round(base);
  },

  evaluatePurchase(player, price) {
    const max = Utils.calcMaxPrice(player);
    if (price < max * 0.90) return 'AFFARE';
    if (price > max * 1.10) return 'OVERPAY';
    return 'OK';
  },

  getBudgetAdvice(player, price, squad, totalBudget) {
    const spent      = Utils.getTotalSpent(squad);
    const remaining  = totalBudget - spent;
    const maxPrice   = Utils.calcMaxPrice(player);
    const slotsLeft  = Utils.getRemainingSlots(squad).total;
    const budgetAfter = remaining - price;
    const slotsAfter  = slotsLeft - 1;

    // Regola dura: deve restare almeno 1 cr per ogni slot futuro
    if (budgetAfter < slotsAfter) return 'NON_COMPRARE';

    // Regola dura: non superare mai il max consigliato
    if (price > maxPrice) return 'NON_COMPRARE';

    // Soglia overpay: oltre il 15% del valore stimato è eccessivo
    // (era 1.05 nella versione GPT — troppo aggressivo, corretto a 1.15)
    if (price > player.value_estimated * 1.15) return 'NON_COMPRARE';

    // Avviso strategico: sopra la media budget per slot
    const avg = remaining / Math.max(slotsLeft, 1);
    if (price > avg * 1.15) return 'ATTENTO';

    return 'OK';
  },

  // ── MAX OFFER NOW ─────────────────────────────────────────────────────────────
  // Prezzo massimo sostenibile ORA senza distruggere la strategia futura

  calcMaxOfferNow(player, squad, totalBudget) {
    const spent     = Utils.getTotalSpent(squad);
    const remaining = totalBudget - spent;
    const slotsLeft = Utils.getRemainingSlots(squad).total;
    const maxPrice  = Utils.calcMaxPrice(player);

    // Riserva almeno 1 cr per ogni slot futuro (escluso quello attuale)
    const budgetCap = remaining - Math.max(slotsLeft - 1, 0);
    const maxNow    = Math.min(maxPrice, Math.max(budgetCap, 1));
    return Math.max(maxNow, 1);
  },

  // ── SMART ALERT ───────────────────────────────────────────────────────────────

  getSmartAlert(player, price, squad, totalBudget) {
    const v       = player.value_estimated;
    const maxNow  = Utils.calcMaxOfferNow(player, squad, totalBudget);
    const advice  = Utils.getBudgetAdvice(player, price, squad, totalBudget);
    const role    = player.role;
    const avgVote = player.stats?.avg_vote || 0;

    // Alert difensori con modificatore alto
    if (role === 'DIF' && avgVote >= 6.5 && price <= maxNow) {
      return '🛡️ Top difensore per modificatore — vale ogni credito';
    }
    if (role === 'DIF' && avgVote >= 6.25 && price <= maxNow) {
      return '🛡️ Ottimo per modificatore difesa';
    }

    // Alert budget
    if (advice === 'NON_COMPRARE' && price > maxNow) {
      return '🚫 Oltre il limite massimo — fermati qui';
    }
    if (price >= maxNow) {
      return '⚖️ Limite massimo — non salire oltre';
    }

    // Alert valore
    if (price < v * 0.85) return '💣 Affare raro — spingi senza esitare';
    if (price < v * 0.90) return '✅ Affare — prendilo';
    if (price > v * 1.10) return '⚠️ Non vale questo prezzo — lascia perdere';
    if (price > v * 1.05) return '⚠️ Stai pagando troppo per questo slot';
    if (advice === 'ATTENTO') return '⚡ Prezzo alto ma sostenibile — ultima chiamata';

    return '👍 Prezzo corretto — puoi comprare';
  },

  getTotalSpent(squad) {
    return squad.reduce((s, p) => s + (p.paid || 0), 0);
  },

  getSlotsByRole(squad) {
    const slots = { POR: 0, DIF: 0, CEN: 0, ATT: 0 };
    squad.forEach(p => { if (slots[p.role] !== undefined) slots[p.role]++; });
    return slots;
  },

  maxSlots() {
    return { POR: 3, DIF: 8, CEN: 8, ATT: 6, total: 25 };
  },

  getRemainingSlots(squad) {
    const max  = Utils.maxSlots();
    const used = Utils.getSlotsByRole(squad);
    return {
      POR:   max.POR   - used.POR,
      DIF:   max.DIF   - used.DIF,
      CEN:   max.CEN   - used.CEN,
      ATT:   max.ATT   - used.ATT,
      total: max.total - squad.length
    };
  },

  canBuy(player, squad, totalBudget) {
    const rem = Utils.getRemainingSlots(squad);
    if (rem.total <= 0)        return { ok: false, reason: 'Rosa completa (25 giocatori)' };
    if (rem[player.role] <= 0) return { ok: false, reason: `Slot ${player.role} esauriti` };
    const spent = Utils.getTotalSpent(squad);
    if (totalBudget - spent <= 0) return { ok: false, reason: 'Budget esaurito' };
    return { ok: true, reason: '' };
  },

  avgBudgetPerSlot(squad, totalBudget) {
    const spent = Utils.getTotalSpent(squad);
    const slots = Utils.getRemainingSlots(squad).total;
    if (slots <= 0) return 0;
    return Math.round((totalBudget - spent) / slots);
  },

  filterPlayers(players, filters) {
    return players.filter(p => {
      if (filters.role !== 'ALL' && p.role !== filters.role) return false;
      if (filters.tag  !== 'ALL' && p.tag  !== filters.tag)  return false;
      if (filters.penalties && !p.on_penalties)               return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.team.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  },

  sortPlayers(players, sortBy) {
    return [...players].sort((a, b) => {
      if (sortBy === 'fantavote')       return b.stats.fantavote   - a.stats.fantavote;
      if (sortBy === 'value_estimated') return b.value_estimated   - a.value_estimated;
      if (sortBy === 'price_initial')   return b.price_initial     - a.price_initial;
      if (sortBy === 'name')            return a.name.localeCompare(b.name);
      return b.value_estimated - a.value_estimated;
    });
  },

  roleLabel(role) {
    return { POR: 'Portiere', DIF: 'Difensore', CEN: 'Centrocampista', ATT: 'Attaccante' }[role] || role;
  },

  roleColor(role) {
    return { POR: '#f59e0b', DIF: '#3b82f6', CEN: '#8b5cf6', ATT: '#ef4444' }[role] || '#6b7280';
  }
};
