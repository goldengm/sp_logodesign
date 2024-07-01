import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface AuthState {
  bSuccess: boolean;
  authUser: any
}

// Define the initial state using that type
const initialState: AuthState = {
  bSuccess: false,
  authUser: null
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setResponse: (state, action: PayloadAction<any>) => {
      state.bSuccess = action.payload && action.payload.bSuccess;
      state.authUser = action.payload && action.payload.authUser
    },
    setPlanSubscription: (state, action: PayloadAction<any>) => {
      state.authUser = {...state.authUser, subscribed: action.payload}
    }
  },
});

export const { setResponse } = authSlice.actions;

export default authSlice.reducer;
