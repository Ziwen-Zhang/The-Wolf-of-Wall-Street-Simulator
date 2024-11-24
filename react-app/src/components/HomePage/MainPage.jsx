// import StockSideBar from "./StockSideBar";
// import StockDetailPage from "../StockPage/StockDetailPage";
// import UserHomePage from "../UserHomePage/UserHomePage";
// import { useSelector } from "react-redux";

// function MainPage() {
//   const user = useSelector((state) => state.session.user);

//   return (
//     <div className="flex">
//       <div className="w-1/4 border-2 border-gray-900">
//         <StockSideBar />
//       </div>
//         {user ? <UserHomePage /> : <StockDetailPage />}
//     </div>
//   );
// }

// export default MainPage;
import StockSideBar from "./StockSideBar";
import StockDetailPage from "../StockPage/StockDetailPage";
import UserHomePage from "../UserHomePage/UserHomePage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function MainPage() {
  const user = useSelector((state) => state.session.user);
  const stocks = useSelector((state) => state.stock.stocks);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && stocks.length > 0) {
      navigate(`/stocks/${stocks[0].id}`);
    }
    else if(user){
      navigate('/user');
    }
  }, [user, stocks, navigate]);

  return (
    <div >
        {user ? <UserHomePage /> : <StockDetailPage />}
    </div>
  );
}

export default MainPage;
