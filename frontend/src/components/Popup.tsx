import React, { useEffect, useState } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  id?: string;
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, id, children }) => {
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
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 300ms',
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
      
      {/* Video container */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 'calc(100% - 60px)',
        padding: '20px',
      }}>
        {/* Lower left - chat.mp3 */}
        <div style={{
          width: '50%',
          height: '100%',
          padding: '10px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Chat Recording</h3>
          <div style={{ 
            flex: 1,
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <audio
              controls
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <source src="/videos/chat.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
        
        {/* Right - flow.mp3 */}
        <div style={{
          width: '50%',
          height: '100%',
          padding: '10px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Flow Recording</h3>
          <div style={{ 
            flex: 1,
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <audio
              controls
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <source src="/videos/flow.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;