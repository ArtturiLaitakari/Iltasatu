import { useState } from 'react';
import { haeHahmot, poistaHahmo } from '../utils/hahmoLogiikka.js';
import { laskeHahmopisteet } from '../data/muutData.js';
import HahmoKortti from './HahmoKortti.jsx';
import HahmoLomake from './Wizard/HahmoLomake.jsx';
import './HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HahmoLista({ onTakaisin }) {
  const [hahmot, asetaHahmot] = useState(() => haeHahmot());
  const [valittuHahmo, asetaValittuHahmo] = useState(null);
  const [naytaXpModaali, setNaytaXpModaali] = useState(false);
  
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

  const paivitaValittuaHahmoa = (paivitettyHahmo) => {
    asetaValittuHahmo(paivitettyHahmo);
    if (paivitettyHahmo?.id) {
      const paivitetytHahmot = { ...hahmot, [paivitettyHahmo.id]: paivitettyHahmo };
      asetaHahmot(paivitetytHahmot);
      localStorage.setItem('iltasatu_hahmot', JSON.stringify(paivitetytHahmot));
    }
  };

  const lisaaXpPopupista = () => {
    setNaytaXpModaali(true);
  };

  const vahvistaXp = () => {
    if (!valittuHahmo) return;

    const vanhaXp = valittuHahmo.xp || 0;
    const uusiXp = vanhaXp + 1;
    const vanhaRaja = laskeHahmopisteet(vanhaXp);
    const uusiRaja = laskeHahmopisteet(uusiXp);
    const saadutPisteet = Math.max(0, uusiRaja - vanhaRaja);

    const paivitetty = {
      ...valittuHahmo,
      xp: uusiXp,
      hp: Math.max(0, valittuHahmo.hp || 0) + saadutPisteet,
      kayttamattomatHahmopisteet: Math.max(0, valittuHahmo.kayttamattomatHahmopisteet || 0) + saadutPisteet
    };
    asetaValittuHahmo(paivitetty);
    if (paivitetty.id) {
      const paivitetytHahmot = { ...hahmot, [paivitetty.id]: paivitetty };
      asetaHahmot(paivitetytHahmot);
      localStorage.setItem('iltasatu_hahmot', JSON.stringify(paivitetytHahmot));
    }
    setNaytaXpModaali(false);
  };

  const peruXp = () => {
    setNaytaXpModaali(false);
  };

  // Tallenna toimintofunktiot HahmoLomakkeesta
  const [kopioiFunktio, setKopioiFunktio] = useState(null);
  const [tulostaFunktio, setTulostaFunktio] = useState(null);
  const [tallennaFunktio, setTallennaFunktio] = useState(null);

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
          <div className="wizard-floating-actions">
            <span onClick={kopioiFunktio} title="Kopioi tekstimuotoon" className="wizard-action-icon">
              📋
            </span>
            <span onClick={tulostaFunktio} title="Tulosta hahmo" className="wizard-action-icon">
              🖨️
            </span>
            <span onClick={tallennaFunktio} title="Tallenna hahmo" className="wizard-action-icon">
              💾
            </span>
            <span onClick={lisaaXpPopupista} title="Lisää XP" className="wizard-action-icon">
              ➕
            </span>
          </div>
        </div>

        {naytaXpModaali && (
          <div className="xp-modal-overlay" onClick={peruXp}>
            <div className="xp-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="xp-modal-title">Ansaitsitko kokemuspisteen?</h3>
              <div className="xp-modal-actions">
                <button onClick={vahvistaXp} className="btn btn-primary">Kyllä</button>
                <button onClick={peruXp} className="btn btn-secondary">Ei</button>
              </div>
            </div>
          </div>
        )}

        <HahmoLomake 
          hahmo={valittuHahmo}
          paivitaHahmo={paivitaValittuaHahmoa}
          onHahmoLista={takaisinListaan}
          aloitaUudelleen={takaisinListaan}
          setKopioiFunktio={setKopioiFunktio}
          setTulostaFunktio={setTulostaFunktio}
          setTallennaFunktio={setTallennaFunktio}
        />
      </div>
    );
  }

  // Päälistausnäkymä
  return (
    <div className="sovellus" style={taustaTyyli}>
      <div className="hahmolista-header">
        <h1 style={{ color: '#fff' }}>Tallennetut Hahmot</h1>
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