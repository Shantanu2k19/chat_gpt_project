import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import App from './pages/App';
import LandingPage from './pages/LandingPage';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<App />} />
                <Route path="/talkgpt" exact element={<LandingPage />} />
            </Routes>
        </BrowserRouter>
    </div>
);

