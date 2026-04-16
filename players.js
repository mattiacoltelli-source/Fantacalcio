// players.js — Rosa 78 giocatori Serie A 2025/26
// stats_prev = stagione 2024/25 completa
// stats_curr = prime 4 giornate 2025/26 (dati simulati, da sostituire con reali)

const PLAYERS = [

  // ─── INTER ───────────────────────────────────────────────────────────────────

  {"id":"por_001","name":"Sommer","team":"Inter","role":"POR","advanced_role":"Portiere",
   "price_initial":16,"value_estimated":23,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.4,"fantavote":7.2,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.1,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.0,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"por_002","name":"Martinez J.","team":"Inter","role":"POR","advanced_role":"Portiere",
   "price_initial":4,"value_estimated":5,"tag":"normal","on_penalties":false,"status":"bench","injury_prone":false,
   "stats_prev":{"matches":6,"avg_vote":6.2,"fantavote":6.5,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":0,"avg_vote":0,"fantavote":0,"goals":0,"assists":0,"goals_per90":0.00,"xg":null,"xa":null,"shots_per90":0.0}},

  {"id":"dif_001","name":"Dimarco","team":"Inter","role":"DIF","advanced_role":"Terzino",
   "price_initial":19,"value_estimated":28,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":31,"avg_vote":6.5,"fantavote":7.8,"goals":4,"assists":7,"goals_per90":0.12,"xg":3.2,"xa":5.8,"shots_per90":1.8},
   "stats_curr":{"matches":4,"avg_vote":6.6,"fantavote":7.5,"goals":1,"assists":2,"goals_per90":0.25,"xg":0.9,"xa":1.6,"shots_per90":1.9}},

  {"id":"dif_002","name":"Dumfries","team":"Inter","role":"DIF","advanced_role":"Terzino",
   "price_initial":20,"value_estimated":25,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":29,"avg_vote":6.3,"fantavote":7.1,"goals":3,"assists":5,"goals_per90":0.10,"xg":2.4,"xa":3.9,"shots_per90":1.4},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":6.9,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.5,"xa":0.8,"shots_per90":1.3}},

  {"id":"dif_003","name":"Bastoni","team":"Inter","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":16,"value_estimated":20,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":32,"avg_vote":6.5,"fantavote":7.3,"goals":2,"assists":4,"goals_per90":0.06,"xg":1.8,"xa":3.2,"shots_per90":0.9},
   "stats_curr":{"matches":4,"avg_vote":6.6,"fantavote":7.1,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.4,"xa":0.7,"shots_per90":0.8}},

  {"id":"dif_004","name":"Acerbi","team":"Inter","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":8,"value_estimated":9,"tag":"normal","on_penalties":false,"status":"risk","injury_prone":true,
   "stats_prev":{"matches":25,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":1,"goals_per90":0.04,"xg":0.9,"xa":0.8,"shots_per90":0.5},
   "stats_curr":{"matches":2,"avg_vote":6.2,"fantavote":6.4,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.1,"shots_per90":0.4}},

  {"id":"dif_005","name":"De Vrij","team":"Inter","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":9,"value_estimated":11,"tag":"normal","on_penalties":false,"status":"risk","injury_prone":false,
   "stats_prev":{"matches":28,"avg_vote":6.3,"fantavote":6.6,"goals":1,"assists":2,"goals_per90":0.04,"xg":1.1,"xa":1.4,"shots_per90":0.6},
   "stats_curr":{"matches":3,"avg_vote":6.3,"fantavote":6.6,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.2,"xa":0.3,"shots_per90":0.6}},

  {"id":"cen_001","name":"Calhanoglu","team":"Inter","role":"CEN","advanced_role":"Regista",
   "price_initial":23,"value_estimated":38,"tag":"normal","on_penalties":true,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":28,"avg_vote":6.5,"fantavote":7.7,"goals":7,"assists":7,"goals_per90":0.25,"xg":6.1,"xa":6.4,"shots_per90":2.8},
   "stats_curr":{"matches":3,"avg_vote":6.5,"fantavote":7.6,"goals":2,"assists":1,"goals_per90":0.67,"xg":1.8,"xa":0.9,"shots_per90":2.9}},

  {"id":"cen_002","name":"Barella","team":"Inter","role":"CEN","advanced_role":"Mezzala",
   "price_initial":30,"value_estimated":42,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":31,"avg_vote":6.6,"fantavote":7.5,"goals":5,"assists":8,"goals_per90":0.16,"xg":4.2,"xa":7.1,"shots_per90":2.4},
   "stats_curr":{"matches":4,"avg_vote":6.7,"fantavote":7.8,"goals":1,"assists":2,"goals_per90":0.25,"xg":1.1,"xa":1.8,"shots_per90":2.5}},

  {"id":"cen_003","name":"Mkhitaryan","team":"Inter","role":"CEN","advanced_role":"Mezzala",
   "price_initial":12,"value_estimated":16,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":27,"avg_vote":6.4,"fantavote":7.0,"goals":3,"assists":5,"goals_per90":0.11,"xg":2.8,"xa":4.2,"shots_per90":1.6},
   "stats_curr":{"matches":3,"avg_vote":6.3,"fantavote":6.8,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.6,"xa":0.9,"shots_per90":1.5}},

  {"id":"cen_004","name":"Frattesi","team":"Inter","role":"CEN","advanced_role":"Mezzala",
   "price_initial":18,"value_estimated":26,"tag":"sleeper","on_penalties":false,"status":"risk","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.3,"fantavote":7.2,"goals":6,"assists":3,"goals_per90":0.20,"xg":5.8,"xa":2.6,"shots_per90":3.1},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.3,"goals":2,"assists":0,"goals_per90":0.50,"xg":1.9,"xa":0.4,"shots_per90":3.2}},

  {"id":"att_001","name":"Martinez L.","team":"Inter","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":34,"value_estimated":95,"tag":"hype","on_penalties":true,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":31,"avg_vote":6.8,"fantavote":9.0,"goals":22,"assists":5,"goals_per90":0.71,"xg":19.4,"xa":4.8,"shots_per90":5.2},
   "stats_curr":{"matches":4,"avg_vote":6.9,"fantavote":8.8,"goals":5,"assists":1,"goals_per90":1.25,"xg":4.6,"xa":0.9,"shots_per90":5.4}},

  {"id":"att_002","name":"Thuram","team":"Inter","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":28,"value_estimated":65,"tag":"hype","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.6,"fantavote":8.2,"goals":15,"assists":7,"goals_per90":0.45,"xg":13.8,"xa":6.2,"shots_per90":4.1},
   "stats_curr":{"matches":4,"avg_vote":6.6,"fantavote":7.9,"goals":3,"assists":2,"goals_per90":0.75,"xg":2.8,"xa":1.5,"shots_per90":4.0}},

  // ─── MILAN ────────────────────────────────────────────────────────────────────

  {"id":"por_003","name":"Maignan","team":"Milan","role":"POR","advanced_role":"Portiere",
   "price_initial":16,"value_estimated":22,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":31,"avg_vote":6.5,"fantavote":7.2,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.1,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.1,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_007","name":"Theo Hernandez","team":"Milan","role":"DIF","advanced_role":"Terzino",
   "price_initial":28,"value_estimated":38,"tag":"hype","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.4,"fantavote":7.6,"goals":5,"assists":6,"goals_per90":0.17,"xg":4.1,"xa":5.0,"shots_per90":2.1},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.4,"goals":1,"assists":1,"goals_per90":0.25,"xg":1.0,"xa":1.1,"shots_per90":2.2}},

  {"id":"dif_008","name":"Calabria","team":"Milan","role":"DIF","advanced_role":"Terzino",
   "price_initial":8,"value_estimated":10,"tag":"normal","on_penalties":false,"status":"risk","injury_prone":true,
   "stats_prev":{"matches":23,"avg_vote":6.2,"fantavote":6.6,"goals":1,"assists":2,"goals_per90":0.04,"xg":0.9,"xa":1.7,"shots_per90":0.8},
   "stats_curr":{"matches":3,"avg_vote":6.2,"fantavote":6.5,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.3,"xa":0.8,"shots_per90":0.7}},

  {"id":"dif_009","name":"Tomori","team":"Milan","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":9,"value_estimated":11,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":27,"avg_vote":6.3,"fantavote":6.8,"goals":1,"assists":0,"goals_per90":0.04,"xg":1.0,"xa":0.4,"shots_per90":0.5},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":6.9,"goals":1,"assists":0,"goals_per90":0.25,"xg":0.8,"xa":0.2,"shots_per90":0.6}},

  {"id":"cen_006","name":"Reijnders","team":"Milan","role":"CEN","advanced_role":"Mezzala",
   "price_initial":18,"value_estimated":30,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.5,"fantavote":7.6,"goals":10,"assists":5,"goals_per90":0.29,"xg":8.9,"xa":4.6,"shots_per90":2.9},
   "stats_curr":{"matches":4,"avg_vote":6.6,"fantavote":7.7,"goals":2,"assists":1,"goals_per90":0.50,"xg":1.8,"xa":0.9,"shots_per90":3.0}},

  {"id":"cen_007","name":"Fofana","team":"Milan","role":"CEN","advanced_role":"Mediano",
   "price_initial":12,"value_estimated":15,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.4,"fantavote":6.9,"goals":2,"assists":3,"goals_per90":0.07,"xg":1.8,"xa":2.6,"shots_per90":1.2},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":6.8,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.4,"xa":0.7,"shots_per90":1.1}},

  {"id":"att_004","name":"Leao","team":"Milan","role":"ATT","advanced_role":"Ala Sinistra",
   "price_initial":28,"value_estimated":42,"tag":"hype","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.5,"fantavote":7.8,"goals":11,"assists":9,"goals_per90":0.33,"xg":9.8,"xa":8.2,"shots_per90":3.6},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.5,"goals":2,"assists":2,"goals_per90":0.50,"xg":2.1,"xa":1.8,"shots_per90":3.5}},

  {"id":"att_005","name":"Morata","team":"Milan","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":14,"value_estimated":20,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":28,"avg_vote":6.3,"fantavote":7.1,"goals":8,"assists":5,"goals_per90":0.29,"xg":7.5,"xa":4.6,"shots_per90":2.8},
   "stats_curr":{"matches":3,"avg_vote":6.3,"fantavote":7.0,"goals":1,"assists":1,"goals_per90":0.33,"xg":1.2,"xa":0.9,"shots_per90":2.7}},

  // ─── JUVENTUS ─────────────────────────────────────────────────────────────────

  {"id":"por_005","name":"Di Gregorio","team":"Juventus","role":"POR","advanced_role":"Portiere",
   "price_initial":10,"value_estimated":16,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.4,"fantavote":7.1,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.1,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_010","name":"Cambiaso","team":"Juventus","role":"DIF","advanced_role":"Terzino",
   "price_initial":18,"value_estimated":26,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":32,"avg_vote":6.4,"fantavote":7.4,"goals":4,"assists":5,"goals_per90":0.13,"xg":3.5,"xa":4.2,"shots_per90":1.7},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.3,"goals":1,"assists":1,"goals_per90":0.25,"xg":0.8,"xa":0.9,"shots_per90":1.6}},

  {"id":"dif_011","name":"Bremer","team":"Juventus","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":14,"value_estimated":17,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":10,"avg_vote":6.4,"fantavote":6.9,"goals":1,"assists":0,"goals_per90":0.10,"xg":0.8,"xa":0.3,"shots_per90":0.7},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.5,"xa":0.2,"shots_per90":0.7}},

  {"id":"dif_012","name":"Gatti","team":"Juventus","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":10,"value_estimated":14,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.4,"fantavote":7.0,"goals":3,"assists":1,"goals_per90":0.09,"xg":2.4,"xa":0.8,"shots_per90":0.8},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":1,"assists":0,"goals_per90":0.25,"xg":0.7,"xa":0.2,"shots_per90":0.9}},

  {"id":"cen_008","name":"Locatelli","team":"Juventus","role":"CEN","advanced_role":"Mediano",
   "price_initial":10,"value_estimated":13,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.3,"fantavote":6.8,"goals":2,"assists":3,"goals_per90":0.06,"xg":1.8,"xa":2.6,"shots_per90":1.1},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":6.7,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.4,"xa":0.7,"shots_per90":1.0}},

  {"id":"cen_009","name":"Koopmeiners","team":"Juventus","role":"CEN","advanced_role":"Mezzala",
   "price_initial":24,"value_estimated":32,"tag":"hype","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":31,"avg_vote":6.4,"fantavote":7.4,"goals":8,"assists":6,"goals_per90":0.26,"xg":7.2,"xa":5.5,"shots_per90":2.8},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.5,"goals":2,"assists":1,"goals_per90":0.50,"xg":1.8,"xa":1.1,"shots_per90":2.7}},

  {"id":"att_006","name":"Vlahovic","team":"Juventus","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":22,"value_estimated":38,"tag":"hype","on_penalties":true,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.4,"fantavote":7.8,"goals":14,"assists":3,"goals_per90":0.41,"xg":14.2,"xa":2.8,"shots_per90":4.2},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.9,"goals":3,"assists":0,"goals_per90":0.75,"xg":3.1,"xa":0.4,"shots_per90":4.3}},

  {"id":"att_007","name":"Yildiz","team":"Juventus","role":"ATT","advanced_role":"Trequartista",
   "price_initial":16,"value_estimated":26,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.4,"fantavote":7.3,"goals":9,"assists":6,"goals_per90":0.27,"xg":8.1,"xa":5.4,"shots_per90":2.9},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.4,"goals":2,"assists":1,"goals_per90":0.50,"xg":1.9,"xa":1.0,"shots_per90":2.8}},

  // ─── NAPOLI ───────────────────────────────────────────────────────────────────

  {"id":"por_006","name":"Meret","team":"Napoli","role":"POR","advanced_role":"Portiere",
   "price_initial":11,"value_estimated":16,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.4,"fantavote":7.3,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.2,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_013","name":"Di Lorenzo","team":"Napoli","role":"DIF","advanced_role":"Terzino",
   "price_initial":14,"value_estimated":18,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":36,"avg_vote":6.4,"fantavote":7.1,"goals":2,"assists":4,"goals_per90":0.06,"xg":1.8,"xa":3.4,"shots_per90":1.2},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.4,"xa":0.8,"shots_per90":1.1}},

  {"id":"dif_014","name":"Buongiorno","team":"Napoli","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":12,"value_estimated":17,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.5,"fantavote":7.0,"goals":2,"assists":1,"goals_per90":0.06,"xg":1.6,"xa":0.8,"shots_per90":0.7},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.1,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.5,"xa":0.2,"shots_per90":0.7}},

  {"id":"cen_010","name":"Anguissa","team":"Napoli","role":"CEN","advanced_role":"Mediano",
   "price_initial":14,"value_estimated":19,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.4,"fantavote":7.1,"goals":4,"assists":3,"goals_per90":0.12,"xg":3.6,"xa":2.8,"shots_per90":1.8},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.2,"goals":1,"assists":0,"goals_per90":0.25,"xg":0.9,"xa":0.5,"shots_per90":1.7}},

  {"id":"cen_011","name":"McTominay","team":"Napoli","role":"CEN","advanced_role":"Mezzala",
   "price_initial":14,"value_estimated":24,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.5,"fantavote":7.8,"goals":10,"assists":4,"goals_per90":0.29,"xg":9.1,"xa":3.6,"shots_per90":3.2},
   "stats_curr":{"matches":4,"avg_vote":6.6,"fantavote":7.9,"goals":3,"assists":1,"goals_per90":0.75,"xg":2.8,"xa":0.8,"shots_per90":3.3}},

  {"id":"att_008","name":"Lukaku","team":"Napoli","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":18,"value_estimated":30,"tag":"hype","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.4,"fantavote":7.8,"goals":13,"assists":6,"goals_per90":0.37,"xg":12.4,"xa":5.5,"shots_per90":3.5},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.6,"goals":2,"assists":2,"goals_per90":0.50,"xg":2.2,"xa":1.6,"shots_per90":3.4}},

  {"id":"att_009","name":"Kvaratskhelia","team":"Napoli","role":"ATT","advanced_role":"Ala Sinistra",
   "price_initial":32,"value_estimated":72,"tag":"hype","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.7,"fantavote":8.4,"goals":14,"assists":11,"goals_per90":0.40,"xg":12.8,"xa":10.2,"shots_per90":4.1},
   "stats_curr":{"matches":4,"avg_vote":6.8,"fantavote":8.5,"goals":3,"assists":3,"goals_per90":0.75,"xg":3.0,"xa":2.6,"shots_per90":4.2}},

  // ─── ATALANTA ─────────────────────────────────────────────────────────────────

  {"id":"por_007","name":"Carnesecchi","team":"Atalanta","role":"POR","advanced_role":"Portiere",
   "price_initial":12,"value_estimated":18,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":36,"avg_vote":6.5,"fantavote":7.6,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.6,"fantavote":7.5,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_015","name":"Djimsiti","team":"Atalanta","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":8,"value_estimated":10,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.4,"fantavote":6.9,"goals":2,"assists":1,"goals_per90":0.07,"xg":1.5,"xa":0.9,"shots_per90":0.7},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":6.9,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.4,"xa":0.2,"shots_per90":0.7}},

  {"id":"dif_016","name":"Kolasinac","team":"Atalanta","role":"DIF","advanced_role":"Terzino",
   "price_initial":7,"value_estimated":9,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":28,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":2,"goals_per90":0.04,"xg":0.9,"xa":1.7,"shots_per90":0.6},
   "stats_curr":{"matches":3,"avg_vote":6.3,"fantavote":6.6,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.2,"xa":0.6,"shots_per90":0.6}},

  {"id":"cen_012","name":"De Roon","team":"Atalanta","role":"CEN","advanced_role":"Mediano",
   "price_initial":9,"value_estimated":12,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.3,"fantavote":6.9,"goals":3,"assists":2,"goals_per90":0.09,"xg":2.7,"xa":1.8,"shots_per90":1.3},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":6.8,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.6,"xa":0.5,"shots_per90":1.2}},

  {"id":"cen_013","name":"Ederson","team":"Atalanta","role":"CEN","advanced_role":"Mezzala",
   "price_initial":14,"value_estimated":20,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.4,"fantavote":7.3,"goals":5,"assists":4,"goals_per90":0.15,"xg":4.6,"xa":3.7,"shots_per90":2.1},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.4,"goals":1,"assists":1,"goals_per90":0.25,"xg":1.1,"xa":0.9,"shots_per90":2.0}},

  {"id":"att_010","name":"Lookman","team":"Atalanta","role":"ATT","advanced_role":"Ala",
   "price_initial":22,"value_estimated":42,"tag":"hype","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":36,"avg_vote":6.7,"fantavote":8.6,"goals":15,"assists":8,"goals_per90":0.42,"xg":13.4,"xa":7.2,"shots_per90":4.0},
   "stats_curr":{"matches":4,"avg_vote":6.8,"fantavote":8.4,"goals":3,"assists":2,"goals_per90":0.75,"xg":3.0,"xa":1.8,"shots_per90":4.1}},

  {"id":"att_011","name":"Retegui","team":"Atalanta","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":14,"value_estimated":32,"tag":"sleeper","on_penalties":true,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":36,"avg_vote":6.5,"fantavote":8.2,"goals":19,"assists":3,"goals_per90":0.53,"xg":16.8,"xa":2.8,"shots_per90":4.6},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":8.0,"goals":4,"assists":0,"goals_per90":1.00,"xg":3.8,"xa":0.4,"shots_per90":4.7}},

  // ─── ROMA ─────────────────────────────────────────────────────────────────────

  {"id":"por_008","name":"Svilar","team":"Roma","role":"POR","advanced_role":"Portiere",
   "price_initial":10,"value_estimated":15,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.5,"fantavote":7.4,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.3,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_017","name":"Celik","team":"Roma","role":"DIF","advanced_role":"Terzino",
   "price_initial":6,"value_estimated":8,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":28,"avg_vote":6.2,"fantavote":6.6,"goals":1,"assists":2,"goals_per90":0.04,"xg":0.8,"xa":1.6,"shots_per90":0.7},
   "stats_curr":{"matches":3,"avg_vote":6.2,"fantavote":6.5,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.2,"xa":0.4,"shots_per90":0.6}},

  {"id":"cen_014","name":"Pellegrini","team":"Roma","role":"CEN","advanced_role":"Trequartista",
   "price_initial":12,"value_estimated":16,"tag":"normal","on_penalties":true,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":26,"avg_vote":6.3,"fantavote":7.1,"goals":5,"assists":5,"goals_per90":0.19,"xg":4.6,"xa":4.8,"shots_per90":2.2},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.2,"goals":1,"assists":2,"goals_per90":0.25,"xg":1.1,"xa":1.5,"shots_per90":2.1}},

  {"id":"cen_015","name":"Paredes","team":"Roma","role":"CEN","advanced_role":"Regista",
   "price_initial":9,"value_estimated":11,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":24,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":3,"goals_per90":0.04,"xg":0.9,"xa":2.6,"shots_per90":0.9},
   "stats_curr":{"matches":3,"avg_vote":6.3,"fantavote":6.6,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.2,"xa":0.7,"shots_per90":0.8}},

  {"id":"att_012","name":"Dybala","team":"Roma","role":"ATT","advanced_role":"Trequartista",
   "price_initial":18,"value_estimated":28,"tag":"hype","on_penalties":true,"status":"risk","injury_prone":true,
   "stats_prev":{"matches":24,"avg_vote":6.6,"fantavote":8.1,"goals":9,"assists":6,"goals_per90":0.38,"xg":8.4,"xa":5.6,"shots_per90":3.4},
   "stats_curr":{"matches":3,"avg_vote":6.6,"fantavote":7.8,"goals":2,"assists":1,"goals_per90":0.67,"xg":1.9,"xa":0.9,"shots_per90":3.3}},

  {"id":"att_013","name":"Dovbyk","team":"Roma","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":16,"value_estimated":26,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.4,"fantavote":7.7,"goals":16,"assists":4,"goals_per90":0.47,"xg":14.8,"xa":3.6,"shots_per90":4.1},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.5,"goals":2,"assists":1,"goals_per90":0.50,"xg":2.3,"xa":0.8,"shots_per90":4.0}},

  // ─── LAZIO ────────────────────────────────────────────────────────────────────

  {"id":"por_009","name":"Provedel","team":"Lazio","role":"POR","advanced_role":"Portiere",
   "price_initial":11,"value_estimated":15,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.3,"fantavote":7.0,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_018","name":"Marusic","team":"Lazio","role":"DIF","advanced_role":"Terzino",
   "price_initial":7,"value_estimated":9,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.2,"fantavote":6.7,"goals":2,"assists":3,"goals_per90":0.07,"xg":1.4,"xa":2.4,"shots_per90":0.9},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":6.7,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.3,"xa":0.6,"shots_per90":0.9}},

  {"id":"cen_016","name":"Guendouzi","team":"Lazio","role":"CEN","advanced_role":"Mezzala",
   "price_initial":13,"value_estimated":18,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.4,"fantavote":7.2,"goals":5,"assists":7,"goals_per90":0.14,"xg":4.6,"xa":6.4,"shots_per90":2.0},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.3,"goals":1,"assists":2,"goals_per90":0.25,"xg":1.1,"xa":1.6,"shots_per90":2.0}},

  {"id":"cen_017","name":"Rovella","team":"Lazio","role":"CEN","advanced_role":"Mediano",
   "price_initial":11,"value_estimated":15,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.4,"fantavote":7.0,"goals":2,"assists":4,"goals_per90":0.06,"xg":1.8,"xa":3.5,"shots_per90":1.2},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.4,"xa":0.9,"shots_per90":1.1}},

  {"id":"att_014","name":"Castellanos","team":"Lazio","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":12,"value_estimated":20,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.3,"fantavote":7.4,"goals":12,"assists":3,"goals_per90":0.35,"xg":11.2,"xa":2.8,"shots_per90":3.4},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":7.3,"goals":2,"assists":0,"goals_per90":0.50,"xg":2.0,"xa":0.4,"shots_per90":3.3}},

  {"id":"att_015","name":"Zaccagni","team":"Lazio","role":"ATT","advanced_role":"Ala Sinistra",
   "price_initial":16,"value_estimated":24,"tag":"normal","on_penalties":true,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.5,"fantavote":7.8,"goals":10,"assists":8,"goals_per90":0.30,"xg":8.9,"xa":7.4,"shots_per90":3.1},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.7,"goals":2,"assists":2,"goals_per90":0.50,"xg":2.0,"xa":1.8,"shots_per90":3.0}},

  // ─── FIORENTINA ───────────────────────────────────────────────────────────────

  {"id":"por_010","name":"De Gea","team":"Fiorentina","role":"POR","advanced_role":"Portiere",
   "price_initial":10,"value_estimated":16,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.5,"fantavote":7.5,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.4,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_019","name":"Dodo","team":"Fiorentina","role":"DIF","advanced_role":"Terzino",
   "price_initial":10,"value_estimated":13,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.4,"fantavote":7.1,"goals":2,"assists":5,"goals_per90":0.07,"xg":1.6,"xa":4.2,"shots_per90":1.3},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.4,"xa":0.9,"shots_per90":1.2}},

  {"id":"cen_018","name":"Bove","team":"Fiorentina","role":"CEN","advanced_role":"Mezzala",
   "price_initial":8,"value_estimated":12,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":29,"avg_vote":6.3,"fantavote":6.9,"goals":3,"assists":2,"goals_per90":0.10,"xg":2.8,"xa":1.8,"shots_per90":1.6},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.0,"goals":1,"assists":0,"goals_per90":0.25,"xg":0.8,"xa":0.4,"shots_per90":1.5}},

  {"id":"att_016","name":"Kean","team":"Fiorentina","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":14,"value_estimated":28,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.5,"fantavote":8.0,"goals":17,"assists":3,"goals_per90":0.49,"xg":15.4,"xa":2.7,"shots_per90":4.3},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.9,"goals":3,"assists":1,"goals_per90":0.75,"xg":3.0,"xa":0.7,"shots_per90":4.2}},

  {"id":"att_017","name":"Colpani","team":"Fiorentina","role":"ATT","advanced_role":"Ala",
   "price_initial":8,"value_estimated":14,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.3,"fantavote":7.0,"goals":5,"assists":6,"goals_per90":0.17,"xg":4.6,"xa":5.5,"shots_per90":2.2},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.2,"goals":1,"assists":2,"goals_per90":0.25,"xg":1.1,"xa":1.6,"shots_per90":2.1}},

  // ─── TORINO ───────────────────────────────────────────────────────────────────

  {"id":"por_011","name":"Milinkovic-Savic V.","team":"Torino","role":"POR","advanced_role":"Portiere",
   "price_initial":9,"value_estimated":14,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":36,"avg_vote":6.5,"fantavote":7.5,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.4,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_020","name":"Bellanova","team":"Torino","role":"DIF","advanced_role":"Terzino",
   "price_initial":12,"value_estimated":17,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.4,"fantavote":7.2,"goals":2,"assists":7,"goals_per90":0.06,"xg":1.6,"xa":5.8,"shots_per90":1.4},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.1,"goals":0,"assists":2,"goals_per90":0.00,"xg":0.4,"xa":1.4,"shots_per90":1.3}},

  {"id":"att_018","name":"Adams","team":"Torino","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":10,"value_estimated":16,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.3,"fantavote":7.2,"goals":9,"assists":3,"goals_per90":0.30,"xg":8.4,"xa":2.7,"shots_per90":2.9},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":7.0,"goals":1,"assists":1,"goals_per90":0.25,"xg":1.0,"xa":0.8,"shots_per90":2.8}},

  // ─── BOLOGNA ──────────────────────────────────────────────────────────────────

  {"id":"por_012","name":"Skorupski","team":"Bologna","role":"POR","advanced_role":"Portiere",
   "price_initial":8,"value_estimated":11,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.3,"fantavote":6.9,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":6.9,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"dif_021","name":"Posch","team":"Bologna","role":"DIF","advanced_role":"Terzino",
   "price_initial":7,"value_estimated":9,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":31,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":3,"goals_per90":0.03,"xg":0.9,"xa":2.4,"shots_per90":0.8},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":6.7,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.2,"xa":0.6,"shots_per90":0.8}},

  {"id":"cen_019","name":"Ferguson","team":"Bologna","role":"CEN","advanced_role":"Mezzala",
   "price_initial":12,"value_estimated":18,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":true,
   "stats_prev":{"matches":28,"avg_vote":6.4,"fantavote":7.4,"goals":7,"assists":4,"goals_per90":0.25,"xg":6.4,"xa":3.6,"shots_per90":2.7},
   "stats_curr":{"matches":3,"avg_vote":6.5,"fantavote":7.5,"goals":2,"assists":0,"goals_per90":0.67,"xg":1.8,"xa":0.5,"shots_per90":2.6}},

  {"id":"att_019","name":"Castro","team":"Bologna","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":8,"value_estimated":16,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.3,"fantavote":7.3,"goals":10,"assists":3,"goals_per90":0.29,"xg":9.2,"xa":2.7,"shots_per90":3.1},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.4,"goals":2,"assists":1,"goals_per90":0.50,"xg":2.1,"xa":0.8,"shots_per90":3.0}},

  // ─── UDINESE ──────────────────────────────────────────────────────────────────

  {"id":"por_013","name":"Okoye","team":"Udinese","role":"POR","advanced_role":"Portiere",
   "price_initial":8,"value_estimated":13,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":35,"avg_vote":6.4,"fantavote":7.3,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.2,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"att_020","name":"Lucca","team":"Udinese","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":10,"value_estimated":18,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":36,"avg_vote":6.3,"fantavote":7.4,"goals":13,"assists":2,"goals_per90":0.36,"xg":11.8,"xa":1.8,"shots_per90":3.6},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":7.2,"goals":2,"assists":0,"goals_per90":0.50,"xg":2.0,"xa":0.3,"shots_per90":3.5}},

  // ─── GENOA ────────────────────────────────────────────────────────────────────

  {"id":"por_014","name":"Leali","team":"Genoa","role":"POR","advanced_role":"Portiere",
   "price_initial":7,"value_estimated":11,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":34,"avg_vote":6.4,"fantavote":7.2,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.1,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"att_021","name":"Pinamonti","team":"Genoa","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":8,"value_estimated":12,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":31,"avg_vote":6.2,"fantavote":6.9,"goals":8,"assists":2,"goals_per90":0.26,"xg":7.6,"xa":1.8,"shots_per90":2.8},
   "stats_curr":{"matches":4,"avg_vote":6.2,"fantavote":6.8,"goals":1,"assists":0,"goals_per90":0.25,"xg":1.1,"xa":0.3,"shots_per90":2.7}},

  // ─── PARMA ────────────────────────────────────────────────────────────────────

  {"id":"dif_022","name":"Delprato","team":"Parma","role":"DIF","advanced_role":"Difensore Centrale",
   "price_initial":5,"value_estimated":7,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":1,"goals_per90":0.03,"xg":0.9,"xa":0.8,"shots_per90":0.5},
   "stats_curr":{"matches":4,"avg_vote":6.2,"fantavote":6.5,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.2,"xa":0.2,"shots_per90":0.5}},

  {"id":"att_022","name":"Bonny","team":"Parma","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":6,"value_estimated":10,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.2,"fantavote":6.8,"goals":7,"assists":2,"goals_per90":0.23,"xg":6.4,"xa":1.8,"shots_per90":2.6},
   "stats_curr":{"matches":4,"avg_vote":6.3,"fantavote":7.0,"goals":2,"assists":0,"goals_per90":0.50,"xg":1.8,"xa":0.3,"shots_per90":2.5}},

  // ─── VERONA ───────────────────────────────────────────────────────────────────

  {"id":"dif_023","name":"Tchatchoua","team":"Verona","role":"DIF","advanced_role":"Terzino",
   "price_initial":5,"value_estimated":7,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":29,"avg_vote":6.2,"fantavote":6.6,"goals":1,"assists":2,"goals_per90":0.03,"xg":0.8,"xa":1.6,"shots_per90":0.7},
   "stats_curr":{"matches":4,"avg_vote":6.2,"fantavote":6.6,"goals":0,"assists":1,"goals_per90":0.00,"xg":0.2,"xa":0.5,"shots_per90":0.7}},

  {"id":"att_023","name":"Tengstedt","team":"Verona","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":5,"value_estimated":9,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":28,"avg_vote":6.2,"fantavote":6.9,"goals":8,"assists":1,"goals_per90":0.29,"xg":7.2,"xa":0.9,"shots_per90":2.8},
   "stats_curr":{"matches":4,"avg_vote":6.2,"fantavote":7.0,"goals":2,"assists":0,"goals_per90":0.50,"xg":1.8,"xa":0.2,"shots_per90":2.7}},

  // ─── CAGLIARI ─────────────────────────────────────────────────────────────────

  {"id":"por_015","name":"Caprile","team":"Cagliari","role":"POR","advanced_role":"Portiere",
   "price_initial":7,"value_estimated":11,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.4,"fantavote":7.2,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.1,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"att_024","name":"Lapadula","team":"Cagliari","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":6,"value_estimated":9,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":30,"avg_vote":6.2,"fantavote":6.8,"goals":7,"assists":2,"goals_per90":0.23,"xg":6.4,"xa":1.8,"shots_per90":2.6},
   "stats_curr":{"matches":4,"avg_vote":6.2,"fantavote":6.7,"goals":1,"assists":1,"goals_per90":0.25,"xg":1.0,"xa":0.7,"shots_per90":2.5}},

  // ─── COMO ─────────────────────────────────────────────────────────────────────

  {"id":"cen_020","name":"Nico Paz","team":"Como","role":"CEN","advanced_role":"Trequartista",
   "price_initial":8,"value_estimated":18,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":33,"avg_vote":6.4,"fantavote":7.5,"goals":8,"assists":7,"goals_per90":0.24,"xg":7.1,"xa":6.3,"shots_per90":2.8},
   "stats_curr":{"matches":4,"avg_vote":6.5,"fantavote":7.6,"goals":2,"assists":2,"goals_per90":0.50,"xg":1.8,"xa":1.6,"shots_per90":2.7}},

  {"id":"att_025","name":"Cutrone","team":"Como","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":5,"value_estimated":8,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":28,"avg_vote":6.2,"fantavote":6.8,"goals":7,"assists":2,"goals_per90":0.25,"xg":6.2,"xa":1.7,"shots_per90":2.5},
   "stats_curr":{"matches":4,"avg_vote":6.2,"fantavote":6.7,"goals":1,"assists":0,"goals_per90":0.25,"xg":1.1,"xa":0.3,"shots_per90":2.4}},

  // ─── EMPOLI ───────────────────────────────────────────────────────────────────

  {"id":"por_016","name":"Vasquez","team":"Empoli","role":"POR","advanced_role":"Portiere",
   "price_initial":6,"value_estimated":10,"tag":"sleeper","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":32,"avg_vote":6.4,"fantavote":7.2,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.1,"xa":0.0,"shots_per90":0.0},
   "stats_curr":{"matches":4,"avg_vote":6.4,"fantavote":7.1,"goals":0,"assists":0,"goals_per90":0.00,"xg":0.0,"xa":0.0,"shots_per90":0.0}},

  {"id":"att_026","name":"Colombo","team":"Empoli","role":"ATT","advanced_role":"Prima Punta",
   "price_initial":5,"value_estimated":8,"tag":"normal","on_penalties":false,"status":"starter","injury_prone":false,
   "stats_prev":{"matches":29,"avg_vote":6.2,"fantavote":6.8,"goals":7,"assists":1,"goals_per90":0.24,"xg":6.6,"xa":0.9,"shots_per90":2.6},
   "stats_curr":{"matches":4,"avg_vote":6.2,"fantavote":6.7,"goals":1,"assists":0,"goals_per90":0.25,"xg":1.0,"xa":0.2,"shots_per90":2.5}}

];

window.PLAYERS = PLAYERS;
