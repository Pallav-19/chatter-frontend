/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import ChatContext from "../contexts/chats/ChatContext";
import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import ProfileModal from "../miscellaneous/ProfileModal";
import GroupInfoModal from "../miscellaneous/GroupInfoModal";
import { useColorMode } from "@chakra-ui/react";
import CreateGroupModal from "../miscellaneous/CreateGroupModal";
const SelectedChat = () => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { selectedChat, setSelectedChat, user } = React.useContext(ChatContext);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const getSender = (user, users) => {
    return users[0]._id === user.userId ? users[1].name : users[0].name;
  };
  const getUser = (user, users) => {
    return users[0]._id === user.userId ? users[1] : users[0];
  };
  const TypingHandler = async (e) => {
    setNewMessage(e.target.value);
  };
  const send = async () => {
    setNewMessage("");
    const { data } = await axios.post(
      "/api/message/createMessage",
      {
        chatId: selectedChat._id,
        content: newMessage,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorisation: localStorage.getItem("Auth"),
        },
      }
    );
    if (await data.success) {
      setMessages([...messages, await data.newMessage]);
    } else {
      toast({
        title: await data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const getMessages = async () => {
    if (!selectedChat) {
      return;
    }
    setLoading(true);
    const { data } = await axios.get(
      `/api/message/getMessages/${selectedChat._id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorisation: localStorage.getItem("Auth"),
        },
      }
    );
    if (await data.success) {
      setMessages(await data.messages);
    } else {
      toast({
        title: await data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    setLoading(false);
  };
  React.useEffect(() => {
    getMessages();
  }, [selectedChat]);
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
            <Box
              display={"flex"}
              flexDirection={"column"}
              width={"100%"}
              height={"100%"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              {!loading ? (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  width={"100%"}
                  height={"85%"}
                  mb={-1}
                  p={2}
                  bg={"transparent"}
                  alignItems={"center"}
                  justifyContent={!loading ? "flex-end" : "center"}
                >
                  {messages.length < 1 ? (
                    <Box
                      textAlign={"center"}
                      bg={"grey"}
                      padding={2}
                      fontFamily={"ubuntu,sans"}
                      borderRadius={"lg"}
                      color={"black"}
                      fontSize={"sm"}
                    >
                      Messages are end to end encrypted and safe with chatter!
                      start chatting safely!
                    </Box>
                  ) : (
                    <Box
                      height={"100%"}
                      width={"100%"}
                      padding={3}
                      overflowY={"scroll"}
                      flexDir={"column"}
                      display={"flex"}
                      justifyContent={"flex-end"}
                    >
                      <ScrollableFeed forceScroll={!newMessage}>
                        {messages.map((m, i) => {
                          return (
                            <Box
                              flexDirection={"row"}
                              alignItems={"center"}
                              justifyContent={
                                m.sender._id === user.userId
                                  ? "flex-end"
                                  : "flex-start"
                              }
                              width={"100%"}
                              padding={1}
                              display={"flex"}
                            >
                              <Tooltip
                                hasArrow
                                position={"bottom-start"}
                                cursor="pointer"
                                label={m.sender.name}
                              >
                                <Avatar
                                  visibility={
                                    messages[i + 1]?.sender?._id ===
                                      m?.sender?._id ||
                                    m?.sender?._id === user.userId
                                      ? "hidden"
                                      : ""
                                  }
                                  size={"xs"}
                                  name={m.sender.name}
                                  mt={2}
                                  mr={1.5}
                                />
                              </Tooltip>
                              <Text
                                padding={1.5}
                                fontStyle={"ubuntu,sans"}
                                fontSize={"sm"}
                                color={
                                  m.sender._id === user.userId
                                    ? "black"
                                    : "black"
                                }
                                borderRadius={"lg"}
                                maxWidth={"50vw"}
                                bg={
                                  m.sender._id === user.userId
                                    ? "blue.100"
                                    : "green.100"
                                }
                              >
                                {m.content}
                              </Text>
                            </Box>
                          );
                        })}
                      </ScrollableFeed>
                    </Box>
                  )}
                </Box>
              ) : (
                <Spinner
                  size={"xl"}
                  w={20}
                  h={20}
                  alignSelf={"center"}
                  margin={"auto"}
                ></Spinner>
              )}
              <Box
                display={"flex"}
                flexDirection={"row"}
                width={"100%"}
                height={"15%"}
                mb={1}
                p={2}
                bg={"transparent"}
              >
                <FormControl
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMessage) send();
                  }}
                  mr={2}
                >
                  <Input
                    onChange={(e) => {
                      TypingHandler(e);
                    }}
                    value={newMessage}
                    variant="filled"
                    autoFocus={true}
                    placeholder="Type a message"
                    display={"flex"}
                    flexDir={"column"}
                    overflowY={"scroll"}
                    borderWidth={3}
                  ></Input>
                </FormControl>
                <Button
                  onClick={() => {
                    send();
                  }}
                  type="submit"
                  colorScheme={""}
                  borderRadius={"lg"}
                >
                  <i class="fa-solid fa-arrow-right"></i>
                </Button>
              </Box>
            </Box>
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
