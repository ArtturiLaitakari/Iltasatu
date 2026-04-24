import './Kortti.css';

function Kortti({ 
  nimi, 
  kuvaus, 
  valittu, 
  onClick, 
  disabled = false,
  kuva = null,
  taustaSijainti = 'center',
  extraInfo = null,
  korttiKoko = 'normaali',
  otsikkoVari = null
}) {
  const taustaTyyli = kuva
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${kuva})`,
        backgroundSize: 'cover',
        backgroundPosition: taustaSijainti
      }
    : undefined;

  const otsikkoTyyli = otsikkoVari ? { color: otsikkoVari } : undefined;

  return (
    <div 
      className={`kortti ${valittu ? 'valittu' : ''} ${disabled ? 'disabled' : ''} ${kuva ? 'kortti-taustakuvalla' : ''} ${korttiKoko === 'pieni' ? 'kortti-pieni' : ''}`}
      style={taustaTyyli}
      onClick={disabled ? undefined : onClick}
    >
      <div className="kortti-sisalto">
        <h3 className="kortti-nimi" style={otsikkoTyyli}>{nimi}</h3>
        {kuvaus && (
          <p className="kortti-kuvaus">{kuvaus}</p>
        )}
        {extraInfo && (
          <div className="kortti-extra">
            {extraInfo}
          </div>
        )}
      </div>
    </div>
  );
}

export default Kortti;