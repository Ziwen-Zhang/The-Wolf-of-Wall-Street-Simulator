import { thunkGetShares } from "./ownedshares";
// import { thunkAuthenticate } from "./session";

const SET_STOCK = "stock/setStock";
const SET_STOCKS = "stock/setStocks";
const SET_STOCK_RECORDS = "stock/setStockRecords";

// Action Creators
const setStock = (stock) => ({
  type: SET_STOCK,
  payload: stock,
});

export const setStocks = (stocks) => ({
  type: SET_STOCKS,
  payload: stocks,
});

export const setStockRecords = (updatedStocks) => ({
  type: SET_STOCK_RECORDS,
  payload: updatedStocks,
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
  const response = await fetch("/api/stocks/all");
  if (response.ok) {
    const data = await response.json();
    dispatch(setStocks(data));
    dispatch(setStockRecords(data));
  } else {
    console.error("Failed to fetch stocks");
  }
};

export const startStockUpdates = () => (dispatch) => {
  dispatch(thunkGetStocks());
  dispatch(thunkGetShares())
  const intervalId = setInterval(() => {
    dispatch(thunkGetShares())
    dispatch(thunkGetStocks());
  }, 3000);
  return () => clearInterval(intervalId);
};


const initialState = {
  stock: null, 
  stocks: [],
  allRecords: JSON.parse(localStorage.getItem("stockHistoryData")) || {},
};

// Reducer
function stockReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STOCK:
      return {
        ...state,
        stock: action.payload.stock,
      };

    case SET_STOCKS:
      return {
        ...state,
        stocks: action.payload.stocks,
      };

    case SET_STOCK_RECORDS: {
      const updatedRecords = { ...state.allRecords };

      action.payload.stocks.forEach((stock) => {
        const id = String(stock.id); 
        if (!updatedRecords[id]) {
          updatedRecords[id] = {
            priceHistory: [],
            timestamps: [],
            name: stock.name,
            symbol: stock.symbol,
            description: stock.description,
          };
        }
      
        updatedRecords[id].priceHistory.push(stock.price);
        updatedRecords[id].timestamps.push(new Date().toLocaleTimeString());
      
        if (updatedRecords[id].priceHistory.length > 500) {
          updatedRecords[id].priceHistory.shift();
          updatedRecords[id].timestamps.shift();
        }
      });
      

      return {
        ...state,
        allRecords: updatedRecords
      };
    }

    default:
      return state;
  }
}

export default stockReducer;
