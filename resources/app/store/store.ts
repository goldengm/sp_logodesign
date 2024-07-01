import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import sharedDataReducer from "./reducers/share";
import templatesReducer from "./reducers/templates";
import designReducer from "./reducers/design";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shared: sharedDataReducer,
    templates: templatesReducer,
    designs: designReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
