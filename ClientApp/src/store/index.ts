import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { storeApi } from './api';
import cartReducer from './cartSlice';

const persistConfigCart = {
  key: 'cart',
  version: 1,
  storage
};

const persistReducerCart = persistReducer(persistConfigCart, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistReducerCart,
    [storeApi.reducerPath]: storeApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(storeApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
