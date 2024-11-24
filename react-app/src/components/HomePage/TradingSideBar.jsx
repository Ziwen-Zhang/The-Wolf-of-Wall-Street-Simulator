import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkBuyStock, thunkSellStock } from "../../redux/transaction";
import { thunkAuthenticate } from "../../redux/session";
import ErrorModal from "../ErrorModal/ErrorModal";
import { useParams } from "react-router-dom";
import Saves from "./SaveSideBar";

function TradingSideBar() {
  const { stockId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const stocks = useSelector((state) => state.stock.stocks);
  const ownedShares = useSelector((state) => {
    const shareData = state.ownedShares.ownedShares.find(
      (share) => share.stock_id === Number(stockId) 
    );
    return shareData ? shareData.quantity : 0;
  });
  const stock = stocks.find((s) => s.id === Number(stockId));

  const [buyQuantity, setBuyQuantity] = useState(1);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [remainingAfterBuy, setRemainingAfterBuy] = useState(
    user?.buying_power || 0
  );
  const [buyCost, setBuyCost] = useState(0);
  const [maxBuyQuantity, setMaxBuyQuantity] = useState(
    stock ? Math.floor(user?.buying_power / stock.price) || 0 : 0
  );
  const [maxSellQuantity, setMaxSellQuantity] = useState(ownedShares || 0); 
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user && stock) {
      setMaxBuyQuantity(Math.floor(user.buying_power / stock.price));
      setBuyCost(buyQuantity * stock.price);
      setRemainingAfterBuy(user.buying_power - buyQuantity * stock.price);
    }
    setMaxSellQuantity(ownedShares);
  }, [user, stock, buyQuantity, ownedShares]);

  const handleBuyQuantityChange = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (inputValue > maxBuyQuantity) {
      setBuyQuantity(maxBuyQuantity);
      setBuyCost(maxBuyQuantity * stock.price);
      setRemainingAfterBuy(user.buying_power - maxBuyQuantity * stock.price);
    } else {
      setBuyQuantity(inputValue || 0);
      setBuyCost((inputValue || 0) * stock.price); 
      setRemainingAfterBuy(user.buying_power - (inputValue || 0) * stock.price);
    }
  };

  const handleSellQuantityChange = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (inputValue > maxSellQuantity) {
      setSellQuantity(maxSellQuantity);
    } else {
      setSellQuantity(inputValue || 0);
    }
  };

  const handleBuy = () => {
    if (!buyQuantity || buyQuantity <= 0) return;

    if (remainingAfterBuy < 0) {
      setErrorMessage("Insufficient buying power! Please adjust the quantity.");
      setShowErrorModal(true);
    } else {
      dispatch(thunkBuyStock(stock.id, buyQuantity));
      dispatch(thunkAuthenticate());
    }
  };

  const handleSell = () => {
    if (!sellQuantity || sellQuantity <= 0 || sellQuantity > maxSellQuantity) {
      setErrorMessage("Invalid sell quantity! Please adjust the quantity.");
      setShowErrorModal(true);
    } else {
      dispatch(thunkSellStock(stock.id, sellQuantity));
      dispatch(thunkAuthenticate());
      setSellQuantity(1)
    }
  };

  const handleModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  if (!user) {
    return (
      <div className="text-red-500 text-center">
        You need to log in to view this section.
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="text-gray-500 text-center">Loading stock data...</div>
    );
  }

  return (
    <div className="py-8 w-1/4 space-y-4 px-4 bg-gray-800 border-2 border-gray-900">
      {/* Display buying power */}
      <div className="flex justify-between">
        <span className="font-semibold text-teal-400">Buying Power</span>
        <span className="text-green-500">${user.buying_power.toFixed(2)}</span>
      </div>

      {/* Display cost and remaining */}
      <div className="flex justify-between">
        <span className="font-semibold text-teal-400">Cost</span>
        <span className="text-red-400">- ${buyCost.toFixed(2)}</span>
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

      {/* Buy input box */}
      <div>
        <label htmlFor="buyQuantity" className="font-semibold text-teal-400">
          Buy Quantity
        </label>
        <input
          type="number"
          id="buyQuantity"
          min="1"
          max={maxBuyQuantity}
          value={buyQuantity}
          onChange={handleBuyQuantityChange}
          className="w-full px-2 py-1 mt-1 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
        />
        <small className="text-gray-400">
          Max Buy Quantity: {maxBuyQuantity} shares
        </small>
      </div>
      <button
        onClick={handleBuy}
        className="w-full bg-green-500 text-gray-900 py-2 rounded-md font-bold hover:bg-green-400"
      >
        Buy
      </button>

      {/* Sell input box */}
      <div>
        <label htmlFor="sellQuantity" className="font-semibold text-teal-400">
          Sell Quantity
        </label>
        <input
          type="number"
          id="sellQuantity"
          min="1"
          max={maxSellQuantity}
          value={sellQuantity}
          onChange={handleSellQuantityChange}
          className="w-full px-2 py-1 mt-1 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
        />
        <small className="text-gray-400">
          Max Sell Quantity: {maxSellQuantity} shares
        </small>
      </div>
      <button
        onClick={handleSell}
        className="w-full bg-red-500 text-gray-900 py-2 rounded-md font-bold hover:bg-red-400"
      >
        Sell
      </button>

      {/* Error modal */}
      <ErrorModal
        isVisible={showErrorModal}
        onClose={handleModalClose}
        title="Error"
        message={errorMessage}
      />
      <Saves/>
    </div>
  );
}

export default TradingSideBar;
