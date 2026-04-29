import { arkkityypit } from '../../data/arkkityypit.js';
import { skaala, taitotasoSanallisesti, luonteet, haeVoimarajat, onkoJumalainen, laskeHahmopisteet } from '../../data/muutData.js';
import { aistit, voimat } from '../../data/voimat.js';
import { ammatit } from '../../data/ammatit.js';
import { adjektiivit } from '../../data/adjektiivit.js';
import { rodut } from '../../data/rodut.js';
import { tallennaHahmo } from '../../utils/hahmoLogiikka.js';
import { haeKampanjanAmmattiTyyppi } from '../../data/kampanjaRajoitteet.js';
import { haeVoimanPallot, haeSkaalaText, voikoNostaa, haeOminaisuudenPallot, laskeOminaisuudenMaksimi, laskeVoimaMaksimi, VOIMAN_MAKSIMIT, voimaProgression, selvitaMuuttunutVoima } from '../../data/voimaProgression.js';
import React from 'react';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HahmoLomake({ hahmo, paivitaHahmo, onHahmoLista, aloitaUudelleen, setKopioiFunktio, setTulostaFunktio, setTallennaFunktio, siirryVoimanKykyyn }) {
  const arkkityyppiData = arkkityypit[hahmo.arkkityyppi];
  const hahmonSkaala = skaala.find(s => s.taso === hahmo.skaala);

  const haeTaustaKuva = () => {
    const tiedostoVaihtoehdot = [
      'yhteenveto_tausta.jpg',
      'yhteenveto_tausta.jpeg',
      'yhteenveto_tausta.png',
      'yhteenveto_tausta.webp'
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

  const haeSukupuoli = (isoAlkukirjain = false) => {
    const sukupuoli = hahmo.henkilotiedot?.sukupuoli;
    if (sukupuoli === 'M') return isoAlkukirjain ? 'Mies' : 'mies';
    if (sukupuoli === 'N') return isoAlkukirjain ? 'Nainen' : 'nainen';
    return isoAlkukirjain ? 'Sukupuoli ei määritelty' : 'henkilö';
  };

  const haeRajamurtoTeksti = () => {
    if ((hahmo.voimaTaso || 1) > 13) return '';
    return hahmo.onkoRajamurto ? ' <Ääriraja murtuma>.' : '';
  };

  // Apufunktiot tietojen hakuun
  const haeAdjektiivinNimi = (adjektiiviId) => {
    if (!adjektiiviId) return '';
    const adjektiivi = adjektiivit.find(adj => adj.id === adjektiiviId);
    return adjektiivi ? adjektiivi.nimi : adjektiiviId;
  };

  const haeLuonteenTiedot = (luonneNimi) => {
    if (!luonneNimi) return null;
    return luonteet.find(luonne => luonne.nimi === luonneNimi);
  };

  const haeAdjektiivinNimiAliasSaannolla = (adjektiiviId, positio, kaikkiAdjektiivit) => {
    if (!adjektiiviId) return '';
    const adjektiivi = adjektiivit.find(adj => adj.id === adjektiiviId);
    if (!adjektiivi) return adjektiiviId;

    // Tarkista onko sama adjektiivi edellisessä positiossa
    const adjektiivitArray = [kaikkiAdjektiivit?.keho, kaikkiAdjektiivit?.mieli, kaikkiAdjektiivit?.sielu];
    let aliasKaytossa = false;
    
    // Käy läpi adjektiivit vasemmalta oikealle ja laske kuinka mones sama adjektiivi tämä on
    let saman_lkm = 0;
    for (let i = 0; i <= positio; i++) {
      if (adjektiivitArray[i] === adjektiiviId) {
        saman_lkm++;
      }
    }
    
    // Jos kyseessä on parillinen esiintymä (2., 4., 6...), käytä aliasta
    if (saman_lkm > 1 && saman_lkm % 2 === 0) {
      aliasKaytossa = true;
    }
    
    return aliasKaytossa ? adjektiivi.alias : adjektiivi.nimi;
  };

  const haeAmmatinNimi = (ammattiId) => {
    if (!ammattiId) return '';
    
    // Etsi ammatti kaikista kategorioista
    const ammattiTyyppi = haeKampanjanAmmattiTyyppi(hahmo.kampanja || 'avoin-fantasia');
    const genreAmmatit = ammatit[ammattiTyyppi] || {};
    const kaikki = [
      ...(genreAmmatit.fyysinen || []),
      ...(genreAmmatit.henkinen || []),
      ...(genreAmmatit.mystinen || [])
    ];
    
    const ammatti = kaikki.find(a => a.id === ammattiId);
    return ammatti ? ammatti.nimi : ammattiId;
  };

  // Taitotason laskenta ja esitys
  const laskeTaitotaso = (perusarvo, onAdjektiivi, onAmmatti) => {
    let taso = perusarvo || 0;
    if (onAdjektiivi) taso += 1;
    if (onAmmatti) taso += 1;
    return taso;
  };

  const luoYmpyraEsitys = (taso, maksimi = 3, kaytetaanProgressiota = false) => {
    if (kaytetaanProgressiota && taso) {
      const pallot = haeVoimanPallot(taso);
      return <span style={{ verticalAlign: 'middle' }}>{pallot}</span>;
    }
    let esitys = '';
    for (let i = 0; i < maksimi; i++) {
      esitys += i < taso ? '●' : '○';
    }
    return <span style={{ verticalAlign: 'middle' }}>{esitys}</span>;
  };

  const haeTaitotasonNimi = (taso) => {
    const taitotasoData = taitotasoSanallisesti.find(t => t.taso === taso);
    return taitotasoData?.nimi || 'Tuntematon';
  };

  const luoTekstimuoto = () => {
    // Luo teksti-muotoinen yhteenveto hahmosta
    const voimaTaso = hahmo.voimaTaso || 1;
    const voimateksti = `Voima ${voimaTaso}`;
    const adjektiivitTeksti = `${haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.keho, 0, hahmo.adjektiivit)} ${haeAmmatinNimi(hahmo.ammatit?.keho)}, ${haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.mieli, 1, hahmo.adjektiivit)} ${haeAmmatinNimi(hahmo.ammatit?.mieli)} ja ${haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.sielu, 2, hahmo.adjektiivit)} ${haeAmmatinNimi(hahmo.ammatit?.sielu)}`;
    
    const teksti = `${hahmo.henkilotiedot.nimi || 'Anonyymi'} - ${hahmo.kuvaaja?.nimi || 'Tuntematon'}

Olen ${hahmo.kuvaaja?.nimi || 'tuntematon'}, ${adjektiivitTeksti}.
Rotuni on ${hahmo.rotu?.nimi || 'Ei rotua'}. 
Luonteeltani olen ${hahmo.henkilotiedot?.luonne || 'Ei luonnetta'} ja ${voimateksti}.

Ominaisuudet:
Keho: ${hahmo.keho || 0}, Mieli: ${hahmo.mieli || 0}, Sielu: ${hahmo.sielu || 0}
Skaala: ${hahmonSkaala?.nimi || 'Tuntematon'} (${hahmonSkaala?.kuvaus || 'Ei kuvausta'})`;
    
    navigator.clipboard.writeText(teksti);
    alert('Hahmon tiedot kopioitu leikepöydälle!');
  };

  const tulostahahmo = () => {
    // Lisää tulostusluokka bodyyn
    document.body.classList.add('tulosta-hahmo');
    
    // Avaa tulostusikkuna
    window.print();
    
    // Poista tulostusluokka tulostuksen jälkeen
    setTimeout(() => {
      document.body.classList.remove('tulosta-hahmo');
    }, 1000);
  };

  const tallennaJaJaa = () => {
    tallennaHahmo(hahmo);
    if (onHahmoLista) {
      onHahmoLista();
    } else if (aloitaUudelleen) {
      aloitaUudelleen();
    }
  };

  // Laske hahmopisteet XP:stä
  const hahmopisteetXpsta = laskeHahmopisteet(hahmo.xp || 0);
  
  // Laske käytetyt pisteet voimista - käytä uutta progression systeemiä
  const kokonaisprogression = hahmo.voimaTaso || 1;
  const kaytetytVoimaPisteet = kokonaisprogression - 1; // Progression alkaa 1:stä, joten vähennetään 1
  
  // Laske käytetyt pisteet ominaisuuksista (keho, mieli, sielu)
  const kaytetytOminaisuusPisteet = (hahmo.keho || 0) + (hahmo.mieli || 0) + (hahmo.sielu || 0);
  
  // Laske käytettävissä olevat pisteet - käytä tallennettua arvoa jos saatavilla
  const hahmopisteetYhteensa = hahmopisteetXpsta;
  const lasketutKayttamattomatPisteet = Math.max(0, hahmopisteetYhteensa - kaytetytVoimaPisteet - kaytetytOminaisuusPisteet);
  const kayttamattomatHahmopisteet = hahmo.kayttamattomatHahmopisteet !== undefined ? hahmo.kayttamattomatHahmopisteet : lasketutKayttamattomatPisteet;
  


  const nostaVoimaa = () => {
    if (!voikoNostaa(hahmo, 'voima') || kayttamattomatHahmopisteet <= 0) return;
    
    const vanhaTaso = hahmo.voimaTaso || 1;
    const uusiVoimaTaso = vanhaTaso + 1;
    
    // Selvitä mikä voima muuttui
    const muutos = selvitaMuuttunutVoima(vanhaTaso, uusiVoimaTaso);
    
    // Päivitä voimaTaso ensin
    const paivitettyHahmo = {
      ...hahmo,
      voimaTaso: uusiVoimaTaso,
      kayttamattomatHahmopisteet: kayttamattomatHahmopisteet - 1
    };
    
    paivitaHahmo(paivitettyHahmo);
    
    // Jos uusi voima aktivoitui (null -> taso) tai voima nousi uudelle tasolle joka antaa kyvyn
    if (muutos) {
      // Apufunktio voimatason numeraaliseen vertailuun (käsittelee myös "4e"/"5e")
      const voimaTasonNumero = (taso) => {
        if (typeof taso === 'string') {
          // "4e" -> 4, "5e" -> 5
          return parseInt(taso, 10);
        }
        return taso || 0;
      };
      
      const uusiNumero = voimaTasonNumero(muutos.uusiTaso);
      const vanhaNumero = voimaTasonNumero(muutos.vanhaTaso);
      
      const tarvitseeUudenKyvyn = 
        (muutos.vanhaTaso === null && uusiNumero >= 1) || // Uusi voima aktivoitui
        (uusiNumero > vanhaNumero) || // Voima nousi numeraalisesti
        (muutos.edistynyt === true); // Tai tuli edistynyt kyky
        
      if (tarvitseeUudenKyvyn) {
        // Jos edistynyt kyky JA voimalla on jo edistynyt kyky, lisää kaikki edistyneet automaattisesti
        if (muutos.edistynyt === true && muutos.voima) {
          const valitutKyvyt = paivitettyHahmo.valitutKyvyt?.[muutos.voima] || [];
          const onJoEdistynytKyky = Array.isArray(valitutKyvyt) 
            ? valitutKyvyt.some(kyky => kyky.edistynyt === true)
            : valitutKyvyt?.edistynyt === true;
          
          if (onJoEdistynytKyky) {
            // Lisää kaikki edistyneet kyvyt automaattisesti
            const voimatyyppi = paivitettyHahmo.voimienJarjestys?.[muutos.voima];
            const voimaData = voimat[voimatyyppi];
            const edistyneetKyvyt = voimaData?.edistyneet || [];
            
            const valitutNimet = Array.isArray(valitutKyvyt) 
              ? valitutKyvyt.map(k => k.nimi)
              : (valitutKyvyt?.nimi ? [valitutKyvyt.nimi] : []);
            
            const uudetKyvyt = edistyneetKyvyt
              .filter(kyky => !valitutNimet.includes(kyky.nimi))
              .map(kyky => ({ ...kyky, edistynyt: true }));
            
            if (uudetKyvyt.length > 0) {
              const kaikki = Array.isArray(valitutKyvyt) 
                ? [...valitutKyvyt, ...uudetKyvyt]
                : [valitutKyvyt, ...uudetKyvyt].filter(Boolean);
              
              const lopullinenHahmo = {
                ...paivitettyHahmo,
                valitutKyvyt: {
                  ...paivitettyHahmo.valitutKyvyt,
                  [muutos.voima]: kaikki
                }
              };
              
              paivitaHahmo(lopullinenHahmo);
              return; // Ei avaa modaalia
            }
          }
        }
        
        // Normaali kykyvalinta modal
        const tempHahmo = {
          ...paivitettyHahmo,
          tempKykyValinta: {
            voima: muutos.voima, // 'primary', 'secondary' tai 'tertiary'
            taso: muutos.uusiTaso,
            edistynyt: muutos.edistynyt || false
          }
        };
        paivitaHahmo(tempHahmo);
        
        // Siirry kyvynvalintaan
        setTimeout(() => siirryVoimanKykyyn(), 100);
      }
    }
  };

  const nostaOminaisuutta = (avain, maksimi) => {
    if (!voikoNostaa(hahmo, avain) || kayttamattomatHahmopisteet <= 0) return;
    
    paivitaHahmo({
      ...hahmo,
      [avain]: (hahmo[avain] || 0) + 1,
      kayttamattomatHahmopisteet: kayttamattomatHahmopisteet - 1
    });
  };

  const voimanMaksimi = laskeVoimaMaksimi(hahmo.skaala);
  const nykyinenVoimataso = hahmo.voimaTaso || 1;
  const voiValitaJumalaisenVoiman = onkoJumalainen(hahmo.skaala); // Valmis jumalaisten voimien valintaa varten
  React.useEffect(() => {
    // Jumalaisen voiman valinta valmis toteutettavaksi: voiValitaJumalaisenVoiman
    if (voiValitaJumalaisenVoiman) {
      // Tulevaisuudessa: näytä jumalaisten voimien valinnat
    }
  }, [voiValitaJumalaisenVoiman]);
  const ominaisuudetMaksimissa =
    (hahmo.keho || 0) >= (arkkityyppiData?.keho?.maksimi || 1) &&
    (hahmo.mieli || 0) >= (arkkityyppiData?.mieli?.maksimi || 1) &&
    (hahmo.sielu || 0) >= (arkkityyppiData?.sielu?.maksimi || 1);
  const voimaMaksimissa = nykyinenVoimataso >= voimanMaksimi;
  const kaikkiOstettavatMaksimissa = ominaisuudetMaksimissa && voimaMaksimissa;

  React.useEffect(() => {
    if (!paivitaHahmo) return;
    if ((hahmo.onkoRajamurto || false) === kaikkiOstettavatMaksimissa) return;
    paivitaHahmo({ ...hahmo, onkoRajamurto: kaikkiOstettavatMaksimissa });
  }, [hahmo, paivitaHahmo, kaikkiOstettavatMaksimissa]);

  // Välitä funktiot Wizard komponenttiin
  React.useEffect(() => {
    if (setKopioiFunktio) setKopioiFunktio(() => luoTekstimuoto);
    if (setTulostaFunktio) setTulostaFunktio(() => tulostahahmo);
    if (setTallennaFunktio) setTallennaFunktio(() => tallennaJaJaa);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vaihe-sisalto form-container-centered">
      <div className={`paa-kortti form-card-fullwidth ${taustaKuva ? 'taustalla' : ''}`} style={{ ...taustaTyyli }}>
        <h3 className="kapitalisoi">
          {hahmo.henkilotiedot.nimi || 'Anonyymi'}, {hahmo.henkilotiedot.ika || '??'}
          {(() => {
            const kerroin = Object.values(rodut).flat().find(r => r.nimi === hahmo.rotu?.nimi)?.ikakerroin;
            return kerroin != null && hahmo.henkilotiedot.ika
              ? ` (${Math.round(hahmo.henkilotiedot.ika * kerroin)})`
              : '';
          })()} vuotta, {haeSukupuoli(true)}
        </h3>
        
        {/* Lyhyt yhteenveto */}
        <div className="info-kortti">
          <p className="olen-teksti">
            Olen {hahmo.kuvaaja?.nimi || 'tuntematon'} ja {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.keho, 0, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.keho)}, {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.mieli, 1, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.mieli)} ja {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.sielu, 2, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.sielu)} sekä {hahmo.rotu?.nimi || ''}. Luonteeltani olen {hahmo.henkilotiedot?.luonne || ''}. {haeRajamurtoTeksti()}
          </p>
        </div>
        
        {/* ominaisuudet*/}
        <div className="teksti-osio popup-otsikko" style={{ position: 'relative' }}>
          <div
            className="teksti-osio popup-otsikko"
            style={{ position: 'absolute', top: '-0.5rem', right: '0.5rem', padding: '0.25rem 0.75rem', margin: 0 }}
          >
            DP:<span>○ ○ ○ ○ ○</span>
          </div>
          <h4>Ominaisuudet</h4>
        <div className="layout-flex-grid">
              <p
                className={`voima-item ${voikoNostaa(hahmo, 'keho') && kayttamattomatHahmopisteet > 0 ? 'voima-item-upgradeable' : ''}`}
                onClick={() => nostaOminaisuutta('keho', laskeOminaisuudenMaksimi(hahmo.arkkityyppi, 'keho'))}
              >
                <strong>Keho {luoYmpyraEsitys(hahmo.keho, arkkityyppiData?.keho?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, false, hahmo.ammatit?.keho))} {haeAmmatinNimi(hahmo.ammatit?.keho)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, hahmo.adjektiivit?.keho, hahmo.ammatit?.keho))} {haeAdjektiivinNimi(hahmo.adjektiivit?.keho).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.keho).toLowerCase()}.{(hahmo.skaala || 0) > 0 ? ` (${haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, hahmo.adjektiivit?.keho, hahmo.ammatit?.keho) + (hahmo.skaala || 0))})` : ''}</small>
              </p>
              <p
                className={`voima-item ${voikoNostaa(hahmo, 'mieli') && kayttamattomatHahmopisteet > 0 ? 'voima-item-upgradeable' : ''}`}
                onClick={() => nostaOminaisuutta('mieli', laskeOminaisuudenMaksimi(hahmo.arkkityyppi, 'mieli'))}
              >
                <strong>Mieli {luoYmpyraEsitys(hahmo.mieli, arkkityyppiData?.mieli?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, false, hahmo.ammatit?.mieli))} {haeAmmatinNimi(hahmo.ammatit?.mieli)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, hahmo.adjektiivit?.mieli, hahmo.ammatit?.mieli))} {haeAdjektiivinNimi(hahmo.adjektiivit?.mieli).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.mieli).toLowerCase()}.{(hahmo.skaala || 0) > 0 ? ` (${haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, hahmo.adjektiivit?.mieli, hahmo.ammatit?.mieli) + (hahmo.skaala || 0))})` : ''}</small>
              </p>
              <p
                className={`voima-item ${voikoNostaa(hahmo, 'sielu') && kayttamattomatHahmopisteet > 0 ? 'voima-item-upgradeable' : ''}`}
                onClick={() => nostaOminaisuutta('sielu', laskeOminaisuudenMaksimi(hahmo.arkkityyppi, 'sielu'))}
              >
                <strong>Sielu {luoYmpyraEsitys(hahmo.sielu, arkkityyppiData?.sielu?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, false, hahmo.ammatit?.sielu))} {haeAmmatinNimi(hahmo.ammatit?.sielu)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, hahmo.adjektiivit?.sielu, hahmo.ammatit?.sielu))} {haeAdjektiivinNimi(hahmo.adjektiivit?.sielu).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.sielu).toLowerCase()}.{(hahmo.skaala || 0) > 0 ? ` (${haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, hahmo.adjektiivit?.sielu, hahmo.ammatit?.sielu) + (hahmo.skaala || 0))})` : ''}</small>
              </p>
              <p className="voima-item">
                <strong>{hahmo.kuvaaja?.nimi || 'Ei kuvaajaa valittu'}</strong>
                <br />
                <small>{hahmo.kuvaaja?.selite || ''}</small>
                {hahmo.kuvaaja?.kyky && (
                  <>
                    <br />
                    <small><strong>Kyky:</strong> {hahmo.kuvaaja.kyky}</small>
                  </>
                )}
                {hahmo.kuvaaja?.heikkous && (
                  <>
                    <br />
                    <small><strong>Heikkous:</strong> {hahmo.kuvaaja.heikkous}</small>
                  </>
                )}
                {hahmo.henkilotiedot?.sidos && (
                  <>
                    <br />
                    <small><strong>Sidos:</strong> {hahmo.henkilotiedot.sidos}</small>
                  </>
                )}
              </p>
              {/* Luonteen tiedot */}
              {haeLuonteenTiedot(hahmo.henkilotiedot?.luonne) && (
                <p className="voima-item">
                  <strong>{haeLuonteenTiedot(hahmo.henkilotiedot.luonne).nimi}</strong>
                  <br />
                  <small>{haeLuonteenTiedot(hahmo.henkilotiedot.luonne).kuvaus}</small>
                  <br />
                  <small><strong>Stuntti:</strong> {haeLuonteenTiedot(hahmo.henkilotiedot.luonne).stuntti}</small>
                </p>
              )}
              {/* Voimat osio */}
              <div 
                className={`voima-item ${voikoNostaa(hahmo, 'voima') && kayttamattomatHahmopisteet > 0 ? 'voima-item-upgradeable' : ''}`}
                onClick={nostaVoimaa}
              >
                <strong>Voimat</strong>
                <div className="voimat-lista">
                  {/* Käytä voimaProgression taulukkoa näyttämään voima1, voima2, voima3 */}
                  {(() => {
                    const voimaTaso = hahmo.voimaTaso || 1;
                    const progressData = voimaProgression[voimaTaso.toString()];
                    
                    if (!progressData) {
                      return (
                        <div className="voima-rivi">
                          <span className="voima-nimi">Ei voimia</span>
                          <span className="voima-pallot">-</span>
                        </div>
                      );
                    }
                    
                    // Hae voimien nimet hahmon tiedoista tai käytä oletusnimiä
                    const voimienNimet = hahmo.voimienJarjestys || {
                      primary: hahmo.rotu?.voimat?.[0],
                      secondary: hahmo.rotu?.voimat?.[1], 
                      tertiary: hahmo.rotu?.voimat?.[2]
                    };
                    
                    const voimat = [
                      { nimi: voimienNimet.primary, taso: progressData.voima1 },
                      { nimi: voimienNimet.secondary, taso: progressData.voima2 },
                      { nimi: voimienNimet.tertiary, taso: progressData.voima3 }
                    ];
                    
                    return voimat
                      .filter(voima => voima.taso !== null && voima.taso !== undefined)
                      .map((voima, index) => (
                        <div key={index} className="voima-rivi">
                          <span className="voima-nimi isot-alkukirjaimet">{voima.nimi}</span>
                          <span className="voima-pallot">
                            {haeVoimanPallot(voima.taso)}
                          </span>
                        </div>
                      ));
                  })()}
                </div>
              </div>
        </div>
        </div>

        {/* Peruskyvyt ja rotu */}
        {hahmo.rotu && (() => {
          // Kerää kaikki kykyrivit yhteen listaan uudessa järjestyksessä
          const kykyRivit = [];

          // 1. Aisti-kyvyt ensin - aktiivisille voimille
          if (hahmo.voimienJarjestys) {
            const voimaTaso = hahmo.voimaTaso || 1;
            const progressData = voimaProgression[voimaTaso.toString()];
            if (progressData) {
              const aistiKentat = [
                { tasoArvo: progressData.voima1, voimatyyppi: hahmo.voimienJarjestys.primary },
                { tasoArvo: progressData.voima2, voimatyyppi: hahmo.voimienJarjestys.secondary },
                { tasoArvo: progressData.voima3, voimatyyppi: hahmo.voimienJarjestys.tertiary }
              ];
              aistiKentat.forEach(({ tasoArvo, voimatyyppi }, idx) => {
                if (tasoArvo != null && voimatyyppi && aistit[voimatyyppi]) {
                  const aisti = aistit[voimatyyppi];
                  kykyRivit.push(
                    <div key={`aisti-${idx}`}>
                      <small><strong>{aisti.nimi}:</strong> {aisti.kuvaus}</small>
                      {aisti.lisakuvaus && (
                        <div><small style={{ fontStyle: 'italic' }}>{aisti.lisakuvaus}</small></div>
                      )}
                    </div>
                  );
                }
              });
            }
          }

          // 2. Mystiset voimat toiseksi (primary, secondary, tertiary)
          ['primary', 'secondary', 'tertiary'].forEach(avain => {
            const kyvyt = hahmo.valitutKyvyt?.[avain];
            if (kyvyt && kyvyt.length > 0) {
              kykyRivit.push(
                <div key={`voima-${avain}`}>
                  <strong>{hahmo.voimienJarjestys?.[avain]}:</strong>
                  {kyvyt.map((kyky, index) => (
                    <div key={index}>
                      {kyky.nimi}{kyky.edistynyt && <em> (edistynyt)</em>}
                      <div><small>{kyky.kuvaus}</small></div>
                    </div>
                  ))}
                  {hahmo.vapaakuvaukset?.[avain] && (
                    <div><small><strong>Erikoistuminen:</strong> {hahmo.vapaakuvaukset[avain]}</small></div>
                  )}
                </div>
              );
            }
          });

          // 3. Rotukyvyt viimeiseksi
          if (hahmo.rotu) {
            kykyRivit.push(
              <div key="rotu">
                <strong>Rotukyvyt:</strong> {hahmo.rotu?.kuvaus || ''}
                {hahmo.rotu.stuntti && (
                  <div><small><strong>Stuntti:</strong> {hahmo.rotu.stuntti}</small></div>
                )}
                {hahmo.rotu.rajoitus && (
                  <div><small><strong>Rajoitus:</strong> {hahmo.rotu.rajoitus}</small></div>
                )}
              </div>
            );
          }

          // Jaa rivit kahteen tasapainoiseen palstaan sisällön mukaan
          const kykyPainot = kykyRivit.map((rivi) => {
            // Arvioi kunkin kyvyn "painoarvo" sisällön perusteella
            let paino = 1;
            
            // Aisti-kyvyt ovat pieniä (ensimmäisinä listassa)
            if (rivi.key && rivi.key.startsWith('aisti-')) {
              paino = 0.7;
            }
            // Mystiset voimat - arvioi kyvyjen määrän perusteella
            else if (rivi.key && rivi.key.startsWith('voima-')) {
              const avain = rivi.key.split('-')[1];
              const kyvytMaara = hahmo.valitutKyvyt?.[avain]?.length || 0;
              paino = Math.max(1, kyvytMaara * 0.8 + (hahmo.vapaakuvaukset?.[avain] ? 0.5 : 0));
            }
            // Rotukyvyt ovat isoja (viimeisinä listassa)
            else if (rivi.key === 'rotu') {
              paino = 3; // Rotukuvaus + mahdolliset stuntti/rajoitus
            }
            
            return { rivi, paino };
          });
          
          // Jaa tasapainoisesti painoarvon mukaan
          const kokonaisPaino = kykyPainot.reduce((sum, item) => sum + item.paino, 0);
          const tavoitePaino = kokonaisPaino / 2;
          
          let vasenPaino = 0;
          let vasenIndeksi = 0;
          
          // Etsi optimaalinen jako
          for (let i = 0; i < kykyPainot.length; i++) {
            const uusiPaino = vasenPaino + kykyPainot[i].paino;
            if (uusiPaino <= tavoitePaino || i === 0) {
              vasenPaino = uusiPaino;
              vasenIndeksi = i + 1;
            } else {
              break;
            }
          }
          
          // Varmista että vasen puoli ei ole tyhjä
          vasenIndeksi = Math.max(1, vasenIndeksi);
          
          const vasenPalsta = kykyRivit.slice(0, vasenIndeksi);
          const oikeaPalsta = kykyRivit.slice(vasenIndeksi);

          return (
            <div className="teksti-osio popup-otsikko">
              <h4>Kyvyt</h4>
              <div className="layout-flex-grid">
                <div className="voima-item voima-item-wide">
                  {vasenPalsta.map((rivi, i) => (
                    <div key={i} style={{ marginBottom: '0.75rem' }}>{rivi}</div>
                  ))}
                </div>
                {oikeaPalsta.length > 0 && (
                  <div className="voima-item voima-item-wide">
                    {oikeaPalsta.map((rivi, i) => (
                      <div key={i} style={{ marginBottom: '0.75rem' }}>{rivi}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <div className="teksti-osio">
          <div>
            <div>
              <strong>Kesto:</strong> {luoYmpyraEsitys(0, (hahmo.keho || 0) + 2 + (hahmo.skaala || 0))}
              {' '}&nbsp;&nbsp;
              <strong>Tahdonvoima:</strong> {luoYmpyraEsitys(0, (hahmo.mieli || 0) + 2 + (hahmo.skaala || 0))}
              {' '}&nbsp;&nbsp;
              <strong>Mana:</strong> {luoYmpyraEsitys(0, (hahmo.sielu || 0) + 2 + (hahmo.skaala || 0))}
              {' '}&nbsp;&nbsp;
              <strong>Hahmopisteet:</strong> <span style={{ verticalAlign: 'middle' }}>({kayttamattomatHahmopisteet}/{hahmopisteetYhteensa})</span> <span>&nbsp;</span><strong> XP:</strong> <span style={{ verticalAlign: 'middle' }}>{hahmo.xp || 0}</span>
              {' '}&nbsp;&nbsp;
              <strong>Skaala:</strong> {hahmonSkaala?.nimi } <span style={{ fontSize: '0.85em' }}>({hahmonSkaala?.kuvaus })</span>
            </div>
          </div>
          
          <div className="layout-flex-center">
            <div className="table-flex-container">
              <div className="fate-seuraukset-taulukko table-column-flex">
                <table className="bordered-table">
                  <colgroup>
                    <col className="fate-col-arvo" />
                    <col className="fate-col-taso" />
                    <col className="fate-col-kuvaus" />
                    <col className="fate-col-aika" />
                  </colgroup>
                  <thead>
                    <tr className="table-header-row">
                      <th colSpan={2} className="table-cell-left">Fyysinen</th>
                      <th className="table-cell-left">Seuraus</th>
                      <th className="table-cell-center">Aika</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-cell-center">1</td>
                      <td className="table-cell-left">Lievä</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Päivä</td>
                    </tr>
                    <tr>
                      <td className="table-cell-center">2</td>
                      <td className="table-cell-left">Vakava</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Viikko</td>
                    </tr>
                    <tr>
                      <td className="table-cell-center">3</td>
                      <td className="table-cell-left">Kuolettava</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Kuukausi</td>
                    </tr>
                    <tr>
                      <td className="table-cell-center">4</td>
                      <td className="table-cell-left">Pysyvä</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Pysyvä</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="fate-seuraukset-taulukko table-column-flex">
                <table className="bordered-table">
                  <colgroup>
                    <col className="table-column-narrow" />
                    <col className="table-column-auto" />
                    <col className="table-column-small" />
                  </colgroup>
                  <thead>
                    <tr className="table-header-row">
                      <th className="table-cell-left">Henkinen</th>
                      <th className="table-cell-left">Seuraus</th>
                      <th className="table-cell-center">Aika</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-cell-left">Lievä</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Päivä</td>
                    </tr>
                    <tr>
                      <td className="table-cell-left">Vakava</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Viikko</td>
                    </tr>
                    <tr>
                      <td className="table-cell-left">Kuolettava</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Kuukausi</td>
                    </tr>
                    <tr>
                      <td className="table-cell-left">Pysyvä</td>
                      <td className="table-cell-bordered"></td>
                      <td className="table-cell-center">Pysyvä</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <small className="small-info-text">
              Tappava vaurio paranee tason vain jos hoitaja onnistuu lääkäri testissä. Pinnallinen vaurio paranee tason automaattisesti.
            </small>
          </div>
        </div>

        <div className="teksti-osio popup-otsikko development-equipment-section">
          <h4>Lisätiedot</h4>
          {/* Kehittyminen ja varusteet rinnakkain */}
          <div className="layout-flex-center">
            <div className="kehittyminen-vasen" style={{ marginTop: '-10px' }}>
              <table className="taistelu-taulukko">
                <tbody>
                  <tr><td>ETU +1</td><td>KESTO</td><td>Mana</td></tr>
                  <tr><td>Varuste</td><td>Kierros, keskit.</td><td>0</td></tr>
                  <tr><td>Ympäristö</td><td>Kohtaus</td><td>1</td></tr>
                  <tr><td>Muu</td><td>Ehto</td><td>2</td></tr>
                  <tr style={{ backgroundColor: '#e9ecef' }}><td>Varuste etu 1 mana</td><td>Ympäristö etu</td><td>1</td></tr>
                </tbody>
              </table>
            </div>

            <div className="kehittyminen-boksi varusteet-laatikko">
              <div className="table-flex-container">
                <table className="varusteet-taulukko table-column-flex">
                  <thead>
                    <tr>
                      <th>Varusteet</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>&nbsp;</td></tr>
                    <tr><td>&nbsp;</td></tr>
                    <tr><td>&nbsp;</td></tr>
                  </tbody>
                </table>
                <table className="varusteet-taulukko table-column-flex">
                  <thead>
                    <tr>
                      <th>Varusteet</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>&nbsp;</td></tr>
                    <tr><td>&nbsp;</td></tr>
                    <tr><td>&nbsp;</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="layout-flex-center">
            <div className="kehittyminen-boksi varusteet-laatikko">
              <div className="table-flex-container">
                <table className="bordered-table table-column-flex">
                  <colgroup>
                    <col className="table-column-small" />
                    <col className="table-column-auto" />
                  </colgroup>
                  <thead>
                    <tr className="table-header-row">
                      <th className="table-cell-left">&nbsp;</th>
                      <th className="table-cell-left">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                  </tbody>
                </table>
                <table className="bordered-table table-column-flex">
                  <colgroup>
                    <col className="table-column-small" />
                    <col className="table-column-auto" />
                  </colgroup>
                  <thead>
                    <tr className="table-header-row">
                      <th className="table-cell-left">&nbsp;</th>
                      <th className="table-cell-left">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                    <tr><td className="table-cell-bordered">&nbsp;</td><td className="table-cell-bordered">&nbsp;</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HahmoLomake;