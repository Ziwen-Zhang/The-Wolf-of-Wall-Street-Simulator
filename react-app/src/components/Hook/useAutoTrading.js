import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkBuyStock, thunkSellStock, thunkUpdateOrderStatus } from "../../redux/transaction";
import { thunkGetStocks } from "../../redux/stock";
import { thunkAuthenticate } from "../../redux/session";

export const useAutoTrading = () => {
    const dispatch = useDispatch();
    const stocks = useSelector((state) => state.stock.stocks);
    const orders = useSelector((state) => state.transactions.orders);
  
    useEffect(() => {
      const stockMap = new Map(stocks.map((stock) => [stock.id, stock]));
      const interval = setInterval(() => {
        orders.forEach((order) => {
          const stock = stockMap.get(order.stock_id);
  
          if (stock) {
            const shouldExecute =
              (order.order_type === "buy" && stock.price <= order.limit_price) ||
              (order.order_type === "sell" && stock.price >= order.limit_price);
  
            if (shouldExecute) {
              const transactionThunk =
                order.order_type === "buy"
                  ? thunkBuyStock(order.stock_id, order.quantity)
                  : thunkSellStock(order.stock_id, order.quantity);
  
              dispatch(transactionThunk).then(() => {
                dispatch(thunkGetStocks())
                dispatch(thunkAuthenticate())
                dispatch(thunkUpdateOrderStatus(order.id, "executed"));
              });
            }
          }
        });
      }, 3000);
  
      return () => clearInterval(interval);
    }, [dispatch, stocks, orders]);
  };
  