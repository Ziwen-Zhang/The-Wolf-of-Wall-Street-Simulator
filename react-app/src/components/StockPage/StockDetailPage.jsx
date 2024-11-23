import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStockRecords, startStockUpdates } from "../../redux/stock";
import { thunkBuyStock, thunkSellStock } from "../../redux/transaction";
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
import { thunkAuthenticate } from "../../redux/session";
import ErrorModal from "../ErrorModal/ErrorModal";

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
  const [loading, setLoading] = useState(true);
  const stocks = useSelector((state) => state.stock.stocks);
  const allRecords = useSelector((state) => state.stock.allRecords);
  const stock = stocks.find((s) => s.id === Number(stockId));
  const stockHistory = allRecords[String(stockId)] || {
    priceHistory: [],
    timestamps: [],
  };
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useSelector((state) => state.session.user);
  const ownedShares = useSelector((state) => state.ownedShares.ownedShares);

  const [quantity, setQuantity] = useState(1);
  const [remainingAfterBuy, setRemainingAfterBuy] = useState(
    user?.buying_power || 0
  );
  const [maxQuantity, setMaxQuantity] = useState(
    Math.floor(user?.buying_power / stock?.price) || 0
  );

  useEffect(() => {
    if (user && stock) {
      setMaxQuantity(Math.floor(user.buying_power / stock.price));
      setRemainingAfterBuy(user.buying_power - quantity * stock.price);
    }
  }, [user, stock, quantity]);

  const handleQuantityChange = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (inputValue > maxQuantity) {
      setQuantity(maxQuantity);
      setRemainingAfterBuy(user.buying_power - maxQuantity * stock.price);
    } else {
      setQuantity(inputValue || 0);
      setRemainingAfterBuy(user.buying_power - inputValue * stock.price);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("stockHistoryData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch(setStockRecords({ stocks: [], allRecords: parsedData }));
      // Remove this line:
      // setLoading(false)
    }
    return dispatch(startStockUpdates());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(allRecords).length > 0) {
      localStorage.setItem("stockHistoryData", JSON.stringify(allRecords));
    }
  }, [allRecords]);

  // New useEffect to monitor data loading
  useEffect(() => {
    if (stocks.length > 0 && stockHistory.priceHistory.length > 0) {
      setLoading(false);
    }
  }, [stocks, stockHistory]);

  if (loading) {
    return <div className="text-gray-500 text-center mt-4">Loading...</div>;
  }

  if (!stockHistory.priceHistory.length || !stockHistory.timestamps.length) {
    return <div className="text-gray-500">Loading chart data...</div>;
  }

  const isAboveInitialPrice =
    stockHistory.priceHistory.length > 0 &&
    stockHistory.priceHistory[stockHistory.priceHistory.length - 1] >=
      stock.initial_price;

  const lineColor =
    stock.price > stock.initial_price ? "rgba(0,255,0,1)" : "rgba(255,0,0,1)";

  const data = {
    labels: stockHistory.timestamps,
    datasets: [
      {
        data: stockHistory.priceHistory,
        borderColor: isAboveInitialPrice
          ? "rgba(0,255,0,1)"
          : "rgba(255,0,0,1)",
        borderWidth: 2,
        backgroundColor: "rgba(0,0,0,0)",
        fill: false,
        pointRadius: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

  const handleBuy = () => {
    if (!quantity || quantity <= 0) return;

    if (remainingAfterBuy < 0) {
      setErrorMessage("Insufficient buying power! Please adjust the quantity.");
      setShowErrorModal(true);
    } else {
      dispatch(thunkBuyStock(stock.id, quantity));
      dispatch(thunkAuthenticate());
    }
  };

  const handleModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleSell = () => {
    if (!quantity || quantity <= 0) return;
    dispatch(thunkSellStock(stock.id, quantity));
    dispatch(thunkAuthenticate());
  };

  return (
    <div className="p-8 h-screen bg-gray-800 text-gray-300 overflow-y-auto text-left scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400">
      <h1 className="text-2xl font-bold mb-4 text-teal-400">
        {stock.name} ({stock.symbol})
        <p className="text-xl font-semibold" style={{ color: lineColor }}>
          ${stock.price}
        </p>
      </h1>

      <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full h-64 sm:h-96">
        <Line data={data} options={options} />
      </div>
      <div className="grid mt-4">
        <h2 className="text-lg font-semibold text-teal-400">
          About {stock.name}
        </h2>
        <div className="text-gray-400 mb-4">{stock.description}</div>
        <div className="flex text-lg mb-4 font-semibold text-teal-400">
          <div className="w-1/3 text-center">Stats</div>
          <div className="w-1/3 text-center">Owned Shares</div>
          <div className="w-1/3 text-center">Trading</div>
        </div>
        <div className="flex">
          <div className="w-1/3 space-y-2 px-4">
            {/* Stats Section */}
            <div className="space-y-8">
              <div className="flex justify-between">
                <span className="font-bold text-teal-400">Initial Price:</span>{" "}
                <span className="text-green-500">
                  ${stock.initial_price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-teal-400">Current Price:</span>{" "}
                <span className="text-green-500">
                  ${stock.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-teal-400">Change:</span>{" "}
                <span
                  className={
                    stock.price > stock.initial_price
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {(
                    ((stock.price - stock.initial_price) /
                      stock.initial_price) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-teal-400">Highest Today:</span>{" "}
                <span className="text-yellow-400">
                  ${Math.max(...stockHistory.priceHistory).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-teal-400">Lowest Today:</span>{" "}
                <span className="text-red-400">
                  ${Math.min(...stockHistory.priceHistory).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="w-1/3 space-y-2 px-4">
            {!user ? (
              <div className="text-red-500 text-center">
                You need to log in to view this section.
              </div>
            ) : (
              (() => {
                const ownedShare = ownedShares.find(
                  (share) => share.stock_id === stock.id
                );
                if (ownedShare) {
                  const earnings =
                    ownedShare.total_value -
                    ownedShare.quantity * ownedShare.average_price;
                  const earningsPercentage =
                    (earnings /
                      (ownedShare.quantity * ownedShare.average_price)) *
                    100;
                  const earningsColor =
                    earnings >= 0 ? "text-green-500" : "text-red-500";

                  return (
                    <div className="text-gray-400 space-y-8">
                      <div className="flex justify-between">
                        <span className="font-bold text-teal-400">
                          Quantity:
                        </span>
                        <span>{ownedShare.quantity.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-teal-400">
                          Average Price:
                        </span>
                        <span>${ownedShare.average_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-teal-400">
                          Total Value:
                        </span>
                        <span>${ownedShare.total_value.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-teal-400">
                          Total Earnings:
                        </span>
                        <span className={`${earningsColor}`}>
                          ${earnings.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-teal-400">
                          Earnings Percentage:
                        </span>
                        <span className={`${earningsColor}`}>
                          {earningsPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-gray-500 text-center">
                      You do not own any shares of this stock.
                    </div>
                  );
                }
              })()
            )}
          </div>
          {!user ? (
            <div className="text-red-500 text-center">
              You need to log in to view this section.
            </div>
          ) : (
            <div className="w-1/3 space-y-4 px-4">
              <div className="flex justify-between">
                <span className="font-semibold text-teal-400">
                  Buying Power
                </span>
                <span className="text-green-500">
                  ${user.buying_power.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-teal-400">Cost</span>
                <span className="text-red-400">
                  - ${(quantity * stock.price).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-teal-400">Remaining</span>
                <span
                  className={`${
                    remainingAfterBuy >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ${remainingAfterBuy.toFixed(2)}
                </span>
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="font-semibold text-teal-400"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full px-2 py-1 mt-1 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
                />
                <small className="text-gray-400">
                  Max Quantity: {maxQuantity} shares
                </small>
              </div>
              <button
                onClick={handleBuy}
                className="w-full bg-green-500 text-gray-900 py-2 rounded-md font-bold hover:bg-green-400"
              >
                Buy
              </button>
              <ErrorModal
                isVisible={showErrorModal}
                onClose={handleModalClose}
                title="Purchase Error"
                message={errorMessage}
              />
              <button
                onClick={handleSell}
                className="w-full bg-red-500 text-gray-900 py-2 rounded-md font-bold hover:bg-red-400"
              >
                Sell
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockDetailPage;

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
