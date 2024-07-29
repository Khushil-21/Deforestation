import React, { useState } from "react";

export default function ActionBar({
	locationName,
	clickedLocation,
	setSelectedYear,
	selectedYear,
	onSearch,
}) {
	const years = ["1990", "2010", "2020"];

	return (
		<div className="w-full flex justify-center items-center">
			<div className="max-w-[80vw] min-w-[60vw] flex gap-4">
				<div className="p-4 bg-white rounded-xl shadow-lg w-[20%]">
					<span className="font-semibold">Lat : </span>
					{clickedLocation.lat.toFixed(4)}
				</div>
				<div className="p-4 bg-white rounded-xl shadow-lg w-[20%]">
					<span className="font-semibold">Lng : </span>
					{clickedLocation.lng.toFixed(4)}
				</div>
				<div className="p-4 bg-white rounded-xl shadow-lg w-[40%] ">
					<div className="line-clamp-1">
						<span className="font-semibold">Location : </span>
						{locationName}
					</div>
				</div>
				<div className="p-4 bg-white rounded-xl shadow-lg w-[20%]">
					<select
						value={selectedYear}
						onChange={(e) => setSelectedYear(e.target.value)}
						className="w-full bg-white rounded-xl border-none focus:outline-none"
					>
						{years.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>
				<div 
					className="p-4 active:scale-95 cursor-pointer flex justify-center items-center text-xl font-semibold bg-blue-500 text-white rounded-xl shadow-lg w-[20%]"
					onClick={onSearch}
				>
					Search
				</div>
			</div>
		</div>
	);
}
