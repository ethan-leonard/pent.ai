import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('http://juice-shop:3000');
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [scanType, setScanType] = useState<'combined' | 'traditional' | 'ajax' | 'active'>('combined');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgressMessage("Testing ZAP connection...");
    setResultData(null);

    try {
      // 1. Test connection
      const connResponse = await axios.post('http://localhost:8000/api/zap-connection/', { target_url: url });
      if (!connResponse.data.success) {
        setProgressMessage("ZAP connection test failed.");
        setIsLoading(false);
        return;
      }
      
      setProgressMessage("ZAP connection successful.");
      
      // Decide which scan to run based on scanType
      if (scanType === 'traditional') {
        // Run only traditional spider scan
        setProgressMessage("Starting traditional spider scan...");
        const spiderResponse = await axios.post('http://localhost:8000/api/traditional-spider-scan/', { target_url: url });
        setResultData(spiderResponse.data);
        setProgressMessage("Traditional spider scan completed.");
      } 
      else if (scanType === 'ajax') {
        // Run only Ajax spider scan
        setProgressMessage("Starting Ajax spider scan...");
        const ajaxResponse = await axios.post('http://localhost:8000/api/ajax-spider-scan/', { target_url: url });
        setResultData(ajaxResponse.data);
        setProgressMessage("Ajax spider scan completed.");
      }
      else if (scanType === 'active') {
        // Run only active scan (without spider)
        setProgressMessage("Starting active scan...");
        const activeResponse = await axios.post('http://localhost:8000/api/active-scan/', { target_url: url });
        setResultData(activeResponse.data);
        setProgressMessage("Active scan completed.");
      }
      else {
        // Combined scan (traditional + ajax + active) - original flow
        setProgressMessage("Starting traditional spider scan...");
        const traditionalResponse = await axios.post('http://localhost:8000/api/traditional-spider-scan/', { target_url: url });
        if (!traditionalResponse.data.success) {
          setProgressMessage("Traditional spider scan failed.");
          setResultData(traditionalResponse.data);
          setIsLoading(false);
          return;
        }
        
        setProgressMessage("Traditional spider scan completed. Starting Ajax spider scan...");
        const ajaxResponse = await axios.post('http://localhost:8000/api/ajax-spider-scan/', { target_url: url });
        if (!ajaxResponse.data.success) {
          setProgressMessage("Ajax spider scan failed.");
          setResultData(ajaxResponse.data);
          setIsLoading(false);
          return;
        }
        
        setProgressMessage("Ajax spider scan completed. Starting active scan...");
        const activeResponse = await axios.post('http://localhost:8000/api/active-scan/', { target_url: url });
        setResultData(activeResponse.data);
        setProgressMessage("Active scan complete.");
      }
    } catch (error: any) {
      console.error('Error:', error);
      setProgressMessage(`An error occurred: ${error.message}`);
      setResultData({ success: false, error: error.message });
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
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Scan Type:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name="scanType"
                  checked={scanType === 'combined'}
                  onChange={() => setScanType('combined')}
                /> 
                Full Scan (Spider + Active)
              </label>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name="scanType"
                  checked={scanType === 'traditional'}
                  onChange={() => setScanType('traditional')}
                /> 
                Traditional Spider Only
              </label>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name="scanType"
                  checked={scanType === 'ajax'}
                  onChange={() => setScanType('ajax')}
                /> 
                Ajax Spider Only
              </label>
              <label>
                <input
                  type="radio"
                  name="scanType"
                  checked={scanType === 'active'}
                  onChange={() => setScanType('active')}
                /> 
                Active Scan Only
              </label>
            </div>
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
            <pre style={{ overflowX: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(resultData, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;