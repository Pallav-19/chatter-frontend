/* eslint-disable no-unused-vars */
import ChatContext from "./ChatContext";

import React from "react";

const ChatState = ({ children }) => {
  return <ChatContext.Provider >{children}</ChatContext.Provider>;
};

export default ChatState;
