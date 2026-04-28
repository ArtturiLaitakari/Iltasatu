export const voimaProgression = {
  "1": {
    "voima1": 1,
    "voima2": null,
    "voima3": null,
    "skaala": 0,
    "skaalaText": "Tavallinen"
  },
  "2": {
    "voima1": 2,
    "voima2": null,
    "voima3": null,
    "skaala": 0,
    "skaalaText": "Tavallinen"
  },
  "3": {
    "voima1": 3,
    "voima2": null,
    "voima3": null,
    "skaala": 0,
    "skaalaText": "Tavallinen"
  },
  "4": {
    "voima1": 3,
    "voima2": 1,
    "voima3": null,
    "skaala": 1,
    "skaalaText": "Erinomainen"
  },
  "5": {
    "voima1": 4,
    "voima2": 1,
    "voima3": null,
    "skaala": 1,
    "skaalaText": "Erinomainen"
  },
  "6": {
    "voima1": 4,
    "voima2": 2,
    "voima3": null,
    "skaala": 1,
    "skaalaText": "Erinomainen"
  },
  "7": {
    "voima1": 4,
    "voima2": 2,
    "voima3": 1,
    "skaala": 2,
    "skaalaText": "Uskomaton"
  },
  "8": {
    "voima1": "4e",
    "voima2": 2,
    "voima3": 1,
    "skaala": 2,
    "skaalaText": "Uskomaton"
  },
  "9": {
    "voima1": "4e",
    "voima2": 3,
    "voima3": 1,
    "skaala": 2,
    "skaalaText": "Uskomaton"
  },
  "10": {
    "voima1": "4e",
    "voima2": 3,
    "voima3": 2,
    "skaala": 3,
    "skaalaText": "Eeppinen"
  },
  "11": {
    "voima1": 5,
    "voima2": 3,
    "voima3": 2,
    "skaala": 3,
    "skaalaText": "Eeppinen"
  },
  "12": {
    "voima1": 5,
    "voima2": 4,
    "voima3": 2,
    "skaala": 3,
    "skaalaText": "Eeppinen"
  },
  "13": {
    "voima1": 5,
    "voima2": "4e",
    "voima3": 3,
    "skaala": 4,
    "skaalaText": "Jumalainen"
  },
  "14": {
    "voima1": "5e",
    "voima2": 4,
    "voima3": 3,
    "skaala": 4,
    "skaalaText": "Jumalainen"
  },
  "15": {
    "voima1": "5e",
    "voima2": "4e",
    "voima3": 3,
    "skaala": 4,
    "skaalaText": "Jumalainen"
  }
};

export const palloMuunto = {
  "0": "○○○",
  "1": "●○○",
  "2": "●●○", 
  "3": "●●●",
  "4": "●●●◐○",
  "4e": "●●●●",
  "5": "●●●●◐",
  "5e": "●●●●●"
};

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

// Apufunktioita
export const haeVoimanTaso = (kokonaisprogression, voimaIndex) => {
  const progression = voimaProgression[kokonaisprogression.toString()];
  if (!progression) return null;
  
  switch(voimaIndex) {
    case 1: return progression.voima1;
    case 2: return progression.voima2;
    case 3: return progression.voima3;
    default: return null;
  }
};

export const haeVoimanPallot = (taso) => {
  return palloMuunto[taso] || "";
};

export const haeSkaala = (kokonaisprogression) => {
  const progression = voimaProgression[kokonaisprogression.toString()];
  return progression ? progression.skaala : 0;
};

export const haeSkaalaText = (kokonaisprogression) => {
  const progression = voimaProgression[kokonaisprogression.toString()];
  return progression ? progression.skaalaText : "Tavallinen";
};

export const haeEdistyneidenSelitys = (taso) => {
  return edistynyeetSelitykset[taso] || null;
};

// Tarkista voiko voimaa nostaa
export const voikoNostaaVoimaa = (nykyinenKokonaisprogression, maksimiprogression = 15) => {
  return nykyinenKokonaisprogression < maksimiprogression;
};

// Laske seuraavan tason tiedot
export const haeSeuraavaTaso = (nykyinenKokonaisprogression) => {
  const seuraavaTaso = nykyinenKokonaisprogression + 1;
  return voimaProgression[seuraavaTaso.toString()] || null;
};