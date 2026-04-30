import Kortti from '../Kortti.jsx';
import { rodut } from '../../data/rodut.js';
import { onkoRotuSallittu, haeRotuVariantti, kampanjaRajoitteet } from '../../data/kampanjaRajoitteet.js';
import VaiheSivu, { haeTaustaKuva } from './VaiheSivu.jsx';

function RotuValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseRotu = (rotu, alkuperainenRotu = null) => {
    console.log('[RotuValinta] valitseRotu:', rotu.nimi, '| kampanja:', hahmo.kampanja);
    let voimienJarjestys = null;
    if (hahmo.kampanja && kampanjaRajoitteet[hahmo.kampanja]) {
      const kampanja = kampanjaRajoitteet[hahmo.kampanja];
      // Käytä valitun rodun nimeä (variantin nimi) rajoitteissa
      const rotuRajoitteet = kampanja.rajoitteet[rotu.nimi] || kampanja.rajoitteet['*'];
      console.log('[RotuValinta] rotuRajoitteet:', rotuRajoitteet);
      if (rotuRajoitteet && rotuRajoitteet.sallitutVoimat) {
        const sallitutVoimat = rotuRajoitteet.sallitutVoimat;
        console.log('[RotuValinta] sallitutVoimat:', sallitutVoimat);
        // Aseta voimienJarjestys vain jos kaikki 3 voimaa ovat konkreettisia nimia (ei wildcardseja)
        if (Array.isArray(sallitutVoimat) && sallitutVoimat.length >= 3 &&
            !sallitutVoimat[0].includes('*') && !sallitutVoimat[0].includes('#') &&
            !sallitutVoimat[1].includes('*') && !sallitutVoimat[1].includes('#') &&
            !sallitutVoimat[2].includes('*') && !sallitutVoimat[2].includes('#')) {
          voimienJarjestys = { primary: sallitutVoimat[0], secondary: sallitutVoimat[1], tertiary: sallitutVoimat[2] };
        }
      }
    }
    console.log('[RotuValinta] voimienJarjestys:', voimienJarjestys, '| siirtyy automaattisesti:', !!voimienJarjestys);
    paivitaHahmo({ ...hahmo, rotu, voimienJarjestys });
    setTimeout(() => seuraavaVaihe(), 100);
  };

  const luoNaytettavatRodut = () => {
    if (!hahmo.kampanja) return rodut.fantasia;
    const naytettavat = [];
    const kaikkiRodut = [...rodut.fantasia, ...(rodut.jumalaiset || [])];
    for (const alkuperainenRotu of kaikkiRodut) {
      if (onkoRotuSallittu(hahmo.kampanja, alkuperainenRotu.nimi)) {
        naytettavat.push({ ...alkuperainenRotu, alkuperainenRotu: null });
      }
      const variantti = haeRotuVariantti(hahmo.kampanja, alkuperainenRotu.nimi);
      if (variantti && onkoRotuSallittu(hahmo.kampanja, variantti.nimi)) {
        naytettavat.push({ ...alkuperainenRotu, nimi: variantti.nimi, kuvaus: variantti.kuvaus, alkuperainenRotu });
      }
    }
    return naytettavat;
  };

  const naytettavatRodut = luoNaytettavatRodut();
  const taustaKuva = haeTaustaKuva('rodut_taustakuva') || haeTaustaKuva('rotu_tausta') || haeTaustaKuva('rodut_tausta');

  return (
    <VaiheSivu taustaKuva={taustaKuva} otsikko="Valitse Rotu" alaotsikko="Valitse hahmon rotu">
      <div className="ammatti-kortit-lista">
        {naytettavatRodut.map((rotu) => (
          <Kortti
            key={rotu.nimi}
            nimi={rotu.nimi}
            kuvaus={rotu.kuvaus}
            extraInfo={rotu.ikakerroin != null ? `Ikäkerroin: ${rotu.ikakerroin}` : null}
            korttiKoko="pieni"
            valittu={hahmo.rotu?.nimi === (rotu.alkuperainenRotu?.nimi || rotu.nimi)}
            onClick={() => valitseRotu(rotu, rotu.alkuperainenRotu)}
          />
        ))}
      </div>
    </VaiheSivu>
  );
}

export default RotuValinta;