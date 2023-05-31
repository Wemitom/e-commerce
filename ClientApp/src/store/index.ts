import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
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
import authReducer from './authSlice';
import cartReducer from './cartSlice';

const persistConfigCart = {
  key: 'cart',
  version: 1,
  storage
};
const persistConfigAuth = {
  key: 'auth',
  version: 1,
  storage
};

const persistReducerCart = persistReducer(persistConfigCart, cartReducer);
const persistReducerAuth = persistReducer(persistConfigAuth, authReducer);

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = configureStore({
  reducer: {
    cart: persistReducerCart,
    auth: persistReducerAuth,
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
