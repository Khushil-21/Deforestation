import React, { useState, useEffect, useRef } from "react";

export default function ActionBar({
	locationName,
	clickedLocation,
	setClickedLocation,
	onSearch,
	isLoading,
	updateLocationName,
}) {
	const [editingLat, setEditingLat] = useState(false);
	const [editingLng, setEditingLng] = useState(false);
	const [tempLat, setTempLat] = useState(clickedLocation.lat.toFixed(4));
	const [tempLng, setTempLng] = useState(clickedLocation.lng.toFixed(4));
	const latInputRef = useRef(null);
	const lngInputRef = useRef(null);

	useEffect(() => {
		if (editingLat) {
			latInputRef.current.focus();
			latInputRef.current.select();
		}
		if (editingLng) {
			lngInputRef.current.focus();
			lngInputRef.current.select();
		}
	}, [editingLat, editingLng]);

	const handleLatChange = (e) => {
		const value = e.target.value;
		setTempLat(value);
		if (value === "" || (!isNaN(parseFloat(value)) && isFinite(value))) {
			updateCoordinates(value, tempLng);
		}
	};

	const handleLngChange = (e) => {
		const value = e.target.value;
		setTempLng(value);
		if (value === "" || (!isNaN(parseFloat(value)) && isFinite(value))) {
			updateCoordinates(tempLat, value);
		}
	};

	const updateCoordinates = (lat, lng) => {
		const newLat = parseFloat(lat);
		const newLng = parseFloat(lng);
		if (
			!isNaN(newLat) &&
			!isNaN(newLng) &&
			newLat >= -90 &&
			newLat <= 90 &&
			newLng >= -180 &&
			newLng <= 180
		) {
			setClickedLocation({ lat: newLat, lng: newLng });
		}
	};

	useEffect(() => {
		if (clickedLocation) {
			updateLocationName(clickedLocation.lat, clickedLocation.lng);
		}
	}, [clickedLocation, tempLat, tempLng]);

	const handleLatBlur = () => {
		setEditingLat(false);
		updateCoordinates(tempLat, tempLng);
	};

	const handleLngBlur = () => {
		setEditingLng(false);
		updateCoordinates(tempLat, tempLng);
	};

	return (
		<div className="w-full flex justify-center items-center">
			<div className="max-w-[80vw] min-w-[60vw] flex gap-4">
				<div className="p-4 bg-white rounded-xl shadow-lg w-[20%]">
					<span className="font-semibold">Lat : </span>
					{editingLat ? (
						<input
							ref={latInputRef}
							type="text"
							value={tempLat}
							onChange={handleLatChange}
							onBlur={handleLatBlur}
							className="w-20 border rounded"
						/>
					) : (
						<span
							onClick={() => setEditingLat(true)}
							className="cursor-pointer"
						>
							{clickedLocation.lat.toFixed(4)}
						</span>
					)}
				</div>
				<div className="p-4 bg-white rounded-xl shadow-lg w-[20%]">
					<span className="font-semibold">Lng : </span>
					{editingLng ? (
						<input
							ref={lngInputRef}
							type="text"
							value={tempLng}
							onChange={handleLngChange}
							onBlur={handleLngBlur}
							className="w-20 border rounded"
						/>
					) : (
						<span
							onClick={() => setEditingLng(true)}
							className="cursor-pointer"
						>
							{clickedLocation.lng.toFixed(4)}
						</span>
					)}
				</div>
				<div className="p-4 bg-white rounded-xl shadow-lg w-[40%] ">
					<div className="line-clamp-1">
						<span className="font-semibold">Location : </span>
						{locationName}
					</div>
				</div>

				<div
					className="p-4 active:scale-95 cursor-pointer flex justify-center items-center text-xl font-semibold bg-blue-500 text-white rounded-xl shadow-lg w-[20%]"
					onClick={onSearch}
				>
					{isLoading === "loading" ? (
						<div className="w-8 h-8">
							<svg
								className="w-8 h-8 text-white animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
					) : (
						"Search"
					)}
				</div>
			</div>
		</div>
	);
}
