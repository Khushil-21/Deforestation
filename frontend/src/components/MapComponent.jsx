import React, { useState, useEffect } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const center = [0, 0];

function MapEvents({ onClick }) {
	useMapEvents({
		click: (e) => onClick(e),
	});
	return null;
}

function MapComponent({ clickedLocation, handleMapClick, mapContainerStyle }) {
	return (
		<MapContainer
			className="border-none outline-none focus:outline-none focus:border-none rounded-xl overflow-hidden shadow-lg"
			center={center}
			zoom={2}
			style={{ width: "100%", height: "100%" }}
			maxBounds={[
				[-90, -180],
				[90, 180],
			]}
			minZoom={2}
		>
			<LayersControl position="topright">
				<LayersControl.BaseLayer checked name="Satellite">
					<TileLayer
						url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
						noWrap={true}
					/>
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name="OpenStreetMap">
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						noWrap={true}
					/>
				</LayersControl.BaseLayer>
			</LayersControl>
			<MapEvents onClick={handleMapClick} />
			{clickedLocation && (
				<Marker position={[clickedLocation.lat, clickedLocation.lng]} />
			)}
		</MapContainer>
	);
}

export default MapComponent;
