import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import "@/styles/index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
/* <React.StrictMode> 
 </React.StrictMode>*/
