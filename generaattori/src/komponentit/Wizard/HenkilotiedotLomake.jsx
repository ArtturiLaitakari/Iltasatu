import { luonteet } from '../../data/muutData.js';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HenkilotiedotLomake({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const paivitaKentta = (kentta, arvo) => {
    const uudetHenkilotiedot = {
      ...hahmo.henkilotiedot,
      [kentta]: arvo
    };
    paivitaHahmo({ 
      ...hahmo, 
      henkilotiedot: uudetHenkilotiedot
    });
  };

  const haeTaustaKuva = () => {
    const tiedostoVaihtoehdot = [
      'henkilotiedot_taustakuva.jpg',
      'henkilotiedot_taustakuva.jpeg',
      'henkilotiedot_taustakuva.png',
      'henkilotiedot_taustakuva.webp'
    ];

    for (const tiedostoNimi of tiedostoVaihtoehdot) {
      const osuma = Object.entries(taustaKuvat).find(([polku]) => polku.endsWith(`/${tiedostoNimi}`));
      if (osuma) {
        return osuma[1];
      }
    }

    return null;
  };

  const taustaKuva = haeTaustaKuva();
  const taustaTyyli = taustaKuva
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${taustaKuva})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : undefined;

  // Tarkista onko kaikki pakolliset kentät täytetty
  const onValmis = hahmo.henkilotiedot.nimi?.trim() && 
                   hahmo.henkilotiedot.luonne && 
                   hahmo.henkilotiedot.sidos?.trim();

  return (
    <div className="vaihe-sisalto">
      <div className="vaihe-otsikko">
        <h2>Henkilötiedot</h2>
        <p>Anna hahmolle nimi ja persoonallisuus</p>
      </div>

      <div className={`lomake-grid ${taustaKuva ? 'lomake-grid-taustalla' : ''}`} style={taustaTyyli}>
        <div className="kentta">
          <label htmlFor="nimi">Nimi</label>
          <input
            type="text"
            id="nimi"
            value={hahmo.henkilotiedot.nimi}
            onChange={(e) => paivitaKentta('nimi', e.target.value)}
            placeholder="Anna hahmon nimi..."
            required
          />
        </div>

        <div className="kentta">
          <label>Luonne</label>
          <div className="luonne-valinnat">
            {luonteet.map((luonne) => (
              <div
                key={luonne.nimi}
                className={`luonne-kortti ${hahmo.henkilotiedot.luonne === luonne.nimi ? 'valittu' : ''}`}
                onClick={() => paivitaKentta('luonne', luonne.nimi)}
              >
                <h4>{luonne.nimi}</h4>
                <p>{luonne.kuvaus}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="kentta">
          <label htmlFor="sidos">Sidos</label>
          <input
            type="text"
            id="sidos"
            value={hahmo.henkilotiedot.sidos}
            onChange={(e) => paivitaKentta('sidos', e.target.value)}
            placeholder="Ketä voi uhata niin että antaudut automaattisesti?"
            required
          />
        </div>
        
        {/* Seuraava-nappi */}
        <div className="kentta">
          {onValmis && (
            <button 
              onClick={seuraavaVaihe}
              className="btn btn-primary btn-full"
            >
              Seuraava
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HenkilotiedotLomake;