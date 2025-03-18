//// filepath: frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    // Fetch the hello message from the Django API
    axios.get('http://127.0.0.1:8000/api/hello/')
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        console.error(err);
        setMessage('Error fetching data.');
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>React Frontend</h1>
      <p>{message}</p>
    </div>
  );
};

export default App;