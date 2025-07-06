import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./pages/Login";
import Books from "./pages/Books";
import NewBook from "./pages/NewBook";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/books" element={<Books />} />
                <Route path="/book/new/:bookId" element={<NewBook />} />
            </Routes>
        </Router>
    );
}