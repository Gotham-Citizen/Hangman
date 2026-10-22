import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import "./utils/i18n.js";
import "./index.css";

// React mounts the entire application into the 'root' element in index.html
const container = document.getElementById('root');

const root = createRoot(container);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
