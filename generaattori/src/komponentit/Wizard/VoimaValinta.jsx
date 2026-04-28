import { useState, useEffect } from 'react';
import Kortti from '../Kortti.jsx';
import { voimat } from '../../data/voimat.js';
import { kampanjaRajoitteet } from '../../data/kampanjaRajoitteet.js';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function VoimaValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const [nykyinenPrioriteetti, setNykyinenPrioriteetti] = useState('primary');

  // Jos voimienJarjestys on jo asetettu (esim. Pimentohaltia), ohita tämä vaihe
  useEffect(() => {
    if (hahmo.voimienJarjestys) {
      seuraavaVaihe();
    }
  }, [hahmo.voimienJarjestys, seuraavaVaihe]);

  // Jos voimat on jo asetettu, älä renderöi mitään
  if (hahmo.voimienJarjestys) {
    return null;
  }
  const [valitutVoimat, setValitutVoimat] = useState({
    primary: null,
    secondary: null,
    tertiary: null
  });

  // Hae sallitut voimat kampanjan mukaan
  const haeSallitutVoimat = () => {
    if (!hahmo.kampanja || !hahmo.rotu) {
      return Object.keys(voimat); // Kaikki voimat jos ei kampanjaa
    }

    const kampanja = kampanjaRajoitteet[hahmo.kampanja];
    if (!kampanja) {
      return Object.keys(voimat);
    }

    const rotuRajoitteet = kampanja.rajoitteet[hahmo.rotu.nimi];
    if (!rotuRajoitteet || rotuRajoitteet.sallitutVoimat === '*') {
      return Object.keys(voimat); // Kaikki voimat jos '*'
    }

    return Array.isArray(rotuRajoitteet.sallitutVoimat) 
      ? rotuRajoitteet.sallitutVoimat 
      : Object.keys(voimat);
  };

  const sallitutVoimat = haeSallitutVoimat();

  const valitseVoima = (voimatyyppi) => {
    const uudetValitutVoimat = { ...valitutVoimat };
    
    // Jos tämä voima on jo valittu toisessa prioriteetissa, poista se sieltä
    Object.keys(uudetValitutVoimat).forEach(avain => {
      if (uudetValitutVoimat[avain] === voimatyyppi) {
        uudetValitutVoimat[avain] = null;
      }
    });
    
    // Aseta uusi valinta nykyiseen prioriteettiin
    uudetValitutVoimat[nykyinenPrioriteetti] = voimatyyppi;
    setValitutVoimat(uudetValitutVoimat);

    // Siirry seuraavaan prioriteettiin automaattisesti
    if (nykyinenPrioriteetti === 'primary') {
      setNykyinenPrioriteetti('secondary');
    } else if (nykyinenPrioriteetti === 'secondary') {
      setNykyinenPrioriteetti('tertiary');
    } else if (nykyinenPrioriteetti === 'tertiary') {
      // Kun kaikki valittu, tallenna ja siirry eteenpäin
      setTimeout(() => {
        paivitaHahmo({
          ...hahmo,
          voimienJarjestys: uudetValitutVoimat
        });
        seuraavaVaihe();
      }, 300);
    }
  };

  const haeTaustaKuva = () => {
    const tiedostoVaihtoehdot = [
      'voimat_taustakuva.jpg',
      'voimat_taustakuva.jpeg',
      'voimat_taustakuva.png',
      'voimat_taustakuva.webp',
      'voima_tausta.jpg',
      'voima_tausta.jpeg',
      'voima_tausta.png',
      'voima_tausta.webp'
    ];

    for (const tiedostoNimi of tiedostoVaihtoehdot) {
      const osuma = Object.entries(taustaKuvat).find(([polku]) => polku.endsWith(`/${tiedostoNimi}`));
      if (osuma) {
        return osuma[1];
      }
    }
    return null;
  };

  const taustaKuva = haeTaustaKuva();

  const prioriteettiNimet = {
    primary: 'Ensisijainen voima',
    secondary: 'Toissijainen voima', 
    tertiary: 'Kolmannen tason voima'
  };

  const prioriteettiKuvaukset = {
    primary: 'Vahvin voimasi - saat tämän ensimmäisenä',
    secondary: 'Toinen voimasi - saat tasolla 4',
    tertiary: 'Kolmas voimasi - saat tasolla 7'
  };

  return (
    <div className={`vaihe-sisalto ${taustaKuva ? 'taustakuvalla' : ''}`}>
      <div className="vaihe-otsikko">
        <h2>Valitse {prioriteettiNimet[nykyinenPrioriteetti]}</h2>
        <p>{prioriteettiKuvaukset[nykyinenPrioriteetti]} - Rotu: {hahmo.rotu?.nimi}</p>
        
        {/* Edistymispalkki */}
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <small>
            Valitut voimat: {valitutVoimat.primary ? `1. ${valitutVoimat.primary}` : ''} 
            {valitutVoimat.secondary ? ` | 2. ${valitutVoimat.secondary}` : ''} 
            {valitutVoimat.tertiary ? ` | 3. ${valitutVoimat.tertiary}` : ''}
          </small>
        </div>
      </div>

      <div className="levea-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`}>
          <div className="ammatti-kortit-lista">
            {sallitutVoimat.map((voimatyyppi) => {
              const voimaData = voimat[voimatyyppi];
              if (!voimaData) return null;

              const onValittu = valitutVoimat[nykyinenPrioriteetti] === voimatyyppi;
              const onJoValittuMuualla = Object.entries(valitutVoimat)
                .some(([avain, arvo]) => avain !== nykyinenPrioriteetti && arvo === voimatyyppi);

              return (
                <Kortti
                  key={voimatyyppi}
                  nimi={voimatyyppi}
                  kuvaus={voimaData.kuvaus || 'Mystinen voima'}
                  korttiKoko="pieni"
                  otsikkoVari="#000000"
                  valittu={onValittu}
                  disabled={onJoValittuMuualla}
                  onClick={() => !onJoValittuMuualla && valitseVoima(voimatyyppi)}
                />
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Taustakuva koko sivulle (sama kuin RotuValinta) */}
      {taustaKuva && (
        <style>{`
          .sovellus {
            background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${taustaKuva}) !important;
            background-size: cover !important;
            background-position: center !important;
          }
        `}</style>
      )}
    </div>
  );
}

export default VoimaValinta;