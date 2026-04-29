import { useState } from 'react';
import { luonteet } from '../../data/muutData.js';
import VaiheSivu, { haeTaustaKuva } from './VaiheSivu.jsx';

function HenkilotiedotLomake({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const [hoverLuonne, setHoverLuonne] = useState(null);

  const paivitaKentta = (kentta, arvo) => {
    paivitaHahmo({ ...hahmo, henkilotiedot: { ...hahmo.henkilotiedot, [kentta]: arvo } });
  };

  const taustaKuva = haeTaustaKuva('henkilotiedot_taustakuva');

  // Tarkista onko kaikki pakolliset kentät täytetty
  const onValmis = hahmo.henkilotiedot.nimi?.trim() && 
                   hahmo.henkilotiedot.luonne && 
                   hahmo.henkilotiedot.sidos?.trim();

  return (
    <VaiheSivu taustaKuva={taustaKuva} otsikko="Henkilötiedot" alaotsikko="Anna hahmolle nimi ja persoonallisuus">
      <div className="sailio-kapea lomake-kortti lomake-kortti-taustalla">
        <div className="kentta">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <tbody>
              <tr>
                <td style={{ width: '70%', paddingRight: '10px' }}>
                  <label htmlFor="nimi">Nimi</label>
                  <input
                    type="text"
                    id="nimi"
                    value={hahmo.henkilotiedot.nimi}
                    onChange={(e) => paivitaKentta('nimi', e.target.value)}
                    placeholder="Anna hahmon nimi..."
                    required
                  />
                </td>
                <td style={{ width: '30%' }}>
                  <label htmlFor="ika">{hahmo.rotu?.ikakerroin != null ? 'Ikä / todellinen' : 'Ikä'}</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      id="ika"
                      style={{ width: '50%' }}
                      value={hahmo.henkilotiedot.ika || ''}
                      onChange={(e) => paivitaKentta('ika', e.target.value)}
                      placeholder="Ikä..."
                      min="1"
                      max="999"
                    />
                    {hahmo.rotu?.ikakerroin != null && hahmo.henkilotiedot.ika && (
                      <span>{Math.round(hahmo.henkilotiedot.ika * hahmo.rotu.ikakerroin)}</span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ paddingRight: '10px' }}>
                  <label>Sukupuoli</label>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label className="radio-valinta">
                      <input
                        type="radio"
                        name="sukupuoli"
                        value="M"
                        checked={hahmo.henkilotiedot.sukupuoli === 'M'}
                        onChange={(e) => paivitaKentta('sukupuoli', e.target.value)}
                      />
                      ♂️
                    </label>
                    <label className="radio-valinta">
                      <input
                        type="radio"
                        name="sukupuoli"
                        value="N"
                        checked={hahmo.henkilotiedot.sukupuoli === 'N'}
                        onChange={(e) => paivitaKentta('sukupuoli', e.target.value)}
                      />
                      ♀️
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="kentta">
          <label>Luonne</label>
          <div className="luonne-valinnat">
            {luonteet.map((luonne) => (
              <div
                key={luonne.nimi}
                className={`luonne-kortti ${hahmo.henkilotiedot.luonne === luonne.nimi ? 'valittu' : ''}`}
                onClick={() => paivitaKentta('luonne', luonne.nimi)}
                onMouseEnter={() => setHoverLuonne(luonne)}
                onMouseLeave={() => setHoverLuonne(null)}
                style={{ position: 'relative' }}
              >
                <h4>{luonne.nimi}</h4>
                <p>{luonne.kuvaus}</p>
              </div>
            ))}
          </div>
          {/* Popup siirretty tänne pois kortin sisältä */}
          {hoverLuonne && hoverLuonne.hover && (
            <div className="luonne-hover-popup">
              {hoverLuonne.hover}
            </div>
          )}
        </div>

        <div className="kentta">
          <label htmlFor="sidos">Sidos</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
            <div style={{ flex: '1' }}>
              <input
                type="text"
                id="sidos"
                value={hahmo.henkilotiedot.sidos}
                onChange={(e) => paivitaKentta('sidos', e.target.value)}
                placeholder="Ketä voi uhata niin että antaudut automaattisesti?"
                required
              />
            </div>
            {onValmis && (
              <button 
                onClick={seuraavaVaihe}
                className="btn btn-primary"
                style={{ minWidth: '120px', height: '3.5rem' }}
              >
                Seuraava
              </button>
            )}
          </div>
        </div>
      </div>
    </VaiheSivu>
  );
}

export default HenkilotiedotLomake;