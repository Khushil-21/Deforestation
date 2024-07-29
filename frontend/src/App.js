import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
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
  height: '80vh'
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
  const [box, setBox] = useState([]);

  const handleMapClick = async (event) => {
    let { lat, lng } = event.latlng;
    setClickedLocation({ lat, lng });
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    lat = lat.toFixed(4) - 0;
    lng = lng.toFixed(4) - 0;
    const newBox = [
      (lat + 0.05).toFixed(4),
      (lng - 0.08).toFixed(4),
      (lat - 0.05).toFixed(4),
      (lng + 0.08).toFixed(4)
    ].map(Number);
    setBox(newBox);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      setLocationName(data.display_name || 'Unknown location');
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Unable to fetch location name');
    }
  };

  return (
    <div className="App">
      <MapContainer center={center} zoom={2} style={mapContainerStyle} maxBounds={[[-90, -180], [90, 180]]} minZoom={2}>
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
      {clickedLocation && (
        <div>
          <p>
            Clicked Location: Latitude: {clickedLocation.lat.toFixed(6)},
            Longitude: {clickedLocation.lng.toFixed(6)}
          </p>
          <p>Location Name: {locationName}</p>
          <p>{JSON.stringify(box)}</p>
        </div>
      )}
    </div>
  );
}

export default App;