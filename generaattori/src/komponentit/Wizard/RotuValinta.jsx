import Kortti from '../Kortti.jsx';
import { rodut } from '../../data/rodut.js';

function RotuValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseRotu = (rotu) => {
    paivitaHahmo({ 
      ...hahmo, 
      rotu: rotu
    });
    
    // Auto-advance kun rotu valitaan
    setTimeout(() => seuraavaVaihe(), 100);
  };

  return (
    <div className="vaihe-sisalto">
      <div className="vaihe-otsikko">
        <h2>Valitse Rotu</h2>
        <p>Valitse hahmon rotu</p>
      </div>

      <div className="kortit-grid">
        {rodut.map((rotu) => (
          <Kortti
            key={rotu.nimi}
            nimi={rotu.nimi}
            kuvaus={rotu.kuvaus}
            valittu={hahmo.rotu?.nimi === rotu.nimi}
            onClick={() => valitseRotu(rotu)}
          />
        ))}
      </div>
    </div>
  );
}

export default RotuValinta;