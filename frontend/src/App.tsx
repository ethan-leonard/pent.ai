import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

// Import the Popup component
import Popup from './components/Popup';

// Define color constants for consistent theming
const COLORS = {
  primary: '#0077cc',        // Electric blue
  primaryLight: '#0099ff',    // Lighter blue for hovers
  primaryDark: '#005999',     // Darker blue for active states
  secondary: '#00ccff',      // Cyan accent
  dark: '#121212',           // Near black
  darkGray: '#1e1e1e',       // Dark gray for backgrounds
  mediumGray: '#333333',     // Medium gray
  lightGray: '#555555',      // Light gray
  text: '#ffffff',           // White text
  textDark: '#e0e0e0',       // Slightly dimmed text
  success: '#00cc88',        // Green
  warning: '#ffbb00',        // Amber
  danger: '#ff3b30',         // Red
  info: '#00b3ff',           // Light blue
};

// Animation keyframes - will be injected into document head
const KEYFRAMES = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 119, 204, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(0, 119, 204, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 119, 204, 0); }
  }
  
  @keyframes glow {
    0% { text-shadow: 0 0 5px rgba(0, 204, 255, 0.5), 0 0 10px rgba(0, 204, 255, 0.3); }
    50% { text-shadow: 0 0 15px rgba(0, 204, 255, 0.8), 0 0 20px rgba(0, 204, 255, 0.5); }
    100% { text-shadow: 0 0 5px rgba(0, 204, 255, 0.5), 0 0 10px rgba(0, 204, 255, 0.3); }
  }
  
  @keyframes scanLine {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

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
  
  // For animations
  const [pageLoaded, setPageLoaded] = useState(false);

  // Inject keyframes when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = KEYFRAMES;
    document.head.appendChild(styleElement);
    
    // Set page as loaded for animations
    setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
    let color = COLORS.mediumGray; // Default gray for unknown
    
    switch(risk.toLowerCase()) {
      case 'high':
        color = COLORS.danger; // Red
        break;
      case 'medium':
        color = COLORS.warning; // Orange/yellow
        break;
      case 'low':
        color = COLORS.info; // Blue
        break;
      case 'informational':
        color = COLORS.success; // Green
        break;
    }
    
    return (
      <span style={{ 
        backgroundColor: color, 
        color: COLORS.text, 
        padding: '2px 8px', 
        borderRadius: '4px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        display: 'inline-block',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {risk}
      </span>
    );
  };

  // Return the JSX for the main component
  return (
    <div style={{
      backgroundColor: COLORS.dark,
      color: COLORS.text,
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '20px',
      transition: 'all 0.3s ease'
    }}>
      {/* Gradient overlay for visual effect */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(0,119,204,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(0,204,255,0.1), transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
    
      <div className="App" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        opacity: pageLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        <header style={{ 
          marginBottom: '40px', 
          textAlign: 'center',
          animation: pageLoaded ? 'fadeIn 0.8s ease-in-out' : 'none'
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            margin: 0,
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'glow 3s infinite alternate',
            letterSpacing: '-0.03em'
          }}>
            Pent.AI
          </h1>
          <p style={{ 
            color: COLORS.textDark, 
            fontSize: '1.2rem',
            marginTop: '10px',
            opacity: 0.9
          }}>
            Advanced Threat Intelligence Platform
          </p>
          
          {/* Decorative scanner line */}
          <div style={{
            width: '150px',
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
            margin: '15px auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${COLORS.secondary}, transparent)`,
              animation: 'scanLine 2s infinite linear'
            }}></div>
          </div>
        </header>
        
        <section style={{
          backgroundColor: COLORS.darkGray,
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.05) inset',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.1)`,
          marginBottom: '30px',
          animation: pageLoaded ? 'slideInUp 0.5s ease-out' : 'none'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              margin: 0, 
              color: COLORS.text,
              fontSize: '1.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: COLORS.primary,
                marginRight: '10px',
                animation: 'pulse 2s infinite'
              }}></span>
              Target Analysis
            </h2>
            
            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: COLORS.secondary,
                fontWeight: 500,
                fontSize: '0.9rem',
                animation: 'blink 1s infinite ease-in-out'
              }}>
                <span style={{ marginRight: '8px' }}>SCANNING</span>
                <span style={{ 
                  display: 'inline-block', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: COLORS.secondary 
                }}></span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="url" style={{ 
                display: 'block', 
                marginBottom: '10px',
                color: COLORS.textDark,
                fontSize: '0.95rem',
                fontWeight: 500 
              }}>
                Target URL:
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-focus"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: `1px solid ${COLORS.lightGray}`,
                  backgroundColor: 'rgba(30, 30, 30, 0.7)',
                  color: COLORS.text,
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                }}
                required
                disabled={isLoading}
              />
              <small style={{ color: COLORS.textDark, display: 'block', marginTop: '8px', opacity: 0.7 }}>
                Default: http://juice-shop:3000 (OWASP Juice Shop in Docker)
              </small>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px',
                color: COLORS.textDark,
                fontSize: '0.95rem',
                fontWeight: 500
              }}>
                Scan Mode:
              </label>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px',
                background: 'rgba(0,0,0,0.15)',
                padding: '15px',
                borderRadius: '8px',
              }}>
                <label style={{
                  display: 'block',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  backgroundColor: scanType === 'combined' ? `rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)` : 'transparent',
                  border: `1px solid ${scanType === 'combined' ? COLORS.primary : 'rgba(255,255,255,0.1)'}`,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.6 : 1
                }}>
                  <input
                    type="radio"
                    name="scanType"
                    checked={scanType === 'combined'}
                    onChange={() => setScanType('combined')}
                    disabled={isLoading}
                    style={{ marginRight: '8px' }}
                  /> 
                  <span style={{
                    color: scanType === 'combined' ? COLORS.primary : COLORS.textDark,
                    fontWeight: scanType === 'combined' ? 600 : 400
                  }}>Complete Scan</span>
                </label>
                
                <label style={{
                  display: 'block',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  backgroundColor: scanType === 'traditional' ? `rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)` : 'transparent',
                  border: `1px solid ${scanType === 'traditional' ? COLORS.primary : 'rgba(255,255,255,0.1)'}`,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.6 : 1
                }}>
                  <input
                    type="radio"
                    name="scanType"
                    checked={scanType === 'traditional'}
                    onChange={() => setScanType('traditional')}
                    disabled={isLoading}
                    style={{ marginRight: '8px' }}
                  /> 
                  <span style={{
                    color: scanType === 'traditional' ? COLORS.primary : COLORS.textDark,
                    fontWeight: scanType === 'traditional' ? 600 : 400
                  }}>Traditional Crawler</span>
                </label>
                
                <label style={{
                  display: 'block',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  backgroundColor: scanType === 'ajax' ? `rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)` : 'transparent',
                  border: `1px solid ${scanType === 'ajax' ? COLORS.primary : 'rgba(255,255,255,0.1)'}`,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.6 : 1
                }}>
                  <input
                    type="radio"
                    name="scanType"
                    checked={scanType === 'ajax'}
                    onChange={() => setScanType('ajax')}
                    disabled={isLoading}
                    style={{ marginRight: '8px' }}
                  /> 
                  <span style={{
                    color: scanType === 'ajax' ? COLORS.primary : COLORS.textDark,
                    fontWeight: scanType === 'ajax' ? 600 : 400
                  }}>AJAX Crawler</span>
                </label>
                
                <label style={{
                  display: 'block',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  backgroundColor: scanType === 'active' ? `rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)` : 'transparent',
                  border: `1px solid ${scanType === 'active' ? COLORS.primary : 'rgba(255,255,255,0.1)'}`,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.6 : 1
                }}>
                  <input
                    type="radio"
                    name="scanType"
                    checked={scanType === 'active'}
                    onChange={() => setScanType('active')}
                    disabled={isLoading}
                    style={{ marginRight: '8px' }}
                  /> 
                  <span style={{
                    color: scanType === 'active' ? COLORS.primary : COLORS.textDark,
                    fontWeight: scanType === 'active' ? 600 : 400
                  }}>Active Analysis</span>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.text,
                padding: '14px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                boxShadow: `0 4px 12px rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.5)`,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: `2px solid ${COLORS.text}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px'
                  }}></div>
                  Processing...
                </>
              ) : (
                <>
                  <span style={{ 
                    marginRight: '8px',
                    fontSize: '1.1em'
                  }}>⚡</span>
                  Initiate Scan
                </>
              )}
            </button>
          </form>

          {progressMessage && (
            <div style={{ 
              padding: '15px',
              borderLeft: `4px solid ${COLORS.primary}`,
              backgroundColor: 'rgba(0,0,0,0.2)',
              color: COLORS.textDark,
              marginTop: '20px',
              borderRadius: '0 4px 4px 0',
              animation: 'fadeIn 0.3s ease-in',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: COLORS.secondary }}>$</span> {progressMessage}
              <span style={{ 
                display: 'inline-block',
                width: '8px',
                height: '15px',
                backgroundColor: COLORS.secondary,
                opacity: 0.7,
                marginLeft: '5px',
                animation: 'blink 1s infinite'
              }}></span>
            </div>
          )}

          {resultData && resultData.success && resultData.alerts && (
            <div style={{
              marginTop: '30px',
              padding: '0',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              animation: 'slideInUp 0.5s ease-out',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${COLORS.primary}`
              }}>
                <h3 style={{ 
                  margin: 0, 
                  color: COLORS.text, 
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.danger,
                    marginRight: '10px'
                  }}></span>
                  Threat Intelligence
                </h3>
                <div style={{
                  backgroundColor: `rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.2)`,
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  color: COLORS.primary,
                  fontWeight: 'bold'
                }}>
                  {resultData.alerts.length} Vulnerabilities
                </div>
              </div>
              
              <div style={{ overflowX: 'auto', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: 'rgba(0,0,0,0.3)'
                    }}>
                      <th style={{ 
                        padding: '12px 15px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${COLORS.mediumGray}`,
                        color: COLORS.textDark,
                        fontWeight: 600
                      }}>Vulnerability</th>
                      <th style={{ 
                        padding: '12px 15px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${COLORS.mediumGray}`,
                        color: COLORS.textDark,
                        fontWeight: 600
                      }}>Severity</th>
                      <th style={{ 
                        padding: '12px 15px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${COLORS.mediumGray}`,
                        color: COLORS.textDark,
                        fontWeight: 600
                      }}>Description</th>
                      <th style={{ 
                        padding: '12px 15px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${COLORS.mediumGray}`,
                        color: COLORS.textDark,
                        fontWeight: 600
                      }}>Path</th>
                      <th style={{ 
                        padding: '12px 15px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${COLORS.mediumGray}`,
                        color: COLORS.textDark,
                        fontWeight: 600
                      }}>Mitigation</th>
                      <th style={{ 
                        padding: '12px 15px', 
                        textAlign: 'center', 
                        borderBottom: `1px solid ${COLORS.mediumGray}`,
                        color: COLORS.textDark,
                        fontWeight: 600
                      }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultData.alerts.map((vuln: any, index: number) => (
                      <tr 
                        key={index} 
                        style={{ 
                          borderBottom: `1px solid ${COLORS.mediumGray}`,
                          backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent',
                          transition: 'background-color 0.2s ease',
                          // Removed '&:hover' as it is not supported in inline styles
                        }}
                      >
                        <td style={{ 
                          padding: '15px', 
                          fontWeight: 500,
                          color: COLORS.text
                        }}>
                          {vuln.name || vuln.alert}
                        </td>
                        <td style={{ 
                          padding: '15px'
                        }}>
                          {renderRiskBadge(vuln.risk)}
                        </td>
                        <td style={{ 
                          padding: '15px',
                          color: COLORS.textDark,
                          maxWidth: '300px'
                        }}>
                          {getFirstTwoSentences(vuln.description)}
                        </td>
                        <td style={{ 
                          padding: '15px', 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          color: COLORS.textDark
                        }}>
                          <a 
                            href={vuln.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{
                              color: COLORS.primary,
                              textDecoration: 'none',
                            }}
                          >
                            {vuln.url}
                          </a>
                        </td>
                        <td style={{ 
                          padding: '15px',
                          color: COLORS.textDark,
                          maxWidth: '250px'
                        }}>
                          {getFirstTwoSentences(vuln.solution)}
                        </td>
                        <td style={{ 
                          padding: '15px',
                          textAlign: 'center'
                        }}>
                          <button 
                            onClick={() => handleSimulate(vuln)}
                            style={{
                              backgroundColor: 'transparent',
                              color: COLORS.secondary,
                              border: `1px solid ${COLORS.secondary}`,
                              borderRadius: '4px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                            }}
                            className="analyze-button"
                          >
                            Analyze &rarr;
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
              marginTop: '30px',
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: resultData.success ? 'rgba(0, 204, 136, 0.1)' : 'rgba(255, 59, 48, 0.1)',
              border: `1px solid ${resultData.success ? COLORS.success : COLORS.danger}`,
              color: resultData.success ? COLORS.success : COLORS.danger,
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600
              }}>
                {resultData.success ? (
                  <span style={{ marginRight: '10px', fontSize: '1.2em' }}>✓</span>
                ) : (
                  <span style={{ marginRight: '10px', fontSize: '1.2em' }}>⨯</span>
                )}
                {resultData.success ? 'Scan Completed' : 'Scan Failed'}
              </h3>
              <pre style={{ 
                overflowX: 'auto', 
                maxHeight: '400px',
                padding: '15px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.05)',
                color: COLORS.textDark,
                margin: 0,
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}>
                {JSON.stringify(resultData, null, 2)}
              </pre>
            </div>
          )}
        </section>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          color: COLORS.textDark,
          fontSize: '0.9rem',
          opacity: 0.7 
        }}>
          <div style={{ 
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <span>Pent.AI &copy; {new Date().getFullYear()}</span>
            <span>|</span>
            <span>Advanced Threat Intelligence</span>
          </div>
          <div style={{
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span>Powered by OWASP ZAP + proxy.lite</span>
          </div>
        </footer>
      </div>

      {/* Add the Popup component */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={selectedVulnerability?.name || "Vulnerability"}
        id={selectedVulnerability?.cweid || ""}
      >
        {selectedVulnerability && (
          <div>
            {/* The content inside the popup will remain the same */}
          </div>
        )}
      </Popup>
    </div>
  );
}

export default App;