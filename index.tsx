
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix: Access document through globalThis to bypass potential environment type issues where DOM lib is missing
const rootElement = (globalThis as any).document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);