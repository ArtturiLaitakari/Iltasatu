// Kampanjakohtaiset rajoitteet roduille ja voimille
// Skaalaperusteinen järjestelmä:
// - Skaala 0 (Tavallinen): 1. voima listasta
// - Skaala 1 (Erinomainen): 2 ensimmäistä voimaa listasta
// - Skaala 2 (Uskomaton): 3 ensimmäistä voimaa listasta
// - Skaala 3+ (Eeppinen+): kaikki mahdolliset voimat (koko voimat.js)
// - Jumalaisten voimien saatavuus: jumalaisetVoimat määrittää alarajan skaala

import { voimat } from './voimat.js';

export const kampanjaRajoitteet = {
  'avoin-fantasia': {
    ammattiTyyppi: 'fantasia',
    jumalaisetVoimat: 2,
    rajoitteet: {
      '*': { // Kaikki rodut
        sallitutVoimat: '*' // Kaikki voimat sallittu, myös jumalaiset
      }
    },
    variantit: {}
  },

  'hopea-fantasia': {
    ammattiTyyppi: 'fantasia',
    jumalaisetVoimat: 5,
    rajoitteet: { // Sallitut rodut: Ihminen + 6 muuta rotua
      'Ihminen': {
        sallitutVoimat: '*' // Ihminen saa kaikki voimat
      },
      'Hopeahaltia': {
        sallitutVoimat: ['magia', 'mentalismi', 'elementin hallinta'] // Skaala 0: magia, Skaala 1: +mentalismi, Skaala 2+: +elementin hallinta
      },
      'Kultahaltia': {
        sallitutVoimat: ['mentalismi', 'magia', 'elementin hallinta'] // Skaala 0: mentalismi, Skaala 1: +magia, Skaala 2+: +elementin hallinta
      },
      'Päivähaltia': {
        sallitutVoimat: ['magia', 'mentalismi', 'elementin hallinta'] // Skaala 0: magia, Skaala 1: +mentalismi, Skaala 2+: +elementin hallinta
      },
      'Pimentohaltia': {
        sallitutVoimat: ['mentalismi', 'magia', 'elementin hallinta'] // Skaala 0: mentalismi, Skaala 1: +magia, Skaala 2+: +elementin hallinta
      },
      'Kääpiö': {
        sallitutVoimat: ['elementin hallinta', 'magia', 'mentalismi'] // Skaala 0: elementin hallinta, Skaala 1: +magia, Skaala 2+: +mentalismi
      },
      'Puolituinen': {
        sallitutVoimat: '*' // Kaikki voimat kaikilla skaaloilla
      },
      'Kimera': {
        sallitutVoimat: ['muodonmuutos', 'mentalismi', 'elementin hallinta'] 
      }
    },
    variantit: {
      'Pimentohaltia': {
        nimi: 'Hopeahaltia',
        kuvaus: 'Pimentohaltiasuku joka menetti mentalismin mutta peri magian'
      },
      'Päivähaltia': {
        nimi: 'Kultahaltia',
        kuvaus: 'Päivähaltiasuku joka menetti magian mutta peri mentalismin'
      }
    }
  },

  'heijastus-matkaajat': {
    ammattiTyyppi: 'moderni',
    jumalaisetVoimat: 0,
    rajoitteet: {
      'Ihminen': {
        sallitutVoimat: '*'
      }
    },
    variantit: {}
  }
};

// Apufunktio tarkistamaan onko rotu sallittu kampanjassa
export function onkoRotuSallittu(kampanja, rotuNimi) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData || !kampanjaData.rajoitteet) return true;
  
  // Jos rotu löytyy suoraan rajoitteista, se on sallittu
  if (kampanjaData.rajoitteet[rotuNimi]) return true;
  
  // Jos on wildcard '*', kaikki rodut sallittu
  if (kampanjaData.rajoitteet['*']) return true;
  
  // Muuten ei sallittu
  return false;
}

// Apufunktio tarkistamaan onko voimatyyppi sallittu rodulle kampanjassa ja skaalassa
export function onkoVoimaSallittu(kampanja, rotuNimi, voimaTyyppi, hahmonSkaala = 0) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData || !kampanjaData.rajoitteet) return true;
  
  // Tarkista jumalaiset voimat ensimmäiseksi
  const jumalaisetVoimatyypit = ['heijastuksen hallinta', 'kaaossäikeet', 'tarot'];
  if (jumalaisetVoimatyypit.includes(voimaTyyppi)) {
    if (!onkoJumalaisetVoimatSallittu(kampanja, hahmonSkaala)) {
      return false;
    }
  }
  
  const rotuRajoitteet = kampanjaData.rajoitteet[rotuNimi] || 
                        kampanjaData.rajoitteet['*'];
  
  if (!rotuRajoitteet) return false;
  
  // Tarkista wildcard - voi olla '*' string tai ['*'] array
  if (rotuRajoitteet.sallitutVoimat === '*' || 
      (Array.isArray(rotuRajoitteet.sallitutVoimat) && rotuRajoitteet.sallitutVoimat[0] === '*')) {
    return true;
  }
  
  // Skaala 3+: Salli kaikki voimat mitä löytyy voimat.js tiedostosta
  if (hahmonSkaala >= 3) {
    return Object.prototype.hasOwnProperty.call(voimat, voimaTyyppi);
  }
  
  // Skaala 0-2: Tarkista voiman indeksi listassa ja onko skaala tarpeeksi korkea
  const voimaIndeksi = rotuRajoitteet.sallitutVoimat.indexOf(voimaTyyppi);
  if (voimaIndeksi === -1) return false; // Voima ei ole listassa
  
  // Skaala määrittää montako voimaa on saatavilla:
  // Skaala 0: 1 voima (indeksi 0)
  // Skaala 1: 2 voimaa (indeksit 0-1) 
  // Skaala 2: 3 voimaa (indeksit 0-2)
  const sallitutIndeksit = Math.min(hahmonSkaala + 1, rotuRajoitteet.sallitutVoimat.length);
  return voimaIndeksi < sallitutIndeksit;
}



// Apufunktio tarkistamaan onko jumalaisiin voimiin oikeus skaalassa
export function onkoJumalaisetVoimatSallittu(kampanja, hahmonSkaala = 0) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData) return false;
  
  // Numero-pohjainen järjestelmä: jumalaisetVoimat = alaraja
  if (typeof kampanjaData.jumalaisetVoimat === 'number') {
    return hahmonSkaala >= kampanjaData.jumalaisetVoimat;
  }
  
  // Vanha lista-pohjainen järjestelmä (yhteensopivuus)
  if (Array.isArray(kampanjaData.jumalaisetVoimat)) {
    return kampanjaData.jumalaisetVoimat.includes(hahmonSkaala);
  }
  
  return false;
}

// Apufunktio hakemaan rodun variantti tietässä kampanjassa
export function haeRotuVariantti(kampanja, alkuperainenRotuNimi) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData || !kampanjaData.variantit) return null;
  
  return kampanjaData.variantit[alkuperainenRotuNimi] || null;
}

// Apufunktio hakemaan kampanjan ammattiryhmä (fantasia/moderni)
export function haeKampanjanAmmattiTyyppi(kampanja) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData) return 'fantasia'; // Oletus fantasia
  
  return kampanjaData.ammattiTyyppi || 'fantasia'; // Oletus fantasia jos ei määritelty
}