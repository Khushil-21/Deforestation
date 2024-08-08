import React, { useState, useEffect } from 'react';
import MainComponent from './components/MainComponent';
import EntryComponent from './components/EntryComponent';

function App() {
  const [showMainComponent, setShowMainComponent] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        setShowMainComponent(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <>
      {showMainComponent ? <MainComponent /> : <EntryComponent />}
    </>
  );
}

export default App;