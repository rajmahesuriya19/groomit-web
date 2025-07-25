import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundaryProvider from './contexts/errorBoundary/index.jsx';
import Store from './utils/store/index.jsx';
import { LoaderProvider } from './contexts/loaderContext/LoaderContext';
import GlobalLoader from './common/loader/GlobalLoader';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundaryProvider>
    <Store>
      <LoaderProvider>
        <GlobalLoader />
        <App />
      </LoaderProvider>
    </Store>
  </ErrorBoundaryProvider>
);

