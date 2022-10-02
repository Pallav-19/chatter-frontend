/* eslint-disable no-unused-vars */
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.js";

function App() {
  return (
      <div className="App">
        <Routes>
          <Route exact index path="/" element={<Home />}></Route>
        </Routes>
      </div>
  );
}

export default App;
