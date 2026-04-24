import '../HahmoVaiheet.css';
import { voimat, aistit } from '../../data/voimat.js';
import { ammatit } from '../../data/ammatit.js';
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

  // Tarkista onko kyvyillä tasosysteemi
  const onTasojarasteelma = kaikki_peruskyvyt.some(kyky => kyky.taso !== undefined);
  
  // Jos tasojärjestelmä, näytä kaikki kyvyt mutta disable korkeammat tasot
  const peruskyvyt = kaikki_peruskyvyt;
  
  // Tason 1 kyvyt ovat käytettävissä
  const tasonYksiKyvyt = onTasojarasteelma 
    ? kaikki_peruskyvyt.filter(kyky => kyky.taso === 1)
    : kaikki_peruskyvyt;

  const valitseVoima = (voima) => {
    const paivitettyHahmo = {
      ...hahmo,
      voimat: {
        ...hahmo.voimat,
        valittuVoima: voima
      }
    };
    paivitaHahmo(paivitettyHahmo);
    
    // Auto-advance aina kun voima valitaan
    setTimeout(() => seuraavaVaihe(), 100);
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
  const taustaTyyli = taustaKuva
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${taustaKuva})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : undefined;

  return (
    <div className="vaihe-sisalto">
      <div className="vaihe-otsikko">
        <h2>Voima</h2>
        <p>Mystisen voiman perustiedot ja ensimmäinen kyky</p>
      </div>

      <div className="ammatti-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`} style={taustaTyyli}>
          
          {/* Aisti-kyky */}
          {aistiTiedot && (
            <div style={{ marginBottom: '2rem' }}>
              <p className="adjektiivi-sivu-indikaattori">Automaattinen peruskyky</p>
              <Kortti
                nimi={aistiTiedot.nimi}
                kuvaus={aistiTiedot.kuvaus}
                korttiKoko="pieni"
                otsikkoVari="#4a90e2"
                onClick={() => {}}
              />
            </div>
          )}
          
          {/* Voimakyvyt */}
          <div>
            <p className="adjektiivi-sivu-indikaattori">
              {tasonYksiKyvyt.length === 1 ? 'Automaattinen 1. tason kyky' : 'Valitse kyky'}
            </p>
            
            <div className="ammatti-kortit-lista">
              {peruskyvyt.map((voima, index) => {
                const onKaytettavissa = !onTasojarasteelma || voima.taso === 1;
                
                return (
                  <Kortti
                    key={`voima-${index}`}
                    nimi={voima.nimi}
                    kuvaus={voima.kuvaus}
                    korttiKoko="pieni"
                    otsikkoVari={valittuVoima?.nimi === voima.nimi ? "#2e7d32" : "#000000"}
                    extraInfo={tasonYksiKyvyt.length === 1 && !onTasojarasteelma ? "Automaattinen" : undefined}
                    valittu={valittuVoima?.nimi === voima.nimi}
                    onClick={() => onKaytettavissa ? valitseVoima(voima) : null}
                    disabled={!onKaytettavissa || (tasonYksiKyvyt.length === 1 && !onTasojarasteelma)}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="wizard-navigation" style={{ marginTop: '2rem' }}>
            {((tasonYksiKyvyt.length === 1 && !onTasojarasteelma) || valittuVoima) && (
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
    </div>
  );
}

export default SieluVoimaValinta;