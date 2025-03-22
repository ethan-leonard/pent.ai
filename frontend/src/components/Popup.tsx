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
        overflow: 'hidden' // Prevent content from overflowing
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
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
          {title} {id && <span style={{ fontSize: '18px', color: '#666' }}>#{id}</span>}
        </h2>
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
        overflow: 'hidden', // Prevent overflow
        boxSizing: 'border-box'
      }}>
        {/* Left side - Chat Recording (70% height but aligned at bottom) */}
        <div style={{
          width: '50%',
          height: '100%',
          paddingRight: '10px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Convergence: Proxy-Lite</h3>
          
          {/* Empty space to push content down (30% of height) */}
          <div style={{ flex: '0.3' }}></div>
          
          {/* Actual video container (70% of height) */}
          <div style={{ 
            flex: '0.7',
            backgroundColor: '#ffffff', 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <video
              ref={chatVideoRef}
              autoPlay
              muted
              loop={false}
              playsInline
              disablePictureInPicture
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%', 
                objectFit: 'contain'
              }}
              preload="auto"
              // Remove controls attribute to hide player controls
            >
              <source src="/videos/Chat.mp4" type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        </div>
        
        {/* Right side - Flow Recording (full height) */}
        <div style={{
          width: '50%',
          height: '100%',
          paddingLeft: '10px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Live</h3>
          <div style={{ 
            flex: 1,
            backgroundColor: '#ffffff', 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <video
              ref={flowVideoRef}
              autoPlay
              muted
              loop={false}
              playsInline
              disablePictureInPicture
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              preload="auto"
              // Remove controls attribute to hide player controls
            >
              <source src="/videos/Flow.mp4" type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;