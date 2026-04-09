const PLAYERS = [

  // ══════════════════════════════════════════════
  //  INTER
  // ══════════════════════════════════════════════

  // Portieri
  {"id":"por_001","name":"Sommer","team":"Inter","role":"POR","advanced_role":"Portiere","price_initial":16,"value_estimated":23,"tag":"normal","on_penalties":false,"stats":{"matches":32,"avg_vote":6.4,"fantavote":7.1,"goals":0,"assists":0}},
  {"id":"por_002","name":"Martinez J.","team":"Inter","role":"POR","advanced_role":"Portiere","price_initial":4,"value_estimated":5,"tag":"normal","on_penalties":false,"stats":{"matches":6,"avg_vote":6.2,"fantavote":6.5,"goals":0,"assists":0}},

  // Difensori
  {"id":"dif_001","name":"Dimarco","team":"Inter","role":"DIF","advanced_role":"Terzino","price_initial":19,"value_estimated":28,"tag":"normal","on_penalties":false,"stats":{"matches":31,"avg_vote":6.5,"fantavote":7.8,"goals":4,"assists":7}},
  {"id":"dif_002","name":"Dumfries","team":"Inter","role":"DIF","advanced_role":"Terzino","price_initial":20,"value_estimated":25,"tag":"normal","on_penalties":false,"stats":{"matches":29,"avg_vote":6.3,"fantavote":7.1,"goals":3,"assists":5}},
  {"id":"dif_003","name":"Bastoni","team":"Inter","role":"DIF","advanced_role":"Difensore Centrale","price_initial":16,"value_estimated":20,"tag":"normal","on_penalties":false,"stats":{"matches":32,"avg_vote":6.5,"fantavote":7.3,"goals":2,"assists":4}},
  {"id":"dif_004","name":"Acerbi","team":"Inter","role":"DIF","advanced_role":"Difensore Centrale","price_initial":8,"value_estimated":9,"tag":"normal","on_penalties":false,"stats":{"matches":25,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":1}},
  {"id":"dif_005","name":"De Vrij","team":"Inter","role":"DIF","advanced_role":"Difensore Centrale","price_initial":9,"value_estimated":11,"tag":"normal","on_penalties":false,"stats":{"matches":28,"avg_vote":6.3,"fantavote":6.6,"goals":1,"assists":2}},
  {"id":"dif_006","name":"Darmian","team":"Inter","role":"DIF","advanced_role":"Terzino","price_initial":7,"value_estimated":8,"tag":"normal","on_penalties":false,"stats":{"matches":24,"avg_vote":6.2,"fantavote":6.5,"goals":1,"assists":2}},

  // Centrocampisti
  {"id":"cen_001","name":"Calhanoglu","team":"Inter","role":"CEN","advanced_role":"Regista","price_initial":23,"value_estimated":38,"tag":"normal","on_penalties":true,"stats":{"matches":28,"avg_vote":6.5,"fantavote":7.7,"goals":7,"assists":7}},
  {"id":"cen_002","name":"Barella","team":"Inter","role":"CEN","advanced_role":"Mezzala","price_initial":30,"value_estimated":42,"tag":"normal","on_penalties":false,"stats":{"matches":31,"avg_vote":6.6,"fantavote":7.5,"goals":5,"assists":8}},
  {"id":"cen_003","name":"Mkhitaryan","team":"Inter","role":"CEN","advanced_role":"Mezzala","price_initial":12,"value_estimated":16,"tag":"normal","on_penalties":false,"stats":{"matches":27,"avg_vote":6.4,"fantavote":7.0,"goals":3,"assists":5}},
  {"id":"cen_004","name":"Frattesi","team":"Inter","role":"CEN","advanced_role":"Mezzala","price_initial":18,"value_estimated":26,"tag":"sleeper","on_penalties":false,"stats":{"matches":30,"avg_vote":6.3,"fantavote":7.2,"goals":6,"assists":3}},
  {"id":"cen_005","name":"Zielinski","team":"Inter","role":"CEN","advanced_role":"Trequartista","price_initial":14,"value_estimated":18,"tag":"normal","on_penalties":false,"stats":{"matches":24,"avg_vote":6.3,"fantavote":6.9,"goals":3,"assists":4}},

  // Attaccanti
  {"id":"att_001","name":"Martinez L.","team":"Inter","role":"ATT","advanced_role":"Prima Punta","price_initial":34,"value_estimated":95,"tag":"hype","on_penalties":true,"stats":{"matches":31,"avg_vote":6.8,"fantavote":9.0,"goals":22,"assists":5}},
  {"id":"att_002","name":"Thuram","team":"Inter","role":"ATT","advanced_role":"Prima Punta","price_initial":28,"value_estimated":65,"tag":"hype","on_penalties":false,"stats":{"matches":33,"avg_vote":6.6,"fantavote":8.2,"goals":15,"assists":7}},
  {"id":"att_003","name":"Correa","team":"Inter","role":"ATT","advanced_role":"Segunda Punta","price_initial":6,"value_estimated":7,"tag":"normal","on_penalties":false,"stats":{"matches":14,"avg_vote":6.0,"fantavote":6.3,"goals":2,"assists":1}},

  // ══════════════════════════════════════════════
  //  MILAN
  // ══════════════════════════════════════════════

  // Portieri
  {"id":"por_003","name":"Maignan","team":"Milan","role":"POR","advanced_role":"Portiere","price_initial":16,"value_estimated":22,"tag":"normal","on_penalties":false,"stats":{"matches":31,"avg_vote":6.5,"fantavote":7.2,"goals":0,"assists":0}},
  {"id":"por_004","name":"Sportiello","team":"Milan","role":"POR","advanced_role":"Portiere","price_initial":3,"value_estimated":4,"tag":"normal","on_penalties":false,"stats":{"matches":7,"avg_vote":6.1,"fantavote":6.3,"goals":0,"assists":0}},

  // Difensori
  {"id":"dif_007","name":"Theo Hernandez","team":"Milan","role":"DIF","advanced_role":"Terzino","price_initial":28,"value_estimated":38,"tag":"hype","on_penalties":false,"stats":{"matches":30,"avg_vote":6.4,"fantavote":7.6,"goals":5,"assists":6}},
  {"id":"dif_008","name":"Calabria","team":"Milan","role":"DIF","advanced_role":"Terzino","price_initial":8,"value_estimated":10,"tag":"normal","on_penalties":false,"stats":{"matches":26,"avg_vote":6.2,"fantavote":6.7,"goals":1,"assists":3}},
  {"id":"dif_009","name":"Tomori","team":"Milan","role":"DIF","advanced_role":"Difensore Centrale","price_initial":10,"value_estimated":12,"tag":"normal","on_penalties":false,"stats":{"matches":27,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":1}},
  {"id":"dif_010","name":"Gabbia","team":"Milan","role":"DIF","advanced_role":"Difensore Centrale","price_initial":7,"value_estimated":9,"tag":"sleeper","on_penalties":false,"stats":{"matches":28,"avg_vote":6.3,"fantavote":6.6,"goals":2,"assists":0}},
  {"id":"dif_011","name":"Emerson Royal","team":"Milan","role":"DIF","advanced_role":"Terzino","price_initial":6,"value_estimated":7,"tag":"normal","on_penalties":false,"stats":{"matches":22,"avg_vote":6.1,"fantavote":6.4,"goals":0,"assists":2}},

  // Centrocampisti
  {"id":"cen_006","name":"Reijnders","team":"Milan","role":"CEN","advanced_role":"Mezzala","price_initial":22,"value_estimated":36,"tag":"hype","on_penalties":false,"stats":{"matches":33,"avg_vote":6.6,"fantavote":7.8,"goals":10,"assists":5}},
  {"id":"cen_007","name":"Fofana","team":"Milan","role":"CEN","advanced_role":"Mediano","price_initial":14,"value_estimated":17,"tag":"normal","on_penalties":false,"stats":{"matches":28,"avg_vote":6.4,"fantavote":6.8,"goals":1,"assists":3}},
  {"id":"cen_008","name":"Musah","team":"Milan","role":"CEN","advanced_role":"Mezzala","price_initial":8,"value_estimated":11,"tag":"normal","on_penalties":false,"stats":{"matches":25,"avg_vote":6.2,"fantavote":6.6,"goals":1,"assists":2}},
  {"id":"cen_009","name":"Loftus-Cheek","team":"Milan","role":"CEN","advanced_role":"Mezzala","price_initial":10,"value_estimated":12,"tag":"normal","on_penalties":false,"stats":{"matches":20,"avg_vote":6.2,"fantavote":6.7,"goals":2,"assists":3}},

  // Attaccanti
  {"id":"att_004","name":"Leao","team":"Milan","role":"ATT","advanced_role":"Ala","price_initial":35,"value_estimated":70,"tag":"hype","on_penalties":false,"stats":{"matches":32,"avg_vote":6.6,"fantavote":8.1,"goals":11,"assists":9}},
  {"id":"att_005","name":"Morata","team":"Milan","role":"ATT","advanced_role":"Prima Punta","price_initial":18,"value_estimated":28,"tag":"normal","on_penalties":false,"stats":{"matches":28,"avg_vote":6.4,"fantavote":7.2,"goals":8,"assists":6}},
  {"id":"att_006","name":"Pulisic","team":"Milan","role":"ATT","advanced_role":"Ala","price_initial":22,"value_estimated":40,"tag":"hype","on_penalties":false,"stats":{"matches":31,"avg_vote":6.6,"fantavote":7.9,"goals":12,"assists":8}},
  {"id":"att_007","name":"Abraham","team":"Milan","role":"ATT","advanced_role":"Prima Punta","price_initial":12,"value_estimated":20,"tag":"sleeper","on_penalties":false,"stats":{"matches":18,"avg_vote":6.3,"fantavote":7.0,"goals":6,"assists":2}},

  // ══════════════════════════════════════════════
  //  JUVENTUS
  // ══════════════════════════════════════════════

  // Portieri
  {"id":"por_005","name":"Di Gregorio","team":"Juventus","role":"POR","advanced_role":"Portiere","price_initial":16,"value_estimated":21,"tag":"normal","on_penalties":false,"stats":{"matches":33,"avg_vote":6.4,"fantavote":7.0,"goals":0,"assists":0}},
  {"id":"por_006","name":"Perin","team":"Juventus","role":"POR","advanced_role":"Portiere","price_initial":4,"value_estimated":5,"tag":"normal","on_penalties":false,"stats":{"matches":5,"avg_vote":6.2,"fantavote":6.4,"goals":0,"assists":0}},

  // Difensori
  {"id":"dif_012","name":"Cambiaso","team":"Juventus","role":"DIF","advanced_role":"Terzino","price_initial":20,"value_estimated":30,"tag":"hype","on_penalties":false,"stats":{"matches":30,"avg_vote":6.5,"fantavote":7.5,"goals":4,"assists":6}},
  {"id":"dif_013","name":"Bremer","team":"Juventus","role":"DIF","advanced_role":"Difensore Centrale","price_initial":14,"value_estimated":16,"tag":"normal","on_penalties":false,"stats":{"matches":12,"avg_vote":6.4,"fantavote":6.8,"goals":1,"assists":0}},
  {"id":"dif_014","name":"Gatti","team":"Juventus","role":"DIF","advanced_role":"Difensore Centrale","price_initial":8,"value_estimated":11,"tag":"sleeper","on_penalties":false,"stats":{"matches":30,"avg_vote":6.3,"fantavote":6.8,"goals":2,"assists":1}},
  {"id":"dif_015","name":"Savona","team":"Juventus","role":"DIF","advanced_role":"Terzino","price_initial":5,"value_estimated":8,"tag":"sleeper","on_penalties":false,"stats":{"matches":22,"avg_vote":6.2,"fantavote":6.6,"goals":1,"assists":2}},
  {"id":"dif_016","name":"Danilo","team":"Juventus","role":"DIF","advanced_role":"Difensore Centrale","price_initial":6,"value_estimated":7,"tag":"normal","on_penalties":false,"stats":{"matches":18,"avg_vote":6.2,"fantavote":6.4,"goals":0,"assists":1}},

  // Centrocampisti
  {"id":"cen_010","name":"Locatelli","team":"Juventus","role":"CEN","advanced_role":"Regista","price_initial":10,"value_estimated":13,"tag":"normal","on_penalties":false,"stats":{"matches":29,"avg_vote":6.3,"fantavote":6.7,"goals":2,"assists":3}},
  {"id":"cen_011","name":"Thuram K.","team":"Juventus","role":"CEN","advanced_role":"Mezzala","price_initial":9,"value_estimated":13,"tag":"sleeper","on_penalties":false,"stats":{"matches":27,"avg_vote":6.3,"fantavote":6.8,"goals":2,"assists":4}},
  {"id":"cen_012","name":"McKennie","team":"Juventus","role":"CEN","advanced_role":"Mezzala","price_initial":8,"value_estimated":11,"tag":"normal","on_penalties":false,"stats":{"matches":25,"avg_vote":6.3,"fantavote":6.9,"goals":3,"assists":3}},
  {"id":"cen_013","name":"Douglas Luiz","team":"Juventus","role":"CEN","advanced_role":"Mezzala","price_initial":16,"value_estimated":20,"tag":"normal","on_penalties":false,"stats":{"matches":20,"avg_vote":6.2,"fantavote":6.6,"goals":2,"assists":3}},
  {"id":"cen_014","name":"Fagioli","team":"Juventus","role":"CEN","advanced_role":"Trequartista","price_initial":8,"value_estimated":12,"tag":"sleeper","on_penalties":false,"stats":{"matches":22,"avg_vote":6.2,"fantavote":6.7,"goals":2,"assists":4}},

  // Attaccanti
  {"id":"att_008","name":"Vlahovic","team":"Juventus","role":"ATT","advanced_role":"Prima Punta","price_initial":32,"value_estimated":60,"tag":"hype","on_penalties":true,"stats":{"matches":30,"avg_vote":6.5,"fantavote":8.0,"goals":17,"assists":3}},
  {"id":"att_009","name":"Yildiz","team":"Juventus","role":"ATT","advanced_role":"Ala","price_initial":18,"value_estimated":35,"tag":"hype","on_penalties":false,"stats":{"matches":31,"avg_vote":6.5,"fantavote":7.5,"goals":9,"assists":6}},
  {"id":"att_010","name":"Conceicao","team":"Juventus","role":"ATT","advanced_role":"Ala","price_initial":14,"value_estimated":25,"tag":"sleeper","on_penalties":false,"stats":{"matches":24,"avg_vote":6.4,"fantavote":7.3,"goals":7,"assists":5}},
  {"id":"att_011","name":"Koopmeiners","team":"Juventus","role":"ATT","advanced_role":"Trequartista","price_initial":22,"value_estimated":32,"tag":"normal","on_penalties":false,"stats":{"matches":26,"avg_vote":6.4,"fantavote":7.2,"goals":6,"assists":5}},

  // ══════════════════════════════════════════════
  //  NAPOLI
  // ══════════════════════════════════════════════

  // Portieri
  {"id":"por_007","name":"Meret","team":"Napoli","role":"POR","advanced_role":"Portiere","price_initial":16,"value_estimated":22,"tag":"normal","on_penalties":false,"stats":{"matches":32,"avg_vote":6.3,"fantavote":6.9,"goals":0,"assists":0}},
  {"id":"por_008","name":"Contini","team":"Napoli","role":"POR","advanced_role":"Portiere","price_initial":2,"value_estimated":3,"tag":"normal","on_penalties":false,"stats":{"matches":4,"avg_vote":6.1,"fantavote":6.2,"goals":0,"assists":0}},

  // Difensori
  {"id":"dif_017","name":"Di Lorenzo","team":"Napoli","role":"DIF","advanced_role":"Terzino","price_initial":18,"value_estimated":24,"tag":"normal","on_penalties":false,"stats":{"matches":33,"avg_vote":6.4,"fantavote":7.2,"goals":3,"assists":5}},
  {"id":"dif_018","name":"Olivera","team":"Napoli","role":"DIF","advanced_role":"Terzino","price_initial":9,"value_estimated":12,"tag":"normal","on_penalties":false,"stats":{"matches":28,"avg_vote":6.3,"fantavote":6.9,"goals":2,"assists":4}},
  {"id":"dif_019","name":"Rrahmani","team":"Napoli","role":"DIF","advanced_role":"Difensore Centrale","price_initial":9,"value_estimated":11,"tag":"normal","on_penalties":false,"stats":{"matches":29,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":1}},
  {"id":"dif_020","name":"Buongiorno","team":"Napoli","role":"DIF","advanced_role":"Difensore Centrale","price_initial":12,"value_estimated":16,"tag":"sleeper","on_penalties":false,"stats":{"matches":30,"avg_vote":6.4,"fantavote":6.9,"goals":2,"assists":1}},
  {"id":"dif_021","name":"Mazzocchi","team":"Napoli","role":"DIF","advanced_role":"Terzino","price_initial":5,"value_estimated":7,"tag":"normal","on_penalties":false,"stats":{"matches":20,"avg_vote":6.2,"fantavote":6.5,"goals":1,"assists":2}},

  // Centrocampisti
  {"id":"cen_015","name":"McTominay","team":"Napoli","role":"CEN","advanced_role":"Mezzala","price_initial":26,"value_estimated":50,"tag":"hype","on_penalties":false,"stats":{"matches":33,"avg_vote":6.6,"fantavote":8.0,"goals":8,"assists":6}},
  {"id":"cen_016","name":"Lobotka","team":"Napoli","role":"CEN","advanced_role":"Regista","price_initial":15,"value_estimated":19,"tag":"normal","on_penalties":false,"stats":{"matches":30,"avg_vote":6.5,"fantavote":7.0,"goals":1,"assists":3}},
  {"id":"cen_017","name":"Anguissa","team":"Napoli","role":"CEN","advanced_role":"Mediano","price_initial":14,"value_estimated":18,"tag":"normal","on_penalties":false,"stats":{"matches":29,"avg_vote":6.4,"fantavote":7.0,"goals":2,"assists":4}},
  {"id":"cen_018","name":"Gilmour","team":"Napoli","role":"CEN","advanced_role":"Mediano","price_initial":8,"value_estimated":11,"tag":"sleeper","on_penalties":false,"stats":{"matches":25,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":2}},

  // Attaccanti
  {"id":"att_012","name":"Lukaku","team":"Napoli","role":"ATT","advanced_role":"Prima Punta","price_initial":28,"value_estimated":55,"tag":"hype","on_penalties":false,"stats":{"matches":31,"avg_vote":6.6,"fantavote":8.0,"goals":14,"assists":8}},
  {"id":"att_013","name":"Politano","team":"Napoli","role":"ATT","advanced_role":"Ala","price_initial":16,"value_estimated":24,"tag":"normal","on_penalties":true,"stats":{"matches":30,"avg_vote":6.4,"fantavote":7.3,"goals":7,"assists":5}},
  {"id":"att_014","name":"Kvaratskhelia","team":"Napoli","role":"ATT","advanced_role":"Ala","price_initial":35,"value_estimated":72,"tag":"hype","on_penalties":false,"stats":{"matches":18,"avg_vote":6.7,"fantavote":8.3,"goals":9,"assists":7}},
  {"id":"att_015","name":"Neres","team":"Napoli","role":"ATT","advanced_role":"Ala","price_initial":14,"value_estimated":28,"tag":"sleeper","on_penalties":false,"stats":{"matches":28,"avg_vote":6.4,"fantavote":7.4,"goals":7,"assists":6}},

  // ══════════════════════════════════════════════
  //  ATALANTA
  // ══════════════════════════════════════════════

  // Portieri
  {"id":"por_009","name":"Carnesecchi","team":"Atalanta","role":"POR","advanced_role":"Portiere","price_initial":14,"value_estimated":20,"tag":"sleeper","on_penalties":false,"stats":{"matches":33,"avg_vote":6.5,"fantavote":7.3,"goals":0,"assists":0}},
  {"id":"por_010","name":"Rossi F.","team":"Atalanta","role":"POR","advanced_role":"Portiere","price_initial":2,"value_estimated":3,"tag":"normal","on_penalties":false,"stats":{"matches":4,"avg_vote":6.1,"fantavote":6.2,"goals":0,"assists":0}},

  // Difensori
  {"id":"dif_022","name":"Hateboer","team":"Atalanta","role":"DIF","advanced_role":"Terzino","price_initial":6,"value_estimated":9,"tag":"normal","on_penalties":false,"stats":{"matches":26,"avg_vote":6.2,"fantavote":6.7,"goals":1,"assists":3}},
  {"id":"dif_023","name":"Kolasinac","team":"Atalanta","role":"DIF","advanced_role":"Terzino","price_initial":6,"value_estimated":8,"tag":"normal","on_penalties":false,"stats":{"matches":24,"avg_vote":6.2,"fantavote":6.6,"goals":1,"assists":2}},
  {"id":"dif_024","name":"Djimsiti","team":"Atalanta","role":"DIF","advanced_role":"Difensore Centrale","price_initial":8,"value_estimated":10,"tag":"normal","on_penalties":false,"stats":{"matches":27,"avg_vote":6.3,"fantavote":6.7,"goals":1,"assists":1}},
  {"id":"dif_025","name":"Scalvini","team":"Atalanta","role":"DIF","advanced_role":"Difensore Centrale","price_initial":10,"value_estimated":14,"tag":"sleeper","on_penalties":false,"stats":{"matches":22,"avg_vote":6.3,"fantavote":6.8,"goals":1,"assists":2}},
  {"id":"dif_026","name":"Bellanova","team":"Atalanta","role":"DIF","advanced_role":"Terzino","price_initial":14,"value_estimated":20,"tag":"sleeper","on_penalties":false,"stats":{"matches":30,"avg_vote":6.4,"fantavote":7.2,"goals":2,"assists":7}},

  // Centrocampisti
  {"id":"cen_019","name":"De Roon","team":"Atalanta","role":"CEN","advanced_role":"Mediano","price_initial":8,"value_estimated":10,"tag":"normal","on_penalties":false,"stats":{"matches":30,"avg_vote":6.3,"fantavote":6.7,"goals":2,"assists":2}},
  {"id":"cen_020","name":"Ederson","team":"Atalanta","role":"CEN","advanced_role":"Mezzala","price_initial":16,"value_estimated":24,"tag":"sleeper","on_penalties":false,"stats":{"matches":29,"avg_vote":6.4,"fantavote":7.2,"goals":4,"assists":5}},
  {"id":"cen_021","name":"Pasalic","team":"Atalanta","role":"CEN","advanced_role":"Trequartista","price_initial":13,"value_estimated":18,"tag":"normal","on_penalties":false,"stats":{"matches":28,"avg_vote":6.4,"fantavote":7.2,"goals":5,"assists":5}},
  {"id":"cen_022","name":"Koopmeiners T.","team":"Atalanta","role":"CEN","advanced_role":"Trequartista","price_initial":20,"value_estimated":30,"tag":"normal","on_penalties":false,"stats":{"matches":15,"avg_vote":6.4,"fantavote":7.1,"goals":4,"assists":3}},
  {"id":"cen_023","name":"Samardzic","team":"Atalanta","role":"CEN","advanced_role":"Mezzala","price_initial":12,"value_estimated":18,"tag":"sleeper","on_penalties":false,"stats":{"matches":26,"avg_vote":6.3,"fantavote":7.0,"goals":4,"assists":4}},

  // Attaccanti
  {"id":"att_016","name":"Lookman","team":"Atalanta","role":"ATT","advanced_role":"Ala","price_initial":28,"value_estimated":62,"tag":"hype","on_penalties":false,"stats":{"matches":32,"avg_vote":6.7,"fantavote":8.4,"goals":14,"assists":9}},
  {"id":"att_017","name":"Retegui","team":"Atalanta","role":"ATT","advanced_role":"Prima Punta","price_initial":24,"value_estimated":55,"tag":"hype","on_penalties":true,"stats":{"matches":31,"avg_vote":6.6,"fantavote":8.2,"goals":19,"assists":4}},
  {"id":"att_018","name":"De Ketelaere","team":"Atalanta","role":"ATT","advanced_role":"Trequartista","price_initial":22,"value_estimated":38,"tag":"hype","on_penalties":false,"stats":{"matches":30,"avg_vote":6.6,"fantavote":7.8,"goals":9,"assists":10}},
  {"id":"att_019","name":"Zaniolo","team":"Atalanta","role":"ATT","advanced_role":"Ala","price_initial":10,"value_estimated":16,"tag":"sleeper","on_penalties":false,"stats":{"matches":22,"avg_vote":6.3,"fantavote":6.9,"goals":4,"assists":3}}

];
window.PLAYERS = PLAYERS;
