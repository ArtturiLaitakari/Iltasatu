import { useState, useEffect } from 'react';
import { haeHahmot, poistaHahmo } from '../utils/hahmoLogiikka.js';
import HahmoKortti from './HahmoKortti.jsx';
import HahmoYhteenveto from './Wizard/HahmoYhteenveto.jsx';
import './HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HahmoLista({ onTakaisin }) {
  const [hahmot, asetaHahmot] = useState({});
  const [valittuHahmo, asetaValittuHahmo] = useState(null);
  
  const haeTaustaKuva = () => {
    const tiedostoVaihtoehdot = [
      'hahmot_taustakuva.jpg',
      'hahmot_taustakuva.jpeg', 
      'hahmot_taustakuva.png',
      'hahmot_taustakuva.webp'
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
  
  useEffect(() => {
    const tallennetutHahmot = haeHahmot();
    asetaHahmot(tallennetutHahmot);
  }, []);

  const hahmoLista = Object.values(hahmot);
  
  const poistaHahmoJaPaivita = (hahmoId) => {
    poistaHahmo(hahmoId);
    const paivitetytHahmot = haeHahmot();
    asetaHahmot(paivitetytHahmot);
  };

  const katsoHahmo = (hahmo) => {
    asetaValittuHahmo(hahmo);
  };

  const takaisinListaan = () => {
    asetaValittuHahmo(null);
  };

  // Jos hahmo on valittu, näytä yksityiskohtainen näkymä
  if (valittuHahmo) {
    return (
      <div className="sovellus">
        <div className="hahmo-yksityiskohdat-header">
          <button onClick={takaisinListaan} className="btn btn-secondary">
            ← Takaisin hahmolistaan
          </button>
          <button onClick={onTakaisin} className="btn btn-secondary">
            🏠 Pääsivu
          </button>
        </div>
        <HahmoYhteenveto 
          hahmo={valittuHahmo} 
          paivitaHahmo={() => {}} // Ei muokkausta tässä vaiheessa
        />
      </div>
    );
  }

  // Päälistausnäkymä
  return (
    <div className="sovellus" style={taustaTyyli}>
      <div className="hahmolista-header">
        <h1>Tallennetut Hahmot</h1>
        <button onClick={onTakaisin} className="btn btn-primary">
          ← Takaisin hahmonluontiin
        </button>
      </div>

      {hahmoLista.length === 0 ? (
        <div className="tyhja-lista">
          <div className="info-kortti text-center">
            <p>Ei tallennettuja hahmoja.</p>
            <p>Luo ensimmäinen hahmosi hahmonluonnissa!</p>
            <button onClick={onTakaisin} className="btn btn-primary mt-1">
              Aloita hahmonluonti
            </button>
          </div>
        </div>
      ) : (
        <div className="hahmo-grid">
          {hahmoLista
            .sort((a, b) => new Date(b.luotu) - new Date(a.luotu)) // Uusimmat ensin
            .map((hahmo) => (
              <HahmoKortti
                key={hahmo.id}
                hahmo={hahmo}
                onKlikkaus={katsoHahmo}
                onPoista={poistaHahmoJaPaivita}
              />
            ))
          }
        </div>
      )}

      <div className="hahmolista-tilastot">
        <p className="text-center">
          Yhteensä {hahmoLista.length} hahmoa tallennettu
        </p>
      </div>
    </div>
  );
}

export default HahmoLista;