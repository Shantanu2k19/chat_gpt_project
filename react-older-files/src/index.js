import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import App from './pages/App';
import LandingPage from './pages/LandingPage.js'
import TestingPage from './pages/testpage'
import Error from './pages/errorPage'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<App />} />
                <Route path="/talkgpt" exact element={<LandingPage />} />
                <Route path="/test" exact element={<TestingPage />} />
                <Route path="/error" exact element={<Error />} />
            </Routes>
        </BrowserRouter>
    </div>
);

