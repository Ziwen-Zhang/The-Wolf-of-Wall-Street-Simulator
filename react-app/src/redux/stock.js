const SET_STOCK = "stock/setStock";
const SET_STOCKS = "stock/setStocks";

// Action Creators
const setStock = (stock) => ({
  type: SET_STOCK,
  payload: stock,
});

export const setStocks = (stocks) => ({
  type: SET_STOCKS,
  payload: stocks,
});

// Thunks
export const thunkGetOneStock = (stockId) => async (dispatch) => {
  const response = await fetch(`/api/stocks/${stockId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setStock(data));
  } else {
    console.error("Failed to fetch stock details");
  }
};

export const thunkGetStocks = () => async (dispatch) => {
  const response = await fetch("/api/stocks/all"); // 假设后端提供 `/api/stocks/all`
  if (response.ok) {
    const data = await response.json();
    dispatch(setStocks(data));
  } else {
    console.error("Failed to fetch stocks");
  }
};

// Initial State
const initialState = {
  stock: null, // 当前选中的股票详情
  stocks: [],  // 所有股票列表
};

// Reducer
function stockReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STOCK:
      return {
        ...state, // 保留其他状态
        stock: action.payload.stock, // 更新单个股票
      };

    case SET_STOCKS:
      return {
        ...state, // 保留其他状态
        stocks: action.payload.stocks, // 更新所有股票列表
      };

    default:
      return state;
  }
}

export default stockReducer;