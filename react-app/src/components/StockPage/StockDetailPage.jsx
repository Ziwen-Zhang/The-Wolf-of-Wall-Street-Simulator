import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // 用于获取路由参数
import { thunkGetOneStock } from "../../redux/stock";

function StockDetailPage() {
  const { stockId } = useParams(); // 提取 stockId 参数
  const dispatch = useDispatch();
  const stock = useSelector((store) => store.stock.stock);
  console.log()
  useEffect(() => {
    dispatch(thunkGetOneStock(stockId)); // 使用 stockId 获取数据
  }, [dispatch, stockId]);

  if (!stock) {
    return <div className="text-center text-gray-500">Loading stock details...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{stock.name} ({stock.symbol})</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-semibold">Current Price</p>
          <p className="text-green-400 text-xl">${stock.price}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Market Cap</p>
          <p className="text-yellow-400 text-xl">${stock.marketCap}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">52-Week High</p>
          <p className="text-green-300 text-xl">${stock.high52Week}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">52-Week Low</p>
          <p className="text-red-400 text-xl">${stock.low52Week}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-lg font-semibold">Description</p>
        <p className="text-gray-400">{stock.description}</p>
      </div>
    </div>
  );
}

export default StockDetailPage;