// ILTASATU PROGRESSIOJÄRJESTELMÄ 
// 4-ominaisuus systeemi: Keho, Mieli, Sielu, Voima
// Limit Break: kun kaikki ominaisuudet saavuttavat skaalan maksimin

import { arkkityypit } from './arkkityypit.js';

// Skaalan nimet
export const SKAALA_NIMET = [
  "Tavallinen",    // Skaala 0
  "Erinomainen",   // Skaala 1  
  "Uskomaton",     // Skaala 2
  "Eeppinen",      // Skaala 3
  "Jumalainen"     // Skaala 4
];

// Voiman progressio taulukko - 3 voimatyyppiä per hahmo
export const voimaProgression = {
  "1": { voima1: 1, voima2: null, voima3: null },
  "2": { voima1: 2, voima2: null, voima3: null },
  "3": { voima1: 3, voima2: null, voima3: null },
  "4": { voima1: 3, voima2: 1, voima3: null },
  "5": { voima1: 4, voima2: 1, voima3: null },
  "6": { voima1: 4, voima2: 2, voima3: null },
  "7": { voima1: 4, voima2: 2, voima3: 1 },
  "8": { voima1: "4e", voima2: 2, voima3: 1 },
  "9": { voima1: "4e", voima2: 3, voima3: 1 },
  "10": { voima1: "4e", voima2: 3, voima3: 2 },
  "11": { voima1: 5, voima2: 3, voima3: 2 },
  "12": { voima1: 5, voima2: 4, voima3: 2 },
  "13": { voima1: 5, voima2: 4, voima3: 3 },
  "14": { voima1: "5e", voima2: 4, voima3: 3 },
  "15": { voima1: "5e", voima2: "4e", voima3: 3 }
};

// Voiman maksimit per skaala (voima voi nousta 3 tasoa per skaala)
export const VOIMAN_MAKSIMIT = [3, 6, 9, 12, 15]; // skaaloille 0-4

// Laske ominaisuuden maksimi arkkityypin perusteella (vain keho, mieli, sielu)
export const laskeOminaisuudenMaksimi = (arkkityyppi, ominaisuus) => {
  const arkki = arkkityypit[arkkityyppi];
  if (!arkki) return 1;
  
  // Keho, Mieli, Sielu: KIINTEÄT maksimit arkkityypin mukaan (EI skaala-bonusta!)
  return arkki[ominaisuus]?.maksimi || 1;
};

// Laske voiman maksimi skaalan perusteella
export const laskeVoimaMaksimi = (skaala = 0) => {
  return VOIMAN_MAKSIMIT[skaala] || 15;
};

// Tarkista voiko ominaisuutta nostaa
export const voikoNostaa = (hahmo, ominaisuus) => {
  let nykyinenArvo, maksimi;
  
  if (ominaisuus === 'voima') {
    // Uudessa arkkitehtuurissa käytä voimaTaso:a
    nykyinenArvo = hahmo.voimaTaso || 1;
    maksimi = laskeVoimaMaksimi(hahmo.skaala);
  } else {
    nykyinenArvo = hahmo[ominaisuus];
    maksimi = laskeOminaisuudenMaksimi(hahmo.arkkityyppi, ominaisuus);
  }
  
  return nykyinenArvo < maksimi;
};

// Tarkista onko limit break mahdollinen (kaikki ominaisuudet maksimissaan)
export const onkoLimitBreakMahdollinen = (hahmo) => {
  const ominaisuudet = ['keho', 'mieli', 'sielu'];
  
  // Tarkista perusominaisuudet
  const ominaisuudetMaksimissa = ominaisuudet.every(ominaisuus => {
    const nykyinen = hahmo[ominaisuus] || 0;
    const maksimi = laskeOminaisuudenMaksimi(hahmo.arkkityyppi, ominaisuus);
    return nykyinen >= maksimi;
  });
  
  // Tarkista voima (uusi arkkitehtuuri)
  const voimaNykyinen = hahmo.voimaTaso || 1;
  const voimaMaksimi = laskeVoimaMaksimi(hahmo.skaala);
  const voimaMaksimissa = voimaNykyinen >= voimaMaksimi;
  
  return ominaisuudetMaksimissa && voimaMaksimissa;
};

// Suorita limit break
export const suoritaLimitBreak = (hahmo) => {
  if (!onkoLimitBreakMahdollinen(hahmo)) {
    return hahmo; // Ei voida suorittaa
  }
  
  const arkki = arkkityypit[hahmo.arkkityyppi];
  if (!arkki) return hahmo;
  
  return {
    ...hahmo,
    skaala: hahmo.skaala + 1,
    keho: arkki.keho?.alkuarvo || 1,
    mieli: arkki.mieli?.alkuarvo || 1,  
    sielu: arkki.sielu?.alkuarvo || 1,
    // Voima säilyy ennallaan (EI nouse automaattisesti)
    onkoRajamurto: true
  };
};

// Selvitä mikä voima muuttui progression mukaan
export const selvitaMuuttunutVoima = (vanhaTaso, uusiTaso) => {
  // Erityistapaus: taso 0 -> 1 (ensimmäinen voima aktivoituu)
  if (vanhaTaso === 0 && uusiTaso === 1) {
    return {
      voima: 'primary',
      vanhaTaso: null,
      uusiTaso: 1,
      edistynyt: false,
      kykyjaValittava: 1
    };
  }
  
  const vanhaData = voimaProgression[vanhaTaso.toString()];
  const uusiData = voimaProgression[uusiTaso.toString()];
  
  if (!vanhaData || !uusiData) return null;
  
  // Apufunktio: onko taso edistynyt (sisältää "e")
  const onEdistynyt = (taso) => typeof taso === 'string' && taso.includes('e');
  
  // Tarkista mikä voima nousi tai aktivoitui
  const tarkistaVoima = (avain, vanha, uusi) => {
    if (vanha === uusi) return null;
    
    return {
      voima: avain,
      vanhaTaso: vanha,
      uusiTaso: uusi,
      edistynyt: onEdistynyt(uusi) && !onEdistynyt(vanha) // Muuttui edistyneeksi
    };
  };
  
  return tarkistaVoima('primary', vanhaData.voima1, uusiData.voima1)
    || tarkistaVoima('secondary', vanhaData.voima2, uusiData.voima2)
    || tarkistaVoima('tertiary', vanhaData.voima3, uusiData.voima3);
};

// Visualisointi palloilla
export const palloMuunto = {
  "0": "○○○",
  "1": "●○○", 
  "2": "●●○",
  "3": "●●●",
  "4": "●●●◐",   // 3 täyttä + puolikas
  "4e": "●●●●",   // 4 täyttä (edistynyt)
  "5": "●●●●◐",   // 4 täyttä + puolikas
  "5e": "●●●●●"    // 5 täyttä (edistynyt)
};

export const haeOminaisuudenPallot = (nykyinen, maksimi) => {
  const ympyrat = Math.min(maksimi, 5); // Maksimissaan 5 ympyrää näkyvissä
  let tulos = "";
  
  for (let i = 0; i < ympyrat; i++) {
    tulos += i < nykyinen ? "●" : "○";
  }
 
  return tulos;
};

// LEGACY COMPATIBILITY FUNCTIONS (for gradual transition)
// These maintain compatibility with existing code while we migrate to new system

// Legacy function - returns voima level from progression table
export const haeVoimanTaso = (voimaTaso, voimaIndex = 1) => {
  const progression = voimaProgression[voimaTaso.toString()];
  if (!progression) return null;
  
  switch(voimaIndex) {
    case 1: return progression.voima1;
    case 2: return progression.voima2; 
    case 3: return progression.voima3;
    default: return null;
  }
};

// Legacy function - returns visual representation of voima
export const haeVoimanPallot = (taso) => {
  return palloMuunto[taso.toString()] || "";
};

// Enhanced abilities explanations
export const edistynyeetSelitykset = {
  "4e": {
    "perusvoimat": 4,
    "edistyneet": 1,
    "yhteensa": 5,
    "kuvaus": "4 perusvoimaa + 1 edistynyt kyky"
  },
  "5e": {
    "perusvoimat": 5,
    "edistyneet": 3,
    "yhteensa": 8,
    "kuvaus": "5 perusvoimaa + 3 edistynyttä kykyä"
  }
};

export const haeEdistyneidenSelitys = (taso) => {
  return edistynyeetSelitykset[taso] || null;
};

// Legacy function - now uses character's scale directly
export const haeSkaala = (hahmo) => {
  return typeof hahmo === 'object' ? hahmo.skaala || 0 : 0;
};

// Legacy function - gets scale name from character
export const haeSkaalaText = (hahmo) => {
  const skaala = typeof hahmo === 'object' ? hahmo.skaala || 0 : 0;
  return SKAALA_NIMET[skaala] || "Tavallinen";
};

// Get next level info (what would happen if attribute increased)
export const haeSeuraavaTaso = (hahmo, ominaisuus) => {
  const nykyinen = hahmo[ominaisuus] || 0;
  
  let maksimi;
  if (ominaisuus === 'voima') {
    maksimi = laskeVoimaMaksimi(hahmo.skaala);
  } else {
    maksimi = laskeOminaisuudenMaksimi(hahmo.arkkityyppi, ominaisuus);
  }
  
  if (nykyinen >= maksimi) {
    return { voiNostaa: false, syy: "Maksimi saavutettu" };
  }
  
  return {
    voiNostaa: true,
    uusiArvo: nykyinen + 1,
    maksimi,
    ominaisuus
  };
};