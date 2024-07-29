import React from "react";

export default function Details({ isLoading = false }) {
	const data = {
		year: 2000,
		"forest Area(%)": 0.3857756120199559,
		"land_Area(%)": 99.61422438798004,
		img_url:
			"http://res.cloudinary.com/dzqf5owza/image/upload/v1722279993/nfbeqzm9fw6zun7e4gwa.png",
	};
	return (
		<div className="w-[45vw] h-[70vh] rounded-xl shadow-lg ">
			{isLoading ? (
				<div className="w-full rounded-xl h-full border-dashed border-2 border-blue-500 bg-blue-200 flex justify-center items-center">
					<span className="text-xl font-semibold text-blue-500">
						You Will See History Here
					</span>
				</div>
			) : (
				<div className="w-full h-full rounded-xl flex flex-col">
					<img
						src={data.img_url}
						alt="forest"
						className="flex-grow rounded-xl"
					/>
					<div className="h-20 flex justify-center items-center gap-10 rounded-xl overflow-hidden">
						<div className="p-4 rounded-xl bg-green-100 border border-green-500 text-green-500 font-semibold">
							Year : {data.year}
						</div>
						<div className="p-4 rounded-xl bg-green-100 border border-green-500 text-green-500 font-semibold">
							forest area {data["forest Area(%)"].toFixed(3)}%
						</div>
						<div className="p-4 rounded-xl bg-yellow-600/20 border border-yellow-600 text-yellow-600 font-semibold">
							land area {data["land_Area(%)"].toFixed(3)}%
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
