import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetStocks } from "../../redux/stock";

function StockSideBar() {
  const dispatch = useDispatch();
  const stocks = useSelector((store) => store.stock.stocks);

  useEffect(() => {
    dispatch(thunkGetStocks());
  }, [dispatch]);

  if (!stocks || stocks.length === 0) {
    return <div className="text-left text-gray-500">Loading stocks...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white shadow-md w-1/5 max-h-screen overflow-y-auto text-left scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400">
      <h2 className="text-xl text-center font-bold mb-4 text-yellow-400">Stock List</h2>
      <div className="space-y-4">
        {stocks.map((stock) => (
          <div
            key={stock.id}
            className="p-4 bg-gray-900 rounded-md shadow-md hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{stock.name}</p>
                <p className="text-sm text-gray-400">{stock.symbol}</p>
              </div>
              <p className="text-green-400 text-lg">${stock.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockSideBar;
