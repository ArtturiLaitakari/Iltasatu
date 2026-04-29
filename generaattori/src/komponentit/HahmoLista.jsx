import { useState } from 'react';
import { haeHahmot, poistaHahmo, suoritaRajamurtoTasonNousu, vieBackupTiedostoon, palautaBackup, tallennaHahmo } from '../utils/hahmoLogiikka.js';
import { laskeHahmopisteet } from '../data/muutData.js';
import { onkoLimitBreakMahdollinen } from '../data/voimaProgression.js';
import HahmoKortti from './HahmoKortti.jsx';
import HahmoLomake from './Wizard/HahmoLomake.jsx';
import SieluVoimaValinta from './Wizard/SieluVoimaValinta.jsx';
import './HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HahmoLista({ onTakaisin }) {
  const [hahmot, asetaHahmot] = useState(() => haeHahmot());
  const [valittuHahmo, asetaValittuHahmo] = useState(null);
  const [naytaXpModaali, setNaytaXpModaali] = useState(false);
  const [naytaVoimakykyValinta, setNaytaVoimakykyValinta] = useState(false);
  const [alkuperainenHahmo, setAlkuperainenHahmo] = useState(null);
  
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
    : {
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      };
  


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
    if (!valittuHahmo) return;
    
    // Tarkista onko limit break mahdollinen ja aseta tila sen mukaan
    const paivitettyHahmo = {
      ...valittuHahmo,
      onkoRajamurto: onkoLimitBreakMahdollinen(valittuHahmo)
    };
    asetaValittuHahmo(paivitettyHahmo);
    
    setNaytaXpModaali(true);
  };

  const vahvistaXp = () => {
    if (!valittuHahmo) return;

    const paivitetty = onkoLimitBreakMahdollinen(valittuHahmo)
      ? suoritaRajamurtoTasonNousu(valittuHahmo)
      : (() => {
          const vanhaXp = valittuHahmo.xp || 0;
          const uusiXp = vanhaXp + 1;
          const vanhaRaja = laskeHahmopisteet(vanhaXp);
          const uusiRaja = laskeHahmopisteet(uusiXp);
          const saadutPisteet = Math.max(0, uusiRaja - vanhaRaja);

          return {
            ...valittuHahmo,
            xp: uusiXp,
            hp: Math.max(0, valittuHahmo.hp || 0) + saadutPisteet,
            kayttamattomatHahmopisteet: Math.max(0, valittuHahmo.kayttamattomatHahmopisteet || 0) + saadutPisteet
          };
        })();

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

  // Yksinkertainen voimakyvyn valinta - näytä modal suoraan
  const siirryVoimanKykyyn = () => {
    // Tallenna alkuperäinen hahmo cancel-toimintoa varten
    setAlkuperainenHahmo(valittuHahmo);
    setNaytaVoimakykyValinta(true);
  };

  const suljeVoimakykyValinta = () => {
    // Peruuta-toiminto: palauta alkuperäinen hahmo jos ei valittu kykyä
    if (alkuperainenHahmo) {
      asetaValittuHahmo(alkuperainenHahmo);
      if (alkuperainenHahmo.id) {
        const palautetutHahmot = { ...hahmot, [alkuperainenHahmo.id]: alkuperainenHahmo };
        asetaHahmot(palautetutHahmot);
        localStorage.setItem('iltasatu_hahmot', JSON.stringify(palautetutHahmot));
      }
    }
    setAlkuperainenHahmo(null);
    setNaytaVoimakykyValinta(false);
  };
  
  const onnistunutVoimakykyValinta = () => {
    // Kyky valittu onnistuneesti - tyhjennä alkuperäinen hahmo
    setAlkuperainenHahmo(null);
    setNaytaVoimakykyValinta(false);
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
          <div className="wizard-floating-actions">
            <span onClick={takaisinListaan} title="Takaisin hahmolistaan" className="wizard-action-icon">
              👤
            </span>
            <span onClick={onTakaisin} title="Pääsivu" className="wizard-action-icon">
              🏠
            </span>
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
              ✚
            </span>
            <span 
              onClick={() => {
                const uusiXp = (valittuHahmo.xp || 0) + 820;
                const uudetHahmopisteet = laskeHahmopisteet(uusiXp);
                
                // Laske käytetyt pisteet
                const kaytetytOminaisuusPisteet = (valittuHahmo.keho || 0) + (valittuHahmo.mieli || 0) + (valittuHahmo.sielu || 0);
                const kaytetytVoimaPisteet = (valittuHahmo.voimaTaso || 1) - 1; // Progression alkaa 1:stä
                const kayttamattomatPisteet = Math.max(0, uudetHahmopisteet - kaytetytOminaisuusPisteet - kaytetytVoimaPisteet);
                
                const paivitettyHahmo = {
                  ...valittuHahmo,
                  xp: uusiXp,
                  kayttamattomatHahmopisteet: kayttamattomatPisteet
                };
                
                // Käytä samoja setState funktioita kuin ➕ plus
                asetaValittuHahmo(paivitettyHahmo);
                
                if (paivitettyHahmo.id) {
                  const paivitetytHahmot = { ...hahmot, [paivitettyHahmo.id]: paivitettyHahmo };
                  asetaHahmot(paivitetytHahmot);
                  localStorage.setItem('iltasatu_hahmot', JSON.stringify(paivitetytHahmot));
                }
              }} 
              title="Lisää 820 XP" 
              className="wizard-action-icon"
            >
              ⭐
            </span>
          </div>
        </div>

        {naytaXpModaali && (
          <div className="xp-modal-overlay" onClick={peruXp}>
            <div className="xp-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="xp-modal-title">
                {onkoLimitBreakMahdollinen(valittuHahmo) 
                  ? "Annatko murtumalle periksi?" 
                  : "Ansaitsitko kokemuspisteen?"
                }
              </h3>
              <div className="xp-modal-actions">
                <button onClick={vahvistaXp} className="btn btn-primary">Kyllä</button>
                <button onClick={peruXp} className="btn btn-secondary">Ei</button>
              </div>
            </div>
          </div>
        )}

        {naytaVoimakykyValinta && (
          <div className="xp-modal-overlay" onClick={suljeVoimakykyValinta}>
            <div className="xp-modal voimakyky-modal" onClick={(e) => e.stopPropagation()}>
              <button onClick={suljeVoimakykyValinta} className="voimakyky-close-btn">✕</button>
              <div className="voimakyky-header">
                <h3>Valitse uusi voimakyky</h3>
              </div>
              <SieluVoimaValinta 
                hahmo={valittuHahmo}
                paivitaHahmo={paivitaValittuaHahmoa}
                seuraavaVaihe={onnistunutVoimakykyValinta}
              />
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
          siirryVoimanKykyyn={siirryVoimanKykyyn}
        />
      </div>
    );
  }

  // Päälistausnäkymä
  return (
    <div className="sovellus" style={taustaTyyli}>
      <div className="hahmolista-header">
        <h1 className="valkoinen-otsikko">Tallennetut Hahmot</h1>
      </div>

      {/* Floating toimintopalkki samassa tyylissä kuin hahmonluonnissa */}
      <div className="wizard-floating-actions">
        <span onClick={onTakaisin} title="Palaa hahmonluontiin" className="wizard-action-icon">
          🏠
        </span>
        <span onClick={vieBackupTiedostoon} title="Tallenna varmuuskopio" className="wizard-action-icon">
          💾
        </span>
        <span onClick={() => {
          const backup = palautaBackup();
          if (backup && Object.keys(backup).length > 0) {
            asetaHahmot(backup);
            localStorage.setItem('iltasatu_hahmot', JSON.stringify(backup));
            alert('Varmuuskopio palautettu!');
          } else {
            alert('Ei varmuuskopiota saatavilla.');
          }
        }} title="Lataa varmuuskopio" className="wizard-action-icon">
          📂
        </span>
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