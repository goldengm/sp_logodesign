import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface Template {
  id: number;
  name: string;
  category: string;
  keywords: string;
  description: string;
  size: string;
  data?: string;
  img: string;
}

// Define a type for the slice state
interface TemplatesState {
  templateList: Template[];
}

// Define the initial state using that type
const initialState: TemplatesState = {
  templateList: [],
};

export const templatesSlice = createSlice({
  name: "templates",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setTemplates: (state, action: PayloadAction<Template[]>) => {
      state.templateList = action.payload;
    },
  },
});

export const { setTemplates } = templatesSlice.actions;

export default templatesSlice.reducer;
