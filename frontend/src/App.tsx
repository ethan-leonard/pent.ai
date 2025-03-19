import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('http://juice-shop:3000');
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgressMessage("Testing ZAP connection...");
    setResultData(null);

    try {
      // 1. Test connection
      const connResponse = await axios.post('http://localhost:8000/api/zap-connection/', { target_url: url });
      if (connResponse.data.success) {
        setProgressMessage("ZAP connection successful. Starting spider scan...");
        // 2. Run spider scan
        const spiderResponse = await axios.post('http://localhost:8000/api/spider-scan/', { target_url: url });
        if (!spiderResponse.data.success) {
          setProgressMessage("Spider scan failed.");
          setIsLoading(false);
          return;
        }
        setProgressMessage("Spider scan completed. Starting active scan...");
        // 3. Run active scan
        const activeResponse = await axios.post('http://localhost:8000/api/active-scan/', { target_url: url });
        setResultData(activeResponse.data);
        setProgressMessage("Active scan complete.");
      } else {
        setProgressMessage("ZAP connection test failed.");
      }
    } catch (error: any) {
      console.error('Error:', error);
      setProgressMessage("An error occurred. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>Pent.AI</h1>
        <p>Security Scan Tester</p>
      </header>
      
      <section style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Test &amp; Scan</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="url" style={{ display: 'block', marginBottom: '5px' }}>
              Target URL:
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              required
            />
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              Default: http://juice-shop:3000 (OWASP Juice Shop in Docker)
            </small>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Processing...' : 'Start Scan'}
          </button>
        </form>

        {progressMessage && (
          <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
            {progressMessage}
          </div>
        )}

        {resultData && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '4px',
            backgroundColor: resultData.success ? '#dff0d8' : '#f2dede',
            color: resultData.success ? '#3c763d' : '#a94442'
          }}>
            <h3>{resultData.success ? 'Scan Completed' : 'Scan Failed'}</h3>
            <pre style={{ overflowX: 'auto' }}>
              {JSON.stringify(resultData, null, 2)}
            </pre>
          </div>
        )}

      </section>
    </div>
  );
}

export default App;