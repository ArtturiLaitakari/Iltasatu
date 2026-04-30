import { useState } from 'react';
import Kortti from '../Kortti.jsx';
import { kampanjat } from '../../data/kampanjat.js';
import { luoTyhjaHahmo } from '../../utils/hahmoLogiikka.js';
import Ohje from './Ohje.jsx';
import VaiheSivu from './VaiheSivu.jsx';

function KampanjaValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const [ohjeAuki, setOhjeAuki] = useState(false);

  const valitseKampanja = (kampanjaId) => {
    // Aloita uusi hahmo alusta - tyhjennä kaikki vanhat valinnat
    paivitaHahmo({ ...luoTyhjaHahmo(), kampanja: kampanjaId });
    seuraavaVaihe();
  };

  return (
    <VaiheSivu
      otsikko="Valitse Kampanja"
      alaotsikko={<><span>Valitse kampanja, johon hahmo osallistuu</span>{' '}<button type="button" onClick={() => setOhjeAuki(true)} className="btn-link-ohje">📖 Hahmonluonnin ohje</button></>}
    >
      {ohjeAuki && <Ohje onSulje={() => setOhjeAuki(false)} />}

      <div className="kortit-grid">
        {Object.values(kampanjat).map(kampanja => (
          <Kortti
            key={kampanja.id}
            nimi={kampanja.nimi}
            kuvaus={kampanja.kuvaus}
            kuva={kampanja.kuva}
            valittu={hahmo.kampanja === kampanja.id}
            onClick={() => valitseKampanja(kampanja.id)}
            tyyliluokka={kampanja.id} 
          />
        ))}
      </div>
    </VaiheSivu>
  );
}

export default KampanjaValinta;