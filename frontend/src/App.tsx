import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

// Import the Popup component
import Popup from './components/Popup';

interface Vulnerability {
  name: string;
  description: string;
  url: string;
  risk: string;
  param?: string;
  attack?: string;
  solution?: string;
  evidence?: string;
  cweid?: string;
  reference?: string;
  method?: string;
}

function App() {
  const [url, setUrl] = useState('http://juice-shop:3000');
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [scanType, setScanType] = useState<'combined' | 'traditional' | 'ajax' | 'active'>('combined');
  
  // Add state for the popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    // Your existing handleSubmit code...
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

  // Updated function to handle the simulate button click
  const handleSimulate = (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
    setIsPopupOpen(true);
  };

  // Function to extract just the first two sentences from text
  const getFirstTwoSentences = (text: string | undefined): string => {
    if (!text) return '-';
    
    // Match sentences that end with period, question mark, or exclamation point
    // followed by a space or end of string
    const sentenceRegex = /[^.!?]*[.!?](?:\s|$)/g;
    const sentences = text.match(sentenceRegex);
    
    if (!sentences || sentences.length === 0) {
      // If no proper sentences found, just return a portion of the text
      return text.length > 100 ? text.substring(0, 100) + '...' : text;
    }
    
    // Return first two sentences or just the first if only one exists
    return (sentences.length === 1) 
      ? sentences[0].trim() 
      : (sentences[0] + sentences[1]).trim();
  };

  // Function to render risk with appropriate color
  const renderRiskBadge = (risk: string) => {
    // Your existing renderRiskBadge code...
    let color = '#777'; // Default gray for unknown
    
    switch(risk.toLowerCase()) {
      case 'high':
        color = '#d9534f'; // Red
        break;
      case 'medium':
        color = '#f0ad4e'; // Orange/yellow
        break;
      case 'low':
        color = '#5bc0de'; // Blue
        break;
      case 'informational':
        color = '#5cb85c'; // Green
        break;
    }
    
    return (
      <span style={{ 
        backgroundColor: color, 
        color: 'white', 
        padding: '2px 8px', 
        borderRadius: '4px',
        fontSize: '0.85em',
        fontWeight: 'bold'
      }}>
        {risk}
      </span>
    );
  };

  // Return the JSX for the main component
  return (
    <div className="App" style={{
      maxWidth: '90%',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Your existing header and form JSX... */}
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

        {resultData && resultData.success && resultData.alerts && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '4px',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3>Vulnerability Findings</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                marginTop: '10px',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Risk</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>URL</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Solution</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.alerts.map((vuln: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{vuln.name || vuln.alert}</td>
                      <td style={{ padding: '10px' }}>{renderRiskBadge(vuln.risk)}</td>
                      <td style={{ padding: '10px' }}>
                        {getFirstTwoSentences(vuln.description)}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        maxWidth: '300px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        <a href={vuln.url} target="_blank" rel="noopener noreferrer">{vuln.url}</a>
                      </td>
                      <td style={{ padding: '10px' }}>
                        {getFirstTwoSentences(vuln.solution)}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button 
                          onClick={() => handleSimulate(vuln)}
                          style={{
                            backgroundColor: '#337ab7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Simulate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultData && !resultData.alerts && (
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

      {/* Add the Popup component */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={selectedVulnerability?.name || "Vulnerability"}
        id={selectedVulnerability?.cweid || ""}
      >
        {selectedVulnerability && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                Vulnerability Details
              </h3>
              <div style={{ display: 'flex', marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', width: '120px' }}>Risk Level:</div>
                <div>{renderRiskBadge(selectedVulnerability.risk)}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Description:</div>
                <div style={{ 
                  backgroundColor: '#f9f9f9', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  {selectedVulnerability.description}
                </div>
              </div>
              {selectedVulnerability.solution && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Solution:</div>
                  <div style={{ 
                    backgroundColor: '#f9f9f9', 
                    padding: '10px', 
                    borderRadius: '4px',
                    border: '1px solid #eee'
                  }}>
                    {selectedVulnerability.solution}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                Technical Information
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}>URL:</td>
                    <td style={{ padding: '8px' }}>
                      <a href={selectedVulnerability.url} target="_blank" rel="noopener noreferrer">
                        {selectedVulnerability.url}
                      </a>
                    </td>
                  </tr>
                  {selectedVulnerability.method && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>HTTP Method:</td>
                      <td style={{ padding: '8px' }}>{selectedVulnerability.method}</td>
                    </tr>
                  )}
                  {selectedVulnerability.param && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>Parameter:</td>
                      <td style={{ padding: '8px' }}>{selectedVulnerability.param}</td>
                    </tr>
                  )}
                  {selectedVulnerability.attack && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>Attack:</td>
                      <td style={{ padding: '8px' }}>
                        <code style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: '2px 4px', 
                          borderRadius: '3px',
                          fontFamily: 'monospace'
                        }}>
                          {selectedVulnerability.attack}
                        </code>
                      </td>
                    </tr>
                  )}
                  {selectedVulnerability.evidence && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>Evidence:</td>
                      <td style={{ padding: '8px' }}>
                        <pre style={{ 
                          margin: 0, 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-all',
                          backgroundColor: '#f5f5f5',
                          padding: '8px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          maxHeight: '200px',
                          overflow: 'auto'
                        }}>
                          {selectedVulnerability.evidence}
                        </pre>
                      </td>
                    </tr>
                  )}
                  {selectedVulnerability.cweid && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>CWE ID:</td>
                      <td style={{ padding: '8px' }}>
                        <a 
                          href={`https://cwe.mitre.org/data/definitions/${selectedVulnerability.cweid}.html`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          CWE-{selectedVulnerability.cweid}
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  // Here you would implement actual simulation functionality
                  console.log("Simulating vulnerability:", selectedVulnerability);
                  alert("Simulation feature coming in the next release!");
                }}
                style={{
                  backgroundColor: '#337ab7',
                  color: 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                Run Simulation
              </button>
              <button
                onClick={() => setIsPopupOpen(false)}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}

export default App;