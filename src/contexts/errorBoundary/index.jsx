import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const GenericFallback = (props) => {
  const { displayMessage } = props;

  return (
    <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 text-center w-full p-8">
      <h1 className="text-2xl m-3 text-gray-500">
        <span className="text-3xl text-black font-bold">
          <span className="text-5xl">O</span>ops
        </span>
        , something went wrong!
      </h1>
      <p className="text-base text-gray-600">{displayMessage || <>Please, reload the page once.</>}</p>
    </div>
  );
};

const ErrorBoundaryProvider = ({ children }) => {
  const [displayMessage, setDisplayMessage] = useState(null);

  const onError = (error, info) => {
    if (error) {
      setDisplayMessage(error.message);
      // here report the error
    }
  };

  return (
    <ErrorBoundary onError={onError} fallback={<GenericFallback displayMessage={displayMessage} />}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryProvider;
