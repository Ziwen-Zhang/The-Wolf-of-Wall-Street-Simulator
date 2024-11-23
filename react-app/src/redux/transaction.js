const SET_TRANSACTION_HISTORY = "transaction/setHistory";
const ADD_TRANSACTION = "transaction/addTransaction";
const REMOVE_TRANSACTION = "transaction/removeTransaction";
const SET_ORDERS = "transaction/setOrders";


const setTransactionHistory = (history) => ({
  type: SET_TRANSACTION_HISTORY,
  payload: history,
});

const addTransaction = (transaction) => ({
  type: ADD_TRANSACTION,
  payload: transaction,
});

const removeTransaction = (transactionId) => ({
  type: REMOVE_TRANSACTION,
  payload: transactionId,
});

const setOrders = (orders) => ({
  type: SET_ORDERS,
  payload: orders,
});


export const thunkGetTransactionHistory = () => async (dispatch) => {
  const response = await fetch("/api/transactions/history");
  if (response.ok) {
      const data = await response.json();
      dispatch(setTransactionHistory(data.history));
  } else {
      console.error("Failed to fetch transaction history");
  }
};

export const thunkBuyStock = (stockId, quantity) => async (dispatch) => {
  const response = await fetch("/api/transactions/buy", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock_id: stockId, quantity }),
  });
  if (response.ok) {
      const data = await response.json();
      dispatch(addTransaction(data.shares));
  } else {
      console.error("Failed to buy stock");
  }
};

export const thunkSellStock = (stockId, quantity) => async (dispatch) => {
  const response = await fetch("/api/transactions/sell", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock_id: stockId, quantity }),
  });
  if (response.ok) {
      const data = await response.json();
      dispatch(addTransaction(data.shares));
  } else {
      console.error("Failed to sell stock");
  }
};

export const thunkGetOrders = () => async (dispatch) => {
  const response = await fetch("/api/transactions/orders");
  if (response.ok) {
      const data = await response.json();
      dispatch(setOrders(data.orders));
  } else {
      console.error("Failed to fetch orders");
  }
};

export const thunkDeleteOrder = (orderId) => async (dispatch) => {
  const response = await fetch(`/api/transactions/schedule/${orderId}`, {
      method: "DELETE",
  });
  if (response.ok) {
      dispatch(removeTransaction(orderId));
  } else {
      console.error("Failed to delete order");
  }
};

const initialState = {
  transactionHistory: [],
  orders: [],     
};


function transactionReducer(state = initialState, action) {
  switch (action.type) {
      case SET_TRANSACTION_HISTORY:
          return {
              ...state,
              transactionHistory: action.payload,
          };

      case ADD_TRANSACTION:
          return {
              ...state,
              transactionHistory: [action.payload, ...state.transactionHistory],
          };

      case REMOVE_TRANSACTION:
          return {
              ...state,
              orders: state.orders.filter((order) => order.id !== action.payload),
          };

      case SET_ORDERS:
          return {
              ...state,
              orders: action.payload,
          };

      default:
          return state;
  }
}

export default transactionReducer;
