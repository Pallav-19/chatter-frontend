/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import ChatContext from "../contexts/chats/ChatContext";
import { Avatar, Box, Text } from "@chakra-ui/react";
import SelectedChat from "../chat/SelectedChat";
const UserList = ({ user, handleClick, isEditing }) => {
  const { selectedChat } = React.useContext(ChatContext);
  return (
    <div>
      <Box
        onClick={handleClick}
        display={"flex"}
        cursor="pointer"
        bg={"#e8e8e8"}
        _hover={{ color: "white", background: "blue.500" }}
        w={"100%"}
        px={3}
        py={2}
        m={2}
        alignItems={"center"}
        color={"black"}
        borderRadius={"lg"}
        hidden={
          isEditing &&
          selectedChat.users.some((elem) => {
            return JSON.stringify(user) === JSON.stringify(elem);
          })
        }
      >
        <Avatar mr={2} size={"sm"} name={user.name} cursor={"pointer"}></Avatar>
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize={"xs"}>
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default UserList;
