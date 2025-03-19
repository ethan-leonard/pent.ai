import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('http://juice-shop:3000');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
    zap_version?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setConnectionStatus(null);

    try {
      const response = await axios.post('http://localhost:8000/api/zap-connection/', {
        target_url: url
      });
      
      setConnectionStatus({
        success: response.data.success,
        message: response.data.message,
        zap_version: response.data.zap_version
      });
    } catch (error) {
      console.error('Error connecting to ZAP:', error);
      setConnectionStatus({
        success: false,
        message: 'Failed to connect to ZAP. Please check the configuration and try again.'
      });
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
        <p>ZAP Connection Tester</p>
      </header>
      
      <section style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Test ZAP Connection</h2>
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
            {isLoading ? 'Testing Connection...' : 'Test Connection'}
          </button>
        </form>
      </section>
      
      {connectionStatus && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '4px',
          backgroundColor: connectionStatus.success ? '#dff0d8' : '#f2dede',
          color: connectionStatus.success ? '#3c763d' : '#a94442'
        }}>
          <h3>{connectionStatus.success ? 'Success!' : 'Error'}</h3>
          <p>{connectionStatus.message}</p>
          {connectionStatus.zap_version && (
            <p>
              ZAP Version: <code>{connectionStatus.zap_version}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;