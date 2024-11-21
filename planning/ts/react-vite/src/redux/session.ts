import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";

// 定义 User 类型
interface User {
  id: number;
  username: string;
  email: string;
}

interface SessionState {
  user: User | null;
}

// 初始状态
const initialState: SessionState = {
  user: null,
};

// 异步 Thunks
export const thunkAuthenticate = createAsyncThunk<User, void>(
  "session/authenticate",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/auth/");
    if (response.ok) {
      const data: User = await response.json();
      return data; // 返回数据作为 payload
    } else {
      const error = await response.json();
      return rejectWithValue(error);
    }
  }
);

export const thunkLogin = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: Record<string, string> }
>(
  "session/login",
  async (credentials, { rejectWithValue }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data: User = await response.json();
      return data; // 返回数据作为 payload
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return rejectWithValue(errorMessages); // 返回错误信息
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
);

export const thunkLogout = createAsyncThunk<void, void>(
  "session/logout",
  async () => {
    await fetch("/api/auth/logout");
  }
);

// 创建 Slice
const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunkAuthenticate.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(thunkLogin.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(thunkLogout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

// 导出 Actions 和 Reducer
export const { setUser, removeUser } = sessionSlice.actions;
export default sessionSlice.reducer;
