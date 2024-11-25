import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAuthenticate } from "../../redux/session";

export const useAutoUpdateUserAssets = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        dispatch(thunkAuthenticate());
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [dispatch, user]);
};
