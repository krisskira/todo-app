import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { SessionSlice } from "./slices/session.slice";
import { TodosSlice } from "./slices/todo.slice";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { API } from "../api/API";
import { setupListeners } from "@reduxjs/toolkit/query";

const reducer = combineReducers({
  [API.reducerPath]: API.reducer,
  [SessionSlice.name]: SessionSlice.reducer,
  [TodosSlice.name]: TodosSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [SessionSlice.name],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const APP_STORE = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(API.middleware),
});

setupListeners(APP_STORE.dispatch);

export const StatePersistor = persistStore(APP_STORE);

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof APP_STORE.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof APP_STORE.dispatch;
export type AppStore = typeof APP_STORE;

export default APP_STORE;
