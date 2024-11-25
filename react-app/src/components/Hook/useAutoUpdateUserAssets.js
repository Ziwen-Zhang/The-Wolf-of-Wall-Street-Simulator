import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAuthenticate, setInvestingHistory } from "../../redux/session";

export const useAutoUpdateUserAssets = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const assetsHistory = useSelector((state) => state.session.assetsHistory); 

  useEffect(() => {
    if (user) {
      const intervalId = setInterval(() => {
        dispatch(thunkAuthenticate()).then((response) => {
          if (response && response.payload) {
            const now = new Date().toLocaleTimeString();
            const updatedHistory = [
              ...assetsHistory,
              { timestamp: now, netWorth: response.payload.total_net_worth },
            ];
            if (updatedHistory.length > 500) {
              updatedHistory.shift();
            }

            dispatch(setInvestingHistory(updatedHistory));
          }
        });
      }, 3000);

      return () => clearInterval(intervalId); 
    }
  }, [dispatch, user, assetsHistory]);
};
