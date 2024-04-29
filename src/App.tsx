import "./App.css";
import React from "react";
import Home from "./views/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InputData from "./views/InputData";
import Tournament from "./views/Tournament";

function App() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Header />
            <Router>
                <Routes>
                    <Route index element={<Home />}></Route>
                    <Route path="/input-data" element={<InputData />} />
                    <Route path="/tournament" element={<Tournament />} />
                    <Route path="/formatter" element={<InputData />} />
                </Routes>
            </Router>
            <Footer />
        </div>
    );
}

export default App;
