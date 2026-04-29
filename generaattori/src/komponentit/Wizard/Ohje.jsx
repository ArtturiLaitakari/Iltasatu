import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ohjeMd from '../../../hahmonluonti.md?raw';
import './Ohje.css';

function Ohje({ onSulje }) {
  return (
    <div className="ohje-overlay" onClick={onSulje}>
      <div className="ohje-modaali" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="ohje-sulje"
          onClick={onSulje}
          aria-label="Sulje ohje"
        >
          ✕
        </button>
        <div className="ohje-sisalto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{ohjeMd}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default Ohje;
