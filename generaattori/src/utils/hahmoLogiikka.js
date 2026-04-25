import { arkkityypit } from '../data/arkkityypit.js';
import { ammatit } from '../data/ammatit.js';

export function haeAmmattiKategoria(arkkityyppi) {
  const tyyppi = arkkityypit[arkkityyppi];
  if (!tyyppi) return 'fyysinen';
  return tyyppi.paaKategoria;
}

export function haeKategorianAmmatit(kategoria, genre = 'fantasia') {
  return ammatit[genre]?.[kategoria] || [];
}

export function luoTyhjaHahmo() {
  return {
    genre: 'fantasia',
    arkkityyppi: null,
    kuvaaja: null,
    adjektiivit: {
      keho: null,
      mieli: null,
      sielu: null
    },
    ammatit: {
      keho: null,
      mieli: null,
      sielu: null
    },
    henkilotiedot: {
      nimi: '',
      luonne: null,
      yksillioivaKuvaaja: '',
      heikous: ''
    },
    rotu: null,
    skaala: 1,
    voimaTaso: 1,
    voimat: {
      'magia': 0,
      'muodonmuutos': 0,
      'mentalismi': 0,
      'elementin hallinta': 0,
      valitut: []
    }
  };
}

export function validoiHahmo(hahmo) {
  const virheet = [];
  
  if (!hahmo.arkkityyppi) {
    virheet.push('Arkkityyppi puuttuu');
  }
  
  if (!hahmo.adjektiivit.keho || !hahmo.adjektiivit.mieli || !hahmo.adjektiivit.sielu) {
    virheet.push('Adjektiivit puuttuvat');
  }
  
  if (!hahmo.henkilotiedot.luonne) {
    virheet.push('Luonne puuttuu');
  }
  
  if (!hahmo.rotu) {
    virheet.push('Rotu puuttuu');
  }
  
  return virheet;
}

export function tallennaHahmo(hahmo) {
  const nykyiset = haeHahmot();
  const id = Date.now().toString();
  nykyiset[id] = { ...hahmo, id, luotu: new Date().toISOString() };
  localStorage.setItem('iltasatu_hahmot', JSON.stringify(nykyiset));
  return id;
}

export function haeHahmot() {
  const data = localStorage.getItem('iltasatu_hahmot');
  return data ? JSON.parse(data) : {};
}

export function poistaHahmo(id) {
  const nykyiset = haeHahmot();
  delete nykyiset[id];
  localStorage.setItem('iltasatu_hahmot', JSON.stringify(nykyiset));
}