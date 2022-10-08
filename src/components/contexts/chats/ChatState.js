/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import ChatContext from "./ChatContext";
import React from "react";
import { useToast } from "@chakra-ui/react";
import parseJwt from "../../../utils/parseJson";
import { useLocation } from "react-router-dom";

const ChatState = ({ children }) => {
  const [selectedChat, setSelectedChat] = React.useState();
  const [chats, setChats] = React.useState([]);
  const [chatID, setChatID] = React.useState([]);
  let [fetchAgain, setFetchAgain] = React.useState(0);
  const location = useLocation();
  const [LoggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState();
  const toast = useToast();
  React.useEffect(() => {
    if (localStorage.getItem("Auth")) {
      setLoggedIn(true);
      setUser(parseJwt(localStorage.getItem("Auth")));
    } else {
      setUser("");
      setLoggedIn(false);
    }
  }, [location]);
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        LoggedIn,
        setLoggedIn,
        user,
        setUser,
        fetchAgain,
        setFetchAgain,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatState;
