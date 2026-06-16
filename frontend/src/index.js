import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const getHttpStatus = (reason) => (
  reason?.response?.status
  || reason?.status
  || reason?.cause?.response?.status
  || reason?.error?.response?.status
  || null
);

const isHandledHttpAuthError = (reason) => {
  const status = getHttpStatus(reason);
  const message = String(
    reason?.message
    || reason?.toString?.()
    || ''
  );

  return [401, 403].includes(status)
    || /status code 401/i.test(message)
    || /status code 403/i.test(message);
};

const preventKnownHttpOverlay = (event) => {
  if (!isHandledHttpAuthError(event.reason)) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
};

window.addEventListener('unhandledrejection', preventKnownHttpOverlay, { capture: true });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
