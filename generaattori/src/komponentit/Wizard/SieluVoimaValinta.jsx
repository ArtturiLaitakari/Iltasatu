import '../HahmoVaiheet.css';
import { voimat, aistit } from '../../data/voimat.js';
import { voimaProgression, haeVoimanTaso } from '../../data/voimaProgression.js';
import Kortti from '../Kortti.jsx';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function SieluVoimaValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  // Etsi mikä voima on tasolla 1 (aktiivinen voima)
  let valittuVoimatyyppi = null;
  if (hahmo.voimat && typeof hahmo.voimat === 'object') {
    const voimaEntries = Object.entries(hahmo.voimat);
    const aktiivinenVoima = voimaEntries.find(([avain, taso]) => avain !== 'valitut' && taso > 0);
    if (aktiivinenVoima) {
      valittuVoimatyyppi = aktiivinenVoima[0];
    }
  }
  
  const valittuVoima = hahmo.voimat?.valittuVoima;
  const vapaakuvaus = hahmo.voimat?.vapaakuvaus || '';
  const valitutKyvyt = hahmo.voimat?.valitut || [];

  // Tarkista tarvitseeko valittu voimatyyppi vapaakuvauksen
  const tarvitseeVapaakuvaus = valittuVoimatyyppi === 'elementin hallinta' || valittuVoimatyyppi === 'muodonmuutos';
  
  // Määritä kentän otsikko voimatyypin mukaan
  const haeVapaakuvausOtsikko = () => {
    if (valittuVoimatyyppi === 'elementin hallinta') return 'Valitse elementti:';
    if (valittuVoimatyyppi === 'muodonmuutos') return 'Valitse eläimen aisti:';
    return '';
  };
  
  // Määritä placeholder teksti voimatyypin mukaan
  const haeVapaakuvausPlaceholder = () => {
    if (valittuVoimatyyppi === 'elementin hallinta') return 'esim. Tuli, Maa, Ilma, Vesi';
    if (valittuVoimatyyppi === 'muodonmuutos') return 'esim. Suden hajuaisti, Kotkan näkö';
    return '';
  };

  if (!valittuVoimatyyppi) {
    return (
      <div className="vaihe-sisalto">
        <div className="vaihe-otsikko">
          <h2>Voima</h2>
          <p>Valitse ensin voimatyyppi edellisessä vaiheessa</p>
        </div>
      </div>
    );
  }

  const voimatyyppiTiedot = voimat[valittuVoimatyyppi];
  const aistiTiedot = aistit[valittuVoimatyyppi];
  const kaikki_peruskyvyt = voimatyyppiTiedot?.peruskyvyt || [];
  
  // Hae hahmon nykyinen voiman taso uudesta progression systeemistä
  const kokonaisprogression = hahmo.voimaTaso || 1;
  const nykyinenVoimanTaso = haeVoimanTaso(kokonaisprogression, 1); // Käytä voima1:tä pääasiallisena voimana
  
  // Jos voiman taso on merkkijono (esim. "4e"), muunna numeroksi kykyjen suodatusta varten
  let kykyjenSuodatusTaso = nykyinenVoimanTaso;
  if (typeof nykyinenVoimanTaso === 'string') {
    kykyjenSuodatusTaso = parseInt(nykyinenVoimanTaso.replace('e', ''));
  }

  // Tarkista onko kyvyillä tasosysteemi
  const onTasojarasteelma = kaikki_peruskyvyt.some(kyky => kyky.taso !== undefined);
  
  // Jos tasojärjestelmä, näytä kaikki kyvyt mutta disable korkeammat tasot
  const peruskyvyt = kaikki_peruskyvyt;
  
  // Näytä kyvyt joiden taso <= hahmon nykyinen voiman taso
  const kaytettavissaOlevatKyvyt = onTasojarasteelma 
    ? kaikki_peruskyvyt.filter(kyky => (kyky.taso || 1) <= kykyjenSuodatusTaso)
    : kaikki_peruskyvyt;

  const valitseVoima = (voima) => {
    if (valitutKyvyt.includes(voima.nimi)) return;

    const paivitettyHahmo = {
      ...hahmo,
      voimat: {
        ...hahmo.voimat,
        valittuVoima: voima,
        valitut: [...valitutKyvyt, voima.nimi]
      }
    };
    paivitaHahmo(paivitettyHahmo);
    
    // Tarkista pitääkö palata hahmolistaan
    const returnTo = localStorage.getItem('wizard_return_to');
    
    // Auto-advance vain jos ei tarvita vapaakuvausta
    if (!tarvitseeVapaakuvaus) {
      // Kutsuu aina seuraavaVaihe (joka on nyt onnistunutVoimakykyValinta)
      setTimeout(() => seuraavaVaihe(), 100);
    }
  };
  
  const paivitaVapaakuvaus = (arvo) => {
    const paivitettyHahmo = {
      ...hahmo,
      voimat: {
        ...hahmo.voimat,
        vapaakuvaus: arvo
      }
    };
    paivitaHahmo(paivitettyHahmo);
  };
  
  // Tarkista onko kaikki valmis seuraavaa vaihetta varten
  const onValmisSeuraavaan = () => {
    if (!valittuVoima) return false;
    if (tarvitseeVapaakuvaus && (!vapaakuvaus || vapaakuvaus.trim().length < 3)) return false;
    return true;
  };

  const haeTaustaKuva = () => {
    const tiedostoVaihtoehdot = [
      'voimat_taustakuva.jpg',
      'voimat_taustakuva.jpeg', 
      'voimat_taustakuva.png',
      'voimat_taustakuva.webp'
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

  return (
    <div className={`vaihe-sisalto ${taustaKuva ? 'taustakuvalla' : ''}`}>
      <div className="vaihe-otsikko">
        <h2>Voima</h2>
        <p>Mystisen voiman perustiedot ja ensimmäinen kyky</p>
      </div>

      <div className="levea-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`}>
          
          {/* Aisti-kyky */}
          {aistiTiedot && (
            <div className="mb-2">
              <p className="vaihe-indikaattori">Automaattinen peruskyky</p>
              <div className="ammatti-kortit-lista kapea">
                <Kortti
                  nimi={aistiTiedot.nimi}
                  kuvaus={aistiTiedot.kuvaus}
                  korttiKoko="pieni"
                  otsikkoVari="#4a90e2"
                  onClick={() => {}}
                />
              </div>
            </div>
          )}
          
          {/* Voimakyvyt */}
          <div>
            <p className="vaihe-indikaattori">
              {kaytettavissaOlevatKyvyt.length === 1 ? 'Automaattinen kyky' : 'Valitse kyky'}
            </p>
            
            <div className="ammatti-kortit-lista kapea">
              {peruskyvyt.map((voima, index) => {
                const onKaytettavissa = kaytettavissaOlevatKyvyt.includes(voima) && !valitutKyvyt.includes(voima.nimi);
                
                return (
                  <Kortti
                    key={`voima-${index}`}
                    nimi={voima.nimi}
                    kuvaus={voima.kuvaus}
                    korttiKoko="pieni"
                    otsikkoVari={valittuVoima?.nimi === voima.nimi ? "#2e7d32" : "#000000"}
                    extraInfo={kaytettavissaOlevatKyvyt.length === 1 && !onTasojarasteelma ? 'Automaattinen' : undefined}
                    valittu={valittuVoima?.nimi === voima.nimi}
                    onClick={() => onKaytettavissa ? valitseVoima(voima) : null}
                    disabled={!onKaytettavissa}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Vapaakuvaus tekstikenttä tietyille voimatyypeille */}
          {valittuVoima && tarvitseeVapaakuvaus && (
            <div className="mt-2">
              <p className="vaihe-indikaattori">{haeVapaakuvausOtsikko()}</p>
              <div className="kentta">
                <input
                  type="text"
                  value={vapaakuvaus}
                  onChange={(e) => paivitaVapaakuvaus(e.target.value)}
                  placeholder={haeVapaakuvausPlaceholder()}
                  maxLength={100}
                  required
                  className="input-custom"
                />
                {vapaakuvaus.trim().length > 0 && vapaakuvaus.trim().length < 3 && (
                  <small className="error-text">
                    Vähintään 3 merkkiä
                  </small>
                )}
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div className="wizard-navigation">
            {onValmisSeuraavaan() && (
              <button 
                onClick={seuraavaVaihe}
                className="btn btn-primary"
              >
                Seuraava
              </button>
            )}
          </div>
        </div>
      </div>        
      {/* Taustakuva koko sivulle */}
      {taustaKuva && (
        <style>{`
          .sovellus {
            background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${taustaKuva}) !important;
            background-size: cover !important;
            background-position: center !important;
          }
        `}</style>
      )}    </div>
  );
}

export default SieluVoimaValinta;