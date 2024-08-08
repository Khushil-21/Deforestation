import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import MapComponent from "./MapComponent";
import ResponseComponent from "./ResponseComponent";
import ActionBar from "./ActionBar";
import ReportPopup from "./ReportPopup";
import ChatComponent from "./ChatComponent";

const initialMapContainerStyle = {
	width: "60vw",
	height: "85vh",
};

const selectedMapContainerStyle = {
	width: "45vw",
	height: "70vh",
};

function MainComponent() {
	const [clickedLocation, setClickedLocation] = useState(null);
	const [locationName, setLocationName] = useState("");
	const [box, setBox] = useState([]);
	const [mapContainerStyle, setMapContainerStyle] = useState(
		initialMapContainerStyle
	);
	const [isLoading, setIsLoading] = useState("ideal");
	const [historyData, setHistoryData] = useState(null);
	const [boundingBox, setBoundingBox] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [report, setReport] = useState("");
	const [entireData, setEntireData] = useState(null);

	useEffect(() => {
		if (clickedLocation) {
			setMapContainerStyle(selectedMapContainerStyle);
		} else {
			setMapContainerStyle(initialMapContainerStyle);
		}
	}, [clickedLocation]);

	const updateLocationName = async (lat, lng) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
			);
			const data = await response.json();
			setLocationName(
				[
					data.address.country,
					data.address.state,
					data.address.state_district && data.address.state_district.length > 12
						? data.address.town
						: data.address.state_district,
				]
					.filter(Boolean)
					.join(" ") || "Unknown location"
			);
		} catch (error) {
			console.error("Error fetching location name:", error);
			setLocationName("Unable to fetch location name");
		}
	};

	const handleMapClick = async (event) => {
		let { lat, lng } = event.latlng;
		setClickedLocation({
			lat: Number(lat.toFixed(4)),
			lng: Number(lng.toFixed(4)),
		});
		console.log(`Latitude: ${lat}, Longitude: ${lng}`);
		lat = lat.toFixed(4) - 0;
		lng = lng.toFixed(4) - 0;
		const newBox = [
			(lng - 0.2).toFixed(4),
			(lat - 0.2).toFixed(4),
			(lng + 0.2).toFixed(4),
			(lat + 0.2).toFixed(4),
		].map(Number);
		setBox(newBox);
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
			);
			const data = await response.json();
			console.log("data: ", data);
			setBoundingBox(data.boundingbox);
			setLocationName(
				[
					data.address.country,
					data.address.state,
					data.address.state_district && data.address.state_district.length > 12
						? data.address.town
						: data.address.state_district,
				]
					.filter(Boolean)
					.join(" ") || "Unknown location"
			);
		} catch (error) {
			console.error("Error fetching location name:", error);
			setLocationName("Unable to fetch location name");
		}
		await updateLocationName(lat, lng);
	};

	const handleSearch = async () => {
		setIsLoading("loading");
		try {
			console.log(box, boundingBox);
			setHistoryData(null);
			axios
				.post("http://localhost:5000/api/get/history", {
					bbox: box,
					platform: "Production",
				})
				.then((data) => {
					console.log(data);
					setEntireData(data.data);
					setHistoryData(data.data.received_data);
					setIsLoading(false);
				})
				.catch((err) => {
					setIsLoading(false);
					console.log(err);
				});
		} catch (error) {
			console.log("Error fetching history data:", error);
			setHistoryData(null);
		}
	};

	const handleViewReport = () => {
		setShowModal(true);
	};

	const handleCloseModal = (e) => {
		if (e.target.classList.contains("modal-overlay")) {
			setShowModal(false);
		}
	};

	return (
		<div
			className={`App bg-blue-50 p-9 gap-5 flex flex-col items-center w-full h-screen`}
		>
			<AnimatePresence>
				{!clickedLocation && (
					<motion.h1
						className="text-4xl font-bold"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						Select a location on the map
					</motion.h1>
				)}
			</AnimatePresence>
			<div
				className={`flex items-center ${
					clickedLocation ? "justify-between" : "justify-center"
				} w-full h-full`}
			>
				<motion.div
					layout
					initial={initialMapContainerStyle}
					animate={mapContainerStyle}
					transition={{ duration: 0.4, ease: "easeInOut" }}
					className="w-full h-full flex flex-col items-center justify-center gap-10"
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
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							transition={{ duration: 0.6, ease: "easeInOut" }}
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
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className="w-full"
					>
						<ActionBar
							locationName={locationName}
							clickedLocation={clickedLocation}
							setClickedLocation={setClickedLocation}
							onSearch={handleSearch}
							isLoading={isLoading}
							updateLocationName={updateLocationName}
						/>
					</motion.div>
				)}
				{showModal && (
					<ReportPopup
						entireData={entireData}
						handleCloseModal={handleCloseModal}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}

export default MainComponent;
