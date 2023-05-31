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

import { categoriesApi } from './api/categoriesApi';
import { orderApi } from './api/orderApi';
import { statsApi } from './api/statsApi';
import { storeApi } from './api/storeApi';
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
    [storeApi.reducerPath]: storeApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(
      storeApi.middleware,
      categoriesApi.middleware,
      orderApi.middleware,
      statsApi.middleware
    )
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
