import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function StockSideBar() {
  const [stocks, setStocks] = useState([]);

  // 建立 WebSocket 连接并监听数据
  useEffect(() => {
    // 连接 WebSocket 服务器
    const socket = io("http://localhost:5000"); // 替换为后端运行的地址
    
    // 监听后端的 "stock_update" 事件
    socket.on("stock_update", (data) => {
      console.log("Updated stocks:", data.stocks);
      setStocks(data.stocks); // 更新股票数据到状态
    });

    // 清理连接
    return () => {
      socket.disconnect();
    };
  }, []);

  // 如果没有股票数据
  if (!stocks || stocks.length === 0) {
    return <div className="text-left text-gray-500">Loading stocks...</div>;
  }

  // 渲染股票列表
  return (
    <div className="p-4 bg-gray-800 text-white shadow-md w-1/4 max-h-screen overflow-y-auto text-left">
      <h2 className="text-xl text-center font-bold mb-4 text-yellow-400">Stock List</h2>
      <div className="space-y-4 scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-800 scrollbar-thin">
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