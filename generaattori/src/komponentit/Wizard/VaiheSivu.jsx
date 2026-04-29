import '../HahmoVaiheet.css';

// Kaikki kuvatiedostot
const taustaKuvat = import.meta.glob('../../kuvat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

/**
 * Hae taustakuva tiedostonimellä (ilman tiedostopäätettä).
 * Kokeilee automaattisesti .jpg, .jpeg, .png, .webp
 */
export function haeTaustaKuva(tiedostoNimiIlmanPaatetta) {
  const paatteet = ['jpg', 'jpeg', 'png', 'webp'];
  for (const pääte of paatteet) {
    const osuma = Object.entries(taustaKuvat).find(([polku]) =>
      polku.endsWith(`/${tiedostoNimiIlmanPaatetta}.${pääte}`)
    );
    if (osuma) return osuma[1];
  }
  return null;
}

/**
 * Vakio wrapper kaikille wizard-vaihe-sivuille.
 * Hoitaa taustakuvan .sovellus-elementtiin ja sivun perusrakenteen.
 *
 * Props:
 *   taustaKuva   - kuvan URL (haeTaustaKuva:n paluuarvo tai static import)
 *   otsikko      - h2-otsikko
 *   alaotsikko   - p-teksti otsikon alla
 *   children     - kortit / sisältö
 */
function VaiheSivu({ taustaKuva, otsikko, alaotsikko, children }) {
  const taustaGradient = taustaKuva
    ? `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${taustaKuva})`
    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

  return (
    <div className={`vaihe-sisalto ${taustaKuva ? 'taustakuvalla' : ''}`}>
      {(otsikko || alaotsikko) && (
        <div className="vaihe-otsikko">
          {otsikko && <h2>{otsikko}</h2>}
          {alaotsikko && <p>{alaotsikko}</p>}
        </div>
      )}

      {children}

      <style>{`
        .sovellus {
          background-image: ${taustaGradient};
          background-size: cover;
          background-position: center;
        }
      `}</style>
    </div>
  );
}

export default VaiheSivu;
