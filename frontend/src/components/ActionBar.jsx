import React, { useState } from "react";

export default function ActionBar({
	locationName,
	clickedLocation,
	setSelectedYear,
	selectedYear,
	onSearch,
	isLoading,
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
				{/* <div className="p-4 bg-white rounded-xl shadow-lg w-[20%]">
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
				</div> */}
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
