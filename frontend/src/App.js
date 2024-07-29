import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import ActionBar from './ActionBar';
import Details from './Details';
import axios from 'axios';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const initialMapContainerStyle = {
  width: '60vw',
  height: '90vh'
};

const selectedMapContainerStyle = {
  width: '45vw',
  height: '70vh'
};

const center = [0, 0];

function MapEvents({ onClick }) {
  useMapEvents({
    click: (e) => onClick(e),
  });
  return null;
}

function App() {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [selectedYear, setSelectedYear] = useState("1990");
  const [box, setBox] = useState([]);
  const [mapContainerStyle, setMapContainerStyle] = useState(initialMapContainerStyle);
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState(null);

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
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/get/history/${selectedYear}`, { bbox: box });
      setHistoryData(response.data);
    } catch (error) {
      console.error('Error fetching history data:', error);
    } finally {
      setIsLoading(false);
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
          <MapContainer
            className='border-none outline-none focus:outline-none focus:border-none rounded-xl overflow-hidden shadow-lg'
            center={center}
            zoom={2}
            style={{ width: '100%', height: '100%' }}
            maxBounds={[[-90, -180], [90, 180]]}
            minZoom={2}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  noWrap={true}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  noWrap={true}
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <MapEvents onClick={handleMapClick} />
            {clickedLocation && <Marker position={[clickedLocation.lat, clickedLocation.lng]} />}
          </MapContainer>
        </motion.div>
        <AnimatePresence>
          {clickedLocation && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Details isLoading={isLoading} historyData={historyData} />
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
      </AnimatePresence>
    </div>
  );
}

export default App;