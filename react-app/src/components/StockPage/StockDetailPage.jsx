// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function StockDetailPage() {
//   const { stockId } = useParams();
//   const [allRecords, setAllRecords] = useState(() => {
//     // Load from localStorage on initial render
//     const storedRecords = localStorage.getItem("stockData");
//     return storedRecords ? JSON.parse(storedRecords) : {};
//   });
//   const [stockData, setStockData] = useState(null);

//   useEffect(() => {
//     // const socket = io("http://localhost:8000");
//     const socket = io("https://the-wolf-of-wall-street-simulator.onrender.com");

//     socket.on("stock_update", (updatedStocks) => {
//       setAllRecords((prevRecords) => {
//         const newRecords = { ...prevRecords };

//         updatedStocks.stocks.forEach((stock) => {
//           if (!newRecords[stock.id]) {
//             newRecords[stock.id] = {
//               priceHistory: [],
//               timestamps: [],
//               name: stock.name,
//               symbol: stock.symbol,
//               description: stock.description,
//             };
//           }

//           newRecords[stock.id].priceHistory.push(stock.price);
//           newRecords[stock.id].timestamps.push(new Date().toLocaleTimeString());

//           if (newRecords[stock.id].priceHistory.length > 500) {
//             newRecords[stock.id].priceHistory.shift();
//             newRecords[stock.id].timestamps.shift();
//           }
//         });

//         localStorage.setItem("stockData", JSON.stringify(newRecords));

//         return newRecords;
//       });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (stockId && allRecords[stockId]) {
//       setStockData(allRecords[stockId]);
//     }
//   }, [stockId, allRecords]);

//   if (!stockData || !stockId) {
//     return <div className="text-center text-gray-500">Loading stock details...</div>;
//   }

//   const startingPrice = stockData.priceHistory[0];
//   const currentPrice = stockData.priceHistory[stockData.priceHistory.length - 1];
//   const lineColor = currentPrice >= startingPrice ? "rgba(0,255,0,1)" : "rgba(255,0,0,1)";

//   const data = {
//     labels: stockData.timestamps,
//     datasets: [
//       {
//         data: stockData.priceHistory,
//         borderColor: lineColor,
//         borderWidth: 2,
//         backgroundColor: "rgba(0,0,0,0)",
//         fill: false,
//         pointRadius: 0.3,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         type: "category",
//         ticks: {
//           autoSkip: true,
//           maxTicksLimit: 10,
//         },
//       },
//       y: {
//         beginAtZero: false,
//       },
//     },
//   };

//   return (
//     <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">
//         {stockData.name} ({stockData.symbol})
//       </h1>

//       <div className="bg-gray-800 p-4 rounded-md shadow-md">
//         <Line data={data} options={options} />
//       </div>

//       <div className="mt-6">
//         <p className="text-lg font-semibold">Description</p>
//         <div className="text-gray-400">{stockData.description}</div>
//       </div>
//     </div>
//   );
// }

// export default StockDetailPage;


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startStockUpdates } from "../../redux/stock";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StockDetailPage() {
  const { stockId } = useParams();
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.stocks);
  const allRecords = useSelector((state) => state.stock.allRecords);
  const stock = stocks.find((s) => s.id === Number(stockId));
  const stockHistory = allRecords[String(stockId)] || { priceHistory: [], timestamps: [] };

  useEffect(() => {
    const savedData = localStorage.getItem("stockHistoryData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: "stock/setStockRecords", payload: { stocks: [], allRecords: parsedData } });
    }

    const cleanup = dispatch(startStockUpdates());

    return () => {
      cleanup && cleanup();
    };
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(allRecords).length > 0) {
      localStorage.setItem("stockHistoryData", JSON.stringify(allRecords));
    }
  }, [allRecords]);

  if (!stock) {
    return <div>Loading stock data...</div>;
  }

  if (!stockHistory.priceHistory.length || !stockHistory.timestamps.length) {
    return <div className="text-gray-500">Loading chart data...</div>;
  }

  const data = {
    labels: stockHistory.timestamps,
    datasets: [
      {
        data: stockHistory.priceHistory,
        borderColor: "rgba(0,255,0,1)",
        borderWidth: 2,
        backgroundColor: "rgba(0,0,0,0)",
        fill: false,
        pointRadius: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {stock.name} ({stock.symbol})
      </h1>

      <div className="bg-gray-800 p-4 rounded-md shadow-md">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default StockDetailPage;
