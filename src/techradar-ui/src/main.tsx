import "bootstrap/scss/bootstrap.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./custom.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./components/AppRouter";
import { store } from "./store/store";

import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
);
