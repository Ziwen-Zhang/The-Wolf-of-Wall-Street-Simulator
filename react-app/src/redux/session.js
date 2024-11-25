const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_INVESTING_HISTORY = 'session/setInvestingHistory';
const RESET_INVESTING_HISTORY = 'session/resetInvestingHistory';


const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  localStorage.removeItem("user");
  return {
    type: REMOVE_USER,
  };
};

export const setInvestingHistory = (history) => {
  localStorage.setItem("investingHistoryData", JSON.stringify(history));
  return {
    type: SET_INVESTING_HISTORY,
    payload: history,
  };
};

export const resetInvestingHistory = () => {
  localStorage.removeItem("investingHistoryData");
  return {
    type: RESET_INVESTING_HISTORY,
  };
};


export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  console.log(user)
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  
  });
  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/", {
    method: 'DELETE',
  });
  dispatch(removeUser());
};

// const initialState = {
//   user: JSON.parse(localStorage.getItem("user")) || null,
//   investingHistory: JSON.parse(localStorage.getItem("investingHistoryData")) || {
//     prices: [],
//     timestamps: [],
//   },
//   // investingHistory: { prices: [], timestamps: [] }, 
// };

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  investingHistory: (() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const storedHistory = JSON.parse(localStorage.getItem("investingHistoryData"));
      return storedHistory || { prices: [], timestamps: [] };
    }
    return { prices: [], timestamps: [] }
  })(),
};


function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case SET_INVESTING_HISTORY:
      return { ...state, investingHistory: action.payload };
    case RESET_INVESTING_HISTORY:
      return { ...state, investingHistory: { prices: [], timestamps: [] } };
    default:
      return state;
  }
}

export default sessionReducer;
