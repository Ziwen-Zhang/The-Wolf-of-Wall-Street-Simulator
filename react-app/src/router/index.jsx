import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import StockDetailPage from "../components/StockPage/StockDetailPage";
import UserHomePage from "../components/UserHomePage/UserHomePage";
import HomePageRedirect from "../components/HomePage/HomePageRedirect";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePageRedirect />,
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
        path: "/stocks/:stockId",
        element: <StockDetailPage />,
      },
      {
        path: "user",
        element: <UserHomePage />,
      },
    ],
  },
]);