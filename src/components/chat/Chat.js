/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import ChatContext from "../contexts/chats/ChatContext";
import SideDrawer from "../miscellaneous/SideDrawer";
import MyChats from "../chat/MyChats";
import ChatBox from "../chat/ChatBox";
import { Box } from "@chakra-ui/react";
const Chat = () => {
  const {
    LoggedIn,

    selectedChat,

    setChatID,
  } = useContext(ChatContext);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      {LoggedIn && <SideDrawer />}
      <Box
        display={"flex"}
        width={"100%"}
        height={{ base: "100%", md: "85%" }}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"0.5rem"}
      >
        {LoggedIn && <MyChats />}
        {LoggedIn && <ChatBox />}
      </Box>
    </Box>
  );
};

export default Chat;
