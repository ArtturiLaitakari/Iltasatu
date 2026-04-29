import Kortti from '../Kortti.jsx';
import { rodut } from '../../data/rodut.js';
import { onkoRotuSallittu, haeRotuVariantti, kampanjaRajoitteet } from '../../data/kampanjaRajoitteet.js';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function RotuValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseRotu = (rotu, alkuperainenRotu = null) => {
    // Tallennetaan alkuperäinen rotu jos kyseessä on variantti
    const tallennettuRotu = alkuperainenRotu || rotu;
    
    // Tarkista onko kampanjarajoitteita tälle rodulle
    let voimienJarjestys = null;
    
    if (hahmo.kampanja && kampanjaRajoitteet[hahmo.kampanja]) {
      const kampanja = kampanjaRajoitteet[hahmo.kampanja];
      const rotuRajoitteet = kampanja.rajoitteet[tallennettuRotu.nimi];
      
      if (rotuRajoitteet && rotuRajoitteet.sallitutVoimat) {
        const sallitutVoimat = rotuRajoitteet.sallitutVoimat;
        
        // Jos on array, aseta voimat järjestyksessä
        if (Array.isArray(sallitutVoimat) && sallitutVoimat.length >= 3) {
          voimienJarjestys = {
            primary: sallitutVoimat[0],
            secondary: sallitutVoimat[1], 
            tertiary: sallitutVoimat[2]
          };
        }
        // Jos on '*', jätä voimienJarjestys null:iksi - valinta tarvitaan
      }
    }
    
    paivitaHahmo({ 
      ...hahmo, 
      rotu: tallennettuRotu,
      voimienJarjestys: voimienJarjestys
    });
    
    // Auto-advance kun rotu valitaan
    setTimeout(() => seuraavaVaihe(), 100);
  };

  // Luo lista näytettävistä roduista kampanjarajoitteiden mukaan
  const luoNaytettavatRodut = () => {
    if (!hahmo.kampanja) return rodut.fantasia;

    const naytettavat = [];
    
    for (const alkuperainenRotu of rodut.fantasia) {
      // Tarkista onko rotu suoraan sallittu
      if (onkoRotuSallittu(hahmo.kampanja, alkuperainenRotu.nimi)) {
        naytettavat.push({
          ...alkuperainenRotu,
          alkuperainenRotu: null // Ei variantti
        });
      }
      
      // Tarkista onko rodulle variantti
      const variantti = haeRotuVariantti(hahmo.kampanja, alkuperainenRotu.nimi);
      if (variantti && onkoRotuSallittu(hahmo.kampanja, variantti.nimi)) {
        // Yhdistä alkuperäinen rotu + variantin muutokset
        naytettavat.push({
          ...alkuperainenRotu, // Kaikki alkuperäiset tiedot
          nimi: variantti.nimi, // Korvaa nimi
          kuvaus: variantti.kuvaus, // Korvaa kuvaus
          // stuntti ja rajoitus säilyvät alkuperäisenä
          alkuperainenRotu: alkuperainenRotu // Viittaus alkuperäiseen tallentamista varten
        });
      }
    }
    
    return naytettavat;
  };

  const naytettavatRodut = luoNaytettavatRodut();

  const haeTaustaKuva = () => {
    const tiedostoVaihtoehdot = [
      'rodut_taustakuva.jpg',
      'rodut_taustakuva.jpeg',
      'rodut_taustakuva.png',
      'rodut_taustakuva.webp',
      'rotu_tausta.jpg',
      'rotu_tausta.jpeg',
      'rotu_tausta.png',
      'rotu_tausta.webp',
      'rodut_tausta.jpg',
      'rodut_tausta.jpeg',
      'rodut_tausta.png',
      'rodut_tausta.webp'
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

  return (
    <div className={`vaihe-sisalto ${taustaKuva ? 'taustakuvalla' : ''}`}>
      <div className="vaihe-otsikko">
        <h2>Valitse Rotu</h2>
        <p>Valitse hahmon rotu</p>
      </div>

      <div className="levea-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`}>
          <div className="ammatti-kortit-lista">
            {naytettavatRodut.map((rotu) => (
              <Kortti
                key={rotu.nimi}
                nimi={rotu.nimi}
                kuvaus={rotu.kuvaus}
                extraInfo={rotu.ikakerroin != null ? `Ikäkerroin: ${rotu.ikakerroin}` : null}
                korttiKoko="pieni"
                otsikkoVari="#000000"
                valittu={hahmo.rotu?.nimi === (rotu.alkuperainenRotu?.nimi || rotu.nimi)}
                onClick={() => valitseRotu(rotu, rotu.alkuperainenRotu)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Taustakuva koko sivulle */}
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

export default RotuValinta;