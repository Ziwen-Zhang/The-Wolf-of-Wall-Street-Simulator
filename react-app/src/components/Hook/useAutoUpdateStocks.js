import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetStocks, setStockRecords } from "../../redux/stock";

export const useAutoStockUpdate = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.stocks); // Current stocks in Redux state

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(thunkGetStocks()).then(() => {
        const now = new Date().toLocaleTimeString();
        const updatedRecords = stocks.map((stock) => ({
          stockId: stock.id,
          price: stock.price,
          timestamp: now,
        }));

        dispatch(setStockRecords({ stocks: updatedRecords }));
      });
    }, 3000);

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, [dispatch, stocks]);
};
