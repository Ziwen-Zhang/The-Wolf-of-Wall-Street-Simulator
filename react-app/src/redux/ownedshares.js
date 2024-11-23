const SET_SHARES = "ownedShares/setShares"

const setShares = (shares) => ({
    type: SET_SHARES,
    payload: shares,
  });


export const thunkGetShares = () => async (dispatch) =>{
    const response = await fetch("/api/stocks/portfolio")
    if (response.ok) {
        const data = await response.json();
        dispatch(setShares(data));
      } else {
        console.error("Failed to fetch owned shares");
      }
}   


const initialState = {
    ownedShares: []
}

function ownedSharesReducer(state = initialState, action){
    switch(action.type){
        case SET_SHARES:
            return{
                ...state,
                ownedShares:action.payload.shares
            }
        default:
            return state;
    }
}

export default ownedSharesReducer