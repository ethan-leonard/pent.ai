import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Vulnerability {
  id: string;
  name: string;
  description: string;
  url: string;
  risk: string;
  confidence: string;
}

interface Scan {
  id: string;
  target_url: string;
  start_time: string;
  end_time: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  vulnerabilities: Vulnerability[];
}

const App: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState<string>('http://127.0.0.1:5000');
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = 'http://127.0.0.1:8000/api';

  // Load existing scans on component mount
  useEffect(() => {
    fetchScans();
  }, []);

  // Poll for updates if there's a scan in progress
  useEffect(() => {
    let interval: number | undefined;
    
    if (currentScan && (currentScan.status === 'pending' || currentScan.status === 'in_progress')) {
      interval = window.setInterval(() => {
        fetchScanDetails(currentScan.id);
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentScan]);

  const fetchScans = async () => {
    try {
      const response = await axios.get(`${API_BASE}/scans/`);
      setScans(response.data);
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError('Failed to fetch scan history');
    }
  };

  const fetchScanDetails = async (scanId: string) => {
    try {
      const response = await axios.get(`${API_BASE}/scans/${scanId}/`);
      setCurrentScan(response.data);
      
      // Update the scan in the list as well
      setScans(prevScans => 
        prevScans.map(scan => scan.id === scanId ? response.data : scan)
      );
    } catch (err) {
      console.error('Error fetching scan details:', err);
    }
  };

  const startScan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE}/scans/`, { target_url: targetUrl });
      setCurrentScan(response.data);
      setScans(prevScans => [response.data, ...prevScans]);
    } catch (err: any) {
      console.error('Error starting scan:', err);
      setError(err.response?.data?.message || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (risk: string) => {
    switch (risk) {
      case 'critical': return 'risk-critical';
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-info';
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Pent.AI - Web Security Scanner</h1>
      </header>
      
      <section className="scan-form">
        <h2>Start New Scan</h2>
        <form onSubmit={startScan}>
          <div className="form-group">
            <label htmlFor="targetUrl">Target URL:</label>
            <input
              type="url"
              id="targetUrl"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter website URL to scan"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || (currentScan?.status === 'in_progress')}
          >
            {loading ? 'Starting...' : 'Start Scan'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </section>

      {currentScan && (
        <section className="current-scan">
          <h2>Current Scan</h2>
          <div className="scan-details">
            <p><strong>Target:</strong> {currentScan.target_url}</p>
            <p>
              <strong>Status:</strong> 
              <span className={`status-${currentScan.status}`}>
                {currentScan.status.replace('_', ' ')}
              </span>
            </p>
            <p><strong>Started:</strong> {new Date(currentScan.start_time).toLocaleString()}</p>
            {currentScan.end_time && (
              <p><strong>Completed:</strong> {new Date(currentScan.end_time).toLocaleString()}</p>
            )}
          </div>

          {currentScan.vulnerabilities.length > 0 && (
            <div className="vulnerabilities">
              <h3>Found Vulnerabilities ({currentScan.vulnerabilities.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Risk</th>
                    <th>Confidence</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {currentScan.vulnerabilities.map(vuln => (
                    <tr key={vuln.id}>
                      <td>{vuln.name}</td>
                      <td className={getRiskClass(vuln.risk)}>{vuln.risk}</td>
                      <td>{vuln.confidence}</td>
                      <td className="url-cell">
                        <a href={vuln.url} target="_blank" rel="noopener noreferrer">
                          {new URL(vuln.url).pathname}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {scans.length > 0 && !currentScan && (
        <section className="scan-history">
          <h2>Scan History</h2>
          <table>
            <thead>
              <tr>
                <th>Target</th>
                <th>Date</th>
                <th>Status</th>
                <th>Vulnerabilities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans.map(scan => (
                <tr key={scan.id}>
                  <td>{scan.target_url}</td>
                  <td>{new Date(scan.start_time).toLocaleString()}</td>
                  <td className={`status-${scan.status}`}>{scan.status}</td>
                  <td>{scan.vulnerabilities.length}</td>
                  <td>
                    <button onClick={() => setCurrentScan(scan)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default App;