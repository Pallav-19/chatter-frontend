/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import SideDrawer from "../miscellaneous/SideDrawer";
import MyChats from "../chat/MyChats";
import ChatBox from "../chat/ChatBox";
import "./Chat.css"
const Chat = () => {
  const { LoggedIn, setLoggedIn } = useContext(AuthContext);
  return (
    <div className="Chat">
      {LoggedIn && <SideDrawer />}
      <div className="chatbox">
        {LoggedIn && <MyChats />}
        {LoggedIn && <ChatBox />}
      </div>
    </div>
  );
};

export default Chat;
