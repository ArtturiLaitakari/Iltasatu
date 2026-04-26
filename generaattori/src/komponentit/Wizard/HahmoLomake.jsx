import { arkkityypit } from '../../data/arkkityypit.js';
import { skaala, taitotasoSanallisesti, luonteet } from '../../data/muutData.js';
import { aistit, voimat } from '../../data/voimat.js';
import { ammatit } from '../../data/ammatit.js';
import { adjektiivit } from '../../data/adjektiivit.js';
import { tallennaHahmo } from '../../utils/hahmoLogiikka.js';
import React from 'react';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HahmoLomake({ hahmo, paivitaHahmo, onHahmoLista, aloitaUudelleen, setKopioiFunktio, setTulostaFunktio, setTallennaFunktio, siirryVoimanKykyyn }) {
  const arkkityyppiData = arkkityypit[hahmo.arkkityyppi];
  const hahmonSkaala = skaala.find(s => s.taso === hahmo.skaala);
  
  // Etsi mikä voima on tasolla 1 (aktiivinen voima)
  let valittuVoimatyyppi = null;
  if (hahmo.voimat && typeof hahmo.voimat === 'object') {
    const voimaEntries = Object.entries(hahmo.voimat);
    const aktiivinenVoima = voimaEntries.find(([avain, taso]) => avain !== 'valitut' && taso > 0);
    if (aktiivinenVoima) {
      valittuVoimatyyppi = aktiivinenVoima[0];
    }
  }

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
    const genre = hahmo.genre || 'fantasia';
    const genreAmmatit = ammatit[genre] || {};
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

  const luoYmpyraEsitys = (taso, maksimi = 3) => {
    let esitys = '';
    for (let i = 0; i < maksimi; i++) {
      esitys += i < taso ? '●' : '○';
    }
    return esitys;
  };

  const haeTaitotasonNimi = (taso) => {
    const taitotasoData = taitotasoSanallisesti.find(t => t.taso === taso);
    return taitotasoData?.nimi || 'Tuntematon';
  };

  const haeVoimarajat = (skaalaData) => {
    const skaala = skaalaData || 1;
    if (skaala === 1) {
      return [{ max: 3 }]; // Tavallinen: 1 voima max 3
    } else if (skaala === 2) {
      return [{ max: 5 }]; // Yliluonnollinen: 1 voima max 5
    } else if (skaala === 3) {
      return [{ max: 5 }, { max: 3 }]; // Legendaarinen: 2 voimaa
    } else if (skaala >= 4) {
      return [{ max: 5 }, { max: 4 }, { max: 3 }]; // Eeppinen ja Tarumainen: 3 voimaa
    }
    return [{ max: 3 }]; // Oletusarvo
  };

  const luoTekstimuoto = () => {
    // Luo teksti-muotoinen yhteenveto hahmosta
    const teksti = `${hahmo.henkilotiedot.nimi || 'Anonyymi'} - ${hahmo.kuvaaja?.nimi || 'Tuntematon'}
Keho: ${hahmo.keho}, Mieli: ${hahmo.mieli}, Sielu: ${hahmo.sielu}
Rotu: ${hahmo.rotu?.nimi || 'Ei rotua'}, Luonne: ${hahmo.henkilotiedot?.luonne || 'Ei luonnetta'}`;
    navigator.clipboard.writeText(teksti);
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

  const hahmopisteetYhteensa = Math.max(0, hahmo.hp || 0);
  const kayttamattomatHahmopisteet = Math.max(0, hahmo.kayttamattomatHahmopisteet || 0);

  const voikoNostaaOminaisuutta = (avain, maksimi) => {
    if (!paivitaHahmo) return false;
    if (kayttamattomatHahmopisteet <= 0) return false;
    return (hahmo[avain] || 0) < maksimi;
  };

  const nostaOminaisuutta = (avain, maksimi) => {
    if (!voikoNostaaOminaisuutta(avain, maksimi)) return;
    paivitaHahmo({
      ...hahmo,
      [avain]: (hahmo[avain] || 0) + 1,
      kayttamattomatHahmopisteet: kayttamattomatHahmopisteet - 1
    });
  };

  const voimanMaksimi = haeVoimarajat(hahmo.skaala)[0]?.max || 3;
  const nykyinenVoimataso = valittuVoimatyyppi && hahmo.voimat ? (hahmo.voimat[valittuVoimatyyppi] || 0) : 0;
  const ominaisuudetMaksimissa =
    (hahmo.keho || 0) >= (arkkityyppiData?.keho?.maksimi) &&
    (hahmo.mieli || 0) >= (arkkityyppiData?.mieli?.maksimi ) &&
    (hahmo.sielu || 0) >= (arkkityyppiData?.sielu?.maksimi );
  const voimaMaksimissa = valittuVoimatyyppi ? nykyinenVoimataso >= voimanMaksimi : false;
  const kaikkiOstettavatMaksimissa = ominaisuudetMaksimissa && voimaMaksimissa;
  const valitutVoimakyvyt = (() => {
    if (!valittuVoimatyyppi) return [];
    const kaikkiKyvyt = voimat[valittuVoimatyyppi]?.peruskyvyt || [];
    const valitutNimet = Array.isArray(hahmo.voimat?.valitut) ? [...hahmo.voimat.valitut] : [];
    if (hahmo.voimat?.valittuVoima?.nimi && !valitutNimet.includes(hahmo.voimat.valittuVoima.nimi)) {
      valitutNimet.push(hahmo.voimat.valittuVoima.nimi);
    }
    return valitutNimet
      .map((nimi) => kaikkiKyvyt.find((kyky) => kyky.nimi === nimi))
      .filter(Boolean);
  })();

  const voikoNostaaVoimaa = () => {
    if (!paivitaHahmo) return false;
    if (!siirryVoimanKykyyn) return false;
    if (!valittuVoimatyyppi) return false;
    if (kayttamattomatHahmopisteet <= 0) return false;
    return nykyinenVoimataso < voimanMaksimi;
  };

  const nostaVoimaa = () => {
    if (!voikoNostaaVoimaa()) return;
    paivitaHahmo({
      ...hahmo,
      voimat: {
        ...hahmo.voimat,
        [valittuVoimatyyppi]: nykyinenVoimataso + 1,
        valittuVoima: null
      },
      kayttamattomatHahmopisteet: kayttamattomatHahmopisteet - 1
    });
    if (siirryVoimanKykyyn) {
      siirryVoimanKykyyn();
    }
  };

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
          {hahmo.henkilotiedot.nimi || 'Anonyymi'}, {hahmo.henkilotiedot.ika || '??'} vuotta, {hahmo.henkilotiedot.sukupuoli === 'M' ? 'Mies' : hahmo.henkilotiedot.sukupuoli === 'N' ? 'Nainen' : 'Sukupuoli ei määritelty'}
        </h3>
        
        {/* Lyhyt yhteenveto */}
        <div className="info-kortti">
          <p className="olen-teksti">
            Olen {hahmo.kuvaaja?.nimi || 'tuntematon'}, {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.keho, 0, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.keho)}, {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.mieli, 1, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.mieli)} ja {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.sielu, 2, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.sielu)}, rotuni on {hahmo.rotu?.nimi || ''}. Luonteeltani olen {hahmo.henkilotiedot?.luonne || ''} ja voimani on{' '}
            <span
              className={voikoNostaaVoimaa() ? 'voima-item-inline-upgradeable' : ''}
              onClick={nostaVoimaa}
            >
              {valittuVoimatyyppi || 'ei voimaa'}{valittuVoimatyyppi ? ` ${luoYmpyraEsitys(nykyinenVoimataso, voimanMaksimi)}` : ''}
            </span>
            . {hahmo.onkoRajamurto ? 'Ääriraja murtuma.' : ''}
          </p>
        </div>
        
        {/* ominaisuudet*/}
        <div className="teksti-osio">
          <h4>Ominaisuudet</h4>
        <div className="layout-flex-grid">
              <p
                className={`voima-item ${voikoNostaaOminaisuutta('keho', arkkityyppiData?.keho?.maksimi || 3) ? 'voima-item-upgradeable' : ''}`}
                onClick={() => nostaOminaisuutta('keho', arkkityyppiData?.keho?.maksimi || 3)}
              >
                <strong>Keho {luoYmpyraEsitys(hahmo.keho, arkkityyppiData?.keho?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, false, hahmo.ammatit?.keho))} {haeAmmatinNimi(hahmo.ammatit?.keho)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, hahmo.adjektiivit?.keho, hahmo.ammatit?.keho))} {haeAdjektiivinNimi(hahmo.adjektiivit?.keho).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.keho).toLowerCase()}.</small>
              </p>
              <p
                className={`voima-item ${voikoNostaaOminaisuutta('mieli', arkkityyppiData?.mieli?.maksimi || 3) ? 'voima-item-upgradeable' : ''}`}
                onClick={() => nostaOminaisuutta('mieli', arkkityyppiData?.mieli?.maksimi || 3)}
              >
                <strong>Mieli {luoYmpyraEsitys(hahmo.mieli, arkkityyppiData?.mieli?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, false, hahmo.ammatit?.mieli))} {haeAmmatinNimi(hahmo.ammatit?.mieli)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, hahmo.adjektiivit?.mieli, hahmo.ammatit?.mieli))} {haeAdjektiivinNimi(hahmo.adjektiivit?.mieli).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.mieli).toLowerCase()}.</small>
              </p>
              <p
                className={`voima-item ${voikoNostaaOminaisuutta('sielu', arkkityyppiData?.sielu?.maksimi || 3) ? 'voima-item-upgradeable' : ''}`}
                onClick={() => nostaOminaisuutta('sielu', arkkityyppiData?.sielu?.maksimi || 3)}
              >
                <strong>Sielu {luoYmpyraEsitys(hahmo.sielu, arkkityyppiData?.sielu?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, false, hahmo.ammatit?.sielu))} {haeAmmatinNimi(hahmo.ammatit?.sielu)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, hahmo.adjektiivit?.sielu, hahmo.ammatit?.sielu))} {haeAdjektiivinNimi(hahmo.adjektiivit?.sielu).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.sielu).toLowerCase()}.</small>
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
        </div>
        </div>

        {/* Peruskyvyt ja rotu */}
        {(valittuVoimatyyppi || hahmo.rotu) && (
          <div className="teksti-osio">
            <h4>Kyvyt</h4>
            <div className="layout-flex-grid">
              {/* Aistikyky */}
              {valittuVoimatyyppi && aistit[valittuVoimatyyppi] && (
                <p className="voima-item voima-item-wide">
                  <strong>{aistit[valittuVoimatyyppi].nimi}:</strong> {aistit[valittuVoimatyyppi].kuvaus}
                  {aistit[valittuVoimatyyppi].lisakuvaus && (
                    <>
                      <br />
                      <strong>Kuvaus:</strong> {aistit[valittuVoimatyyppi].lisakuvaus}
                    </>
                  )}
                </p>
              )}

              {/* Valitut voimakyvyt */}
              {valitutVoimakyvyt.map((kyky) => (
                <p key={kyky.nimi} className="voima-item voima-item-wide">
                  <strong>{kyky.nimi}:</strong> {kyky.kuvaus}
                  {hahmo.voimat?.valittuVoima?.nimi === kyky.nimi && hahmo.voimat.vapaakuvaus && (
                    <>
                      <br />
                      <strong>{valittuVoimatyyppi === 'elementin hallinta' ? 'Elementti' : valittuVoimatyyppi === 'muodonmuutos' ? 'Eläimen aisti' : 'Kuvaus'}:</strong> {hahmo.voimat.vapaakuvaus}
                    </>
                  )}
                </p>
              ))}

              {/* Rotu tiedot */}
              {hahmo.rotu && (
                <div className="voima-item voima-item-wide">
                  <strong>Rotukyvyt:</strong> {hahmo.rotu?.kuvaus || ''}
                  {hahmo.rotu.stuntti && (
                    <>
                      <br />
                      <small><strong>Stuntti:</strong> {hahmo.rotu.stuntti}</small>
                    </>
                  )}
                  {hahmo.rotu.rajoitus && (
                    <>
                      <br />
                      <small><strong>Rajoitus:</strong> {hahmo.rotu.rajoitus}</small>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="teksti-osio">
          <div className="layout-flex-center">
            <div className="kehittyminen-boksi kestotasot">
              <strong>Kesto:</strong> {luoYmpyraEsitys(0, (hahmo.keho || 0) + 2 + (hahmo.skaala || 1))}
              {' '}&nbsp;&nbsp;
              <strong>Tahdonvoima:</strong> {luoYmpyraEsitys(0, (hahmo.mieli || 0) + 2 + (hahmo.skaala || 1))}
              {' '}&nbsp;&nbsp;
              <strong>Mana:</strong> {luoYmpyraEsitys(0, (hahmo.sielu || 0) + 2 + (hahmo.skaala || 0))}
              {' '}&nbsp;&nbsp;
              <strong>Fate-pisteet:</strong> ○ ○ ○ ○ ○
              {' '}&nbsp;&nbsp;
              <strong>Hahmopisteet:</strong> {hahmopisteetYhteensa} <span>&nbsp;</span><strong>Käyttämätön:</strong> {kayttamattomatHahmopisteet} <span>&nbsp;</span><strong> XP:</strong> {hahmo.xp || 0}
              {' '}&nbsp;&nbsp;
              <strong>Skaala:</strong> {hahmonSkaala?.nimi } +{hahmonSkaala?.taso }
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

        <div className="teksti-osio development-equipment-section">
          {/* Kehittyminen ja varusteet rinnakkain */}
          <div className="layout-flex-center">
            <div className="kehittyminen-vasen">
              <table className="taistelu-taulukko">
                <tbody>
                  <tr><td>ETU +1</td><td>KESTO</td><td>Mana</td></tr>
                  <tr><td>Varuste</td><td>Kierros, keskit.</td><td>0</td></tr>
                  <tr><td>Ympäristö</td><td>Kohtaus</td><td>1</td></tr>
                  <tr><td>Muu</td><td>Ehto</td><td>2</td></tr>
                  <tr><td>Varuste etu 1 mana</td><td>Ympäristö etu</td><td>1</td></tr>
                </tbody>
              </table>
            </div>

            <div className="kehittyminen-boksi varusteet-laatikko">
              <table className="varusteet-taulukko">
                <thead>
                  <tr>
                    <th>Varusteet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>&nbsp;</td></tr>
                  <tr><td>&nbsp;</td></tr>
                  <tr><td>&nbsp;</td></tr>
                  <tr><td>&nbsp;</td></tr>
                  <tr><td>&nbsp;</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="layout-flex-center">
            <div className="kehittyminen-boksi varusteet-laatikko">
              <h4>Opitut asiat</h4>
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