/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  Box,
  Button,
  useToast,
  Text,
  Stack,
  Spinner,
  Avatar,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatContext from "../contexts/chats/ChatContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CreateGroupModal from "../miscellaneous/CreateGroupModal";
const MyChats = () => {
  const [loading, setLoading] = React.useState(false);
  const { selectedChat, setSelectedChat, chats, setChats } =
    React.useContext(ChatContext);
  const { user } = React.useContext(ChatContext);
  const toast = useToast();
  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://chatter-nfu0.onrender.com/api/chat/getChats",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            authorisation: localStorage.getItem("Auth"),
          },
        }
      );
      if ((await data.length) > 0) {
        console.log(await data);
        setChats(await data);
      }
      setLoading(false);
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };
  const getSender = (user, users) => {
    return users[0]?._id === user.userId ? users[1]?.name : users[0]?.name;
  };
  React.useEffect(() => {
    fetchChats();
    console.log(chats);
  }, [useLocation()]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="column"
      p={3}
      // bg="white"
      w={{ base: "100%", md: "35%" }}
      h={"100%"}
      borderRadius="lg"
      borderWidth={"1px"}
      mx={1}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "1.75rem", md: "2rem" }}
        fontFamily={"Ubuntu sans"}
        display={"flex"}
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text fontSize={"3xl"} fontFamily={"ubuntu, sans"}>
          Chatter
        </Text>
        <CreateGroupModal isEditing={false}>
          <Button
            fontFamily={"ubuntu, sans"}
            display={"flex"}
            fontSize="1rem"
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </CreateGroupModal>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg="#ffffff14"
        width={"100%"}
        height={"100%"}
        overflowY={"hidden"}
        borderRadius={"lg"}
      >
        {chats ? (
          <>
            <Stack height={"100%"} width={"100%"} p={1} overflowY={"scroll"}>
              {chats.map((chat) => {
                return (
                  <Box
                    maxHeight={"15%"}
                    onClick={() => {
                      setSelectedChat(chat);
                    }}
                    cursor={"pointer"}
                    bg={selectedChat === chat ? "blue.500" : "#e8e8e8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={chat._id}
                  >
                    <Box height={"100%"} display={"flex"} alignItems={"center"}>
                      <Avatar
                        mr={3}
                        name={
                          !chat?.isGroup
                            ? getSender(user, chat?.users)
                            : chat.name
                        }
                        size={"sm"}
                      />
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                      >
                        <Text>
                          {!chat?.isGroup
                            ? getSender(user, chat.users)
                            : chat.name}
                        </Text>
                        {chat?.lastMessage && (
                          <Text fontWeight={"600"} fontSize={"xs"}>
                            {chat?.lastMessage?.sender?.name?.split(" ")[0]} :{" "}
                            <i>{chat.lastMessageContent}</i>
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </>
        ) : (
          <Text>no chats</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
