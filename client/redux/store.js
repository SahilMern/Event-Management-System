import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/AuthSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local Storage ke liye
// import { getDefaultMiddleware } from "@reduxjs/toolkit"; // Middleware ke liye

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // ❌ Persist ki warnings hata dega
      },
    }),
});

export const persistor = persistStore(store);
export default store;
