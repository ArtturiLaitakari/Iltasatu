import { kuvaajatArray } from '../../data/kuvaajat.js';
import Kortti from '../Kortti.jsx';
import VaiheSivu, { haeTaustaKuva } from './VaiheSivu.jsx';

function OlenValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseKuvaaja = (kuvaaja) => {
    const paivitettyHahmo = { ...hahmo, kuvaaja: kuvaaja };
    paivitaHahmo(paivitettyHahmo);
    if (seuraavaVaihe) seuraavaVaihe();
  };

  const taustaKuva = haeTaustaKuva('kuvaaja_tausta') || haeTaustaKuva('kuvaus') || haeTaustaKuva('olen');

  return (
    <VaiheSivu taustaKuva={taustaKuva} otsikko="Olen..." alaotsikko="Valitse kuvaaja, joka parhaiten kuvaa hahmosi luonnetta">
      <div className="kuvaaja-kortit-lista">
        {kuvaajatArray.map((kuvaaja) => (
          <Kortti
            key={kuvaaja.nimi}
            nimi={kuvaaja.nimi}
            kuvaus={kuvaaja.selite}
            extraInfo={`Kyky: ${kuvaaja.kyky}`}
            korttiKoko="tiivis"
            otsikkoVari="#000000"
            valittu={hahmo.kuvaaja?.nimi === kuvaaja.nimi}
            onClick={() => valitseKuvaaja(kuvaaja)}
          />
        ))}
      </div>
    </VaiheSivu>
  );
}

export default OlenValinta;