import { useState } from 'react';
import { voimat } from '../../data/voimat.js';
import { haeVoimanTaso } from '../../data/voimaProgression.js';
import { onkoJumalaisetVoimatSallittu, kampanjaRajoitteet } from '../../data/kampanjaRajoitteet.js';
import Kortti from '../Kortti.jsx';
import Modal from '../Modal.jsx';

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

// Muunna kyvyt aina arrayksi (yhteensopivuus vanhan datan kanssa)
const haeKyvytArray = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw) return [raw];
  return [];
};

function SieluVoimaModal({ isOpen, onClose, hahmo, paivitaHahmo, seuraavaVaihe }) {
  const [localHahmo, setLocalHahmo] = useState(hahmo);

  // Selvitä mihin voimaan kyky valitaan
  const onVoimatasoNosto = !!localHahmo.tempKykyValinta;
  const valintaAvain = onVoimatasoNosto ? localHahmo.tempKykyValinta.voima : 'primary';
  const onEdistynyt = onVoimatasoNosto && localHahmo.tempKykyValinta.edistynyt === true;
  const valittuVoimatyyppi = localHahmo.voimienJarjestys?.[valintaAvain];

  if (!valittuVoimatyyppi) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Voima" size="medium">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Valitse ensin voimatyyppi edellisessä vaiheessa</p>
        </div>
      </Modal>
    );
  }

  const valitutKyvyt = haeKyvytArray(localHahmo.valitutKyvyt?.[valintaAvain]);
  const onJokinValittu = valitutKyvyt.length > 0;
  const vapaakuvaus = localHahmo.vapaakuvaukset?.[valintaAvain] || '';
  const vapaakuvausTiedot = VAPAAKUVAUS_OTSIKOT[valittuVoimatyyppi];
  const tarvitseeVapaakuvaus = !!vapaakuvausTiedot;
  
  // Radiobutton valinta (magia)
  const radiobuttonTiedot = RADIOBUTTON_VALINNAT[valittuVoimatyyppi];
  const tarvitseeRadiobutton = !!radiobuttonTiedot;
  const radiobuttonValinta = localHahmo.vapaakuvaukset?.[valintaAvain] || '';
  
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
  if (onVoimatasoNosto && localHahmo.tempKykyValinta?.taso) {
    // Käytä tempKykyValinta tason arvoa
    const tasoArvo = localHahmo.tempKykyValinta.taso;
    voimanTaso = typeof tasoArvo === 'string'
      ? parseInt(tasoArvo.replace('e', ''))
      : tasoArvo;
  } else {
    // Normaali progression taulukosta haku
    const voimanTasoRaw = haeVoimanTaso(localHahmo.voimaTaso || localHahmo.voima || 1, 1);
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
      if (!onkoJumalaisetVoimatSallittu(localHahmo.kampanja, localHahmo.skaala || 0)) {
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
      ...localHahmo,
      valitutKyvyt: {
        ...localHahmo.valitutKyvyt,
        [valintaAvain]: paivitetytKyvyt
      }
    };
    
    setLocalHahmo(paivitettyHahmo);

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
        const siivottuHahmo = { ...paivitettyHahmo, tempKykyValinta: undefined };
        paivitaHahmo(siivottuHahmo);
        onClose();
        seuraavaVaihe();
      }, 100);
    }
  };

  const paivitaVapaakuvaus = (arvo) => {
    setLocalHahmo({
      ...localHahmo,
      vapaakuvaukset: { ...localHahmo.vapaakuvaukset, [valintaAvain]: arvo }
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

  const tallennaNSeuraava = () => {
    const siivottuHahmo = { ...localHahmo };
    delete siivottuHahmo.tempKykyValinta;
    paivitaHahmo(siivottuHahmo);
    onClose();
    seuraavaVaihe();
  };

  const otsikko = onEdistynyt 
    ? `Edistynyt ${valittuVoimatyyppi} (${valintaAvain})`
    : `${valittuVoimatyyppi} (${valintaAvain})`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={otsikko} size="large">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Elementin hallinta: Vapaakuvaus ensimmäiseksi */}
        {onElementinHallinta && (valitutKyvyt.length === 0) && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{vapaakuvausTiedot.otsikko}</h4>
            <input
              type="text"
              value={vapaakuvaus}
              onChange={(e) => paivitaVapaakuvaus(e.target.value)}
              placeholder={vapaakuvausTiedot.placeholder}
              maxLength={100}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e1e1',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease',
                background: 'white',
                color: '#2c3e50',
                boxSizing: 'border-box'
              }}
            />
            {vapaakuvaus.trim().length > 0 && vapaakuvaus.trim().length < 3 && (
              <small style={{ color: '#ff6b6b', marginTop: '0.5rem', display: 'block', fontSize: '0.875rem' }}>
                Vähintään 3 merkkiä
              </small>
            )}
          </div>
        )}

        {/* Magia: Radiobutton valinta ensimmäiseksi */}
        {onMagia && !magiaValittu && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{radiobuttonTiedot.otsikko}</h4>
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
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              {onEdistynyt ? 'Valitse edistynyt kyky' : 'Valitse kyky'}
              {onElementinHallinta && elementtiValittu && (
                <span style={{ color: '#666', fontWeight: 'normal' }}> - {vapaakuvaus}</span>
              )}
              {onMagia && magiaValittu && (
                <span style={{ color: '#666', fontWeight: 'normal' }}>
                  {' - '}{radiobuttonTiedot.vaihtoehdot.find(v => v.arvo === radiobuttonValinta)?.nimi}
                </span>
              )}
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
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
                           !onkoJumalaisetVoimatSallittu(localHahmo.kampanja, localHahmo.skaala || 0)) {
                    const kampanjaData = kampanjaRajoitteet[localHahmo.kampanja];
                    const vaadittavaSkaala = kampanjaData?.jumalaisetVoimat || 0;
                    extraInfo = `Vaatii skaalan ${vaadittavaSkaala}+ (jumalainen voima)`;
                  }
                }

                return (
                  <Kortti
                    key={`voima-${index}`}
                    nimi={voima.nimi}
                    kuvaus={voima.kuvaus}
                    korttiKoko="tiivis"
                    otsikkoVari={onValittu ? "#2e7d32" : "#000000"}
                    extraInfo={extraInfo}
                    valittu={onValittu}
                    onClick={() => valitseVoima(voima)}
                    disabled={onDisabloitu}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Vapaakuvaus tekstikenttä tietyille voimatyypeille (paitsi elementin hallinta) */}
        {onJokinValittu && tarvitseeVapaakuvaus && !onElementinHallinta && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{vapaakuvausTiedot.otsikko}</h4>
            <input
              type="text"
              value={vapaakuvaus}
              onChange={(e) => paivitaVapaakuvaus(e.target.value)}
              placeholder={vapaakuvausTiedot.placeholder}
              maxLength={100}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e1e1',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease',
                background: 'white',
                color: '#2c3e50',
                boxSizing: 'border-box'
              }}
            />
            {vapaakuvaus.trim().length > 0 && vapaakuvaus.trim().length < 3 && (
              <small style={{ color: '#ff6b6b', marginTop: '0.5rem', display: 'block', fontSize: '0.875rem' }}>
                Vähintään 3 merkkiä
              </small>
            )}
          </div>
        )}

        {/* Seuraava-painike vain jos tarvitaan vapaakuvaus (muodonmuutos) */}
        {tarvitseeVapaakuvaus && !onElementinHallinta && onValmisSeuraavaan && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button onClick={tallennaNSeuraava} className="btn btn-primary">
              Tallenna ja jatka
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default SieluVoimaModal;