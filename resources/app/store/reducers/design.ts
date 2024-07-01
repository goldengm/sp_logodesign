import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface EditorState {
  bSuccess: boolean;
  curDesignId: number;
  curDesignName: string;
  curCategory: string;
  curKeywords: string;
  curDescription: string;
  designList: Design[];
}

export interface Design {
  id: number;
  name: string;
  category: string;
  keywords: string;
  description: string;
  size: string;
  thumbnail: string;
  data?: string;
}

// Define the initial state using that type
const initialState: EditorState = {
  bSuccess: false,
  curDesignId: -1,
  curDesignName: "",
  curCategory: "",
  curDescription: "",
  curKeywords: "",
  designList: [],
};

export const designSlice = createSlice({
  name: "design",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setResponse: (state, action: PayloadAction<boolean>) => {
      state.bSuccess = action.payload;
    },
    setCurDesignId: (state, action: PayloadAction<number>) => {
      state.curDesignId = action.payload;
    },
    setCurDesignName: (state, action: PayloadAction<string>) => {
      state.curDesignName = action.payload;
    },
    setCurCategory: (state, action: PayloadAction<string>) => {
      state.curCategory = action.payload;
    },
    setCurKeywords: (state, action: PayloadAction<string>) => {
      state.curKeywords = action.payload;
    },
    setCurDescription: (state, action: PayloadAction<string>) => {
      state.curDescription = action.payload;
    },
    setDesignList: (state, action: PayloadAction<Design[]>) => {
      state.designList = action.payload;
    },
  },
});

export const { setResponse, setDesignList, setCurDesignId, setCurDesignName, setCurCategory, setCurKeywords, setCurDescription } =
  designSlice.actions;

export default designSlice.reducer;
