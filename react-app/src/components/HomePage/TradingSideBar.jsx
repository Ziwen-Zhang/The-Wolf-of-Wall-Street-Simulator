import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkBuyStock, thunkSellStock } from '../../redux/transaction';
import { thunkAuthenticate } from '../../redux/session';
import ErrorModal from '../ErrorModal/ErrorModal';
import { useParams } from 'react-router-dom';

function TradingSideBar() {
    const { stockId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const stocks = useSelector((state) => state.stock.stocks);
    const stock = stocks.find((s) => s.id === Number(stockId));

  const [quantity, setQuantity] = useState(1);
  const [remainingAfterBuy, setRemainingAfterBuy] = useState(
    user?.buying_power || 0
  );
  const [maxQuantity, setMaxQuantity] = useState(
    stock ? Math.floor(user?.buying_power / stock.price) || 0 : 0
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleBuy = () => {
    if (!quantity || quantity <= 0) return;

    if (remainingAfterBuy < 0) {
      setErrorMessage('Insufficient buying power! Please adjust the quantity.');
      setShowErrorModal(true);
    } else {
      dispatch(thunkBuyStock(stock.id, quantity));
      dispatch(thunkAuthenticate());
    }
  };

  const handleSell = () => {
    if (!quantity || quantity <= 0) return;
    dispatch(thunkSellStock(stock.id, quantity));
    dispatch(thunkAuthenticate());
  };

  const handleModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage('');
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
      <div className="text-gray-500 text-center">
        Loading stock data...
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 px-4">
      <div className="flex justify-between">
        <span className="font-semibold text-teal-400">Buying Power</span>
        <span className="text-green-500">${user.buying_power.toFixed(2)}</span>
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
            remainingAfterBuy >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          ${remainingAfterBuy.toFixed(2)}
        </span>
      </div>
      <div>
        <label htmlFor="quantity" className="font-semibold text-teal-400">
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
  );
}

export default TradingSideBar;
