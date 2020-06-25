import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import FilesystemStorage from "redux-persist-filesystem-storage";

import ColorReducer from "./colorReducer";
import BookReducer from "./bookReducer";

const persistConfig = {
	key: "root",
	storage: FilesystemStorage,
};

const rootReducer = combineReducers({
	colors: ColorReducer,
    books: BookReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
