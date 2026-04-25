import { useState } from 'react';
import Wizard from './komponentit/Wizard/Wizard.jsx';
import HahmoLista from './komponentit/HahmoLista.jsx';
import GenreValinta from './komponentit/Wizard/GenreValinta.jsx';
import ArkkityyppiValinta from './komponentit/Wizard/ArkkityyppiValinta.jsx';
import OlenValinta from './komponentit/Wizard/OlenValinta.jsx';
import AdjektiiviValinta from './komponentit/Wizard/AdjektiiviValinta.jsx';
import AmmattiValinta from './komponentit/Wizard/AmmattiValinta.jsx';
import SieluVoimaValinta from './komponentit/Wizard/SieluVoimaValinta.jsx';
import HenkilotiedotLomake from './komponentit/Wizard/HenkilotiedotLomake.jsx';
import RotuValinta from './komponentit/Wizard/RotuValinta.jsx';
import HahmoYhteenveto from './komponentit/Wizard/HahmoYhteenveto.jsx';
import { luoTyhjaHahmo } from './utils/hahmoLogiikka.js';
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
      nimi: 'Henkilötiedot',
      komponentti: HenkilotiedotLomake
    },
    {
      nimi: 'Rotu',
      komponentti: RotuValinta
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
        <div className="valmis-sivu">
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
