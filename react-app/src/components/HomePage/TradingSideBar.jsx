import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkBuyStock,
  thunkScheduleLimitBuy,
  thunkSellStock,
} from "../../redux/transaction";
import { thunkAuthenticate } from "../../redux/session";
import ErrorModal from "../ErrorModal/ErrorModal";
import { useParams } from "react-router-dom";
import Saves from "./SaveSideBar";
import { thunkGetStocks } from "../../redux/stock";

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

  const [buyLimitPrice, setBuyLimitPrice] = useState("");
  const [sellLimitPrice, setSellLimitPrice] = useState("");

  const handleLimitBuy = () => {
    if (!buyQuantity || buyQuantity <= 0 || buyLimitPrice <= 0) {
      setErrorMessage("Invalid limit buy quantity or price! Please adjust.");
      setShowErrorModal(true);
      return;
    }

    dispatch(
      thunkScheduleLimitBuy(stock.id, buyQuantity, buyLimitPrice, "buy")
    );
    setBuyQuantity(1);
    setBuyLimitPrice("");
    dispatch(thunkAuthenticate());
    dispatch(thunkGetStocks());
  };

  const handleLimitSell = () => {
    if (
      !sellQuantity ||
      sellQuantity <= 0 ||
      sellLimitPrice <= 0 ||
      sellQuantity > maxSellQuantity
    ) {
      setErrorMessage("Invalid limit sell quantity or price! Please adjust.");
      setShowErrorModal(true);
      return;
    }

    dispatch(
      thunkScheduleLimitBuy(stock.id, sellQuantity, sellLimitPrice, "sell")
    );
    setSellQuantity(1);
    setSellLimitPrice("");
    dispatch(thunkAuthenticate());
    dispatch(thunkGetStocks());
  };

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
    if (!buyQuantity || buyQuantity <= 0) {
      setErrorMessage("Insufficient buying power! Please adjust the quantity.");
      setShowErrorModal(true);
    }

    if (remainingAfterBuy < 0) {
      setErrorMessage("Insufficient buying power! Please adjust the quantity.");
      setShowErrorModal(true);
    } else {
      dispatch(thunkBuyStock(stock.id, buyQuantity));
      setBuyQuantity(1);
      dispatch(thunkAuthenticate());
      dispatch(thunkGetStocks());
    }
  };

  const handleSell = () => {
    if (!sellQuantity || sellQuantity <= 0 || sellQuantity > maxSellQuantity) {
      setErrorMessage("Invalid sell quantity! Please adjust the quantity.");
      setShowErrorModal(true);
    } else {
      dispatch(thunkSellStock(stock.id, sellQuantity));
      dispatch(thunkGetStocks());
      dispatch(thunkAuthenticate());
      setSellQuantity(1);
    }
  };

  const handleAllin = () => {
    dispatch(thunkBuyStock(stock.id, maxBuyQuantity));
    dispatch(thunkAuthenticate());
    dispatch(thunkGetStocks());
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
        <label
          htmlFor="buyQuantity"
          className="flex justify-between items-center font-semibold text-teal-400"
        >
          <span>Buy Quantity</span>
          <span>Limit price</span>
        </label>
        <div className="w-full flex space-x-1">
          {/* Buy Quantity Input */}
          <input
            type="number"
            id="buyQuantity"
            min="1"
            max={maxBuyQuantity}
            value={buyQuantity}
            onChange={handleBuyQuantityChange}
            className="w-1/2 flex-1 px-2 py-1 rounded-l-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Quantity"
          />

          {/* Limit Price Input */}
          <input
            type="number"
            id="limitPrice"
            min="0"
            value={buyLimitPrice}
            onChange={(e) => setBuyLimitPrice(parseFloat(e.target.value))}
            className="w-1/2 text-right flex-1 px-2 py-1 rounded-r-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Limit Price"
          />
        </div>

        <small className="text-gray-400">
          Max Buy Quantity: {maxBuyQuantity} shares
        </small>
      </div>
      <div className="w-full flex space-x-1">
        {/* Buy Button */}
        <button
          onClick={handleBuy}
          className="flex-1 px-3 py-2 bg-green-500 text-white font-bold rounded-l shadow-md hover:bg-green-700 active:scale-95 active:bg-green-700 transition-transform duration-150"
        >
          Buy
        </button>

        {/* Limit Buy Button */}
        <button
          onClick={handleLimitBuy}
          title="Place a limit buy order at or below the specified limit price."
          className="flex-1 px-3 py-2 bg-blue-500 text-white font-bold rounded-r shadow-md hover:bg-blue-700 active:scale-95 active:bg-blue-700 transition-transform duration-150"
        >
          Limit Buy
        </button>
      </div>

      {/* Sell input box */}
      <div>
        <label
          htmlFor="sellQuantity"
          className="flex justify-between items-center font-semibold text-teal-400"
        >
          <span>Sell Quantity</span>
          <span>Limit price</span>
        </label>
        <div className="w-full flex space-x-1 mt-1">
          {/* Sell Quantity Input */}
          <input
            type="number"
            id="sellQuantity"
            min="1"
            max={maxSellQuantity}
            value={sellQuantity}
            onChange={handleSellQuantityChange}
            className="w-1/2 flex-1 px-2 py-1 rounded-l-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Quantity"
          />

          {/* Limit Price Input */}
          <input
            type="number"
            id="limitPrice"
            min="0"
            value={sellLimitPrice}
            onChange={(e) => setSellLimitPrice(parseFloat(e.target.value))}
            className="w-1/2 text-right flex-1 px-2 py-1 rounded-r-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Limit Price"
          />
        </div>
        <small className="text-gray-400">
          Max Sell Quantity: {maxSellQuantity} shares
        </small>
      </div>
      <div className="w-full flex space-x-1">
        {/* Sell Button */}
        <button
          onClick={handleSell}
          className="flex-1 px-3 py-2 bg-red-500 text-white font-bold rounded-l shadow-md hover:bg-red-700 active:scale-95 active:bg-red-700 transition-transform duration-150"
        >
          Sell
        </button>

        {/* Limit Sell Button */}
        <button
          onClick={handleLimitSell}
          title="Place a limit sell order at or above the specified limit price."
          className="flex-1 px-3 py-2 bg-purple-500 text-white font-bold rounded-r shadow-md hover:bg-purple-700 active:scale-95 active:bg-purple-700 transition-transform duration-150"
        >
          Limit Sell
        </button>
      </div>

      <button
        className="w-full px-6 py-2 bg-yellow-400 text-red-700 font-bold rounded shadow-md hover:bg-red-700 hover:text-yellow-500 active:scale-95 active:bg-red-700 transition-transform duration-150"
        onClick={handleAllin}
      >
        ALL IN
      </button>
      {/* Error modal */}
      <ErrorModal
        isVisible={showErrorModal}
        onClose={handleModalClose}
        title="Error"
        message={errorMessage}
      />
      <Saves />
    </div>
  );
}

export default TradingSideBar;
