/* eslint-disable no-unused-vars */
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.js";
import AuthState from "../src/components/contexts/AuthState";

function App() {
  return (
    <AuthState>
      <div className="App">
        <Router>
          <Routes>
            <Route exact index path="/" element={<Home />}></Route>
          </Routes>
        </Router>
      </div>
    </AuthState>
  );
}

export default App;
