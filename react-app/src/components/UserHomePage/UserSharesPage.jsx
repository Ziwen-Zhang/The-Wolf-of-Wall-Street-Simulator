import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetShares } from "../../redux/ownedshares"; 
import { thunkGetStocks, startStockUpdates } from "../../redux/stock";

import { Line } from "react-chartjs-2";
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

function OwnedStocksPage() {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.stocks);
  const ownedShares = useSelector((state) => state.ownedShares.ownedShares);
  console.log(ownedShares)
  const stockHistories = useSelector((state) => state.stock.allRecords);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeDetails, setTradeDetails] = useState({
    quantity: 0,
    action: "buy",
  });

  useEffect(() => {
    dispatch(thunkGetShares());
    dispatch(thunkGetStocks());
    const stopUpdates = dispatch(startStockUpdates());
    return () => stopUpdates();
  }, [dispatch]);

  const handleTrade = () => {
    if (!selectedStock || tradeDetails.quantity <= 0) {
      alert("Invalid trade details");
      return;
    }

  };

  const getStockDetails = (stockId) => {
    const stock = stocks.find((s) => s.id === stockId) || {};
    const history = stockHistories[stockId] || { priceHistory: [] };
    return {
      name: stock.name || "Unknown Stock",
      symbol: stock.symbol || "N/A",
      price: stock.price?.toFixed(2) || "N/A",
      highestToday: history.priceHistory.length
        ? Math.max(...history.priceHistory).toFixed(2)
        : "N/A",
      lowestToday: history.priceHistory.length
        ? Math.min(...history.priceHistory).toFixed(2)
        : "N/A",
    };
  };

  return (
    <div className="p-8 bg-gray-900 text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Owned Stocks</h1>
      <div className="overflow-auto border border-gray-700 rounded-lg max-h-[70vh]">
        <table className="min-w-full table-auto bg-gray-800 text-gray-200">
          <thead className="bg-gray-700 sticky top-0">
            <tr>
              <th className="p-4 text-left font-semibold">Stock</th>
              <th className="p-4 text-center font-semibold">Current Price</th>
              <th className="p-4 text-center font-semibold">Quantity</th>
              <th className="p-4 text-center font-semibold">Average Price</th>
              <th className="p-4 text-center font-semibold">Total Value</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ownedShares.map((share) => {
              const { name, symbol, price } = getStockDetails(share.stock_id);
              return (
                <tr
                  key={share.id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="p-4">{name} ({symbol})</td>
                  <td className="p-4 text-center text-green-500">${price}</td>
                  <td className="p-4 text-center">{share.quantity.toFixed(2)}</td>
                  <td className="p-4 text-center">${share.average_price.toFixed(2)}</td>
                  <td className="p-4 text-center">${(share.quantity * share.average_price).toFixed(2)}</td>
                  <td className="p-4 flex justify-center space-x-2">
                    <button
                      onClick={() => setSelectedStock({ id: share.stock_id, name })}
                      className="px-4 py-2 bg-blue-500 rounded text-white font-semibold hover:bg-blue-700"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedStock && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold">Trade {selectedStock.name}</h2>
          <div className="flex items-center space-x-4">
            <select
              value={tradeDetails.action}
              onChange={(e) =>
                setTradeDetails((prev) => ({
                  ...prev,
                  action: e.target.value,
                }))
              }
              className="p-2 bg-gray-700 rounded text-white"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <input
              type="number"
              value={tradeDetails.quantity}
              onChange={(e) =>
                setTradeDetails((prev) => ({
                  ...prev,
                  quantity: parseFloat(e.target.value) || 0,
                }))
              }
              className="p-2 bg-gray-700 rounded text-white"
              placeholder="Quantity"
            />
            <button
              onClick={handleTrade}
              className="px-4 py-2 bg-green-500 rounded text-white font-semibold hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setSelectedStock(null)}
              className="px-4 py-2 bg-red-500 rounded text-white font-semibold hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnedStocksPage;
