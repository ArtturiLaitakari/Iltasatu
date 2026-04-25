import { useState, useEffect } from 'react';
import './Wizard.css';

function Wizard({ vaiheet, hahmo, paivitaHahmo, onValmis, onHahmoLista }) {
  const [nykyinenVaihe, asetaNykyinenVaihe] = useState(() => {
    const tallennettuVaihe = localStorage.getItem('iltasatu-nykyinen-vaihe');
    return tallennettuVaihe ? parseInt(tallennettuVaihe, 10) : 0;
  });

  // Tallenna nykyinen vaihe localStorageen
  useEffect(() => {
    localStorage.setItem('iltasatu-nykyinen-vaihe', nykyinenVaihe.toString());
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
      {nykyinenVaihe === 0 && <h1>Iltasatu Hahmonluonti</h1>}
      <div className="wizard-progress-popup">
        <span className="progress-text">
          <span onClick={paasivu} style={{cursor: 'pointer'}}>🏠</span> <span onClick={hahmoLista} style={{cursor: 'pointer'}}>👤</span> Vaihe {nykyinenVaihe + 1} / {vaiheet.length}: {nykyinenVaiheKomponentti.nimi}
        </span>
      </div>

      <div className="wizard-content">
        <VaiheKomponentti 
          hahmo={hahmo}
          paivitaHahmo={paivitaHahmo}
          seuraavaVaihe={seuraavaVaihe}
        />
      </div>

      <div className="wizard-navigation">
        <button 
          onClick={edellinenVaihe}
          disabled={nykyinenVaihe === 0}
          className="btn btn-secondary"
        >
          ← Edellinen
        </button>
      </div>
    </div>
  );
}

export default Wizard;