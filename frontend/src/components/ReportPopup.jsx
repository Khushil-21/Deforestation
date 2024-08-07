import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ReportPopup({ handleCloseModal }) {
	const [isLoading, setIsLoading] = useState(false);
	const [report, setReport] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get("http://localhost:5000/getBot");
				setReport(response.data.report);
				console.log("response.data.report: ", response.data.report);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const formatReport = (text) => {
		const lines = text.split("\n");
		return lines.map((line, index) => {
			if (line.startsWith("**") && line.endsWith("**")) {
				return (
					<p key={index} className="font-bold">
						{line.slice(2, -2)}
					</p>
				);
			} else if (/^\d+\.\s/.test(line)) {
				return (
					<li key={index} className="list-decimal ml-4">
						{line}
					</li>
				);
			} else if (line.startsWith("* ")) {
				return (
					<li key={index} className="list-disc ml-4">
						{line.slice(2)}
					</li>
				);
			} else {
				return <p key={index}>{line}</p>;
			}
		});
	};

	return (
		<div
			className="fixed z-[999999] inset-0 bg-black bg-opacity-50 flex justify-center items-center modal-overlay"
			onClick={handleCloseModal}
		>
			<div className="bg-white w-[800px] h-[600px] rounded-md p-6 overflow-y-auto">
				{isLoading ? (
					<div className="h-full flex items-center justify-center">
						Generating Report...
					</div>
				) : (
					<div dangerouslySetInnerHTML={{ __html: report }}></div>
				)}
			</div>
		</div>
	);
}
