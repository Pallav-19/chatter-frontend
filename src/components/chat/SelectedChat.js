/* eslint-disable no-unused-vars */
import React from "react";
import ChatContext from "../contexts/chats/ChatContext";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon, InfoIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../miscellaneous/ProfileModal";

const SelectedChat = () => {
  const { selectedChat, setSelectedChat, user } = React.useContext(ChatContext);
  const getSender = (user, users) => {
    return users[0]._id === user.userId ? users[1].name : users[0].name;
  };
  const getUser = (user, users) => {
    return users[0]._id === user.userId ? users[1] : users[0];
  };
  return (
    <>
      {selectedChat ? (
        <Box width={"100%"} h={"100%"} display={"flex"} flexDir={"column"}>
          <Box
            width={"100%"}
            padding={3}
            height={"15%"}
            display={"flex"}
            flexDir={"row"}
            borderTopRadius={"lg"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <IconButton
              icon={<ArrowBackIcon />}
              color={"black"}
              bg={"#e8e8e8"}
              borderRadius={"lg"}
              padding={"1"}
              _hover={{ color: "white", background: "teal" }}
              display={{ base: "flex", md: "none" }}
              onClick={() => {
                setSelectedChat("");
              }}
            ></IconButton>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontFamily={"ubuntu,sans"}
            >
              {selectedChat.isGroup
                ? selectedChat.name
                : getSender(user, selectedChat.users)}
            </Text>
            <>
              {!selectedChat.isGroup ? (
                <ProfileModal
                  userReceived={getUser(user, selectedChat.users)}
                ></ProfileModal>
              ) : (
                <IconButton
                  icon={<InfoIcon />}
                  color={"black"}
                  borderRadius={"lg"}
                  padding={"1"}
                  _hover={{ color: "white", background: "teal" }}
                />
              )}
            </>
          </Box>
          <Box
            width={"100%"}
            height={"83%"}
            bg={"#e8e8e8"}
            borderRadius={"lg"}
          ></Box>
        </Box>
      ) : (
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
        >
          <Text fontSize={"2xl"} padding={2} fontFamily={"ubuntu,sans"}>
            Click on a user to start chatting!
          </Text>
        </Box>
      )}
    </>
  );
};

export default SelectedChat;
