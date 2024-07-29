import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const mapContainerStyle = {
  width: '100%',
  height: '400px'
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

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setClickedLocation({ lat, lng });
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  return (
    <div className="App">
      <MapContainer center={center} zoom={2} style={mapContainerStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onClick={handleMapClick} />
        {clickedLocation && <Marker position={[clickedLocation.lat, clickedLocation.lng]} />}
      </MapContainer>
      {clickedLocation && (
        <p>
          Clicked Location: Latitude: {clickedLocation.lat.toFixed(6)}, 
          Longitude: {clickedLocation.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}

export default App;