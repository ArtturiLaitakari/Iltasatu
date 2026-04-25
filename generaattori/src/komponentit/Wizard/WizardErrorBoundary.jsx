import { Component } from 'react';

class WizardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Wizard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="vaihe-sisalto">
          <div className="virhe-nakyma">
            <h2>⚠️ Oho! Jotain meni pieleen</h2>
            <p>Wizard-vaiheessa tapahtui virhe. Yritä palata edelliseen vaiheeseen tai aloittaa alusta.</p>
            <details style={{ marginTop: '1rem' }}>
              <summary>Tekninen tieto (kehittäjille)</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '1rem', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.9rem'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
            <div className="toiminto-napit" style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn btn-secondary"
              >
                Yritä uudelleen
              </button>
              {this.props.onReset && (
                <button 
                  onClick={this.props.onReset}
                  className="btn btn-primary"
                >
                  Aloita alusta
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WizardErrorBoundary;