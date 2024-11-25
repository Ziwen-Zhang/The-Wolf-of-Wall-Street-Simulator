import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postNotificationThunk } from "../../redux/notification";

export const useNotificationChecker = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.stocks);
  const saves = useSelector((state) => state.saves.saves);

  useEffect(() => {
    const savedStocks = stocks.filter((stock) =>
      Object.keys(saves).some((stockId) =>
        saves[stockId].some((save) => save.stock_id === stock.id)
      )
    );

    savedStocks.forEach((stock) => {
      const stockId = stock.id;
      const stockSaves = saves[stockId] || [];

      stockSaves.forEach((save) => {
        const targetPrice = parseFloat(save.target_price);
        const alertType = save.alert_type;
        const price = stock.price;

        if (
          (alertType === "above" && price >= targetPrice) ||
          (alertType === "below" && price <= targetPrice)
        ) {
          dispatch(
            postNotificationThunk({
              stock_name: stock.name,
              target_price: targetPrice,
              current_price: price,
              alert_type: alertType,
            })
          );
        }
      });
    });
  }, [stocks, saves, dispatch]);
};
