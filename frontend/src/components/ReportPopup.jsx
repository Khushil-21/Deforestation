import axios from "axios";
import React, { useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";

export default function ReportPopup({ handleCloseModal, entireData }) {
	const [isLoading, setIsLoading] = useState(false);
	const [report, setReport] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			console.log(entireData)
			try {
				const response = await axios.post(
					"http://localhost:5000/getBot",
					entireData
				);
				setReport(HTMLReactParser(response.data.report));
				console.log("response.data.report: ", response.data.report);
			} catch (error) {
				console.log("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [entireData]);

	return (
		<div
			className="fixed z-[999999] inset-0 bg-black bg-opacity-50 flex justify-center items-center modal-overlay"
			onClick={handleCloseModal}
		>
			<div className="bg-white w-[800px] h-[600px] rounded-md p-6 overflow-y-auto">
				{isLoading ? (
					<div className="h-full flex items-center justify-center">
						<p className="text-xl font-semibold text-gray-700">
							Generating Report...
						</p>
					</div>
				) : (
					<div>{report}</div>
				)}
			</div>
		</div>
	);
}
