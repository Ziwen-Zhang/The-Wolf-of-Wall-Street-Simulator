import { createBrowserRouter, RouteObject } from "react-router-dom";
import Layout from './Layout'

// 定义路由的类型
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
    ],
  },
] as RouteObject[]); // 确保符合 RouteObject 类型
