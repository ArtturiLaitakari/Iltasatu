import { useEffect, useState } from 'react';
import { haeKategorianAmmatit } from '../../utils/hahmoLogiikka.js';
import { arkkityypit } from '../../data/arkkityypit.js';
import Kortti from '../Kortti.jsx';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function AmmattiValinta({ hahmo, paivitaHahmo, seuraavaVaihe, kategoria = null }) {
  if (!hahmo.arkkityyppi) {
    return (
      <div className="vaihe-sisalto">
        <p>Valitse ensin arkkityyppi.</p>
      </div>
    );
  }

  // Jos kategoria on määritelty, käsitellään vain sitä
  if (kategoria) {
    const kategoriaData = {
      keho: { avain: 'keho', nimi: 'Fyysinen', ammattiKategoria: 'fyysinen' },
      mieli: { avain: 'mieli', nimi: 'Henkinen', ammattiKategoria: 'henkinen' },
      sielu: { avain: 'sielu', nimi: 'Mystinen', ammattiKategoria: 'mystinen' }
    };

    const aktiivinenKategoria = kategoriaData[kategoria];
    const ammatit = haeKategorianAmmatit(aktiivinenKategoria.ammattiKategoria, hahmo.genre || 'fantasia');
    
    const haeTaustaKuva = () => {
      const tiedostoVaihtoehdot = [
        `${aktiivinenKategoria.avain}_tausta.jpg`,
        `${aktiivinenKategoria.avain}_tausta.jpeg`,
        `${aktiivinenKategoria.avain}_tausta.png`,
        `${aktiivinenKategoria.avain}_tausta.webp`,
        `${aktiivinenKategoria.avain}_ammatti.jpg`,
        `${aktiivinenKategoria.avain}_ammatit.jpg`
      ];

      for (const tiedostoNimi of tiedostoVaihtoehdot) {
        const osuma = Object.entries(taustaKuvat).find(([polku]) => polku.endsWith(`/${tiedostoNimi}`));
        if (osuma) {
          return osuma[1];
        }
      }
      return null;
    };

    const valitseAmmatti = (ammatti) => {
      const uudetAmmatit = {
        ...hahmo.ammatit,
        [aktiivinenKategoria.avain]: ammatti.id // Tallenna id
      };

      let paivitettyHahmo = { 
        ...hahmo, 
        ammatit: uudetAmmatit
      };

      // Aseta voimat kun valitaan sielu ammatti
      if (aktiivinenKategoria.avain === 'sielu') {
        paivitettyHahmo = {
          ...paivitettyHahmo,
          voimat: {
            'magia': ammatti.voima === 'magia' ? 1 : 0,
            'muodonmuutos': ammatti.voima === 'muodonmuutos' ? 1 : 0,
            'mentalismi': ammatti.voima === 'mentalismi' ? 1 : 0,
            'elementin hallinta': ammatti.voima === 'elementin hallinta' ? 1 : 0,
            valitut: []
          }
        };
      }

      paivitaHahmo(paivitettyHahmo);
      
      // Siirry automaattisesti seuraavalle sivulle
      if (seuraavaVaihe) {
        seuraavaVaihe();
      }
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
      <div className={`vaihe-sisalto ${taustaKuva ? 'ammatti-sivu' : ''}`}>
        <div className="vaihe-otsikko">
          <h2>{aktiivinenKategoria.nimi} Ammatti</h2>
          <p>Valitse {aktiivinenKategoria.nimi.toLowerCase()} ammatti hahmollesi</p>
        </div>

        <div className="levea-grid">
          <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`}>
            <div className={`ammatti-kortit-lista ${aktiivinenKategoria.avain === 'sielu' ? 'kapea' : ''}`}>
              {ammatit.map((ammatti) => (
                <Kortti
                  key={ammatti.nimi}
                  nimi={ammatti.nimi}
                  kuvaus={ammatti.kuvaus}
                  korttiKoko="pieni"
                  otsikkoVari="#000000"
                  valittu={hahmo.ammatit?.[aktiivinenKategoria.avain] === ammatti.id}
                  onClick={() => valitseAmmatti(ammatti)}
                />
              ))}
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
        )}
      </div>
    );
  }

  // Alkuperäinen monivaihe-logiikka jos kategoria ei ole määritelty

  const arkkityyppiData = arkkityypit[hahmo.arkkityyppi];
  const [nykyinenSivu, asetaNykyinenSivu] = useState(0);

  // Järjestä otsikot arkkityypin mukaan, mutta säilytä vakio järjestys keho, mieli, sielu
  const jarjestaAmmattiVaiheet = () => {
    const ominaisuudet = ['keho', 'mieli', 'sielu'];
    
    // Kartoitus ominaisuuksista näyttönimiin
    const nimiKartta = {
      'keho': 'Fyysinen',
      'mieli': 'Henkinen', 
      'sielu': 'Mystinen'
    };
    
    // Järjestä ominaisuudet maksimiarvojen mukaan saadaksemme otsikot oikeaan järjestykseen
    const jarjestetytOtsikot = [...ominaisuudet].sort((a, b) => {
      return arkkityyppiData[b].maksimi - arkkityyppiData[a].maksimi;
    });
    
    const otsikkoKartta = {
      [jarjestetytOtsikot[0]]: 'Ammatti',     // Korkein maksimi
      [jarjestetytOtsikot[1]]: 'Koulutus',    // Keskimmäinen 
      [jarjestetytOtsikot[2]]: 'Harrastus'    // Alhaisin
    };
    
    // Palauta vakio järjestys keho, mieli, sielu mutta oikeilla otsikoilla
    return ominaisuudet.map((avain) => ({
      avain,
      nimi: nimiKartta[avain],
      otsikko: otsikkoKartta[avain]
    }));
  };

  const ammattiVaiheet = jarjestaAmmattiVaiheet();
  const aktiivinenVaihe = ammattiVaiheet[nykyinenSivu];

  useEffect(() => {
    asetaNykyinenSivu(0);
  }, [hahmo.arkkityyppi]);

  const haeAmmattiKategoria = (kategoria) => {
    // Yksinkertainen kartoitus ominaisuus -> ammattiryhmä
    const kategoriaKartta = {
      'keho': 'fyysinen',
      'mieli': 'henkinen', 
      'sielu': 'mystinen'
    };
    
    return kategoriaKartta[kategoria] || 'fyysinen';
  };

  const haeTaustaKuva = (stat) => {
    const tiedostoVaihtoehdot = [
      `${stat}_tausta.jpg`,
      `${stat}_tausta.jpeg`,
      `${stat}_tausta.png`,
      `${stat}_tausta.webp`,
      `${stat}_ammatti.jpg`,
      `${stat}_ammatit.jpg`
    ];

    for (const tiedostoNimi of tiedostoVaihtoehdot) {
      const osuma = Object.entries(taustaKuvat).find(([polku]) => polku.endsWith(`/${tiedostoNimi}`));
      if (osuma) {
        return osuma[1];
      }
    }

    return null;
  };
  
  const valitseAmmatti = (kategoria, ammatti) => {
    const uudetAmmatit = {
      ...hahmo.ammatit,
      [kategoria]: ammatti.id // Tallenna id
    };

    let paivitettyHahmo = { 
      ...hahmo, 
      ammatit: uudetAmmatit
    };

    // Aseta voimat kun valitaan sielu ammatti
    if (kategoria === 'sielu') {
      paivitettyHahmo = {
        ...paivitettyHahmo,
        voimat: {
          'magia': ammatti.voima === 'magia' ? 1 : 0,
          'muodonmuutos': ammatti.voima === 'muodonmuutos' ? 1 : 0,
          'mentalismi': ammatti.voima === 'mentalismi' ? 1 : 0,
          'elementin hallinta': ammatti.voima === 'elementin hallinta' ? 1 : 0,
          valitut: []
        }
      };
    }

    paivitaHahmo(paivitettyHahmo);

    // Tarkista onko kaikki kolme ammattia valittu
    const kaikkiAmmatitValittu = uudetAmmatit.keho && uudetAmmatit.mieli && uudetAmmatit.sielu;
    
    if (kaikkiAmmatitValittu) {
      // Kaikki ammatit valittu, siirry suoraan voima-sivulle
      if (seuraavaVaihe) {
        seuraavaVaihe();
      }
      return;
    }

    if (nykyinenSivu < ammattiVaiheet.length - 1) {
      asetaNykyinenSivu(nykyinenSivu + 1);
      return;
    }

    if (seuraavaVaihe) {
      seuraavaVaihe();
    }
  };

  const ammattiKategoria = haeAmmattiKategoria(aktiivinenVaihe.avain);
  const ammatit = haeKategorianAmmatit(ammattiKategoria, hahmo.genre || 'fantasia');
  const taustaKuva = haeTaustaKuva(aktiivinenVaihe.avain);
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
        <h2>Valitse Ammatit</h2>
        <p>Valitse ammatti, koulutus ja harrastus kullekin ominaisuudelle</p>
      </div>

      <div className="levea-grid">
        <div className={`ammatti-kategoria ${taustaKuva ? 'ammatti-kategoria-taustalla' : ''}`} style={taustaTyyli}>
          <h3>{aktiivinenVaihe.nimi} {aktiivinenVaihe.otsikko}</h3>
          <p className="adjektiivi-sivu-indikaattori">{nykyinenSivu + 1} / {ammattiVaiheet.length}</p>
          <div className="ammatti-kortit-lista">
            {ammatit.map((ammatti) => (
              <Kortti
                key={ammatti.nimi}
                nimi={ammatti.nimi}
                kuvaus={ammatti.kuvaus}
                korttiKoko="pieni"
                otsikkoVari="#000000"
                valittu={hahmo.ammatit[aktiivinenVaihe.avain] === ammatti.id}
                onClick={() => valitseAmmatti(aktiivinenVaihe.avain, ammatti)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmmattiValinta;