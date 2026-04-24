import { arkkityypit } from '../../data/arkkityypit.js';
import { skaala, taitotasoSanallisesti, luonteet } from '../../data/muutData.js';
import { voimat, aistit } from '../../data/voimat.js';
import { ammatit } from '../../data/ammatit.js';
import { adjektiivit } from '../../data/adjektiivit.js';
import { tallennaHahmo } from '../../utils/hahmoLogiikka.js';
import '../HahmoVaiheet.css';

const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

function HahmoYhteenveto({ hahmo, paivitaHahmo }) {
  const arkkityyppiData = arkkityypit[hahmo.arkkityyppi];
  const hahmonSkaala = skaala.find(s => s.taso === hahmo.skaala);
  
  // Hae peruskyvyt hahmon valitun voiman tyypin perusteella
  const mystisetAmmatit = ammatit.mystinen.map((ammatti) => ammatti.nimi);
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

  const haeAmmatinId = (ammattiId) => {
    return ammattiId || ''; // Käytä id:tä suoraan
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
      if (i < maksimi - 1) esitys += ' ';
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

  const tallennaJaJaa = () => {
    const hahmoId = tallennaHahmo(hahmo);
    console.log('Hahmo tallennettu:', hahmoId);
    // TODO: Näytä jakamisvaihtoehdot
  };

  const luoTekstimuoto = () => {
    const teksti = `
ILTASATU HAHMO

Nimi: ${hahmo.henkilotiedot.nimi || 'Nimetön'}
Rotu: ${hahmo.rotu?.nimi || ''}
Arkkityyppi: ${arkkityyppiData?.nimi || ''}

OMINAISUUDET:
Keho: ${arkkityyppiData?.keho.alkuarvo || 0} - ${haeAdjektiivinNimi(hahmo.adjektiivit.keho)} ${haeAmmatinId(hahmo.ammatit.keho)}
Mieli: ${arkkityyppiData?.mieli.alkuarvo || 0} - ${haeAdjektiivinNimi(hahmo.adjektiivit.mieli)} ${haeAmmatinId(hahmo.ammatit.mieli)}
Sielu: ${arkkityyppiData?.sielu.alkuarvo || 0} - ${haeAdjektiivinNimi(hahmo.adjektiivit.sielu)} ${haeAmmatinId(hahmo.ammatit.sielu)}

PERSOONALLISUUS:
Luonne: ${hahmo.henkilotiedot.luonne || ''}
Yksilöivä kuvaaja: ${hahmo.henkilotiedot.yksillioivaKuvaaja || ''}
Sidos: ${hahmo.henkilotiedot.sidos || ''}

${(peruskyvyt.length > 0 || valitutEdistyneet.length > 0) ? `SIELU-VOIMAT:
Voiman tyyppi: ${valittuVoimatyyppi || 'Ei valittu'}

Peruskyvyt:
${peruskyvyt.map((voima) => `• ${voima.nimi}${voima.elementti ? ` - ${voima.elementti}` : ''}: ${voima.kuvaus}`).join('\n')}

Edistyneet kyvyt:
${valitutEdistyneet.map((voima) => `• ${voima.nimi}${voima.elementti ? ` - ${voima.elementti}` : ''}: ${voima.kuvaus}`).join('\n')}
` : ''}
Skaala: ${hahmonSkaala?.nimi || 'Tavallinen'}
    `.trim();
    
    navigator.clipboard.writeText(teksti);
    alert('Hahmo kopioitu leikepöydälle!');
  };

  return (
    <div className="vaihe-sisalto">
      <div className="vaihe-otsikko">
        <h2>Valmis Hahmo</h2>
        <p>Hahmo on valmis pelattavaksi!</p>
      </div>

      <div className={`paa-kortti ${taustaKuva ? 'taustalla' : ''}`} style={taustaTyyli}>
        <h3 className="kapitalisoi">{hahmo.henkilotiedot.nimi || 'Nimetön'}</h3>
        
        {/* Lyhyt yhteenveto */}
        <div className="info-kortti">
          <p className="olen-teksti">
            Olen {hahmo.kuvaaja?.nimi || 'tuntematon'}, {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.keho, 0, hahmo.adjektiivit)} {haeAmmatinId(hahmo.ammatit?.keho)}, {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.mieli, 1, hahmo.adjektiivit)} {haeAmmatinId(hahmo.ammatit?.mieli)} ja {haeAdjektiivinNimiAliasSaannolla(hahmo.adjektiivit?.sielu, 2, hahmo.adjektiivit)} {haeAmmatinId(hahmo.ammatit?.sielu)}, rotuni on {hahmo.rotu?.nimi || ''}. Luonteeltani olen {hahmo.henkilotiedot?.luonne || ''} ja voimani on {valittuVoimatyyppi || 'ei voimaa'}.
          </p>
        </div>
        
        {/* ominaisuudet*/}
        <div className="teksti-osio">
          <h4>Ominaisuudet</h4>
          <div style={{display: 'flex', gap: '0', justifyContent: 'center', flexWrap: 'wrap'}}>
            <div style={{textAlign: 'left', flex: '1', maxWidth: '300px', minWidth: '250px'}}>
              <p className="voima-item">
                <strong>Keho {luoYmpyraEsitys(hahmo.keho, arkkityyppiData?.keho?.maksimi || 3)}</strong> {haeTaitotasonNimi(hahmo.keho || 0)}
                <br />
                <small>+ {haeAdjektiivinNimi(hahmo.adjektiivit?.keho)} = {haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, hahmo.adjektiivit?.keho, false))}</small>
                <br />
                <small>+ {haeAmmatinId(hahmo.ammatit?.keho)} = {haeTaitotasonNimi(laskeTaitotaso(hahmo.keho, hahmo.adjektiivit?.keho, hahmo.ammatit?.keho))}</small>
              </p>
              <p className="voima-item">
                <strong>Mieli {luoYmpyraEsitys(hahmo.mieli, arkkityyppiData?.mieli?.maksimi || 3)}</strong> {haeTaitotasonNimi(hahmo.mieli || 0)}
                <br />
                <small>+ {haeAdjektiivinNimi(hahmo.adjektiivit?.mieli)} = {haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, hahmo.adjektiivit?.mieli, false))}</small>
                <br />
                <small>+ {haeAmmatinId(hahmo.ammatit?.mieli)} = {haeTaitotasonNimi(laskeTaitotaso(hahmo.mieli, hahmo.adjektiivit?.mieli, hahmo.ammatit?.mieli))}</small>
              </p>
              <p className="voima-item">
                <strong>Sielu {luoYmpyraEsitys(hahmo.sielu, arkkityyppiData?.sielu?.maksimi || 3)}</strong> {haeTaitotasonNimi(hahmo.sielu || 0)}
                <br />
                <small>+ {haeAdjektiivinNimi(hahmo.adjektiivit?.sielu)} = {haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, hahmo.adjektiivit?.sielu, false))}</small>
                <br />
                <small>+ {haeAmmatinId(hahmo.ammatit?.sielu)} = {haeTaitotasonNimi(laskeTaitotaso(hahmo.sielu, hahmo.adjektiivit?.sielu, hahmo.ammatit?.sielu))}</small>
              </p>
            </div>
            <div style={{textAlign: 'left', flex: '1', maxWidth: '300px', minWidth: '250px'}}>
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
            <div style={{textAlign: 'center', marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0'}}>
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

        {/* Peruskyvyt ja aistit */}
        {(peruskyvyt.length > 0 || valittuVoimatyyppi) && (
          <div className="teksti-osio">
            <h4>Peruskyvyt - {valittuVoimatyyppi || 'Ei valittu'}</h4>
            
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
                {hahmo.voimat.valittuVoima.lisakuvaus && (
                  <>
                    <bold>kuvaus:</bold> {hahmo.voimat.valittuVoima.kuvaus}
                  </>
                )}
              </p>
            )}
          </div>
        )}
        
        <div className="teksti-osio">
          <h4>
            {hahmo.rotu?.nimi || 'Rotu'}  {arkkityyppiData?.nimi }  

          </h4>
          
          {/* Rotu tiedot */}
          {hahmo.rotu && (
            <div className="voima-item">
              {hahmo.rotu?.kuvaus || ''}
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
              {hahmo.rotu.erikoisominaisuus && (
                <>
                  <br />
                  <small><strong>Erikoisominaisuus:</strong> {hahmo.rotu.erikoisominaisuus}</small>
                </>
              )}
            </div>
          )}
          
          {/* Arkkityyppi tiedot */}
          <div className="voima-item" style={{marginTop: '1rem'}}>
            <strong></strong>
            <br />
            <small>{arkkityyppiData?.kuvaus || ''}</small>
          </div>
        </div>

        <div className="teksti-osio">
          <h4>Kehittyminen</h4>
          
          {/* Horisontaalinen layout ominaisuuksille ja voimille */}
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            {/* Ominaisuuksien kehittyminen */}
            <div style={{
              border: '2px solid black', 
              borderRadius: '15px', 
              padding: '0.75rem 1rem', 
              display: 'flex', 
              gap: '1.5rem', 
              alignItems: 'center',
              color: 'black'
            }}>
              <div style={{textAlign: 'center'}}>
                <strong>Keho</strong> <span style={{fontSize: '1.2em', marginLeft: '0.5rem'}}>{luoYmpyraEsitys(hahmo.keho || 0, arkkityyppiData?.keho?.maksimi || 3)}</span>
              </div>
              <div style={{textAlign: 'center'}}>
                <strong>Mieli</strong> <span style={{fontSize: '1.2em', marginLeft: '0.5rem'}}>{luoYmpyraEsitys(hahmo.mieli || 0, arkkityyppiData?.mieli?.maksimi || 3)}</span>
              </div>
              <div style={{textAlign: 'center'}}>
                <strong>Sielu</strong> <span style={{fontSize: '1.2em', marginLeft: '0.5rem'}}>{luoYmpyraEsitys(hahmo.sielu || 0, arkkityyppiData?.sielu?.maksimi || 3)}</span>
              </div>
            </div>
            
            {/* Voimien kehittyminen */}
            <div style={{
              border: '2px solid black', 
              borderRadius: '15px', 
              padding: '0.75rem 1rem', 
              display: 'flex', 
              alignItems: 'center',
              color: 'black'
            }}>
              {(() => {
                const voimarajat = haeVoimarajat(hahmo.skaala);
                const voimatyyppi = valittuVoimatyyppi;
                // Hae aktiivisen voiman taso
                const voimataso1 = valittuVoimatyyppi && hahmo.voimat ? (hahmo.voimat[valittuVoimatyyppi] || 0) : 0;
                
                return (
                  <div style={{textAlign: 'center'}}>
                    <strong>Voimat: {voimatyyppi || 'Ei voimaa'}</strong> 
                    <span style={{fontSize: '1.2em', marginLeft: '0.5rem'}}>
                      {voimataso1 > 0 ? luoYmpyraEsitys(voimataso1, voimarajat[0]?.max || 3) : '○ ○ ○'}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          
          <div style={{textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', color: '#666'}}>
            * Seuraavan skaalan saavuttamiseksi täytä kyky pisteet maksimiin
          </div>
        </div>

        <div className="skaala">
          <h4>Skaala</h4>
          <p>{hahmonSkaala?.nimi} - {hahmonSkaala?.kuvaus}</p>
        </div>
      </div>

      <div className="jakamis-toiminnot">
        <button onClick={luoTekstimuoto} className="btn btn-secondary">
          📋 Kopioi tekstimuotoon
        </button>
        <button onClick={tallennaJaJaa} className="btn btn-primary">
          💾 Tallenna hahmo
        </button>
      </div>
    </div>
  );
}

export default HahmoYhteenveto;