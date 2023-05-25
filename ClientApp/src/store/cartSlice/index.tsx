import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { ProductType } from 'components/Products/Product';

export type CartItemType = {
  item: ProductType;
  count: number;
};

type CartState = {
  items: CartItemType[];
};

const initialState: CartState = {
  items: []
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state: CartState, action: PayloadAction<ProductType>) => {
      state.items = state.items
        ? [...state.items, { item: action.payload, count: 1 }]
        : [{ item: action.payload, count: 1 }];
    },
    changeCount: (
      state: CartState,
      action: PayloadAction<{ id: number; count: number }>
    ) => {
      if (action.payload.count === 0) {
        if (state.items.find((item) => item.item.id === action.payload.id)) {
          state.items = state.items.filter(
            (item) => item.item.id !== action.payload.id
          );
        }
      } else if (action.payload.count > 0) {
        if (state.items.find((item) => item.item.id === action.payload.id)) {
          state.items = state.items.map((item) => {
            if (item.item.id === action.payload.id) {
              item.count = action.payload.count;
            }

            return item;
          });
        }
      }
    }
  }
});

export const { addToCart, changeCount } = cartSlice.actions;

export default cartSlice.reducer;
