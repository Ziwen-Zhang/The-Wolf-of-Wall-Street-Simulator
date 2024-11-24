import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSaves,
  updateSaveThunk,
  deleteSaveThunk,
  createSave,
} from "../../redux/save";
import { thunkGetStocks, startStockUpdates } from "../../redux/stock";

function WatchlistPage() {
  const dispatch = useDispatch();
  const saves = useSelector((state) => state.saves.saves);
  const stocks = useSelector((state) => state.stock.stocks);
  const stockHistories = useSelector((state) => state.stock.allRecords);
  const [editingSave, setEditingSave] = useState(null);
  const [editedValues, setEditedValues] = useState({
    target_price: 0,
    alert_type: "",
  });

  useEffect(() => {
    dispatch(fetchSaves());
    dispatch(thunkGetStocks());
    const stopUpdates = dispatch(startStockUpdates());
    return () => stopUpdates();
  }, [dispatch]);

  const handleEditClick = (save) => {
    setEditingSave(save.id);
    setEditedValues({
      target_price: parseFloat(save.target_price),
      alert_type: save.alert_type,
    });
  };

  const handleSaveClick = (stockId) => {
    if (editingSave) {
      dispatch(updateSaveThunk({ ...editedValues, stock_id: stockId }));
    } else {
      dispatch(createSave({ stock_id: stockId, ...editedValues }));
    }
    setEditingSave(null);
    setEditedValues({ target_price: 0, alert_type: "" });
  };

  const handleDeleteClick = async (saveId) => {
    if (window.confirm("Are you sure you want to delete this save?")) {
      try {
        await dispatch(deleteSaveThunk(saveId));
      } catch (error) {
        console.error("Failed to delete save:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedValues((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const getStockDetails = (stockId) => {
    const stock = stocks.find((s) => s.id === parseInt(stockId)) || {};
    const history = stockHistories[stockId] || { priceHistory: [] };
    const highestPrice =
      history.priceHistory.length > 0
        ? Math.max(...history.priceHistory).toFixed(2)
        : "N/A";
    const lowestPrice =
      history.priceHistory.length > 0
        ? Math.min(...history.priceHistory).toFixed(2)
        : "N/A";

    return {
      name: stock.name || "Unknown Stock",
      currentPrice: stock.price?.toFixed(2) || "N/A",
      highestToday: highestPrice,
      lowestToday: lowestPrice,
    };
  };

  return (
    <div className="p-8 bg-gray-900 text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <div className="overflow-auto border border-gray-700 rounded-lg max-h-[70vh]">
        <table className="min-w-full table-auto bg-gray-800 text-gray-200">
          <thead className="bg-gray-700 sticky top-0">
            <tr>
              <th className="p-4 text-left font-semibold">Stock</th>
              <th className="p-4 text-center font-semibold">Current Price</th>
              <th className="p-4 text-center font-semibold">Highest Today</th>
              <th className="p-4 text-center font-semibold">Lowest Today</th>
              <th className="p-4 text-center font-semibold">Target Price</th>
              <th className="p-4 text-center font-semibold">Alert Type</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(saves).map((stockId) =>
              saves[stockId].map((save) => {
                const {
                  name,
                  currentPrice,
                  highestToday,
                  lowestToday,
                } = getStockDetails(save.stock_id);

                return (
                  <tr
                    key={save.id}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="p-4">{name}</td>
                    <td className="p-4 text-center text-green-500">${currentPrice}</td>
                    <td className="p-4 text-center text-yellow-400">
                      ${highestToday}
                    </td>
                    <td className="p-4 text-center text-red-400">
                      ${lowestToday}
                    </td>
                    <td className="p-4 text-center">
                      {editingSave === save.id ? (
                        <input
                          type="number"
                          name="target_price"
                          value={editedValues.target_price}
                          onChange={handleInputChange}
                          className="p-2 bg-gray-600 text-white rounded"
                        />
                      ) : (
                        `$${parseFloat(save.target_price).toFixed(2)}`
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {editingSave === save.id ? (
                        <span className="text-gray-300 font-semibold">
                          {save.alert_type.charAt(0).toUpperCase() +
                            save.alert_type.slice(1)}
                        </span>
                      ) : (
                        save.alert_type.charAt(0).toUpperCase() +
                        save.alert_type.slice(1)
                      )}
                    </td>
                    <td className="p-4 flex justify-center space-x-2">
                      {editingSave === save.id ? (
                        <button
                          onClick={() => handleSaveClick(save.stock_id)}
                          className="px-4 py-2 bg-green-500 rounded text-white font-semibold hover:bg-green-700"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(save)}
                          className="px-4 py-2 bg-blue-500 rounded text-white font-semibold hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(save.id)}
                        className="px-4 py-2 bg-red-500 rounded text-white font-semibold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WatchlistPage;
