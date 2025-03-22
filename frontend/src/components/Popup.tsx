import React, { useEffect, useState, useRef } from 'react';

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
    <div 
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 300ms',
        width: '90%',
        height: '90%',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        borderRadius: '8px',
      }}
    >
      {/* Header with risk title and ID */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
            marginRight: '10px',
            boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)',
            animation: 'pulse 1.5s infinite'
          }}></div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
            {title} {id && <span style={{ fontSize: '18px', color: '#666' }}>#{id}</span>}
          </h2>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '8px',
          }}
        >
          &times;
        </button>
      </div>
      
      {/* Main content area */}
      <div style={{
        display: 'flex',
        height: 'calc(100% - 60px)',
        padding: '20px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: '#f0f4f8',
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
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: 0 }}>Proxy-Lite AI Assistant</h3>
            <div style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
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
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}>
            {/* Fake chat header */}
            <div style={{
              padding: '10px 15px',
              backgroundColor: '#f8f8f8',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>Vulnerability Simulation</div>
              <div style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '12px' }}>
                {chatLoaded ? 'Processing...' : 'Connecting...'}
              </div>
            </div>
            
            {/* Loading spinner that shows until video loads */}
            {!chatLoaded && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  border: '4px solid rgba(0, 0, 0, 0.1)',
                  borderLeft: '4px solid #4CAF50',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 10px auto'
                }}></div>
                <div>Initializing proxy-lite model...</div>
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
                borderRadius: '0 0 8px 8px',
                opacity: chatLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease'
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
              pointerEvents: 'none'
            }}>
              <div style={{
                backgroundColor: '#f8f8f8',
                borderRadius: '20px',
                padding: '8px 15px',
                width: '90%',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                border: '1px solid #eee',
                color: '#aaa',
                fontSize: '14px'
              }}>
                AI is analyzing vulnerability...
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
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: 0 }}>Live Vulnerability Simulation</h3>
            <div style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
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
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}>
            {/* Fake browser header */}
            <div style={{
              padding: '10px 15px',
              backgroundColor: '#f0f0f0',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {/* Browser controls */}
              <div style={{ display: 'flex', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ff5f57', borderRadius: '50%' }}></div>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ffbd2e', borderRadius: '50%' }}></div>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#28c940', borderRadius: '50%' }}></div>
              </div>
              
              {/* Address bar */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '4px',
                padding: '5px 10px',
                fontSize: '12px',
                color: '#333',
                flexGrow: 1,
                marginLeft: '10px',
                border: '1px solid #ddd',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}>
                {flowLoaded ? 'http://juice-shop:3000/' : 'Loading...'}
              </div>
            </div>
            
            {/* Loading spinner that shows until video loads */}
            {!flowLoaded && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  border: '4px solid rgba(0, 0, 0, 0.1)',
                  borderLeft: '4px solid #4CAF50',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 10px auto'
                }}></div>
                <div>Connecting to target application...</div>
              </div>
            )}
            
            {/* Video styled as website content - FIXED STRETCHING */}
            <div style={{
              width: '100%',
              height: 'calc(100% - 40px)',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
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
                  objectFit: 'contain', // Changed from 'cover' to 'contain'
                  opacity: flowLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease'
                }}
                preload="auto"
              >
                <source src="/videos/Flow.mp4" type="video/mp4" />
                Your browser does not support the video element.
              </video>
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
        `}
      </style>
    </div>
  );
};

export default Popup;