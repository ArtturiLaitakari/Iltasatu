import { useState } from 'react';
import {
  Wizard,
  GenreValinta,
  ArkkityyppiValinta, 
  OlenValinta,
  AdjektiiviValinta,
  AmmattiValinta,
  SieluVoimaValinta,
  HenkilotiedotLomake,
  RotuValinta,
  HahmoYhteenveto,
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

  const wizardVaiheet = [
    {
      nimi: 'Genre',
      komponentti: GenreValinta
    },
    {
      nimi: 'Arkkityyppi',
      komponentti: ArkkityyppiValinta
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
      nimi: 'Rotu',
      komponentti: RotuValinta
    },
    {
      nimi: 'Henkilötiedot',
      komponentti: HenkilotiedotLomake
    },
    {
      nimi: 'Yhteenveto',
      komponentti: HahmoYhteenveto
    }
  ];

  const aloitaUudelleen = () => {
    asetaHahmo(luoTyhjaHahmo());
    asetaWizardValmis(false);
    asetaNakyma('wizard');
  };

  const vieHahmoListaan = () => {
    asetaNakyma('hahmolista');
  };

  const takaisinWizardiin = () => {
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
      />
    </div>
  );
}

export default Sovellus;
