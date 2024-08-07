import React, { useState, useEffect } from 'react';
import ChatComponent from './ChatComponent';

function ResponseComponent({ isLoading, historyData, handleViewReport, setReport, setShowModal }) {
  const [selectedYear, setSelectedYear] = useState(2019);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (historyData) {
      const yearData = historyData.find((item) => item.year === selectedYear);
      setSelectedData(yearData);
    }
  }, [historyData, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <div className="w-[45vw] h-[70vh] rounded-xl shadow-lg ">
      {isLoading === "ideal" || isLoading === "loading" ? (
        <div
          className={`w-full ${
            isLoading === "loading" ? "animate-pulse" : ""
          } rounded-xl h-full border-dashed border-2 border-blue-500 bg-blue-200 flex justify-center items-center`}
        >
          <span className="text-xl font-semibold text-blue-500">
            {isLoading === "loading" ? (
              <svg
                className="w-12 h-12 text-blue-500 animate-spin"
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
            ) : (
              "You Will See History Here"
            )}
          </span>
        </div>
      ) : (
        <div className="w-full h-full rounded-xl flex flex-col">
          <img
            src={selectedData?.img_url}
            alt="forest"
            className="flex-grow rounded-xl"
          />
          <div className="h-20 flex justify-center items-center gap-10 rounded-xl overflow-hidden">
            <div className="p-4 bg-white rounded-xl shadow-lg">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full bg-white rounded-xl border-none focus:outline-none"
              >
                {historyData &&
                  historyData.map((item) => (
                    <option key={item.year} value={item.year}>
                      {item.year}
                    </option>
                  ))}
              </select>
            </div>
            <div className="px-2 py-2 rounded-xl bg-green-100 border border-green-500 text-green-500 font-semibold">
              forest area {selectedData?.["forest Area(%)"]?.toFixed(3)}%
            </div>
            <div className="px-2 py-2  rounded-xl bg-yellow-600/20 border border-yellow-600 text-yellow-600 font-semibold">
              land area {selectedData?.["land_Area(%)"]?.toFixed(3)}%
            </div>
            <div
              className="px-2 py-2  rounded-xl cursor-pointer bg-blue-600/20 border border-blue-600 text-blue-600 font-semibold"
              onClick={handleViewReport}
            >
              Generate Report
            </div>
          </div>
      <div>
				<ChatComponent/>
			</div>	
        </div>
      )}
    </div>
  );
}

export default ResponseComponent;