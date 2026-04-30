import { arkkityypit } from '../data/arkkityypit.js';
import { ammatit } from '../data/ammatit.js';
import { haeKampanjanAmmattiTyyppi } from '../data/kampanjaRajoitteet.js';

export function haeAmmattiKategoria(arkkityyppi) {
  const tyyppi = arkkityypit[arkkityyppi];
  if (!tyyppi) return 'fyysinen';
  return tyyppi.paaKategoria;
}

export function haeKategorianAmmatit(kategoria, kampanja = 'avoin-fantasia') {
  // Hae kampanjan mukainen ammattiTyyppi (fantasia/moderni)
  const ammattiTyyppi = haeKampanjanAmmattiTyyppi(kampanja);
  return ammatit[ammattiTyyppi]?.[kategoria] || [];
}

export function luoTyhjaHahmo() {
  return {
    kampanja: 'avoin-fantasia',
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
      ika: 20,
      sukupuoli: 'N',
      luonne: null,
      yksillioivaKuvaaja: '',
      heikous: '',
      sidos: ''
    },
    rotu: null,
    skaala: 0,
    hp: 0,
    kayttamattomatHahmopisteet: 0,
    onkoRajamurto: false,
    xp: 0,
    voimaTaso: 1,
    voimat: {
      'magia': 0,
      'muodonmuutos': 0,
      'mentalismi': 0,
      'elementin hallinta': 0,
      valitut: []
    },
    voimienJarjestys: null,
    valitutKyvyt: {},
    vapaakuvaukset: {},
    tempKykyValinta: null
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
  try {
    const nykyiset = haeHahmot();
    const id = Date.now().toString();
    nykyiset[id] = { ...hahmo, id, luotu: new Date().toISOString() };
    
    // Luo backup ennen tallennusta
    luoBackup();
    
    localStorage.setItem('iltasatu_hahmot', JSON.stringify(nykyiset));
    return id;
  } catch (error) {
    console.error('Virhe hahmon tallennuksessa:', error);
    alert('VIRHE: Hahmon tallennus epäonnistui! Kopioi hahmotiedot ylös.');
    return null;
  }
}

export function haeHahmot() {
  try {
    const data = localStorage.getItem('iltasatu_hahmot');
    const hahmot = data ? JSON.parse(data) : {};
    return hahmot;
  } catch (error) {
    console.error('Virhe hahmotietojen latauksessa:', error);
    // Yritä palauttaa backup
    return palautaBackup() || {};
  }
}

export function poistaHahmo(id) {
  try {
    luoBackup(); // Backup ennen poistoa
    const nykyiset = haeHahmot();
    delete nykyiset[id];
    localStorage.setItem('iltasatu_hahmot', JSON.stringify(nykyiset));
  } catch (error) {
    console.error('Virhe hahmon poistossa:', error);
  }
}

export function suoritaRajamurtoTasonNousu(hahmo) {
  if (!hahmo) return hahmo;

  const arkkityyppiData = arkkityypit[hahmo.arkkityyppi] || {};
  const paaOminaisuus = ['keho', 'mieli', 'sielu'].find(
    (ominaisuus) => (arkkityyppiData[ominaisuus]?.alkuarvo || 0) >= 1
  ) || (arkkityyppiData.paaKategoria === 'henkinen'
    ? 'mieli'
    : arkkityyppiData.paaKategoria === 'mystinen'
      ? 'sielu'
      : 'keho');

  return {
    ...hahmo,
    keho: 0,
    mieli: 0,
    sielu: 0,
    [paaOminaisuus]: 1,
    skaala: Math.min(4, (hahmo.skaala || 0) + 1),
    onkoRajamurto: false
  };
}

// Backup-funktiot tietojen suojaamiseksi
export function luoBackup() {
  try {
    const data = localStorage.getItem('iltasatu_hahmot');
    if (data) {
      const aikaleima = new Date().toISOString();
      localStorage.setItem('iltasatu_hahmot_backup', data);
      localStorage.setItem('iltasatu_hahmot_backup_aika', aikaleima);
    }
  } catch (error) {
    console.warn('Backup-luonti epäonnistui:', error);
  }
}

export function palautaBackup() {
  try {
    const backup = localStorage.getItem('iltasatu_hahmot_backup');
    const backupAika = localStorage.getItem('iltasatu_hahmot_backup_aika');
    if (backup) {
      return JSON.parse(backup);
    }
  } catch (error) {
    console.error('Backup-palautus epäonnistui:', error);
  }
  return null;
}

export function vieBackupTiedostoon() {
  try {
    const data = localStorage.getItem('iltasatu_hahmot') || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iltasatu_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Tiedosto-vienti epäonnistui:', error);
  }
}