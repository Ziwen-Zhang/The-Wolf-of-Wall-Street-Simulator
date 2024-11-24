import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import stockReducer from "./stock";
import ownedSharesReducer from "./ownedshares";
import savesReducer from "./save";
import { notificationReducer } from "./notification";

const rootReducer = combineReducers({
  session: sessionReducer,
  stock:stockReducer,
  ownedShares:ownedSharesReducer,
  saves:savesReducer,
  notifications:notificationReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
