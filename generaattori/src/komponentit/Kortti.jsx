import './Kortti.css';
import { KORTTI_DEFAULTS, KORTTI_VARIANTS } from '../constants';

function Kortti({ 
  nimi, 
  kuvaus, 
  valittu, 
  onClick, 
  disabled = false,
  kuva = null,
  kuvaKoko = KORTTI_DEFAULTS.KUVA_KOKO,
  extraInfo = null,
  korttiKoko = KORTTI_VARIANTS.NORMAALI,
  korttiKorkeus = null,
  otsikkoVari = null
}) {
  const taustaTyyli = kuva
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${kuva})`,
        backgroundSize: kuvaKoko === 'fit-width' ? '100% auto' : kuvaKoko,
        backgroundPosition: KORTTI_DEFAULTS.TAUSTA_SIJAINTI,
        backgroundRepeat: 'no-repeat'
      }
    : undefined;

  const korttiTyyli = {
    ...taustaTyyli,
    ...(korttiKorkeus && { height: `${korttiKorkeus}px` })
  };

  const otsikkoTyyli = otsikkoVari ? { color: otsikkoVari } : undefined;

  return (
    <div 
      className={`kortti ${valittu ? 'valittu' : ''} ${disabled ? 'disabled' : ''} ${kuva ? 'kortti-taustakuvalla' : ''} ${
        korttiKoko === KORTTI_VARIANTS.PIENI ? 'kortti-pieni' : ''
      } ${
        korttiKoko === KORTTI_VARIANTS.TIIVIS ? 'kortti-tiivis' : ''
      }`}
      style={korttiTyyli}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={valittu}
    >
      <div className="kortti-sisalto">
        <h3 className="kortti-nimi" style={otsikkoTyyli}>{nimi}</h3>
        {kuvaus && (
          <p className="kortti-kuvaus">{kuvaus}</p>
        )}
        {extraInfo && (
          <p className="kortti-kuvaus">
            {extraInfo}
          </p>
        )}
      </div>
    </div>
  );
}

export default Kortti;