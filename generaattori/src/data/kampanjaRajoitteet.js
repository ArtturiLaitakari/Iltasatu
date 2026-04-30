// Kampanjakohtaiset rajoitteet roduille ja voimille
//
// sallitutVoimat-lista määrittää rodun voimajärjestyksen:
// - Listan position 0 = 1. voima, position 1 = 2. voima, position 2 = 3. voima
// - Hahmon skaala määrittää montako voimaa hahmolla on:
//     Skaala 0 (Tavallinen): 1 voima  | Skaala 1 (Erinomainen): 2 voimaa
//     Skaala 2 (Uskomaton):  3 voimaa | Skaala 3+ (Eeppinen+): kaikki voimat (voimat.js)
//
// Slotin sisältö voi olla:
// - 'voimanNimi' = täsmälleen tämä voima
// - '*' = mikä tahansa maallinen voima paitsi aiemmin valittu
// - '#' = mikä tahansa voima (myös jumalainen) paitsi aiemmin valittu
//
// Esim. ['*', '*', '#'] = 1. ja 2. voima maallinen, 3. voima voi olla jumalainen.

import { voimat } from './voimat.js';

export const kampanjaRajoitteet = {
  'avoin-fantasia': {
    ammattiTyyppi: 'fantasia',
    rajoitteet: {
      '*': { // Kaikki rodut
        sallitutVoimat: ['*', '*', '#'] // 1.-2. voima maallinen, 3. voima voi olla jumalainen
      }
    },
    variantit: {}
  },

  'hopea-fantasia': {
    ammattiTyyppi: 'fantasia',
    rajoitteet: { // Sallitut rodut: Ihminen + 6 muuta rotua
      'Ihminen': {
        sallitutVoimat: ['*', '*', '*'] // Kaikki 3 voimaa maallisia (ei jumalaisia)
      },
      'Hopeahaltia': {
        sallitutVoimat: ['magia', 'mentalismi', 'elementin hallinta']
      },
      'Kultahaltia': {
        sallitutVoimat: ['mentalismi', 'magia', 'elementin hallinta']
      },
      'Päivähaltia': {
        sallitutVoimat: ['magia', 'mentalismi', 'elementin hallinta']
      },
      'Pimentohaltia': {
        sallitutVoimat: ['mentalismi', 'magia', 'elementin hallinta']
      },
      'Kääpiö': {
        sallitutVoimat: ['elementin hallinta', 'magia', 'mentalismi']
      },
      'Puolituinen': {
        sallitutVoimat: ['*', '*', '*']
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
    rajoitteet: {
      'Ihminen': {
        sallitutVoimat: ['*', '*', '*']
      },
      'Puolienkeli': {
        sallitutVoimat: ['heijastuksen hallinta', '*', '*'] // Jumalaista verta - kaikki voimat sallittu
      },
      'Puolidemoni': {
        sallitutVoimat: ['tarot', '*', '*']
      },
      'Puolikesäkeiju': {
        sallitutVoimat: ['kaaossäikeet', '*', '*']
      },
      'Puolisyyskeiju': {
        sallitutVoimat: ['kaaossäikeet', '*', '*']
      },
      'Puolikevätkeiju': {
        sallitutVoimat: ['kaaossäikeet', '*', '*']
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

const JUMALAISET_VOIMATYYPIT = ['heijastuksen hallinta', 'kaaossäikeet', 'tarot'];

// Apufunktio tarkistamaan onko voimatyyppi sallittu rodulle kampanjassa ja skaalassa
// valitutVoimat = jo valitut voimat, käytetään '*' ja '#' wildcardien "paitsi aiemmin valittu" -logiikkaan
export function onkoVoimaSallittu(kampanja, rotuNimi, voimaTyyppi, hahmonSkaala = 0, valitutVoimat = []) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData || !kampanjaData.rajoitteet) return true;

  const rotuRajoitteet = kampanjaData.rajoitteet[rotuNimi] || kampanjaData.rajoitteet['*'];
  if (!rotuRajoitteet) return false;

  // Skaala 3+: Salli kaikki voimat mitä löytyy voimat.js tiedostosta
  if (hahmonSkaala >= 3) {
    return Object.prototype.hasOwnProperty.call(voimat, voimaTyyppi);
  }

  const onJumalainen = JUMALAISET_VOIMATYYPIT.includes(voimaTyyppi);
  if (!Object.prototype.hasOwnProperty.call(voimat, voimaTyyppi)) return false;

  // Skaala 0-2: Käy positiot 0..skaala läpi ja katso sopiiko voima johonkin
  const sallitutIndeksit = Math.min(hahmonSkaala + 1, rotuRajoitteet.sallitutVoimat.length);
  for (let i = 0; i < sallitutIndeksit; i++) {
    const slotti = rotuRajoitteet.sallitutVoimat[i];

    // Suora match
    if (slotti === voimaTyyppi) return true;

    // '*' = mikä tahansa maallinen voima paitsi aiemmin valittu
    if (slotti === '*' && !onJumalainen && !valitutVoimat.includes(voimaTyyppi)) {
      return true;
    }

    // '#' = mikä tahansa voima (myös jumalainen) paitsi aiemmin valittu
    if (slotti === '#' && !valitutVoimat.includes(voimaTyyppi)) {
      return true;
    }
  }

  return false;
}

// Apufunktio hakemaan rodun variantti tietässä kampanjassa
export function haeRotuVariantti(kampanja, alkuperainenRotuNimi) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData || !kampanjaData.variantit) return null;
  
  return kampanjaData.variantit[alkuperainenRotuNimi] || null;
}

// Apufunktio hakemaan alkuperäisen rodun varianttirodun perusteella
export function haeAlkuperainenRotu(kampanja, varianttiRotuNimi) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData || !kampanjaData.variantit) return varianttiRotuNimi;
  
  // Etsi avain jolla on tämä variantti
  for (const [alkuperainenRotu, variantti] of Object.entries(kampanjaData.variantit)) {
    if (variantti.nimi === varianttiRotuNimi) {
      return alkuperainenRotu;
    }
  }
  
  // Jos ei löydy varianttia, palautetaan alkuperäinen nimi
  return varianttiRotuNimi;
}

// Apufunktio hakemaan kampanjan ammattiryhmä (fantasia/moderni)
export function haeKampanjanAmmattiTyyppi(kampanja) {
  const kampanjaData = kampanjaRajoitteet[kampanja];
  if (!kampanjaData) return 'fantasia'; // Oletus fantasia
  
  return kampanjaData.ammattiTyyppi || 'fantasia'; // Oletus fantasia jos ei määritelty
}