import { useState } from 'react';
import { adjektiivit } from '../../data/adjektiivit.js';
import Kortti from '../Kortti.jsx';
import '../HahmoVaiheet.css';

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
      <div className="vaihe-sisalto">
        <div className="vaihe-otsikko">
          <h2>{aktiivinenKategoria.nimi} Adjektiivi</h2>
          <p>Valitse adjektiivi, joka kuvaa hahmosi {aktiivinenKategoria.nimi.toLowerCase()}-ominaisuutta</p>
        </div>

        <div className="levea-grid sailio-keskikoko">
          <div className="adjektiivi-kategoria">
            <div className="kortit-grid">
              {adjektiivit.map((adj) => (
                <Kortti
                  key={adj.id}
                  nimi={adj.nimi}
                  kuvaus={adj.kuvaus}
                  kuva={adj.kuva ? new URL(`../../kuvat/${adj.kuva}`, import.meta.url).href : null}
                  valittu={hahmo.adjektiivit?.[aktiivinenKategoria.avain] === adj.id}
                  onClick={() => valitseAdjektiivi(adj.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Alkuperäinen monivaihe-logiikka jos kategoria ei ole määritelty
  const [nykyinenSivu, asetaNykyinenSivu] = useState(() => haeAloitusSivu(hahmo));

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
    <div className="vaihe-sisalto">
      <div className="vaihe-otsikko">
        <h2>Valitse Adjektiivit</h2>
        <p>Valitse yksi adjektiivi kullekin ominaisuudelle vaiheittain</p>
      </div>

      <div className="levea-grid sailio-keskikoko">
        <div className="adjektiivi-kategoria">
          <h3 className="adjektiivi-kategoria-otsikko">{aktiivinenVaihe.nimi}</h3>
          <p className="adjektiivi-sivu-indikaattori">
            {nykyinenSivu + 1} / {adjektiiviVaiheet.length}
          </p>
          <div className="kortit-grid">
            {adjektiivit.map((adj) => (
              <Kortti
                key={adj.id}
                nimi={adj.nimi}
                kuvaus={adj.kuvaus}
                kuva={adj.kuva ? new URL(`../../kuvat/${adj.kuva}`, import.meta.url).href : null}
                valittu={hahmo.adjektiivit[aktiivinenVaihe.avain] === adj.id}
                onClick={() => valitseAdjektiivi(aktiivinenVaihe.avain, adj.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdjektiiviValinta;
