import Kortti from '../Kortti.jsx';
import { rodut } from '../../data/rodut.js';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function RotuValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseRotu = (rotu) => {
    paivitaHahmo({ 
      ...hahmo, 
      rotu: rotu
    });
    
    // Auto-advance kun rotu valitaan
    setTimeout(() => seuraavaVaihe(), 100);
  };

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
    <div className={`vaihe-sisalto ${taustaKuva ? 'rotu-sivu' : ''}`}>
      <div className="vaihe-otsikko">
        <h2>Valitse Rotu</h2>
        <p>Valitse hahmon rotu</p>
      </div>

      <div className="levea-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`}>
          <div className="ammatti-kortit-lista">
            {rodut.fantasia.map((rotu) => (
              <Kortti
                key={rotu.nimi}
                nimi={rotu.nimi}
                kuvaus={rotu.kuvaus}
                korttiKoko="pieni"
                otsikkoVari="#000000"
                valittu={hahmo.rotu?.nimi === rotu.nimi}
                onClick={() => valitseRotu(rotu)}
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