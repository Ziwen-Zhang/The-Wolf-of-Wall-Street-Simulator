import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSaves,
  createSave,
  updateSaveThunk,
  deleteSaveThunk,
} from "../../redux/save";
import { fetchNotifications } from "../../redux/notification";

function Saves() {
  const { stockId } = useParams();
  const dispatch = useDispatch();


  const saves = useSelector((state) => state.saves.saves || {});


  const relatedSaves = saves[stockId] ? Object.values(saves[stockId]) : [];

  
  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState("above");

  useEffect(() => {
    dispatch(fetchSaves());
  }, [dispatch]);

  const handleAddToSaves = async () => {
    try {
      if (!targetPrice || targetPrice <= 0) {
        alert("Please enter a valid target price.");
        return;
      }

      
      const existingSave = relatedSaves.find(
        (save) => save.alert_type === alertType
      );

      if (existingSave) {
        await dispatch(
          updateSaveThunk({
            id: existingSave.id,
            stock_id: stockId,
            target_price: parseFloat(targetPrice),
            alert_type: alertType,
          })
        );
      } else {

        await dispatch(
          createSave({
            stock_id: stockId,
            target_price: parseFloat(targetPrice),
            alert_type: alertType,
          })
        );
      }

      setTargetPrice("");
    } catch (error) {
      console.error("Failed to add or update save:", error);
    }
  };

  const handleDeleteSave = async (saveId) => {
    if (window.confirm("Are you sure you want to delete this save?")) {
      try {
        await dispatch(deleteSaveThunk(saveId));
        await dispatch(fetchNotifications())
      } catch (error) {
        console.error("Failed to delete save:", error);
      }
    }
  };

  return (
    <div className="text-teal-400">
      <h1 className="text-xl font-bold mb-4 text-center">Add to Watchlist</h1>

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <label className="">Target Price:</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-1/2 px-2 py-1 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Enter target price"
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <label className="">Alert Type:</label>
          <select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
            className="w-1/2 px-2 py-1 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>

        <button
          onClick={handleAddToSaves}
          className="w-full px-6 py-2 bg-green-500 text-white font-bold rounded shadow-md hover:bg-green-700 active:scale-95 active:bg-green-700 transition-transform duration-150"
        >
          Add to Saves
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 text-center">
          Current Watchlist
        </h2>
        {relatedSaves.length > 0 ? (
          <ul className="space-y-4">
            {relatedSaves.map((save) => (
              <li
                key={save.id}
                className="flex justify-between items-center px-4"
              >
                <div>
                  <span className="mr-4">{save.alert_type}</span>
                  <span>${save.target_price}</span>
                </div>
                <button
                  onClick={() => handleDeleteSave(save.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No saves for this stock.</p>
        )}
      </div>
    </div>
  );
}

export default Saves;
