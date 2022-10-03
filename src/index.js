import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthState from "./components/contexts/Auth/AuthState";
import ChatState from "./components/contexts/chats/ChatState";
const root = ReactDOM.createRoot(document.getElementById("root"));

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const theme = extendTheme({ colors });

root.render(
  <React.StrictMode>
    <Router>
      <AuthState>
        <ChatState>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </ChatState>
      </AuthState>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
