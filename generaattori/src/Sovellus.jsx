import { useState, useEffect } from 'react';
import {
  Wizard,
  KampanjaValinta,
  ArkkityyppiValinta, 
  OlenValinta,
  AdjektiiviValinta,
  AmmattiValinta,
  SieluVoimaValinta,
  HenkilotiedotLomake,
  RotuValinta,
  VoimaValinta,
  HahmoLomake,
  WizardErrorBoundary
} from './komponentit/Wizard';
import HahmoLista from './komponentit/HahmoLista.jsx';
import { luoTyhjaHahmo } from './utils/hahmoLogiikka.js';
import { UI_CONSTANTS } from './constants';
import './Sovellus.css';

function Sovellus() {
  const [hahmo, asetaHahmo] = useState(luoTyhjaHahmo);
  const [wizardValmis, asetaWizardValmis] = useState(false);
  const [nakyma, asetaNakyma] = useState('wizard'); // 'wizard', 'hahmolista', 'valmis'

  // Migraatio: kaaosnäikeet -> kaaossäikeet (kirjoitusvirheen korjaus)
  useEffect(() => {
    try {
      const data = localStorage.getItem('iltasatu_hahmot');
      if (!data || !data.includes('kaaosnäike')) return;
      const korjattu = data.replace(/kaaosnäike/g, 'kaaossäike');
      localStorage.setItem('iltasatu_hahmot', korjattu);
    } catch {
      // Ohita migraatiovirheet
    }
  }, []);

  // Yksinkertaistettu - tarkista vain return_to_hahmolista
  useEffect(() => {
    const tempMode = localStorage.getItem('wizard_temp_mode');
    const tempHahmo = localStorage.getItem('wizard_temp_hahmo');
    
    if (tempMode === 'return_to_hahmolista' && tempHahmo) {
      try {
        const parsedHahmo = JSON.parse(tempHahmo);
        
        // Tallenna päivitetty hahmo localStorage:iin
        const tallennetutHahmot = JSON.parse(localStorage.getItem('iltasatu_hahmot') || '{}');
        if (parsedHahmo.id && tallennetutHahmot[parsedHahmo.id]) {
          tallennetutHahmot[parsedHahmo.id] = parsedHahmo;
          localStorage.setItem('iltasatu_hahmot', JSON.stringify(tallennetutHahmot));
        }
        
        // Puhdista väliaikainen data
        localStorage.removeItem('wizard_temp_mode');
        localStorage.removeItem('wizard_temp_hahmo');
        
        // Siirry hahmolistaan
        asetaNakyma('hahmolista');
      } catch (error) {
        localStorage.removeItem('wizard_temp_mode');
        localStorage.removeItem('wizard_temp_hahmo');
      }
    }
  }, [nakyma]);

  const wizardVaiheet = [
    {
      nimi: 'Kampanja',
      komponentti: KampanjaValinta
    },
    {
      nimi: 'Rotu',
      komponentti: RotuValinta
    },
    {
      nimi: 'Arkkityyppi',
      komponentti: ArkkityyppiValinta
    },
    {
      nimi: 'Voimien Valinta',
      komponentti: VoimaValinta
    },
    {
      nimi: 'Olen...',
      komponentti: OlenValinta
    },
    {
      nimi: 'Keho Adjektiivi',
      komponentti: (props) => <AdjektiiviValinta {...props} kategoria="keho" />
    },
    {
      nimi: 'Fyysinen Ammatti',
      komponentti: (props) => <AmmattiValinta {...props} kategoria="keho" />
    },
    {
      nimi: 'Mieli Adjektiivi',
      komponentti: (props) => <AdjektiiviValinta {...props} kategoria="mieli" />
    },
    {
      nimi: 'Henkinen Ammatti',
      komponentti: (props) => <AmmattiValinta {...props} kategoria="mieli" />
    },
    {
      nimi: 'Sielu Adjektiivi',
      komponentti: (props) => <AdjektiiviValinta {...props} kategoria="sielu" />
    },
    {
      nimi: 'Mystinen Koulutus',
      komponentti: (props) => <AmmattiValinta {...props} kategoria="sielu" />
    },
    {
      nimi: 'Mystinen Voima',
      komponentti: SieluVoimaValinta
    },
    {
      nimi: 'Henkilötiedot',
      komponentti: HenkilotiedotLomake
    },
    {
      nimi: 'Hahmolomake',
      komponentti: HahmoLomake
    }
  ];

  const aloitaUudelleen = () => {
    asetaHahmo(luoTyhjaHahmo());
    asetaWizardValmis(false);
    // Tyhjennä wizard-tilan localStorage jotta voimakyky-valinta ei jää muistiin
    localStorage.removeItem(UI_CONSTANTS.LOCAL_STORAGE_KEYS.CURRENT_STEP);
    localStorage.removeItem('wizard_temp_mode');
    asetaNakyma('wizard');
  };

  const vieHahmoListaan = () => {
    asetaNakyma('hahmolista');
  };

  const takaisinWizardiin = () => {
    // Tarkista onko voimakyky-valinta tilaa - älä nollaa silloin
    const tempMode = localStorage.getItem('wizard_temp_mode');
    if (tempMode === 'voima_kyky_valinta') {
      // Älä nollaa hahmoa tai vaihetta, anna useEffect:n hoitaa
      asetaNakyma('wizard');
      return;
    }
    
    // Normaali paluu - nollaa kaikki
    asetaHahmo(luoTyhjaHahmo());
    localStorage.removeItem(UI_CONSTANTS.LOCAL_STORAGE_KEYS.CURRENT_STEP);
    asetaNakyma('wizard');
  };

  if (wizardValmis || nakyma === 'valmis') {
    return (
      <div className="sovellus">
        <div className="keskitetty-nakyma">
          <h1>Hahmo luotu onnistuneesti! 🎉</h1>
          <div className="toiminto-napit">
            <button onClick={aloitaUudelleen} className="btn btn-primary">
              Luo uusi hahmo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (nakyma === 'hahmolista') {
    return (
      <HahmoLista onTakaisin={takaisinWizardiin} />
    );
  }

  return (
    <div className="sovellus">
      <Wizard 
        vaiheet={wizardVaiheet}
        hahmo={hahmo}
        paivitaHahmo={asetaHahmo}
        onValmis={() => asetaWizardValmis(true)}
        onHahmoLista={vieHahmoListaan}
        aloitaUudelleen={aloitaUudelleen}
      />
    </div>
  );
}

export default Sovellus;
