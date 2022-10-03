/* eslint-disable no-unused-vars */
import ChatContext from "./ChatContext";

import React from "react";

const ChatState = ({ children }) => {
  const [selectedChat, setSelectedChat] = React.useState();
  const [chats, setChats] = React.useState();
  return (
    <ChatContext.Provider
      value={{ selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatState;
