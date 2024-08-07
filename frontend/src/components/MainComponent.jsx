import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import MapComponent from './MapComponent';
import ResponseComponent from './ResponseComponent';
import ActionBar from './ActionBar';

const initialMapContainerStyle = {
  width: '60vw',
  height: '90vh'
};

const selectedMapContainerStyle = {
  width: '45vw',
  height: '70vh'
};

function MainComponent() {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [selectedYear, setSelectedYear] = useState("1990");
  const [box, setBox] = useState([]);
  const [mapContainerStyle, setMapContainerStyle] = useState(initialMapContainerStyle);
  const [isLoading, setIsLoading] = useState("ideal");
  const [historyData, setHistoryData] = useState(null);
  const [boundingBox, setBoundingBox] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState("");

  useEffect(() => {
    if (clickedLocation) {
      setMapContainerStyle(selectedMapContainerStyle);
    } else {
      setMapContainerStyle(initialMapContainerStyle);
    }
  }, [clickedLocation]);

  const handleMapClick = async (event) => {
    let { lat, lng } = event.latlng;
    setClickedLocation({ lat, lng });
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    lat = lat.toFixed(4) - 0;
    lng = lng.toFixed(4) - 0;
    const newBox = [
      (lng - 0.2991).toFixed(4),
      (lat + 0.0059).toFixed(4),
      (lng + 0.2991).toFixed(4),
      (lat - 0.0059).toFixed(4),
    ].map(Number);
    setBox(newBox);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      console.log("data: ", data);
      setBoundingBox(data.boundingbox);
      setLocationName(
        [
          data.address.country,
          data.address.state,
          data.address.state_district && data.address.state_district.length > 12
            ? data.address.town
            : data.address.state_district
        ].filter(Boolean).join(" ") || 'Unknown location'
      );
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Unable to fetch location name');
    }
  };

  const handleSearch = async () => {
    setIsLoading("loading");
    try {
      console.log(box, boundingBox);
      axios.post("http://localhost:5000/api/get/history", {
        "bbox": box
      }).then((data) => {
        console.log(data);
        setHistoryData(data.data.received_data);
        setIsLoading(false);
      }).catch((err) => {
        setIsLoading(false);
        console.log(err);
      })
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  const handleViewReport = () => {
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setShowModal(false);
    }
  };

  return (
    <div className={`App bg-blue-50 p-9 flex flex-col items-center w-full h-screen`}>
      <div className={`flex items-center ${clickedLocation ? 'justify-between' : 'justify-center'} w-full h-full`}>
        <motion.div
          layout
          initial={initialMapContainerStyle}
          animate={mapContainerStyle}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <MapComponent
            clickedLocation={clickedLocation}
            handleMapClick={handleMapClick}
            mapContainerStyle={mapContainerStyle}
          />
        </motion.div>
        <AnimatePresence>
          {clickedLocation && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ResponseComponent
                isLoading={isLoading}
                historyData={historyData}
                handleViewReport={handleViewReport}
                setReport={setReport}
                setShowModal={setShowModal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {clickedLocation && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full"
          >
            <ActionBar
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              locationName={locationName}
              clickedLocation={clickedLocation}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </motion.div>
        )}
        {showModal && (
          <div
            className="fixed z-[999999] inset-0 bg-black bg-opacity-50 flex justify-center items-center modal-overlay"
            onClick={handleCloseModal}
          >
            {/* Modal content */}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainComponent;