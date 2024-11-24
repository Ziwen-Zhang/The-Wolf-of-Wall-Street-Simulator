import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import StockDetailPage from "../components/StockPage/StockDetailPage";
import UserHomePage from "../components/UserHomePage/UserHomePage";
import HomePageRedirect from "../components/HomePage/HomePageRedirect";
import MainPage from "../components/HomePage/MainPage";
import WatchlistPage from "../components/Watchlist/WatchlistPage";
import OwnedStocksPage from "../components/UserHomePage/UserSharesPage";

export const router = createBrowserRouter([
  // {
  //   element: <Layout />,
  //   children: [
  //     {
  //       path: "/",
  //       element: <HomePageRedirect />,
  //     },
  //     {
  //       path: "login",
  //       element: <LoginFormPage />,
  //     },
  //     {
  //       path: "signup",
  //       element: <SignupFormPage />,
  //     },
  //     {
  //       path: "/stocks/:stockId",
  //       element: <StockDetailPage />,
  //     },
  //     {
  //       path: "/user",
  //       element: <UserHomePage />,
  //     },
  //   ],
  // },
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
      }
    ],
  },
]);