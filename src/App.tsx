import "./App.css";
import React from "react";
import Home from "./views/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
                    {/* <Route path='/courses' element={<SetOptions />} />
              <Route path='/schedules' element={<ViewSchedules />}></Route> */}
                </Routes>
            </Router>
            <Footer />
        </div>
    );
}

export default App;
