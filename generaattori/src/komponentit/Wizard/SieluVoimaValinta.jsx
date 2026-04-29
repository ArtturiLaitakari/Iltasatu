import '../HahmoVaiheet.css';
import { voimat } from '../../data/voimat.js';
import { haeVoimanTaso } from '../../data/voimaProgression.js';
import { onkoJumalaisetVoimatSallittu, kampanjaRajoitteet } from '../../data/kampanjaRajoitteet.js';
import Kortti from '../Kortti.jsx';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

// Voimatyypit jotka tarvitsevat vapaakuvauksen
const VAPAAKUVAUS_OTSIKOT = {
  'elementin hallinta': { otsikko: 'Valitse elementti:', placeholder: 'esim. Tuli, Maa, Ilma, Vesi' },
  'muodonmuutos': { otsikko: 'Valitse eläimen aisti:', placeholder: 'esim. Suden hajuaisti, Kotkan näkö' }
};

// Voimatyypit jotka tarvitsevat radiobutton valinnan
const RADIOBUTTON_VALINNAT = {
  'magia': {
    otsikko: 'Valitse magian lähestymistapa:',
    vaihtoehdot: [
      { arvo: 'hermeettinen', nimi: 'Hermeettinen magia', kuvaus: 'Kirjoihin ja oppiin perustuva magia' },
      { arvo: 'instrumentaali', nimi: 'Instrumentaali magia', kuvaus: 'Välineisiin ja esineisiin perustuva magia' }
    ]
  }
};

// Jumalaiset voimatyypit - vaativat korkeaa skaalaa
const JUMALAISET_VOIMATYYPIT = [
  'heijastuksen hallinta',
  'kaaossäikeet', 
  'tarot'
];

// Hae taustakuva
const haeTaustaKuva = () => {
  const osuma = Object.entries(taustaKuvat).find(([polku]) => polku.match(/voimat_taustakuva\.(jpg|jpeg|png|webp)$/));
  return osuma ? osuma[1] : null;
};

// Muunna kyvyt aina arrayksi (yhteensopivuus vanhan datan kanssa)
const haeKyvytArray = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw) return [raw];
  return [];
};

function SieluVoimaValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  // Selvitä mihin voimaan kyky valitaan
  const onVoimatasoNosto = !!hahmo.tempKykyValinta;
  const valintaAvain = onVoimatasoNosto ? hahmo.tempKykyValinta.voima : 'primary';
  const onEdistynyt = onVoimatasoNosto && hahmo.tempKykyValinta.edistynyt === true;
  const valittuVoimatyyppi = hahmo.voimienJarjestys?.[valintaAvain];

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

  const valitutKyvyt = haeKyvytArray(hahmo.valitutKyvyt?.[valintaAvain]);
  const onJokinValittu = valitutKyvyt.length > 0;
  const vapaakuvaus = hahmo.vapaakuvaukset?.[valintaAvain] || '';
  const vapaakuvausTiedot = VAPAAKUVAUS_OTSIKOT[valittuVoimatyyppi];
  const tarvitseeVapaakuvaus = !!vapaakuvausTiedot;
  
  // Radiobutton valinta (magia)
  const radiobuttonTiedot = RADIOBUTTON_VALINNAT[valittuVoimatyyppi];
  const tarvitseeRadiobutton = !!radiobuttonTiedot;
  const radiobuttonValinta = hahmo.vapaakuvaukset?.[valintaAvain] || '';
  
  // Elementin hallinta erityiskäsittely
  const onElementinHallinta = valittuVoimatyyppi === 'elementin hallinta';
  const elementtiValittu = onElementinHallinta && vapaakuvaus.trim().length >= 3;
  
  // Magia erityiskäsittely
  const onMagia = valittuVoimatyyppi === 'magia';
  const magiaValittu = onMagia && radiobuttonValinta.length > 0;


  // Suodata kyvyt voiman tason mukaan - edistynyt taso näyttää edistyneet-listan
  const voimaData = voimat[valittuVoimatyyppi];
  const naytettavatKyvyt = onEdistynyt
    ? (voimaData?.edistyneet || [])
    : (voimaData?.peruskyvyt || []);

    
  const onTasojarjestelma = naytettavatKyvyt.some(k => k.taso !== undefined);
  
  // Selvitä voimanTaso oikein tempKykyValinta tilanteessa
  let voimanTaso;
  if (onVoimatasoNosto && hahmo.tempKykyValinta?.taso) {
    // Käytä tempKykyValinta tason arvoa
    const tasoArvo = hahmo.tempKykyValinta.taso;
    voimanTaso = typeof tasoArvo === 'string'
      ? parseInt(tasoArvo.replace('e', ''))
      : tasoArvo;
  } else {
    // Normaali progression taulukosta haku
    const voimanTasoRaw = haeVoimanTaso(hahmo.voimaTaso || hahmo.voima || 1, 1);
    voimanTaso = typeof voimanTasoRaw === 'string'
      ? parseInt(voimanTasoRaw.replace('e', ''))
      : voimanTasoRaw;
  }

  const onKaytettavissa = (kyky) => {
    // Tarkista tasovalinta 
    if (onTasojarjestelma && (kyky.taso || 1) > voimanTaso) {
      return false;
    }
    
    // Tarkista jumalaisten voimien kampanjarajoitteet
    if (JUMALAISET_VOIMATYYPIT.includes(valittuVoimatyyppi)) {
      if (!onkoJumalaisetVoimatSallittu(hahmo.kampanja, hahmo.skaala || 0)) {
        return false;
      }
    }
    
    return true;
  };

  // Lisää kyky valittujen joukkoon (merkitään edistyneet)
  const valitseVoima = (voima) => {
    const tallennettava = onEdistynyt ? { ...voima, edistynyt: true } : voima;
    const paivitetytKyvyt = [...valitutKyvyt, tallennettava];
    
    const paivitettyHahmo = {
      ...hahmo,
      valitutKyvyt: {
        ...hahmo.valitutKyvyt,
        [valintaAvain]: paivitetytKyvyt
      }
    };
    
    paivitaHahmo(paivitettyHahmo);

    // Auto-advance logiikka
    const voiSulkeutua = (() => {
      if (onElementinHallinta) {
        // Elementin hallinnassa: elementti valittu JA kyky valittu
        return elementtiValittu && paivitetytKyvyt.length >= 1;
      } else if (onMagia) {
        // Magiassa: lähestymistapa valittu ja kyky valittu
        return magiaValittu;
      } else {
        // Muut voimat: ei tarvita vapaakuvausta
        return !tarvitseeVapaakuvaus;
      }
    })();

    if (voiSulkeutua) {
      setTimeout(() => {
        paivitaHahmo({ ...paivitettyHahmo, tempKykyValinta: undefined });
        seuraavaVaihe();
      }, 100);
    }
  };

  const paivitaVapaakuvaus = (arvo) => {
    paivitaHahmo({
      ...hahmo,
      vapaakuvaukset: { ...hahmo.vapaakuvaukset, [valintaAvain]: arvo }
    });
  };

  const onValmisSeuraavaan = (() => {
    if (onElementinHallinta) {
      // Elementin hallinnassa: elementti valittu JA kyky valittu
      return elementtiValittu && valitutKyvyt.length >= 1;
    } else if (onMagia) {
      // Magiassa: lähestymistapa valittu JA kyky valittu  
      return magiaValittu && valitutKyvyt.length >= 1;
    } else {
      // Muut voimat: kyky valittu JA vapaakuvaus (jos tarvitaan)
      return valitutKyvyt.length >= 1 && (!tarvitseeVapaakuvaus || vapaakuvaus.trim().length >= 3);
    }
  })();
  const taustaKuva = haeTaustaKuva();

  return (
    <div className={`vaihe-sisalto ${taustaKuva ? 'taustakuvalla' : ''}`}>
      <div className="levea-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`}>

          <div>
            {/* Elementin hallinta: Vapaakuvaus ensimmäiseksi */}
            {onElementinHallinta && (valitutKyvyt.length === 0) && (
              <div className="kentta-container">
                <p className="vaihe-indikaattori">{vapaakuvausTiedot.otsikko}</p>
                <div className="kentta">
                  <input
                    type="text"
                    value={vapaakuvaus}
                    onChange={(e) => paivitaVapaakuvaus(e.target.value)}
                    placeholder={vapaakuvausTiedot.placeholder}
                    maxLength={100}
                    required
                    className="input-custom"
                  />
                  {vapaakuvaus.trim().length > 0 && vapaakuvaus.trim().length < 3 && (
                    <small className="error-text">Vähintään 3 merkkiä</small>
                  )}
                </div>
              </div>
            )}

            {/* Magia: Radiobutton valinta ensimmäiseksi */}
            {onMagia && !magiaValittu && (
              <div className="mb-3">
                <p className="vaihe-indikaattori">{radiobuttonTiedot.otsikko}</p>
                <div className="radio-group">
                  {radiobuttonTiedot.vaihtoehdot.map((vaihtoehto, index) => (
                    <label key={index} className="radio-option">
                      <input
                        type="radio"
                        name={`magia-${valintaAvain}`}
                        value={vaihtoehto.arvo}
                        checked={radiobuttonValinta === vaihtoehto.arvo}
                        onChange={(e) => paivitaVapaakuvaus(e.target.value)}
                        className="radio-input"
                      />
                      <div className="radio-content">
                        <strong>{vaihtoehto.nimi}</strong>
                        <small>{vaihtoehto.kuvaus}</small>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Kykyjen valinta (kun valinta tehty) */}
            {((!onElementinHallinta && !onMagia) || (onElementinHallinta && elementtiValittu) || magiaValittu) && (
              <>
                <p className="vaihe-indikaattori">
                  {onEdistynyt 
                    ? 'Valitse edistynyt kyky' 
                    : 'Valitse kyky'}: {valittuVoimatyyppi} ({valintaAvain})
                  {onElementinHallinta && elementtiValittu && (
                    <span> - {vapaakuvaus}</span>
                  )}
                  {onMagia && magiaValittu && (
                    <span> - {radiobuttonTiedot.vaihtoehdot.find(v => v.arvo === radiobuttonValinta)?.nimi}</span>
                  )}
                </p>

                <div className="ammatti-kortit-lista kapea">
                  {naytettavatKyvyt.map((voima, index) => {
                    const onValittu = valitutKyvyt.some(k => k.nimi === voima.nimi);
                    const onDisabloitu = !onKaytettavissa(voima) || onValittu;
                    
                    let extraInfo = undefined;
                    if (!onKaytettavissa(voima)) {
                      // Tarkista onko taso-ongelma
                      if (onTasojarjestelma && (voima.taso || 1) > voimanTaso) {
                        extraInfo = `Vaatii voimatason ${voima.taso || 1}`;
                      }
                      // Tarkista onko skaala-ongelma jumalaisille voimille
                      else if (JUMALAISET_VOIMATYYPIT.includes(valittuVoimatyyppi) && 
                               !onkoJumalaisetVoimatSallittu(hahmo.kampanja, hahmo.skaala || 0)) {
                        const kampanjaData = kampanjaRajoitteet[hahmo.kampanja];
                        const vaadittavaSkaala = kampanjaData?.jumalaisetVoimat || 0;
                        extraInfo = `Vaatii skaalan ${vaadittavaSkaala}+ (jumalainen voima)`;
                      }
                    }

                    return (
                      <Kortti
                        key={`voima-${index}`}
                        nimi={voima.nimi}
                        kuvaus={voima.kuvaus}
                        korttiKoko="pieni"
                        otsikkoVari={onValittu ? "#2e7d32" : "#000000"}
                        extraInfo={extraInfo}
                        valittu={onValittu}
                        onClick={() => valitseVoima(voima)}
                        disabled={onDisabloitu}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Vapaakuvaus tekstikenttä tietyille voimatyypeille (paitsi elementin hallinta) */}
          {onJokinValittu && tarvitseeVapaakuvaus && !onElementinHallinta && (
            <div className="mt-2">
              <p className="vaihe-indikaattori">{vapaakuvausTiedot.otsikko}</p>
              <div className="kentta">
                <input
                  type="text"
                  value={vapaakuvaus}
                  onChange={(e) => paivitaVapaakuvaus(e.target.value)}
                  placeholder={vapaakuvausTiedot.placeholder}
                  maxLength={100}
                  required
                  className="input-custom"
                />
                {vapaakuvaus.trim().length > 0 && vapaakuvaus.trim().length < 3 && (
                  <small className="error-text">Vähintään 3 merkkiä</small>
                )}
              </div>
            </div>
          )}

          {/* Seuraava-painike vain jos tarvitaan vapaakuvaus (muodonmuutos) */}
          {tarvitseeVapaakuvaus && !onElementinHallinta && onValmisSeuraavaan && (
            <div className="wizard-navigation">
              <button onClick={() => {
                // Poista tempKykyValinta ja siirry eteenpäin
                const siivottuHahmo = { ...hahmo };
                delete siivottuHahmo.tempKykyValinta;
                paivitaHahmo(siivottuHahmo);
                seuraavaVaihe();
              }} className="btn btn-primary">
                Seuraava
              </button>
            </div>
          )}
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

export default SieluVoimaValinta;
