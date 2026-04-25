import Kortti from '../Kortti.jsx';
import { KORTTI_DEFAULTS } from '../../constants';
import '../HahmoVaiheet.css';
import { arkkityypit } from '../../data/arkkityypit.js';
import soturiKuva from '../../kuvat/Soturi.jpeg';
import temppeliritariKuva from '../../kuvat/Temppeliritari.jpg';
import bardiKuva from '../../kuvat/Bardi.jpg';
import tietajaKuva from '../../kuvat/Tietaja.jpg';
import maagiKuva from '../../kuvat/Maagi.jpg';
import soturimaagiKuva from '../../kuvat/Soturimaagi.jpg';
import kehoAmmattiTausta from '../../kuvat/keho_ammatti.jpg';

function ArkkityyppiValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const taustaKuva = kehoAmmattiTausta;
  
  const arkkityyppiKuvat = {
    soturi: soturiKuva,
    temppeliritari: temppeliritariKuva,
    bardi: bardiKuva,
    tietaja: tietajaKuva,
    maagi: maagiKuva,
    soturimaagi: soturimaagiKuva
  };

  const valitseArkkityyppi = (arkkityyppiId) => {
    const arkkityyppiData = arkkityypit[arkkityyppiId];
    paivitaHahmo({ 
      ...hahmo, 
      arkkityyppi: arkkityyppiId,
      keho: arkkityyppiData.keho.alkuarvo,
      mieli: arkkityyppiData.mieli.alkuarvo,
      sielu: arkkityyppiData.sielu.alkuarvo,
      adjektiivit: { keho: null, mieli: null, sielu: null },
      ammatit: { keho: null, mieli: null, sielu: null }
    });
    seuraavaVaihe();
  };

  const luoStatsKuvaus = (arkkityyppi) => {
    return (
      <div className="stats-kuvaus">
        <div>Keho: {arkkityyppi.keho.alkuarvo} (max {arkkityyppi.keho.maksimi})</div>
        <div>Mieli: {arkkityyppi.mieli.alkuarvo} (max {arkkityyppi.mieli.maksimi})</div>
        <div>Sielu: {arkkityyppi.sielu.alkuarvo} (max {arkkityyppi.sielu.maksimi})</div>
      </div>
    );
  };

  return (
    <div className={`vaihe-sisalto ${taustaKuva ? 'taustakuvalla' : ''}`}>
      <div className="vaihe-otsikko">
        <h2>Valitse Arkkityyppi</h2>
        <p>Arkkityyppi määrää hahmon perusominaisuudet ja kehityssuunnan</p>
      </div>

      <div className="levea-grid">
        <div className={`kuvaaja-kategoria ${taustaKuva ? 'kuvaaja-kategoria-taustalla' : ''}`}>
          <div className="kuvaaja-kortit-lista">
            {Object.entries(arkkityypit).map(([id, arkkityyppi]) => (
              <Kortti
                key={id}
                nimi={arkkityyppi.nimi}
                kuvaus={arkkityyppi.kuvaus}
                kuva={arkkityyppiKuvat[id]}
                korttiKorkeus={KORTTI_DEFAULTS.KORKEUS}
                valittu={hahmo.arkkityyppi === id}
                onClick={() => valitseArkkityyppi(id)}
                extraInfo={luoStatsKuvaus(arkkityyppi)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {taustaKuva && (
        <style>{`
          .sovellus {
            background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${taustaKuva}) !important;
            background-size: cover !important;
            background-position: center !important;
          }
        `}</style>
      )}
    </div>
  );
}

export default ArkkityyppiValinta;