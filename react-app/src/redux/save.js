
const LOAD_SAVES = "saves/LOAD_SAVES";
const ADD_SAVE = "saves/ADD_SAVE";
const UPDATE_SAVE = "saves/UPDATE_SAVE";
const DELETE_SAVE = "saves/DELETE_SAVE";


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

export const deleteSave = (saveId) => ({
  type: DELETE_SAVE,
  saveId,
});


const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (response.ok) {
    return response.json();
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error || "An unknown error occurred");
  }
};


export const fetchSaves = () => async (dispatch) => {
  try {
    const data = await fetchAPI("/api/saves/");
    dispatch(loadSaves(data.saves));
  } catch (error) {
    console.error("Failed to fetch saves:", error);
  }
};


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

export const updateSaveThunk = (saveData) => async (dispatch) => {
  console.log(saveData)
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


export const deleteSaveThunk = (saveId) => async (dispatch) => {
  try {
    await fetchAPI("/api/saves/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: saveId }),
    });
    dispatch(deleteSave(saveId));
  } catch (error) {
    console.error("Failed to delete save:", error);
  }
};


const initialState = {
  saves: {},
};


const savesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SAVES:
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
        const { saveId } = action;
        return {
          ...state,
          saves: Object.keys(state.saves).reduce((acc, stockId) => {
            acc[stockId] = state.saves[stockId].filter((s) => s.id !== saveId);
            return acc;
          }, {}),
        };
      }
           
    default:
      return state;
  }
};

export default savesReducer;
