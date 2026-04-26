import { useState, useEffect } from 'react';
import { UI_CONSTANTS } from '../../constants/index.js';
import { laskeHahmopisteet } from '../../data/muutData.js';
import WizardErrorBoundary from './WizardErrorBoundary.jsx';
import './Wizard.css';

function Wizard({ vaiheet, hahmo, paivitaHahmo, onValmis, onHahmoLista, aloitaUudelleen }) {
  const [nykyinenVaihe, asetaNykyinenVaihe] = useState(() => {
    const tallennettuVaihe = localStorage.getItem(UI_CONSTANTS.LOCAL_STORAGE_KEYS.CURRENT_STEP);
    return tallennettuVaihe ? parseInt(tallennettuVaihe, 10) : 0;
  });

  // Hahmolomakkeen toiminnot
  const [kopioiFunktio, setKopioiFunktio] = useState(null);
  const [tulostaFunktio, setTulostaFunktio] = useState(null);
  const [tallennaFunktio, setTallennaFunktio] = useState(null);
  const [naytaXpModaali, setNaytaXpModaali] = useState(false);
  const [paluuHahmolomakkeelleVoimasta, setPaluuHahmolomakkeelleVoimasta] = useState(false);

  // Tallenna nykyinen vaihe localStorageen
  useEffect(() => {
    localStorage.setItem(UI_CONSTANTS.LOCAL_STORAGE_KEYS.CURRENT_STEP, nykyinenVaihe.toString());
  }, [nykyinenVaihe]);

  // Skrollaa sivun yläosaan kun vaihe vaihtuu
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nykyinenVaihe]);

  const seuraavaVaihe = () => {
    const voimaVaiheIndeksi = vaiheet.findIndex((v) => v.nimi === 'Mystinen Voima');
    const hahmolomakeIndeksi = vaiheet.length - 1;

    if (paluuHahmolomakkeelleVoimasta && nykyinenVaihe === voimaVaiheIndeksi) {
      asetaNykyinenVaihe(hahmolomakeIndeksi);
      setPaluuHahmolomakkeelleVoimasta(false);
      return;
    }

    if (nykyinenVaihe < vaiheet.length - 1) {
      asetaNykyinenVaihe(nykyinenVaihe + 1);
    } else {
      onValmis && onValmis();
    }
  };

  const edellinenVaihe = () => {
    if (nykyinenVaihe > 0) {
      asetaNykyinenVaihe(nykyinenVaihe - 1);
    }
  };

  const paasivu = () => {
    asetaNykyinenVaihe(0);
  };

  const hahmoLista = () => {
    onHahmoLista && onHahmoLista();
  };

  const lisaaXpPopupista = () => {
    setNaytaXpModaali(true);
  };

  const vahvistaXp = () => {
    if (paivitaHahmo) {
      const vanhaXp = hahmo.xp || 0;
      const uusiXp = vanhaXp + 1;
      const vanhaRaja = laskeHahmopisteet(vanhaXp);
      const uusiRaja = laskeHahmopisteet(uusiXp);
      const saadutPisteet = Math.max(0, uusiRaja - vanhaRaja);

      paivitaHahmo({
        ...hahmo,
        xp: uusiXp,
        hp: Math.max(0, hahmo.hp || 0) + saadutPisteet,
        kayttamattomatHahmopisteet: Math.max(0, hahmo.kayttamattomatHahmopisteet || 0) + saadutPisteet
      });
    }
    setNaytaXpModaali(false);
  };

  const peruXp = () => {
    setNaytaXpModaali(false);
  };

  const nykyinenVaiheKomponentti = vaiheet[nykyinenVaihe];
  const VaiheKomponentti = nykyinenVaiheKomponentti.komponentti;

  const siirryVoimanKykyyn = () => {
    const voimaVaiheIndeksi = vaiheet.findIndex((v) => v.nimi === 'Mystinen Voima');
    if (voimaVaiheIndeksi >= 0) {
      setPaluuHahmolomakkeelleVoimasta(true);
      asetaNykyinenVaihe(voimaVaiheIndeksi);
    }
  };

  return (
    <div className="wizard">
      {nykyinenVaihe === 0 && <h1>{UI_CONSTANTS.APP_TITLE}</h1>}
      
      {/* Edellinen-nappi vasempaan yläkulmaan */}
      {nykyinenVaihe > 0 && (
        <div className="wizard-back-button">
          <button 
            onClick={edellinenVaihe}
            className="btn-back"
          >
            ← Edellinen
          </button>
        </div>
      )}
      
      <div className="wizard-progress-popup">
        <span className="progress-text">
          <span onClick={paasivu} style={{cursor: 'pointer'}}>🏠</span> <span onClick={hahmoLista} style={{cursor: 'pointer'}}>👤</span> Vaihe {nykyinenVaihe + 1} / {vaiheet.length}: {nykyinenVaiheKomponentti.nimi}
        </span>
      </div>

      {/* Hahmolomakkeen toimintonapit - näkyvät vain vaiheessa 13 */}
      {nykyinenVaihe === vaiheet.length - 1 && (
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
      )}

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

      <div className="wizard-content">
        <WizardErrorBoundary onReset={() => asetaNykyinenVaihe(0)}>
          <VaiheKomponentti 
            hahmo={hahmo}
            paivitaHahmo={paivitaHahmo}
            seuraavaVaihe={seuraavaVaihe}
            onHahmoLista={hahmoLista}
            aloitaUudelleen={aloitaUudelleen}
            setKopioiFunktio={setKopioiFunktio}
            setTulostaFunktio={setTulostaFunktio}
            setTallennaFunktio={setTallennaFunktio}
            siirryVoimanKykyyn={siirryVoimanKykyyn}
          />
        </WizardErrorBoundary>
      </div>
    </div>
  );
}

export default Wizard;