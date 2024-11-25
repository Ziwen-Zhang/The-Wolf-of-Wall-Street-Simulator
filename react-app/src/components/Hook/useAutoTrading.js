import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkBuyStock, thunkSellStock, thunkUpdateOrderStatus } from "../../redux/transaction";
import { thunkGetStocks } from "../../redux/stock";
import { thunkAuthenticate } from "../../redux/session";

export const useAutoTrading = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.stocks);
  const orders = useSelector((state) => state.transactions.orders);

  const stockMap = useMemo(() => new Map(stocks.map((stock) => [stock.id, stock])), [stocks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const actionableOrders = orders.filter((order) => {
        const stock = stockMap.get(order.stock_id);
        return stock && (
          (order.order_type === "buy" && order.status === "pending" && stock.price <= order.limit_price) ||
          (order.order_type === "sell" && order.status === "pending" && stock.price >= order.limit_price)
        );
      });

      actionableOrders.forEach(async (order) => {
        try {
          const transactionThunk =
            order.order_type === "buy"
              ? thunkBuyStock(order.stock_id, order.quantity)
              : thunkSellStock(order.stock_id, order.quantity);

          await dispatch(transactionThunk);

          await Promise.all([
            dispatch(thunkGetStocks()),
            dispatch(thunkAuthenticate()),
            dispatch(thunkUpdateOrderStatus(order.id, "executed")),
          ]);
        } catch (err) {
          console.error(`Failed to process order ${order.id}:`, err);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, stockMap, orders]);
};
