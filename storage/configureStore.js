import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import FilesystemStorage from "redux-persist-filesystem-storage";

import Reducer from "./reducer";

const persistConfig = {
	key: "root",
	storage: FilesystemStorage,
};

const rootReducer = combineReducers({
	colors: Reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
