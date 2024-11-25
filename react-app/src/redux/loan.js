const LOAN_SUCCESS = "user/LOAN_SUCCESS";
const REPAY_SUCCESS = "user/REPAY_SUCCESS";
const USER_UPDATE = "user/USER_UPDATE";


export const loanSuccess = (user, message) => ({
    type: LOAN_SUCCESS,
    payload: { user, message },
  });
  
  export const repaySuccess = (user, message) => ({
    type: REPAY_SUCCESS,
    payload: { user, message },
  });
  
  export const updateUser = (user) => ({
    type: USER_UPDATE,
    payload: user,
  });

  
  export const thunkLoan = (amount) => async (dispatch) => {
    try {
      const response = await fetch("/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
  
      if (response.ok) {
        const data = await response.json();
        dispatch(loanSuccess(data.user, data.message));
      } else {
        const error = await response.json();
        console.error(error);
        throw new Error(error.error || "Failed to process loan");
      }
    } catch (error) {
      console.error("Loan error:", error.message);
    }
  };
  
  export const thunkRepay = (amount) => async (dispatch) => {
    try {
      const response = await fetch("/api/users/repay", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
  
      if (response.ok) {
        const data = await response.json();
        dispatch(repaySuccess(data.user, data.message));
      } else {
        const error = await response.json();
        console.error(error);
        throw new Error(error.error || "Failed to process repayment");
      }
    } catch (error) {
      console.error("Repayment error:", error.message);
    }
  };
  

  const initialState = {
    user: null, 
    loanMessage: null,
    repayMessage: null, 
  };
  

  export default function userReducer(state = initialState, action) {
    switch (action.type) {
      case LOAN_SUCCESS:
        return {
          ...state,
          user: action.payload.user,
          loanMessage: action.payload.message, 
        };
  
      case REPAY_SUCCESS:
        return {
          ...state,
          user: action.payload.user,
          repayMessage: action.payload.message,
        };
  
      case USER_UPDATE:
        return {
          ...state,
          user: action.payload,
        };
  
      default:
        return state;
    }
  }
  