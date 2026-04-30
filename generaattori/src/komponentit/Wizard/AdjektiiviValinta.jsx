import { useState } from 'react';
import { adjektiivit } from '../../data/adjektiivit.js';
import Kortti from '../Kortti.jsx';
import adjektiiviTausta from '../../kuvat/hahmot_taustakuva.jpg';
import VaiheSivu from './VaiheSivu.jsx';

const adjektiiviVaiheet = [
  { avain: 'keho', nimi: 'Keho' },
  { avain: 'mieli', nimi: 'Mieli' },
  { avain: 'sielu', nimi: 'Sielu' }
];

function haeAloitusSivu(hahmo) {
  if (!hahmo?.adjektiivit?.keho) return 0;
  if (!hahmo?.adjektiivit?.mieli) return 1;
  if (!hahmo?.adjektiivit?.sielu) return 2;
  return 2;
}

const korttiLista = (lista, valittu, onClick) => lista.map((adj) => (
  <Kortti
    key={adj.id}
    nimi={adj.nimi}
    kuvaus={adj.kuvaus}
    kuva={adj.kuva ? new URL(`../../kuvat/${adj.kuva}`, import.meta.url).href : null}
    korttiKoko="korkea"
    valittu={valittu(adj)}
    onClick={() => onClick(adj.id)}
  />
));

function AdjektiiviValinta({ hahmo, paivitaHahmo, seuraavaVaihe, kategoria = null }) {
  const [nykyinenSivu, asetaNykyinenSivu] = useState(() => haeAloitusSivu(hahmo));

  const paivitaAdjektiivi = (avain, id) => {
    paivitaHahmo({ ...hahmo, adjektiivit: { ...hahmo.adjektiivit, [avain]: id } });
  };

  if (kategoria) {
    const kategoriaData = { keho: 'Keho', mieli: 'Mieli', sielu: 'Sielu' };
    const nimi = kategoriaData[kategoria];
    return (
      <VaiheSivu taustaKuva={adjektiiviTausta} otsikko={`${nimi} Adjektiivi`} alaotsikko={`Valitse adjektiivi, joka kuvaa hahmosi ${nimi.toLowerCase()}-ominaisuutta`}>
        <div className="kuvaaja-kortit-lista">
          {korttiLista(adjektiivit, (adj) => hahmo.adjektiivit?.[kategoria] === adj.id, (id) => { paivitaAdjektiivi(kategoria, id); seuraavaVaihe?.(); })}
        </div>
      </VaiheSivu>
    );
  }

  const aktiivinenVaihe = adjektiiviVaiheet[nykyinenSivu];

  const valitseAdjektiivi = (avain, id) => {
    paivitaAdjektiivi(avain, id);
    if (nykyinenSivu < adjektiiviVaiheet.length - 1) {
      asetaNykyinenSivu(nykyinenSivu + 1);
    } else {
      seuraavaVaihe?.();
    }
  };

  return (
    <VaiheSivu taustaKuva={adjektiiviTausta} otsikko="Valitse Adjektiivit" alaotsikko="Valitse yksi adjektiivi kullekin ominaisuudelle vaiheittain">
      <p className="vaihe-indikaattori text-center">{aktiivinenVaihe.nimi} — {nykyinenSivu + 1} / {adjektiiviVaiheet.length}</p>
      <div className="kuvaaja-kortit-lista">
        {korttiLista(adjektiivit, (adj) => hahmo.adjektiivit[aktiivinenVaihe.avain] === adj.id, (id) => valitseAdjektiivi(aktiivinenVaihe.avain, id))}
      </div>
    </VaiheSivu>
  );
}

export default AdjektiiviValinta;
