import { useState } from 'react';
import { adjektiivit } from '../../data/adjektiivit.js';
import Kortti from '../Kortti.jsx';
import { KORTTI_DEFAULTS } from '../../constants';
import '../HahmoVaiheet.css';
import adjektiiviTausta from '../../kuvat/hahmot_taustakuva.jpg';

const adjektiiviVaiheet = [
  { avain: 'keho', nimi: 'Keho' },
  { avain: 'mieli', nimi: 'Mieli' },
  { avain: 'sielu', nimi: 'Sielu' }
];

function haeAloitusSivu(hahmo) {
  if (!hahmo?.adjektiivit?.keho) {
    return 0;
  }
  if (!hahmo?.adjektiivit?.mieli) {
    return 1;
  }
  if (!hahmo?.adjektiivit?.sielu) {
    return 2;
  }
  return 2;
}

function AdjektiiviValinta({ hahmo, paivitaHahmo, seuraavaVaihe, kategoria = null }) {
  // useState pitää kutsua aina komponentin alussa
  const [nykyinenSivu, asetaNykyinenSivu] = useState(() => haeAloitusSivu(hahmo));

  // Jos kategoria on määritelty, käsitellään vain sitä
  if (kategoria) {
    const kategoriaData = {
      keho: { avain: 'keho', nimi: 'Keho' },
      mieli: { avain: 'mieli', nimi: 'Mieli' },
      sielu: { avain: 'sielu', nimi: 'Sielu' }
    };

    const aktiivinenKategoria = kategoriaData[kategoria];

    const valitseAdjektiivi = (adjektiiviId) => {
      const paivitettyHahmo = {
        ...hahmo,
        adjektiivit: {
          ...hahmo.adjektiivit,
          [aktiivinenKategoria.avain]: adjektiiviId
        }
      };
      paivitaHahmo(paivitettyHahmo);
      
      // Siirry automaattisesti seuraavalle sivulle
      if (seuraavaVaihe) {
        seuraavaVaihe();
      }
    };

    return (
      <div className={`vaihe-sisalto ${adjektiiviTausta ? 'taustakuvalla' : ''}`}>
        <div className="vaihe-otsikko">
          <h2>{aktiivinenKategoria.nimi} Adjektiivi</h2>
          <p>Valitse adjektiivi, joka kuvaa hahmosi {aktiivinenKategoria.nimi.toLowerCase()}-ominaisuutta</p>
        </div>

        <div className="levea-grid">
          <div className={`kuvaaja-kategoria ${adjektiiviTausta ? 'kuvaaja-kategoria-taustalla' : ''}`}>
            <div className="kuvaaja-kortit-lista">
              {adjektiivit.map((adj) => (
                <Kortti
                  key={adj.id}
                  nimi={adj.nimi}
                  kuvaus={adj.kuvaus}
                  kuva={adj.kuva ? new URL(`../../kuvat/${adj.kuva}`, import.meta.url).href : null}
                  korttiKorkeus={KORTTI_DEFAULTS.KORKEUS}
                  valittu={hahmo.adjektiivit?.[aktiivinenKategoria.avain] === adj.id}
                  onClick={() => valitseAdjektiivi(adj.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {adjektiiviTausta && (
          <style>{`
            .sovellus {
              background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${adjektiiviTausta}) !important;
              background-size: cover !important;
              background-position: center !important;
            }
          `}</style>
        )}
      </div>
    );
  }

  // Alkuperäinen monivaihe-logiikka jos kategoria ei ole määritelty
  const valitseAdjektiivi = (kategoria, adjektiiviId) => {
    paivitaHahmo({
      ...hahmo,
      adjektiivit: {
        ...hahmo.adjektiivit,
        [kategoria]: adjektiiviId
      }
    });

    if (nykyinenSivu < adjektiiviVaiheet.length - 1) {
      asetaNykyinenSivu(nykyinenSivu + 1);
      return;
    }

    if (seuraavaVaihe) {
      seuraavaVaihe();
    }
  };

  const aktiivinenVaihe = adjektiiviVaiheet[nykyinenSivu];

  return (
    <div className={`vaihe-sisalto ${adjektiiviTausta ? 'adjektiivi-sivu' : ''}`}>
      <div className="vaihe-otsikko">
        <h2>Valitse Adjektiivit</h2>
        <p>Valitse yksi adjektiivi kullekin ominaisuudelle vaiheittain</p>
      </div>

      <div className="levea-grid">
        <div className={`kuvaaja-kategoria ${adjektiiviTausta ? 'kuvaaja-kategoria-taustalla' : ''}`}>
          <h3 className="adjektiivi-kategoria-otsikko">{aktiivinenVaihe.nimi}</h3>
          <p className="vaihe-indikaattori">
            {nykyinenSivu + 1} / {adjektiiviVaiheet.length}
          </p>
          <div className="kuvaaja-kortit-lista">
            {adjektiivit.map((adj) => (
              <Kortti
                key={adj.id}
                nimi={adj.nimi}
                kuvaus={adj.kuvaus}
                kuva={adj.kuva ? new URL(`../../kuvat/${adj.kuva}`, import.meta.url).href : null}
                korttiKorkeus={KORTTI_DEFAULTS.KORKEUS}
                valittu={hahmo.adjektiivit[aktiivinenVaihe.avain] === adj.id}
                onClick={() => valitseAdjektiivi(aktiivinenVaihe.avain, adj.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {adjektiiviTausta && (
        <style>{`
          .sovellus {
            background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${adjektiiviTausta}) !important;
            background-size: cover !important;
            background-position: center !important;
          }
        `}</style>
      )}
    </div>
  );
}

export default AdjektiiviValinta;
