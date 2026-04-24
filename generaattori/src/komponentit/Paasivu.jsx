import './Paasivu.css';
import fantasiaKuva from '../kuvat/fantasia.jpg';
import multiverseKuva from '../kuvat/multiverse.jpg';

function Paasivu({ valitseModuli }) {
  return (
    <div className="paasivu">
      <header className="paasivu-header">
        <h1 className="paasivu-otsikko">Iltasatu</h1>
      </header>
      
      <main className="paasivu-sisalto">
        <div className="modulit-grid">
          <div className="moduli fantasia-moduli">
            <button 
              className="moduli-nappi" 
              onClick={() => valitseModuli('fantasia')}
            >
              <div className="moduli-sisalto">
                <div className="moduli-kuva-alue">
                  <img src={fantasiaKuva} alt="Fantasia" className="moduli-kuva" />
                </div>
                <h2 className="moduli-otsikko">Fantasia</h2>
                <p className="moduli-kuvaus">Luo hahmoja fantasiamaailmaan</p>
              </div>
            </button>
          </div>
          
          <div className="moduli multiversumi-moduli">
            <div className="moduli-placeholder">
              <div className="moduli-sisalto">
                <div className="moduli-kuva-alue">
                  <img src={multiverseKuva} alt="Multiversumi" className="moduli-kuva" />
                </div>
                <h2 className="moduli-otsikko">Multiversumi</h2>
                <p className="moduli-kuvaus">Tulossa pian...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Paasivu;