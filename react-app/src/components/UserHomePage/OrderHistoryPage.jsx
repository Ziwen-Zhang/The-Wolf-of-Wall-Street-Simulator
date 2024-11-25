import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkFetchOrders,
  thunkEditOrder,
  thunkCancelOrder,
  thunkGetTransactionHistory,
} from "../../redux/transaction";
import { thunkGetStocks } from "../../redux/stock";

function OrderHistoryPage() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.transactions.orders);
  const user = useSelector((state) => state.session.user);
  const transactions = useSelector(
    (state) => state.transactions.transactionHistory
  );
  const stocks = useSelector((state) => state.stock.stocks);

  const [activeTab, setActiveTab] = useState("orders");
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedValues, setEditedValues] = useState({
    quantity: 0,
    limit_price: 0,
  });

  useEffect(() => {
    dispatch(thunkFetchOrders());
    dispatch(thunkGetTransactionHistory());
    dispatch(thunkGetStocks());

    const intervalId = setInterval(() => {
      dispatch(thunkFetchOrders());
      dispatch(thunkGetTransactionHistory());
      dispatch(thunkGetStocks());
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleEditClick = (order) => {
    setEditingOrder(order.id);
    setEditedValues({
      quantity: order.quantity,
      limit_price: order.limit_price,
    });
  };

  const handleSaveClick = (orderId) => {
    const updates = {
      quantity: editedValues.quantity,
      limit_price: editedValues.limit_price,
    };

    dispatch(thunkEditOrder(orderId, updates));
    setEditingOrder(null);
    setEditedValues({ quantity: 0, limit_price: 0 });
  };

  const handleDeleteClick = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(thunkCancelOrder(orderId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 1,
    }));
  };

  const getStockName = (stockId) => {
    const stock = stocks.find((s) => s.id === stockId);
    return stock ? stock.name : "Unknown Stock";
  };

  const getMaxSellAmount = (stockId) => {
    const stock = user.shares.find((stock) => stock.stock_id == stockId);
    return stock.quantity;
  };

  const sortedTransactions = [...transactions]
    .filter((transaction) => transaction && transaction.transaction_date)
    .sort(
      (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
    );

  return (
    <div className="p-8 bg-gray-900 text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Order and Transaction History</h1>
      {/* Tabs */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${
            activeTab === "orders"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 rounded ${
            activeTab === "transactions"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Transaction History
        </button>
      </div>

      {/* Orders Table */}
      {activeTab === "orders" && (
        <div className="overflow-auto border border-gray-700 rounded-lg max-h-[70vh]">
          {orders.length > 0 ? (
            <table className="min-w-full table-auto bg-gray-800 text-gray-200">
              <thead className="bg-gray-700 sticky top-0">
                <tr>
                  <th className="p-4 text-left font-semibold">Stock Name</th>
                  <th className="p-4 text-center font-semibold">Order Type</th>
                  <th className="p-4 text-center font-semibold">Quantity</th>
                  <th className="p-4 text-center font-semibold">Limit Price</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .sort((a, b) => {
                    if (a.status === "pending" && b.status === "executed")
                      return -1;
                    if (a.status === "executed" && b.status === "pending")
                      return 1;
                    return new Date(b.created_at) - new Date(a.created_at);
                  })
                  .map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-700 hover:bg-gray-750"
                    >
                      <td className="p-4">{getStockName(order.stock_id)}</td>
                      <td className="p-4 text-center">{order.order_type}</td>
                      <td className="p-4 text-center">
                        {editingOrder === order.id ? (
                          <input
                            type="number"
                            name="quantity"
                            max={getMaxSellAmount(order.stock_id)}
                            value={editedValues.quantity}
                            onChange={(e) => {
                              const inputValue =
                                parseFloat(e.target.value) || 0;
                              const maxSellAmount = getMaxSellAmount(
                                order.stock_id
                              );
                              if (inputValue > maxSellAmount || inputValue <=0) {
                                setEditedValues((prev) => ({
                                  ...prev,
                                  quantity: maxSellAmount,
                                }));
                              } else {
                                setEditedValues((prev) => ({
                                  ...prev,
                                  quantity: inputValue,
                                }));
                              }
                            }}
                            className="w-16 p-1 bg-gray-600 text-white rounded text-center focus:outline-none focus:ring focus:ring-teal-400"
                          />
                        ) : (
                          order.quantity
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {editingOrder === order.id ? (
                          <input
                            type="number"
                            name="limit_price"
                            min={1}
                            value={editedValues.limit_price}
                            onChange={handleInputChange}
                            className="w-16 p-1 bg-gray-600 text-white rounded text-center focus:outline-none focus:ring focus:ring-teal-400"
                          />
                        ) : (
                          `$${order.limit_price.toFixed(2)}`
                        )}
                      </td>
                      <td className="p-4 text-center">{order.status}</td>
                      <td className="p-4 flex w-full justify-center space-x-2">
                        {order.status !== "executed" ? (
                          editingOrder === order.id ? (
                            <>
                              <button
                                onClick={() => handleSaveClick(order.id)}
                                className="w-20 px-4 py-2 bg-green-500 rounded text-white font-semibold hover:bg-green-700 text-center"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingOrder(null);
                                  setEditedValues({
                                    quantity: 0,
                                    limit_price: 0,
                                  });
                                }}
                                className="w-20 px-4 py-2 bg-gray-500 rounded text-white font-semibold hover:bg-gray-700 text-center"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(order)}
                                className="w-20 px-4 py-2 bg-blue-500 rounded text-white font-semibold hover:bg-blue-700 text-center"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(order.id)}
                                className="w-20 px-4 py-2 bg-red-500 rounded text-white font-semibold hover:bg-red-700 text-center"
                              >
                                Delete
                              </button>
                            </>
                          )
                        ) : null}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No orders found.
            </div>
          )}
        </div>
      )}

      {/* Transaction History Table */}
      {activeTab === "transactions" && (
        <div className="overflow-auto border border-gray-700 rounded-lg max-h-[70vh]">
          {sortedTransactions.length > 0 ? (
            <table className="min-w-full table-auto bg-gray-800 text-gray-200">
              <thead className="bg-gray-700 sticky top-0">
                <tr>
                  <th className="p-4 text-left font-semibold">Stock Name</th>
                  <th className="p-4 text-center font-semibold">Type</th>
                  <th className="p-4 text-center font-semibold">Quantity</th>
                  <th className="p-4 text-center font-semibold">Price</th>
                  <th className="p-4 text-center font-semibold">Total</th>
                  <th className="p-4 text-center font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="p-4">
                      {getStockName(transaction.stock_id)}
                    </td>
                    <td className="p-4 text-center">
                      {transaction.transaction_type}
                    </td>
                    <td className="p-4 text-center">{transaction.quantity}</td>
                    <td className="p-4 text-center">
                      ${transaction.transaction_price.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      ${transaction.total_price.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      {new Date(transaction.transaction_date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No transactions found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
