import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import ErrorBoundaryProvider from "./contexts/errorBoundary/index.jsx";
import { LoaderProvider } from "./contexts/loaderContext/LoaderContext";
import GlobalLoader from "./common/loader/GlobalLoader";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./utils/store";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isMobile = window.matchMedia("(max-width: 767px)").matches;

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundaryProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LoaderProvider>
          <GlobalLoader />
          <App />

          <ToastContainer
            position={"top-right"}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
            theme="colored"
            style={{
              width: isMobile ? "90vw" : "auto",
              maxWidth: "400px",
            }}
          />
        </LoaderProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundaryProvider>
);
