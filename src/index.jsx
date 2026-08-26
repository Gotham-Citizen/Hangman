import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Your main component

// 1. Target the 'root' element in your public/index.html
const container = document.getElementById('root');

// 2. Create a React root
const root = createRoot(container);

// 3. Render your App component
root.render(
    <App />
);
