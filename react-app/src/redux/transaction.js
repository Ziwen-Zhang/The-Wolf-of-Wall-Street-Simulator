import { thunkAuthenticate } from "./session";
import { thunkGetStocks } from "./stock";

const SET_TRANSACTION_HISTORY = "transaction/setHistory";
const ADD_TRANSACTION = "transaction/addTransaction";
const REMOVE_TRANSACTION = "transaction/removeTransaction";
const SET_ORDERS = "transaction/setOrders";
const ADD_ORDER = "transaction/addOrder";
const REMOVE_ORDER = "transaction/removeOrder";
const EDIT_ORDER = "transaction/editOrder";
const UPDATE_ORDER_STATUS = "transaction/updateOrderStatus";

export const updateOrderStatus = (orderId, status) => ({
  type: UPDATE_ORDER_STATUS,
  payload: { orderId, status },
});

export const editOrder = (order) => ({
  type: EDIT_ORDER,
  payload: order,
});

const addOrder = (order) => ({
  type: ADD_ORDER,
  payload: order,
});

const removeOrder = (orderId) => ({
  type: REMOVE_ORDER,
  payload: orderId,
});

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

export const thunkEditOrder = (orderId, updates) => async (dispatch) => {
  try {
    const response = await fetch(`/api/transactions/schedule/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(editOrder(data.order));
    } else {
      console.error("Failed to edit order");
    }
  } catch (error) {
    console.error("Error editing order:", error);
  }
};

export const thunkScheduleLimitBuy =
  (stock_id, quantity, limit_price, order_type) => async (dispatch) => {
    try {
      const response = await fetch("/api/transactions/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stock_id,
          quantity,
          limit_price,
          order_type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(addOrder(data.order));
      } else {
        console.error("Failed to schedule");
      }
    } catch (error) {
      console.error("Error scheduling limit buy:", error);
    }
  };

export const thunkCancelOrder = (orderId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/transactions/schedule/${orderId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(removeOrder(orderId));
    } else {
      console.error("Failed to cancel order");
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
  }
};

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
    dispatch(thunkGetStocks())
    dispatch(thunkAuthenticate())
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
    dispatch(thunkGetStocks())
    dispatch(thunkAuthenticate())
  } else {
    console.error("Failed to sell stock");
  }
};

export const thunkFetchOrders = () => async (dispatch) => {
  try {
    const response = await fetch("/api/transactions/orders");

    if (response.ok) {
      const data = await response.json();
      dispatch(setOrders(data.orders));
    } else {
      console.error("Failed to fetch orders");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
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

export const thunkUpdateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    const response = await fetch(
      `/api/transactions/schedule/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (response.ok) {
      // const data = await response.json();
      dispatch(updateOrderStatus(orderId, status));
    } else {
      console.error("Failed to update order status.");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
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

    case ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case EDIT_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
      };

    case REMOVE_ORDER:
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };

    case UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    default:
      return state;
  }
}

export default transactionReducer;
