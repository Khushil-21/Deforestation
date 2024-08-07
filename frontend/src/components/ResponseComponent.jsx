import React from 'react';
import Details from './Details';

function ResponseComponent({ isLoading, historyData, handleViewReport, setReport, setShowModal }) {
  return (
    <Details
      isLoading={isLoading}
      data={historyData}
      handleViewReport={handleViewReport}
      setReport={setReport}
      setShowModal={setShowModal}
    />
  );
}

export default ResponseComponent;