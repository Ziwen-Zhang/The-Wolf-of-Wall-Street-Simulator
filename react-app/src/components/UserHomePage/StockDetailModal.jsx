

function StockDetailModal({ stock, isOpen, onClose }) {
  if (!isOpen || !stock) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-teal-400 text-2xl font-bold">{stock.stock_name}</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-lg font-bold hover:text-red-700"
          >
            x
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-gray-300">
          <div>
            <p>
              <span className="font-bold text-teal-400">Current Price: </span>$
              {stock.current_price.toFixed(2)}
            </p>
            <p>
              <span className="font-bold text-teal-400">Quantity: </span>
              {stock.quantity}
            </p>
            <p>
              <span className="font-bold text-teal-400">Average Price: </span>$
              {stock.average_price.toFixed(2)}
            </p>
          </div>
          <div>
            <p>
              <span className="font-bold text-teal-400">Total Value: </span>$
              {(stock.quantity * stock.current_price).toFixed(2)}
            </p>
            <p>
              <span className="font-bold text-teal-400">Profit/Loss: </span>
              <span
                className={
                  stock.profitLoss >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                ${stock.profitLoss.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetailModal;
