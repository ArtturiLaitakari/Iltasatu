import Kortti from '../Kortti.jsx';
import '../HahmoVaiheet.css';
import fantasiaKuva from '../../kuvat/fantasia.jpg';
import multiverseKuva from '../../kuvat/multiverse.jpg';

function GenreValinta({ hahmo, paivitaHahmo, seuraavaVaihe }) {
  const valitseGenre = (genreId) => {
    paivitaHahmo({ ...hahmo, genre: genreId });
    seuraavaVaihe();
  };

  return (
    <div className="vaihe-sisalto genre-sivu">
      <div className="vaihe-otsikko">
        <h2>Valitse Genre</h2>
        <p>Valitse maailma, jossa hahmo seikkailuu</p>
      </div>

      <div className="kortit-grid">
        <Kortti
          nimi="Fantasia"
          kuvaus="Perinteinen fantasiamaailma taynna magiaa, hirvioita ja seikkailuja"
          kuva={fantasiaKuva}
          valittu={hahmo.genre === 'fantasia'}
          onClick={() => valitseGenre('fantasia')}
        />
        <Kortti
          nimi="Multiversumi"
          kuvaus="Sci-fi maailma avaruudessa ja eri dimensioissa (tulossa pian)"
          kuva={multiverseKuva}
          valittu={hahmo.genre === 'multiversumi'}
          onClick={() => valitseGenre('multiversumi')}
          disabled={true}
        />
      </div>
    </div>
  );
}

export default GenreValinta;