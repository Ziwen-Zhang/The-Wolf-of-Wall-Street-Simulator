import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./redux/store"; // 使用 Redux Toolkit 配置的 store
import { router } from "./router";

// 开发环境下将 store 和 actions 添加到 window 对象中
if (import.meta.env.MODE !== "production") {
  (window as any).store = store;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);
