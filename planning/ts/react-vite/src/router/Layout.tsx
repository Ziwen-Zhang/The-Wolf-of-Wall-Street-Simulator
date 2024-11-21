import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { thunkAuthenticate } from "../redux/session";
import { useEffect,useState } from "react";
import Navbar from "../components/Navigation/Navbar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // 明确指定类型
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navbar />
      {isLoaded && <Outlet />}
    </>
  );
};

export default Layout;
