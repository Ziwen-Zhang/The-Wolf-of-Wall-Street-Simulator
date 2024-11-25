import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import StockDetailPage from "../components/StockPage/StockDetailPage";
import UserHomePage from "../components/UserHomePage/UserHomePage";
import MainPage from "../components/HomePage/MainPage";
import WatchlistPage from "../components/Watchlist/WatchlistPage";
import OrderHistoryPage from "../components/UserHomePage/OrderHistoryPage";

export const router = createBrowserRouter([
  {
    element: <Layout />, 
    children: [
      {
        path:"/",
        element:<MainPage/>
      },
      {
        path: "/stocks/:stockId",
        element: <StockDetailPage />, 
      },
      {
        path: "/user",
        element: <UserHomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path:"watchlist",
        element:<WatchlistPage/>
      },
      {
        path:"history",
        element:<OrderHistoryPage/>
      }
    ],
  },
]);