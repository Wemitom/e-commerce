import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  username?: string;
  loggedIn: boolean;
};

const initialState: AuthState = {
  loggedIn: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state: AuthState, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.loggedIn = true;
    },
    logOut: (state: AuthState) => {
      state.username = undefined;
      state.loggedIn = false;
    }
  }
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
