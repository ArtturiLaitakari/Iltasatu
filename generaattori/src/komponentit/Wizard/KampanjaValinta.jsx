import Kortti from '../Kortti.jsx';
import '../HahmoVaiheet.css';
import { kampanjat } from '../../data/kampanjat.js';
import { luoTyhjaHahmo } from '../../utils/hahmoLogiikka.js';

function KampanjaValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseKampanja = (kampanjaId) => {
    // Aloita uusi hahmo alusta - tyhjennä kaikki vanhat valinnat
    paivitaHahmo({ ...luoTyhjaHahmo(), kampanja: kampanjaId });
    seuraavaVaihe();
  };

  return (
    <div className="vaihe-sisalto genre-sivu">
      <div className="vaihe-otsikko">
        <h2>Valitse Kampanja</h2>
        <p>Valitse kampanja, johon hahmo osallistuu</p>
      </div>

      <div className="kortit-grid">
        {Object.values(kampanjat).map(kampanja => (
          <Kortti
            key={kampanja.id}
            nimi={kampanja.nimi}
            kuvaus={kampanja.kuvaus}
            kuva={kampanja.kuva}
            valittu={hahmo.kampanja === kampanja.id}
            onClick={() => valitseKampanja(kampanja.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default KampanjaValinta;