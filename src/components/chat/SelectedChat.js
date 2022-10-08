/* eslint-disable no-unused-vars */
import React from "react";
import ChatContext from "../contexts/chats/ChatContext";
import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import ProfileModal from "../miscellaneous/ProfileModal";
import GroupInfoModal from "../miscellaneous/GroupInfoModal";
import { useColorMode } from "@chakra-ui/react";
import CreateGroupModal from "../miscellaneous/CreateGroupModal";
const SelectedChat = () => {
  const { colorMode } = useColorMode();
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
              // color={"black"}
              // bg={"#fffff"}
              borderRadius={"lg"}
              padding={"1"}
              _hover={{ color: "white", background: "blue.500" }}
              display={{ base: "flex", md: "none" }}
              onClick={() => {
                setSelectedChat("");
              }}
            ></IconButton>
            <Text
              // wordBreak={false}
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
                <Box
                  display={"flex"}
                  justifyContent={"space-evenly"}
                  alignItems={"center"}
                  // width={"20%"}
                >
                  <CreateGroupModal isEditing={true}>
                    <Button
                      hidden={selectedChat.admin._id !== user.userId}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      mr={5}
                      borderRadius={"lg"}
                      padding={2.5}
                      _hover={{ color: "white", background: "blue.500" }}
                    >
                      <i class="fa-solid fa-user-plus"></i>
                    </Button>
                  </CreateGroupModal>
                  <GroupInfoModal>
                    {" "}
                    <IconButton
                      icon={<InfoIcon />}
                      borderRadius={"lg"}
                      padding={"1"}
                      _hover={{ color: "white", background: "blue.500" }}
                    />
                  </GroupInfoModal>
                </Box>
              )}
            </>
          </Box>
          <Box
            width={"100%"}
            height={"83%"}
            bg={colorMode === "light" ? "#e8e8e8" : "#ffffff14"}
            borderRadius={"lg"}
          >
            {!selectedChat.lastMessage ? (
              <Box
                height={"100%"}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                fontFamily={"ubuntu,sans"}
                fontSize={"xl"}
              >
                No Messages yet
              </Box>
            ) : (
              <></>
            )}
          </Box>
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
