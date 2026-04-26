import { arkkityypit } from '../../data/arkkityypit.js';
import { skaala, taitotasoSanallisesti, luonteet } from '../../data/muutData.js';
import { voimat, aistit } from '../../data/voimat.js';
import { ammatit } from '../../data/ammatit.js';
import { adjektiivit } from '../../data/adjektiivit.js';
import { tallennaHahmo } from '../../utils/hahmoLogiikka.js';
import React from 'react';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HahmoLomake({ hahmo, paivitaHahmo, onHahmoLista, aloitaUudelleen, setKopioiFunktio, setTulostaFunktio, setTallennaFunktio }) {
  const arkkityyppiData = arkkityypit[hahmo.arkkityyppi];
  const hahmonSkaala = skaala.find(s => s.taso === hahmo.skaala);
  
  // Hae peruskyvyt hahmon valitun voiman tyypin perusteella
  const genre = hahmo.genre || 'fantasia';
  const genreAmmatit = ammatit[genre] || {};
  const mystisetAmmatit = (genreAmmatit.mystinen || []).map((ammatti) => ammatti.nimi);
  const onMystinen = hahmo.ammatit?.sielu && mystisetAmmatit.includes(hahmo.ammatit.sielu);
  
  // Etsi mikä voima on tasolla 1 (aktiivinen voima)
  let valittuVoimatyyppi = null;
  if (hahmo.voimat && typeof hahmo.voimat === 'object') {
    const voimaEntries = Object.entries(hahmo.voimat);
    const aktiivinenVoima = voimaEntries.find(([avain, taso]) => avain !== 'valitut' && taso > 0);
    if (aktiivinenVoima) {
      valittuVoimatyyppi = aktiivinenVoima[0];
    }
  }
  
  const peruskyvyt = onMystinen && valittuVoimatyyppi ? (voimat[valittuVoimatyyppi]?.peruskyvyt || []) : [];
  
  // Hae valitut edistyneet kyvyt
  const valitutEdistyneet = Array.isArray(hahmo.voimat?.valitut) ? hahmo.voimat.valitut : [];

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
    aloitaUudelleen && aloitaUudelleen();
  };

  // Välitä funktiot Wizard komponenttiin
  React.useEffect(() => {
    if (setKopioiFunktio) setKopioiFunktio(() => luoTekstimuoto);
    if (setTulostaFunktio) setTulostaFunktio(() => tulostahahmo);
    if (setTallennaFunktio) setTallennaFunktio(() => tallennaJaJaa);
  }, []);

  return (
    <div className="vaihe-sisalto" style={{ maxWidth: '80%', margin: '0 auto' }}>
      <div className={`paa-kortti ${taustaKuva ? 'taustalla' : ''}`} style={{ ...taustaTyyli, width: '100%', maxWidth: 'none' }}>
        <h3 className="kapitalisoi">
          {hahmo.henkilotiedot.nimi || 'Anonyymi'}, {hahmo.henkilotiedot.ika || '??'} vuotta, {hahmo.henkilotiedot.sukupuoli === 'M' ? 'Mies' : hahmo.henkilotiedot.sukupuoli === 'N' ? 'Nainen' : 'Sukupuoli ei määritelty'}
        </h3>
        
        {/* Lyhyt yhteenveto */}
        <div className="info-kortti">
          <p className="olen-teksti">
            Olen {hahmo.kuvaaja?.nimi || 'tuntematon'}, {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.keho, 0, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.keho)}, {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.mieli, 1, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.mieli)} ja {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.sielu, 2, hahmo.adjektiivit)} {haeAmmatinNimi(hahmo.ammatit?.sielu)}, rotuni on {hahmo.rotu?.nimi || ''}. Luonteeltani olen {hahmo.henkilotiedot?.luonne || ''} ja voimani on {valittuVoimatyyppi || 'ei voimaa'}.
          </p>
        </div>
        
        {/* ominaisuudet*/}
        <div className="teksti-osio">
          <h4>Ominaisuudet</h4>
        <div className="layout-two-col">
          <div className="layout-col">
              <p className="voima-item">
                <strong>Keho {luoYmpyraEsitys(hahmo.keho, arkkityyppiData?.keho?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, false, hahmo.ammatit?.keho))} {haeAmmatinNimi(hahmo.ammatit?.keho)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, hahmo.adjektiivit?.keho, hahmo.ammatit?.keho))} {haeAdjektiivinNimi(hahmo.adjektiivit?.keho).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.keho).toLowerCase()}.</small>
              </p>
              <p className="voima-item">
                <strong>Mieli {luoYmpyraEsitys(hahmo.mieli, arkkityyppiData?.mieli?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, false, hahmo.ammatit?.mieli))} {haeAmmatinNimi(hahmo.ammatit?.mieli)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, hahmo.adjektiivit?.mieli, hahmo.ammatit?.mieli))} {haeAdjektiivinNimi(hahmo.adjektiivit?.mieli).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.mieli).toLowerCase()}.</small>
              </p>
              <p className="voima-item">
                <strong>Sielu {luoYmpyraEsitys(hahmo.sielu, arkkityyppiData?.sielu?.maksimi || 3)}</strong>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, false, hahmo.ammatit?.sielu))} {haeAmmatinNimi(hahmo.ammatit?.sielu)}</small>
                <br />
                <small>&nbsp;{haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, hahmo.adjektiivit?.sielu, hahmo.ammatit?.sielu))} {haeAdjektiivinNimi(hahmo.adjektiivit?.sielu).toLowerCase()} {haeAmmatinNimi(hahmo.ammatit?.sielu).toLowerCase()}.</small>
              </p>
            </div>
            <div className="layout-col">
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
                {hahmo.henkilotiedot?.sidos && (
                  <>
                    <br />
                    <small><strong>Sidos:</strong> {hahmo.henkilotiedot.sidos}</small>
                  </>
                )}
                  </>
                )}
              </p>
            </div>
          </div>
          
          {/* Luonteen tiedot */}
          {haeLuonteenTiedot(hahmo.henkilotiedot?.luonne) && (
            <div className="layout-center">
              <p className="voima-item">
                <strong>{haeLuonteenTiedot(hahmo.henkilotiedot.luonne).nimi}</strong>
                <br />
                <small>{haeLuonteenTiedot(hahmo.henkilotiedot.luonne).kuvaus}</small>
                <br />
                <small><strong>Stuntti:</strong> {haeLuonteenTiedot(hahmo.henkilotiedot.luonne).stuntti}</small>
              </p>
            </div>
          )}
        </div>

        {/* Peruskyvyt ja rotu */}
        {(peruskyvyt.length > 0 || valittuVoimatyyppi || hahmo.rotu) && (
          <div className="teksti-osio text-left">
            <h4 className="text-center">
              {hahmo.rotu?.nimi || 'Kyvyt'} {valittuVoimatyyppi ? `• ${valittuVoimatyyppi}` : ''} {arkkityyppiData?.nimi ? `• ${arkkityyppiData.nimi}` : ''}
            </h4>
            
            {/* Aisti-kyky */}
            {valittuVoimatyyppi && aistit[valittuVoimatyyppi] && (
              <p className="voima-item">
                <strong>{aistit[valittuVoimatyyppi].nimi}:</strong> {aistit[valittuVoimatyyppi].kuvaus}
                {aistit[valittuVoimatyyppi].lisakuvaus && (
                  <>
                    <br />
                    <strong>Kuvaus:</strong> {aistit[valittuVoimatyyppi].lisakuvaus}
                  </>
                )}
              </p>
            )}
            
            {/* Valittu peruskyky */}
            {hahmo.voimat?.valittuVoima && (
              <p className="voima-item">
                <strong>{hahmo.voimat.valittuVoima.nimi}:</strong> {hahmo.voimat.valittuVoima.kuvaus}
                {hahmo.voimat.vapaakuvaus && (
                  <>
                    <br />
                    <strong>{valittuVoimatyyppi === 'elementin hallinta' ? 'Elementti' : valittuVoimatyyppi === 'muodonmuutos' ? 'Eläimen aisti' : 'Kuvaus'}:</strong> {hahmo.voimat.vapaakuvaus}
                  </>
                )}
              </p>
            )}
            
            {/* Rotu tiedot */}
            {hahmo.rotu && (
              <div className="voima-item">
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
            
            {/* Arkkityyppi tiedot */}
            {arkkityyppiData && (
              <div className="voima-item">
                <strong>Arkkityyppi:</strong> {arkkityyppiData?.kuvaus || ''}
              </div>
            )}
          </div>
        )}

        <div className="teksti-osio">
          <div className="layout-flex-center">
            <div className="kehittyminen-boksi kestotasot">
              <strong>Kesto:</strong> {luoYmpyraEsitys(0, (hahmo.keho || 0) + 2 + (hahmo.skaala || 1))}
              {' '}&nbsp;&nbsp;
              <strong>Tahdonvoima:</strong> {luoYmpyraEsitys(0, (hahmo.mieli || 0) + 2 + (hahmo.skaala || 1))}
              {' '}&nbsp;&nbsp;
              <strong>Mana:</strong> {luoYmpyraEsitys(0, (hahmo.sielu || 0) + 2 + (hahmo.skaala || 1))}
              {' '}&nbsp;&nbsp;
              <strong>Fate-pisteet:</strong> ○ ○ ○ ○ ○
            </div>
          </div>
          
          <div className="layout-flex-center">
            <div style={{ display: 'flex', gap: '16px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="fate-seuraukset-taulukko" style={{ flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                  <colgroup>
                    <col className="fate-col-arvo" />
                    <col className="fate-col-taso" />
                    <col className="fate-col-kuvaus" />
                    <col className="fate-col-aika" />
                  </colgroup>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th colSpan={2} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Fyysinen</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Seuraus</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Aika</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>1</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Lievä</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Päivä</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>2</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Vakava</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Viikko</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>3</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Kuolettava</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Kuukausi</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>4</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Pysyvä</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Pysyvä</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="fate-seuraukset-taulukko" style={{ flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                  <colgroup>
                    <col style={{ width: '25%' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '20%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Henkinen</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Seuraus</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Aika</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Lievä</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Päivä</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Vakava</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Viikko</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Kuolettava</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Kuukausi</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Pysyvä</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Pysyvä</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <small style={{ display: 'block', marginTop: '10px', color: '#666', fontStyle: 'italic' }}>
              Tappava vaurio paranee tason vain jos hoitaja onnistuu lääkäri testissä. Pinnallinen vaurio paranee tason automaattisesti.
            </small>
          </div>
        </div>

        <div className="teksti-osio">
          {/* Kehittyminen ja varusteet rinnakkain */}
          <div className="layout-flex-center">
            <div className="kehittyminen-vasen">
              <div className="kehittyminen-boksi kehittyminen-yhteinen">
                <strong>Keho</strong> {luoYmpyraEsitys(hahmo.keho || 0, arkkityyppiData?.keho?.maksimi || 3)}
                {' '}&nbsp;&nbsp;
                <strong>Mieli</strong> {luoYmpyraEsitys(hahmo.mieli || 0, arkkityyppiData?.mieli?.maksimi || 3)}
                {' '}&nbsp;&nbsp;
                <strong>Sielu</strong> {luoYmpyraEsitys(hahmo.sielu || 0, arkkityyppiData?.sielu?.maksimi || 3)}
                {(() => {
                  const voimarajat = haeVoimarajat(hahmo.skaala);
                  const voimatyyppi = valittuVoimatyyppi;
                  const voimataso1 = valittuVoimatyyppi && hahmo.voimat ? (hahmo.voimat[valittuVoimatyyppi] || 0) : 0;
                  
                  return (
                    <>
                      {' '}&nbsp;&nbsp;
                      <strong>{voimatyyppi || 'Ei voimaa'} </strong>{' '}
                      {voimataso1 > 0 ? luoYmpyraEsitys(voimataso1, voimarajat[0]?.max || 3) : '○ ○ ○'}
                    </>
                  );
                })()}
              </div>

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
        </div>

        <div className="skaala">
          <h4>Skaala</h4>
          <p>{hahmonSkaala?.nimi} - {hahmonSkaala?.kuvaus}</p>
        </div>
      </div>
    </div>
  );
}

export default HahmoLomake;