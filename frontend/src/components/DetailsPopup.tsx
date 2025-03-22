import React, { useEffect, useState } from 'react';

// Import the same color constants for consistency
const COLORS = {
  primary: '#0077cc',        // Electric blue
  primaryLight: '#0099ff',   // Lighter blue for hovers
  primaryDark: '#005999',    // Darker blue for active states
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
  confidence?: string;
  plugin_id?: string;
  input_vector?: string;
  alert_id?: string;
}

interface DetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  vulnerability: Vulnerability | null;
}

const DetailsPopup: React.FC<DetailsPopupProps> = ({ isOpen, onClose, vulnerability }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  // Animation effect
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);
  
  if (!isOpen && !isAnimating) return null;
  if (!vulnerability) return null;
  
  // Function to get appropriate color for risk level
  const getRiskColor = (risk: string): string => {
    switch(risk.toLowerCase()) {
      case 'high':
        return COLORS.danger;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.info;
      case 'informational':
        return COLORS.success;
      default:
        return COLORS.mediumGray;
    }
  };
  
  // Function to render external references as links
  const renderReferences = (references: string | undefined): React.ReactNode => {
    if (!references) return '-';
    
    // Try to extract links from the text
    const linkRegex = /https?:\/\/[^\s]+/g;
    const links = references.match(linkRegex);
    
    if (!links || links.length === 0) {
      return references;
    }
    
    // Replace links with actual hyperlinks
    return (
      <ul style={{ margin: '0', paddingLeft: '20px' }}>
        {links.map((link, index) => (
          <li key={index} style={{ marginBottom: '4px' }}>
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: COLORS.secondary,
                textDecoration: 'none',
                wordBreak: 'break-all'
              }}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    );
  };
  
  // Used for UI section styling
  const sectionStyle = {
    marginBottom: '24px',
    animation: 'fadeIn 0.5s ease-out'
  };
  
  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 600 as const,
    color: COLORS.text,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)`,
    paddingBottom: '8px'
  };
  
  const sectionContentStyle = {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '15px',
    borderRadius: '6px',
    color: COLORS.textDark,
    fontSize: '0.9rem',
    lineHeight: '1.5',
    border: '1px solid rgba(255,255,255,0.05)'
  };
  
  return (
    <div style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 300ms ease',
      overflow: 'hidden'
    }}>
      <div 
        style={{
          backgroundColor: COLORS.darkGray,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          width: '90%',
          maxWidth: '1000px',
          height: '90%',
          maxHeight: '800px',
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.2) inset`,
          borderRadius: '12px',
          overflow: 'hidden',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: isOpen ? 'fadeIn 0.3s ease-out' : 'none',
          border: `1px solid rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)`
        }}
      >
        {/* Header with vulnerability name and risk level */}
        <div style={{
          padding: '18px 24px',
          borderBottom: `1px solid rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: getRiskColor(vulnerability.risk),
              borderRadius: '50%',
              marginRight: '12px',
              boxShadow: `0 0 8px ${getRiskColor(vulnerability.risk)}`,
              animation: 'pulse 2s infinite'
            }}></div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: 600,
              color: COLORS.text,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}>
              {vulnerability.name}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', gap: '10px' }}>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: getRiskColor(vulnerability.risk), 
                  backgroundColor: `rgba(${parseInt(getRiskColor(vulnerability.risk).slice(1, 3), 16)}, ${parseInt(getRiskColor(vulnerability.risk).slice(3, 5), 16)}, ${parseInt(getRiskColor(vulnerability.risk).slice(5, 7), 16)}, 0.1)`,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'normal',
                  letterSpacing: '0.02em'
                }}>
                  {vulnerability.risk.toUpperCase()} RISK
                </span>
                {vulnerability.cweid && (
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: COLORS.secondary, 
                    backgroundColor: 'rgba(0, 204, 255, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 'normal',
                    letterSpacing: '0.02em'
                  }}>
                    CWE-{vulnerability.cweid}
                  </span>
                )}
                {vulnerability.confidence && (
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: COLORS.textDark, 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 'normal',
                    letterSpacing: '0.02em'
                  }}>
                    Confidence: {vulnerability.confidence}
                  </span>
                )}
              </div>
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '16px',
              cursor: 'pointer',
              color: COLORS.textDark,
              padding: '6px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none',
              boxShadow: 'none',
              width: '32px',
              height: '32px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,59,48,0.2)';
              e.currentTarget.style.color = COLORS.danger;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.color = COLORS.textDark;
            }}
          >
            ×
          </button>
        </div>
        
        {/* Content area with scrolling */}
        <div style={{
          padding: '24px',
          flex: 1,
          overflowY: 'auto',
          backgroundColor: COLORS.darkGray,
        }}>
          {/* Left and right columns for different types of information */}
          <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
            <div style={{ flex: '3', display: 'flex', flexDirection: 'column' }}>
              {/* Description Section */}
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.primary,
                    marginRight: '8px',
                  }}></span>
                  Description
                </div>
                <div style={sectionContentStyle}>
                  {vulnerability.description || 'No description available.'}
                </div>
              </div>
              
              {/* Solution Section */}
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.success,
                    marginRight: '8px',
                  }}></span>
                  Mitigation Strategy
                </div>
                <div style={sectionContentStyle}>
                  {vulnerability.solution || 'No mitigation recommendations available.'}
                </div>
              </div>
              
              {/* References Section */}
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.secondary,
                    marginRight: '8px',
                  }}></span>
                  References
                </div>
                <div style={sectionContentStyle}>
                  {renderReferences(vulnerability.reference)}
                </div>
              </div>
              
              {/* Evidence Section */}
              {vulnerability.evidence && (
                <div style={sectionStyle}>
                  <div style={sectionTitleStyle}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.warning,
                      marginRight: '8px',
                    }}></span>
                    Evidence
                  </div>
                  <div style={{
                    ...sectionContentStyle,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {vulnerability.evidence}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right side - Technical details */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
              {/* Target URL */}
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.danger,
                    marginRight: '8px',
                  }}></span>
                  Target Details
                </div>
                <div style={{
                  ...sectionContentStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ color: COLORS.secondary, marginBottom: '4px', fontSize: '0.8rem' }}>URL:</div>
                    <a 
                      href={vulnerability.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        color: COLORS.primary,
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {vulnerability.url}
                    </a>
                  </div>
                  
                  {vulnerability.method && (
                    <div>
                      <div style={{ color: COLORS.secondary, marginBottom: '4px', fontSize: '0.8rem' }}>HTTP Method:</div>
                      <div style={{ fontFamily: 'monospace' }}>{vulnerability.method}</div>
                    </div>
                  )}
                  
                  {vulnerability.param && (
                    <div>
                      <div style={{ color: COLORS.secondary, marginBottom: '4px', fontSize: '0.8rem' }}>Parameter:</div>
                      <div style={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                        {vulnerability.param}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Attack information */}
              {vulnerability.attack && (
                <div style={sectionStyle}>
                  <div style={sectionTitleStyle}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.warning,
                      marginRight: '8px',
                    }}></span>
                    Attack Vector
                  </div>
                  <div style={{
                    ...sectionContentStyle,
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(255,187,0,0.05)',
                    border: '1px solid rgba(255,187,0,0.2)',
                  }}>
                    {vulnerability.attack}
                  </div>
                </div>
              )}
              
              {/* Technical identifiers */}
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.info,
                    marginRight: '8px',
                  }}></span>
                  Technical Details
                </div>
                <div style={{
                  ...sectionContentStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <table style={{ 
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem'
                  }}>
                    <tbody>
                      {vulnerability.cweid && (
                        <tr>
                          <td style={{ padding: '4px 8px', color: COLORS.secondary }}>CWE ID:</td>
                          <td style={{ padding: '4px 8px' }}>{vulnerability.cweid}</td>
                        </tr>
                      )}
                      {vulnerability.plugin_id && (
                        <tr>
                          <td style={{ padding: '4px 8px', color: COLORS.secondary }}>Plugin ID:</td>
                          <td style={{ padding: '4px 8px' }}>{vulnerability.plugin_id}</td>
                        </tr>
                      )}
                      {vulnerability.input_vector && (
                        <tr>
                          <td style={{ padding: '4px 8px', color: COLORS.secondary }}>Input Vector:</td>
                          <td style={{ padding: '4px 8px' }}>{vulnerability.input_vector}</td>
                        </tr>
                      )}
                      {vulnerability.alert_id && (
                        <tr>
                          <td style={{ padding: '4px 8px', color: COLORS.secondary }}>Alert ID:</td>
                          <td style={{ padding: '4px 8px' }}>{vulnerability.alert_id}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with additional links or tools */}
        <div style={{
          padding: '12px 24px',
          borderTop: `1px solid rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)`,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '0.85rem',
            color: COLORS.textDark,
          }}>
            Detected by OWASP ZAP Scanner
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                color: COLORS.textDark,
                border: `1px solid ${COLORS.lightGray}`,
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = COLORS.text;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = COLORS.textDark;
              }}
            >
              Close
            </button>
            {vulnerability.cweid && (
              <a
                href={`https://cwe.mitre.org/data/definitions/${vulnerability.cweid}.html`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.text,
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primaryLight;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary;
                }}
              >
                View CWE Details
              </a>
            )}
          </div>
        </div>
        
        {/* CSS animations */}
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            /* Custom scrollbar for webkit browsers */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.2);
              border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb {
              background: ${COLORS.mediumGray};
              border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: ${COLORS.lightGray};
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default DetailsPopup;