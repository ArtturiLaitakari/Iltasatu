import Kortti from '../Kortti.jsx';
import '../HahmoVaiheet.css';
import { arkkityypit } from '../../data/arkkityypit.js';
import soturiKuva from '../../kuvat/Soturi.jpeg';
import temppeliritariKuva from '../../kuvat/Temppeliritari.jpg';
import bardiKuva from '../../kuvat/Bardi.jpg';
import tietajaKuva from '../../kuvat/Tietaja.jpg';
import maagiKuva from '../../kuvat/Maagi.jpg';
import soturimaagiKuva from '../../kuvat/Soturimaagi.jpg';

function ArkkityyppiValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const arkkityyppiKuvat = {
    soturi: soturiKuva,
    temppeliritari: temppeliritariKuva,
    bardi: bardiKuva,
    tietaja: tietajaKuva,
    maagi: maagiKuva,
    soturimaagi: soturimaagiKuva
  };

  const arkkityyppiTaustaSijainnit = {
    soturi: 'top',
    temppeliritari: 'top',
    bardi: 'top',
    soturimaagi: 'top'
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
    <div className="vaihe-sisalto">
      <div className="vaihe-otsikko">
        <h2>Valitse Arkkityyppi</h2>
        <p>Arkkityyppi määrää hahmon perusominaisuudet ja kehityssuunnan</p>
      </div>

      <div className="kortit-grid">
        {Object.entries(arkkityypit).map(([id, arkkityyppi]) => (
          <Kortti
            key={id}
            nimi={arkkityyppi.nimi}
            kuvaus={arkkityyppi.kuvaus}
            kuva={arkkityyppiKuvat[id]}
            taustaSijainti={arkkityyppiTaustaSijainnit[id] || 'center'}
            valittu={hahmo.arkkityyppi === id}
            onClick={() => valitseArkkityyppi(id)}
            extraInfo={luoStatsKuvaus(arkkityyppi)}
          />
        ))}
      </div>
    </div>
  );
}

export default ArkkityyppiValinta;