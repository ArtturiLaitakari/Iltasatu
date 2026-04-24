import { kuvaajatArray } from '../../data/kuvaajat.js';
import Kortti from '../Kortti.jsx';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function OlenValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseKuvaaja = (kuvaaja) => {
    const paivitettyHahmo = { ...hahmo, kuvaaja: kuvaaja };
    paivitaHahmo(paivitettyHahmo);
    
    // Siirry automaattisesti seuraavalle sivulle kun kuvaaja on valittu
    if (seuraavaVaihe) {
      seuraavaVaihe();
    }
  };

  const haeTaustaKuva = () => {
    const tiedostoVaihtoehdot = [
      'kuvaaja_tausta.jpg',
      'kuvaaja_tausta.jpeg', 
      'kuvaaja_tausta.png',
      'kuvaaja_tausta.webp',
      'kuvaus.jpg',
      'olen.jpg'
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
  const taustaTyyli = taustaKuva
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${taustaKuva})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : undefined;

  return (
    <div className="vaihe-sisalto">
      <div className="vaihe-otsikko">
        <h2>Olen...</h2>
        <p>Valitse kuvaaja, joka parhaiten kuvaa hahmosi luonnetta</p>
      </div>

      <div className="ammatti-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`} style={taustaTyyli}>
          <h3>Kuvaaja</h3>
          <p className="adjektiivi-sivu-indikaattori">Valitse yksi kuvaaja</p>
          <div className="ammatti-kortit-lista">
            {kuvaajatArray.map((kuvaaja) => (
              <Kortti
                key={kuvaaja.nimi}
                nimi={kuvaaja.nimi}
                kuvaus={kuvaaja.selite}
                extraInfo={`Kyky: ${kuvaaja.kyky}`}
                korttiKoko="pieni"
                otsikkoVari="#000000"
                valittu={hahmo.kuvaaja?.nimi === kuvaaja.nimi}
                onClick={() => valitseKuvaaja(kuvaaja)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OlenValinta;