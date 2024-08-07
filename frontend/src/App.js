import React, { useState, useEffect } from 'react';
import MainComponent from './Components/MainComponent';
import EntryComponent from './Components/EntryComponent';

function App() {
  const [showMainComponent, setShowMainComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMainComponent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showMainComponent ? <MainComponent/> : <EntryComponent />}
    </>
  );
}

export default App;