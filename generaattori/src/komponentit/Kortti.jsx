import './Kortti.css';
import { KORTTI_VARIANTS } from '../constants';

function Kortti({ 
  nimi, 
  kuvaus, 
  valittu, 
  onClick, 
  disabled = false,
  kuva = null,
  extraInfo = null,
  korttiKoko = null,
}) {
  const lopullinenKorttiKoko = korttiKoko || (!kuva ? KORTTI_VARIANTS.PIENI : KORTTI_VARIANTS.NORMAALI);

  return (
    <div 
      className={`kortti ${valittu ? 'valittu' : ''} ${disabled ? 'disabled' : ''} ${kuva ? 'kortti-taustakuvalla' : ''} ${
        lopullinenKorttiKoko === KORTTI_VARIANTS.PIENI ? 'kortti-pieni' : ''
      } ${
        lopullinenKorttiKoko === KORTTI_VARIANTS.TIIVIS ? 'kortti-tiivis' : ''
      } ${
        lopullinenKorttiKoko === KORTTI_VARIANTS.KORKEA ? 'kortti-korkea' : ''
      }`}
      style={kuva ? { '--kortti-kuva': `url(${kuva})` } : undefined}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={valittu}
    >
      <div className="kortti-sisalto">
        <h3 className="kortti-nimi">{nimi}</h3>
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