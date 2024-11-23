// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { Link, useParams, useNavigate } from "react-router-dom";

// function StockSideBar() {
//   const [stocks, setStocks] = useState([]);
//   const { stockId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // const socket = io("http://localhost:8000");
//     const socket = io("https://the-wolf-of-wall-street-simulator.onrender.com");
//     socket.on("stock_update", (data) => {
//       setStocks(data.stocks);

//       if (!stockId && data.stocks.length > 0) {
//         navigate(`/stocks/${data.stocks[0].id}`); 
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [stockId, navigate]);

//   if (!stocks || stocks.length === 0) {
//     return <div className="text-left text-gray-500">Loading stocks...</div>;
//   }

//   return (
//     <div className="p-4 bg-gray-800 text-white shadow-md max-h-screen overflow-y-auto text-left scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400">
//       <h2 className="text-xl text-center font-bold mb-4 text-yellow-400">Stock List</h2>
//       <div className="space-y-4">
//         {stocks.map((stock) => (
//           <Link to={`/stocks/${stock.id}`} key={stock.id}>
//             <div
//               className={`p-4 rounded-md shadow-md cursor-pointer ${
//                 stock.id.toString() === stockId
//                   ? "bg-gray-700 border-2 border-yellow-400"
//                   : "bg-gray-900 hover:bg-gray-700"
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-lg font-semibold">{stock.name}</p>
//                   <p className="text-sm text-gray-400">{stock.symbol}</p>
//                 </div>
//                 <p className="text-green-400 text-lg">${stock.price}</p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default StockSideBar;

import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetStocks } from "../../redux/stock";

function StockSideBar() {
  const dispatch = useDispatch();
  const { stockId } = useParams();
  const navigate = useNavigate();

  const stocks = useSelector((state) => state.stock.stocks);

  useEffect(() => {
    dispatch(thunkGetStocks());
  }, [dispatch]);

  useEffect(() => {
    if (!stockId && stocks.length > 0) {
      navigate(`/stocks/${stocks[0].id}`);
    }
  }, [stockId, stocks, navigate]);

  if (!stocks || stocks.length === 0) {
    return <div className="text-left text-gray-500">Loading stocks...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white shadow-md max-h-screen overflow-y-auto text-left scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400">
      <h2 className="text-xl text-center font-bold mb-4 text-yellow-400">Stock List</h2>
      <div className="space-y-4">
        {stocks.map((stock) => (
          <Link to={`/stocks/${stock.id}`} key={stock.id}>
            <div
              className={`p-4 rounded-md shadow-md cursor-pointer ${
                stock.id.toString() === stockId
                  ? "bg-gray-700 border-2 border-yellow-400"
                  : "bg-gray-900 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{stock.name}</p>
                  <p className="text-sm text-gray-400">{stock.symbol}</p>
                </div>
                <p className="text-green-400 text-lg">${stock.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StockSideBar;
