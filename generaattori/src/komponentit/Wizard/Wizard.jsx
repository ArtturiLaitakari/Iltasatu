import { useState, useEffect } from 'react';
import './Wizard.css';

function Wizard({ vaiheet, hahmo, paivitaHahmo, onValmis }) {
  const [nykyinenVaihe, asetaNykyinenVaihe] = useState(0);

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

  const nykyinenVaiheKomponentti = vaiheet[nykyinenVaihe];
  const VaiheKomponentti = nykyinenVaiheKomponentti.komponentti;

  return (
    <div className="wizard">
      {nykyinenVaihe === 0 && <h1>Iltasatu Hahmonluonti</h1>}
      <div className="wizard-progress-popup">
        <span className="progress-text">
          Vaihe {nykyinenVaihe + 1} / {vaiheet.length}: {nykyinenVaiheKomponentti.nimi}
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