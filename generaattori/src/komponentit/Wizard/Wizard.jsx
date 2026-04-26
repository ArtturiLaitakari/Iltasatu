import { useState, useEffect } from 'react';
import { UI_CONSTANTS } from '../../constants/index.js';
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

  // Tallenna nykyinen vaihe localStorageen
  useEffect(() => {
    localStorage.setItem(UI_CONSTANTS.LOCAL_STORAGE_KEYS.CURRENT_STEP, nykyinenVaihe.toString());
  }, [nykyinenVaihe]);

  // Skrollaa sivun yläosaan kun vaihe vaihtuu
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nykyinenVaihe]);

  const seuraavaVaihe = () => {
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

  const nykyinenVaiheKomponentti = vaiheet[nykyinenVaihe];
  const VaiheKomponentti = nykyinenVaiheKomponentti.komponentti;

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
          />
        </WizardErrorBoundary>
      </div>
    </div>
  );
}

export default Wizard;