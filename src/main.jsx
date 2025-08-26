import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundaryProvider from './contexts/errorBoundary/index.jsx';
import { LoaderProvider } from './contexts/loaderContext/LoaderContext';
import GlobalLoader from './common/loader/GlobalLoader';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './utils/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundaryProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LoaderProvider>
          <GlobalLoader />
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </LoaderProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundaryProvider>
);

