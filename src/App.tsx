import { useState } from 'react';
import { IconForm } from './components/IconForm';
import { IconGrid } from './components/IconGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { generateIcons } from './api';
import { StylePreset, GenerationResponse } from './types';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResponse | null>(null);

  const handleGenerate = async (prompt: string, style: StylePreset, colors: string[]) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateIcons({ prompt, style, colors });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>IconMaker</h1>
        <p className="tagline">Generate consistent icon sets with AI</p>
      </header>

      <main className="app-main">
        <IconForm onSubmit={handleGenerate} isLoading={loading} />

        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        
        {result && !loading && (
          <IconGrid 
            icons={result.icons} 
            theme={result.metadata.theme}
            style={result.metadata.style}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>IconMaker Demo</p>
      </footer>
    </div>
  );
}

export default App;
