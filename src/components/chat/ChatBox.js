/* eslint-disable no-unused-vars */
import React from "react";
import { Box } from "@chakra-ui/react";
import ChatContext from "../contexts/chats/ChatContext";
import SelectedChat from "./SelectedChat";
const ChatBox = () => {
  const { selectedChat } = React.useContext(ChatContext);
  return (
    <Box
      height={"100%"}
      display={{ base: !selectedChat ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "65%" }}
      alignItems={"center"}
      borderRadius={"lg"}
      borderWidth="1px"
      p={1}
      bg={"white"}
    >
      <SelectedChat></SelectedChat>
    </Box>
  );
};

export default ChatBox;
