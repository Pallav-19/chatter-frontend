import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.js";
import Chat from "./components/Chat.js";
import NoteState from "../src/components/contexts/AuthState";
function App() {
  return (
    <NoteState>
      <div className="App">
        <Router>
          <Routes>
            <Route exact index path="/" element={<Home />}></Route>
            <Route exact path="/chat" element={<Chat />}></Route>
          </Routes>
        </Router>
      </div>
    </NoteState>
  );
}

export default App;
