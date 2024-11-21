import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./session";
import logger from "redux-logger";

// 配置 Store
const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // 开发环境添加 redux-logger
    import.meta.env.MODE !== "production"
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  devTools: import.meta.env.MODE !== "production", // 开发环境启用 Redux DevTools
});

// 定义 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
