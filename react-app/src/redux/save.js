// Action Types
const LOAD_SAVES = "saves/LOAD_SAVES";
const ADD_SAVE = "saves/ADD_SAVE";
const UPDATE_SAVE = "saves/UPDATE_SAVE";
const DELETE_SAVE = "saves/DELETE_SAVE";

// Action Creators
export const loadSaves = (saves) => ({
  type: LOAD_SAVES,
  saves,
});

export const addSave = (save) => ({
  type: ADD_SAVE,
  save,
});

export const updateSave = (save) => ({
  type: UPDATE_SAVE,
  save,
});

export const deleteSave = (stockId, saveId) => ({
  type: DELETE_SAVE,
  stockId,
  saveId,
});

// Helper function for API requests
const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (response.ok) {
    return response.json();
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error || "An unknown error occurred");
  }
};

// Thunk: Fetch all saves
export const fetchSaves = () => async (dispatch) => {
  try {
    const data = await fetchAPI("/api/saves/");
    dispatch(loadSaves(data.saves));
  } catch (error) {
    console.error("Failed to fetch saves:", error);
  }
};

// Thunk: Create a new save
export const createSave = (saveData) => async (dispatch) => {
  try {
    const data = await fetchAPI("/api/saves/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saveData),
    });
    dispatch(addSave(data.save));
  } catch (error) {
    console.error("Failed to create save:", error);
  }
};

// Thunk: Update an existing save
export const updateSaveThunk = (saveData) => async (dispatch) => {
  try {
    const data = await fetchAPI("/api/saves/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saveData),
    });
    dispatch(updateSave(data.save));
  } catch (error) {
    console.error("Failed to update save:", error);
  }
};

// Thunk: Delete a save
export const deleteSaveThunk = (stockId, saveId) => async (dispatch) => {
  try {
    await fetchAPI("/api/saves/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_id: stockId, id: saveId }),
    });
    dispatch(deleteSave(stockId, saveId));
  } catch (error) {
    console.error("Failed to delete save:", error);
  }
};

// Initial State
const initialState = {
  saves: {}, // Key: stock_id, Value: Array of saves
};

// Saves Reducer
const savesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SAVES:
      // Group saves by stock_id
      const groupedSaves = action.saves.reduce((acc, save) => {
        if (!acc[save.stock_id]) {
          acc[save.stock_id] = [];
        }
        acc[save.stock_id].push(save);
        return acc;
      }, {});
      return {
        ...state,
        saves: groupedSaves,
      };

    case ADD_SAVE:
      // Add a new save to the corresponding stock_id
      return {
        ...state,
        saves: {
          ...state.saves,
          [action.save.stock_id]: [
            ...(state.saves[action.save.stock_id] || []),
            action.save,
          ],
        },
      };

    case UPDATE_SAVE:
      // Update an existing save based on its id
      return {
        ...state,
        saves: {
          ...state.saves,
          [action.save.stock_id]: state.saves[action.save.stock_id].map((s) =>
            s.id === action.save.id ? action.save : s
          ),
        },
      };

      case DELETE_SAVE: {
        const { stockId, saveId } = action; // 在块作用域中声明变量
        return {
          ...state,
          saves: {
            ...state.saves,
            [stockId]: state.saves[stockId].filter((s) => s.id !== saveId),
          },
        };
      }
      

    default:
      return state;
  }
};

export default savesReducer;
