import { arkkityypit } from '../data/arkkityypit.js';
import './HahmoVaiheet.css';

function HahmoKortti({ hahmo, onKlikkaus, onPoista }) {
  const arkkityyppiData = arkkityypit[hahmo.arkkityyppi];
  const luontiAika = new Date(hahmo.luotu);
  
  const formatoiPaiva = (paiva) => {
    const paivat = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
    const kuukaudet = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 
                      'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'];
    
    return `${paivat[paiva.getDay()]} ${paiva.getDate()}. ${kuukaudet[paiva.getMonth()]} ${paiva.getFullYear()}`;
  };

  const poistaHahmo = (e) => {
    e.stopPropagation(); // Estä kortin klikkauksen laukeaminen
    if (window.confirm(`Haluatko varmasti poistaa hahmon "${hahmo.henkilotiedot.nimi || 'Nimetön'}"?`)) {
      onPoista(hahmo.id);
    }
  };

  return (
    <div className="hahmo-kortti" onClick={() => onKlikkaus(hahmo)}>
      <div className="hahmo-kortti-header">
        <h3 className="kapitalisoi">{hahmo.henkilotiedot.nimi || 'Nimetön'}</h3>
        <button 
          className="btn-poista" 
          onClick={poistaHahmo}
          title="Poista hahmo"
        >
          ×
        </button>
      </div>
      
      <div className="hahmo-kortti-info">
        <p><strong>Arkkityyppi:</strong> {arkkityyppiData?.nimi || 'Tuntematon'}</p>
        <p><strong>Rotu:</strong> {hahmo.rotu?.nimi || 'Ei valittu'}</p>
        <p><strong>Luonne:</strong> {hahmo.henkilotiedot?.luonne || 'Ei määritetty'}</p>
      </div>
      
      <div className="hahmo-kortti-aika">
        <small>Luotu: {formatoiPaiva(luontiAika)}</small>
      </div>
    </div>
  );
}

export default HahmoKortti;