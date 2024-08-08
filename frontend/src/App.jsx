import React, { useState, useEffect } from 'react';
import MainComponent from './components/MainComponent';
import EntryComponent from './components/EntryComponent';

function App() {
  const [showMainComponent, setShowMainComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMainComponent(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showMainComponent ? <MainComponent/> : <EntryComponent />}
    </>
  );
}

export default App;