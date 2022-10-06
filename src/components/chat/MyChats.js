/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Button, useToast, Text, Stack, Spinner } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatContext from "../contexts/chats/ChatContext";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import CreateGroupModal from "../miscellaneous/CreateGroupModal";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = React.useState(false);
  const { selectedChat, setSelectedChat, chats, setChats } =
    React.useContext(ChatContext);
  const { user } = React.useContext(ChatContext);
  const toast = useToast();
  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/chat/getChats", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorisation: localStorage.getItem("Auth"),
        },
      });
      if ((await data.length) > 0) {
        setChats(await data);
      }
      setLoading(false);
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
    setFetchAgain(true);
  };
  const getSender = (user, users) => {
    return users[0]._id === user.userId ? users[1].name : users[0].name;
  };
  React.useEffect(() => {
    fetchChats();
    console.log(chats);
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="column"
      p={3}
      bg="white"
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
        <Text fontSize={"1.55rem"} fontFamily={"ubuntu, sans"}>
          My Chats
        </Text>
        <CreateGroupModal>
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
      {!loading ? (
        <Box
          display={"flex"}
          flexDir={"column"}
          p={3}
          bg="#f8f8f8"
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
                      onClick={() => {
                        setSelectedChat(chat);
                      }}
                      cursor={"pointer"}
                      bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                      color={selectedChat === chat ? "white" : "black"}
                      px={3}
                      py={2}
                      borderRadius={"lg"}
                      key={chat._id}
                    >
                      <Text>
                        {!chat?.isGroup
                          ? getSender(user, chat.users)
                          : chat.name}
                      </Text>
                    </Box>
                  );
                })}
              </Stack>
            </>
          ) : (
            <h1>no chats</h1>
          )}
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDir={"column"}
          p={3}
          bg="#f8f8f8"
          width={"100%"}
          height={"100%"}
          overflowY={"hidden"}
          borderRadius={"lg"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />{" "}
        </Box>
      )}
    </Box>
  );
};

export default MyChats;
