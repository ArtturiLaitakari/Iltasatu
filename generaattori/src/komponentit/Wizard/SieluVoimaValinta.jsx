import '../HahmoVaiheet.css';
import { voimat } from '../../data/voimat.js';
import { haeVoimanTaso } from '../../data/voimaProgression.js';
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

  // Suodata kyvyt voiman tason mukaan
  const peruskyvyt = voimat[valittuVoimatyyppi]?.peruskyvyt || [];
  const onTasojarjestelma = peruskyvyt.some(k => k.taso !== undefined);
  const voimanTasoRaw = haeVoimanTaso(hahmo.voimaTaso || hahmo.voima || 1, 1);
  const voimanTaso = typeof voimanTasoRaw === 'string'
    ? parseInt(voimanTasoRaw.replace('e', ''))
    : voimanTasoRaw;

  const onKaytettavissa = (kyky) => !onTasojarjestelma || (kyky.taso || 1) <= voimanTaso;

  // Lisää kyky valittujen joukkoon
  const valitseVoima = (voima) => {
    const paivitettyHahmo = {
      ...hahmo,
      valitutKyvyt: {
        ...hahmo.valitutKyvyt,
        [valintaAvain]: [...valitutKyvyt, voima]
      }
    };
    delete paivitettyHahmo.tempKykyValinta;
    paivitaHahmo(paivitettyHahmo);

    // Auto-advance jos ei tarvita vapaakuvausta
    if (!tarvitseeVapaakuvaus) {
      setTimeout(() => seuraavaVaihe(), 100);
    }
  };

  const paivitaVapaakuvaus = (arvo) => {
    paivitaHahmo({
      ...hahmo,
      vapaakuvaukset: { ...hahmo.vapaakuvaukset, [valintaAvain]: arvo }
    });
  };

  const onValmisSeuraavaan = onJokinValittu && (!tarvitseeVapaakuvaus || vapaakuvaus.trim().length >= 3);
  const taustaKuva = haeTaustaKuva();

  return (
    <div className={`vaihe-sisalto ${taustaKuva ? 'taustakuvalla' : ''}`}>
      <div className="levea-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`}>

          <div>
            <p className="vaihe-indikaattori">
              Valitse kyky: {valittuVoimatyyppi} ({valintaAvain})
            </p>

            <div className="ammatti-kortit-lista kapea">
              {peruskyvyt.map((voima, index) => {
                const onValittu = valitutKyvyt.some(k => k.nimi === voima.nimi);
                const onDisabloitu = !onKaytettavissa(voima) || onValittu;
                const extraInfo = !onKaytettavissa(voima)
                  ? `Vaatii voimatason ${voima.taso || 1}`
                  : undefined;

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
          </div>

          {/* Vapaakuvaus tekstikenttä tietyille voimatyypeille */}
          {onJokinValittu && tarvitseeVapaakuvaus && (
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

          {/* Seuraava-painike vain jos vapaakuvaus tarvitaan */}
          {tarvitseeVapaakuvaus && onValmisSeuraavaan && (
            <div className="wizard-navigation">
              <button onClick={seuraavaVaihe} className="btn btn-primary">
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
