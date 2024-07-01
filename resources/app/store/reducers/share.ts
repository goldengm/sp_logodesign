import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

// Define a type for the slice state
interface SharedDataState {
  bLoading: boolean;
  bHasMessage: boolean;
  notifyMessage: string;
}

// Define the initial state using that type
const initialState: SharedDataState = {
  bLoading: false,
  notifyMessage: "",
};

export const sharedDataSlice = createSlice({
  name: "sharedData",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.bLoading = action.payload;
    },
    setNotifyMsg: (state, action: PayloadAction<string>) => {
      state.notifyMessage = action.payload;
    },
  },
});

export const { setLoading, setNotifyMsg } = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
