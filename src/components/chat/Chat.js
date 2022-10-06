/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import ChatContext from "../contexts/chats/ChatContext";
import SideDrawer from "../miscellaneous/SideDrawer";
import MyChats from "../chat/MyChats";
import ChatBox from "../chat/ChatBox";
import "./Chat.css";
const Chat = () => {
  const { LoggedIn, setLoggedIn } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = React.useState(false);
  return (
    <div className="Chat">
      {LoggedIn && <SideDrawer />}
      <div className="chatbox">
        {LoggedIn && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {LoggedIn && <ChatBox fetchAgain={fetchAgain} />}
      </div>
    </div>
  );
};

export default Chat;
