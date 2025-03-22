import React, { useEffect, useState, useRef } from 'react';

// Import the same color constants as App.tsx for consistency
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

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  id?: string;
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, id, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const chatVideoRef = useRef<HTMLVideoElement>(null);
  const flowVideoRef = useRef<HTMLVideoElement>(null);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [flowLoaded, setFlowLoaded] = useState(false);
  
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
  
  // Animation effect and video autoplay
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      
      // Auto play the videos when popup opens
      if (chatVideoRef.current) {
        chatVideoRef.current.play().catch(error => {
          console.error("Error playing chat video:", error);
        });
      }
      
      if (flowVideoRef.current) {
        flowVideoRef.current.play().catch(error => {
          console.error("Error playing flow video:", error);
        });
      }
    } else {
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      document.body.style.overflow = 'auto';
      
      // Pause videos when popup closes
      if (chatVideoRef.current) {
        chatVideoRef.current.pause();
      }
      
      if (flowVideoRef.current) {
        flowVideoRef.current.pause();
      }
    }
  }, [isOpen]);
  
  if (!isOpen && !isAnimating) return null;
  
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
          height: '90%',
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.2) inset`,
          borderRadius: '12px',
          overflow: 'hidden',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: isOpen ? 'fadeIn 0.3s ease-out' : 'none',
          border: `1px solid rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.3)`
        }}
      >
        {/* Header with risk title and ID */}
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
              backgroundColor: COLORS.danger,
              borderRadius: '50%',
              marginRight: '12px',
              boxShadow: `0 0 8px rgba(${parseInt(COLORS.danger.slice(1, 3), 16)}, ${parseInt(COLORS.danger.slice(3, 5), 16)}, ${parseInt(COLORS.danger.slice(5, 7), 16)}, 0.7)`,
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
              {title} {id && <span style={{ 
                fontSize: '0.9rem', 
                color: COLORS.secondary, 
                backgroundColor: 'rgba(0, 204, 255, 0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                marginLeft: '8px',
                fontWeight: 'normal',
                letterSpacing: '0.02em'
              }}>CWE-{id}</span>}
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
        
        {/* Main content area */}
        <div style={{
          display: 'flex',
          height: 'calc(100% - 68px)',
          padding: '20px',
          overflow: 'hidden',
          boxSizing: 'border-box',
          backgroundColor: COLORS.darkGray,
        }}>
          {/* Left side - Chat responses */}
          <div style={{
            width: '50%',
            height: '100%',
            paddingRight: '10px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{ 
                margin: 0,
                color: COLORS.text,
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.01em'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.secondary,
                  marginRight: '8px',
                  animation: 'pulse 2s infinite'
                }}></span>
                Proxy-Lite AI Assistant
              </h3>
              <div style={{
                backgroundColor: COLORS.success,
                color: 'white',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                boxShadow: `0 2px 6px rgba(${parseInt(COLORS.success.slice(1, 3), 16)}, ${parseInt(COLORS.success.slice(3, 5), 16)}, ${parseInt(COLORS.success.slice(5, 7), 16)}, 0.3)`,
                letterSpacing: '0.05em'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  marginRight: '5px',
                  boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
                  animation: 'pulse 1.5s infinite'
                }}></span>
                LIVE
              </div>
            </div>
            
            {/* Actual video container styled as a chat window */}
            <div style={{ 
              flex: 1,
              backgroundColor: 'rgba(24, 24, 24, 0.7)',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.05) inset',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              {/* Fake chat header */}
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: COLORS.text,
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  <div style={{ 
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>AI</div>
                  Vulnerability Analysis Session
                </div>
                <div style={{ 
                  color: chatLoaded ? COLORS.success : COLORS.warning, 
                  fontWeight: 'bold', 
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  animation: chatLoaded ? undefined : 'blink 1.5s infinite'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    backgroundColor: chatLoaded ? COLORS.success : COLORS.warning,
                    borderRadius: '50%',
                    marginRight: '5px'
                  }}></span>
                  {chatLoaded ? 'Processing' : 'Connecting...'}
                </div>
              </div>
              
              {/* Loading spinner that shows until video loads */}
              {!chatLoaded && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  zIndex: 2,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '20px 30px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 15px auto'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: `2px solid rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.2)`,
                      borderTopColor: COLORS.primary,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      right: '8px',
                      bottom: '8px',
                      border: `2px solid rgba(${parseInt(COLORS.secondary.slice(1, 3), 16)}, ${parseInt(COLORS.secondary.slice(3, 5), 16)}, ${parseInt(COLORS.secondary.slice(5, 7), 16)}, 0.2)`,
                      borderTopColor: COLORS.secondary,
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite reverse'
                    }}></div>
                  </div>
                  <div style={{ color: COLORS.text, fontSize: '0.9rem', fontWeight: 500 }}>
                    Initializing proxy-lite model...
                  </div>
                  <div style={{ 
                    color: COLORS.textDark, 
                    fontSize: '0.75rem', 
                    marginTop: '8px',
                    opacity: 0.7
                  }}>
                    Loading language model capabilities
                  </div>
                </div>
              )}
              
              {/* Video with chat interface styling */}
              <video
                ref={chatVideoRef}
                autoPlay
                muted
                loop={false}
                playsInline
                disablePictureInPicture
                onLoadedData={() => setChatLoaded(true)}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: chatLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  backgroundColor: 'rgba(0,0,0,0.3)'
                }}
                preload="auto"
              >
                <source src="/videos/Chat.mp4" type="video/mp4" />
                Your browser does not support the video element.
              </video>
              
              {/* Overlay for interaction effect */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '0',
                right: '0',
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
                padding: '0 15px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  width: '90%',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: COLORS.textDark,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>AI is analyzing vulnerability...</span>
                  <span style={{ 
                    width: '16px', 
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.darkGray,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '10px'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.secondary,
                      opacity: 0.7,
                      animation: 'pulse 1.5s infinite'
                    }}></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Flow visualization */}
          <div style={{
            width: '50%',
            height: '100%',
            paddingLeft: '10px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{ 
                margin: 0,
                color: COLORS.text,
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.01em'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.danger,
                  marginRight: '8px',
                  animation: 'pulse 2s infinite'
                }}></span>
                Live Vulnerability Simulation
              </h3>
              <div style={{
                backgroundColor: COLORS.danger,
                color: 'white',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                boxShadow: `0 2px 6px rgba(${parseInt(COLORS.danger.slice(1, 3), 16)}, ${parseInt(COLORS.danger.slice(3, 5), 16)}, ${parseInt(COLORS.danger.slice(5, 7), 16)}, 0.3)`,
                letterSpacing: '0.05em'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  marginRight: '5px',
                  animation: 'blink 1s infinite'
                }}></span>
                RECORDING
              </div>
            </div>
            
            {/* Browser-like container for flow visualization */}
            <div style={{ 
              flex: 1,
              backgroundColor: 'rgba(24, 24, 24, 0.7)',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.05) inset',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {/* Fake browser header */}
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* Browser controls */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    backgroundColor: COLORS.danger, 
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                  }}></div>
                  <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    backgroundColor: COLORS.warning, 
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                  }}></div>
                  <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    backgroundColor: COLORS.success, 
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                  }}></div>
                </div>
                
                {/* Address bar */}
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  color: COLORS.textDark,
                  flexGrow: 1,
                  border: '1px solid rgba(255,255,255,0.05)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'monospace',
                  letterSpacing: '-0.02em'
                }}>
                  <span style={{ 
                    color: COLORS.success,
                    marginRight: '6px',
                    fontSize: '1rem'
                  }}>⚡</span>
                  <span>{flowLoaded ? 'http://juice-shop:3000/' : 'Loading...'}</span>
                </div>
                
                {/* Fake browser action buttons */}
                <div style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px', 
                  padding: '3px',
                  display: 'flex',
                  gap: '3px'
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '3px',
                    color: COLORS.textDark,
                    fontSize: '14px'
                  }}>↺</div>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '3px',
                    color: COLORS.textDark,
                    fontSize: '14px'
                  }}>⋯</div>
                </div>
              </div>
              
              {/* Loading spinner that shows until video loads */}
              {!flowLoaded && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  zIndex: 2,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '20px 30px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 15px auto'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: `2px solid rgba(${parseInt(COLORS.danger.slice(1, 3), 16)}, ${parseInt(COLORS.danger.slice(3, 5), 16)}, ${parseInt(COLORS.danger.slice(5, 7), 16)}, 0.2)`,
                      borderTopColor: COLORS.danger,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      right: '8px',
                      bottom: '8px',
                      border: `2px solid rgba(${parseInt(COLORS.warning.slice(1, 3), 16)}, ${parseInt(COLORS.warning.slice(3, 5), 16)}, ${parseInt(COLORS.warning.slice(5, 7), 16)}, 0.2)`,
                      borderTopColor: COLORS.warning,
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite reverse'
                    }}></div>
                  </div>
                  <div style={{ color: COLORS.text, fontSize: '0.9rem', fontWeight: 500 }}>
                    Connecting to target application...
                  </div>
                  <div style={{ 
                    color: COLORS.textDark, 
                    fontSize: '0.75rem', 
                    marginTop: '8px',
                    opacity: 0.7
                  }}>
                    Establishing secure connection
                  </div>
                </div>
              )}
              
              {/* Video styled as website content */}
              <div style={{
                width: '100%',
                height: 'calc(100% - 46px)',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <video
                  ref={flowVideoRef}
                  autoPlay
                  muted
                  loop={false}
                  playsInline
                  disablePictureInPicture
                  onLoadedData={() => setFlowLoaded(true)}
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    opacity: flowLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    backgroundColor: 'black'
                  }}
                  preload="auto"
                >
                  <source src="/videos/Flow.mp4" type="video/mp4" />
                  Your browser does not support the video element.
                </video>
                
                {/* Scanner overlay effect */}
                {flowLoaded && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-100%',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: `linear-gradient(90deg, transparent 0%, ${COLORS.danger} 50%, transparent 100%)`,
                      animation: 'scanLine 3s linear infinite',
                      boxShadow: `0 0 8px ${COLORS.danger}`
                    }}></div>
                  </div>
                )}
              </div>
            </div>
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
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes blink {
              0% { opacity: 0.4; }
              50% { opacity: 1; }
              100% { opacity: 0.4; }
            }
            
            @keyframes scanLine {
              0% { transform: translateY(0); }
              100% { transform: translateY(2000%); }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Popup;