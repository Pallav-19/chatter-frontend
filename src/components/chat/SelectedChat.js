/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import ChatContext from "../contexts/chats/ChatContext";
import { Avatar, Tooltip } from "@chakra-ui/react";
import io from "socket.io-client";
import "../../index.css";
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
let socket, compareChat;
const SelectedChat = () => {
  const endref = React.useRef(null);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const {
    selectedChat,
    setSelectedChat,
    user,
    notifications,
    setNotifications,
    setChats,
  } = React.useContext(ChatContext);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [socketState, setSocketState] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [typer, setTyper] = React.useState("");

  const getSender = (user, users) => {
    return users[0]._id === user.userId ? users[1].name : users[0].name;
  };
  const getUser = (user, users) => {
    return users[0]._id === user.userId ? users[1] : users[0];
  };
  const TypingHandler = async (e) => {
    setNewMessage(e.target.value);
    if (!socketState && newMessage?.length < 0) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id, user.name);
    }
    let lastTyping = new Date().getTime();
    let timeout = 2000;
    setTimeout(() => {
      if (new Date().getTime() - lastTyping >= timeout && typing) {
        socket.emit("stop typing", selectedChat._id, user.name);
        setTyping(false);
      }
    }, timeout);
  };
  React.useEffect(() => {
    socket = io("http://35.154.71.7");

    socket.on("connected", () => {
      setSocketState(true);
    });
    socket.emit("setup", user);
    socket.on("typing", (user) => {
      setIsTyping(true);
      setTyper(user);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
      setTyper(user);
    });
  }, []);
  const send = async () => {
    if (!newMessage) return;
    setNewMessage("");
    socket.emit("stop typing", selectedChat._id, user.name);
    const { data } = await axios.post(
      "http://35.154.71.7/api/message/createMessage",
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
      socket.emit("new message", await data.newMessage);
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
      `http://35.154.71.7/api/message/getMessages/${selectedChat._id}`,

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
    socket.emit("join chat", selectedChat._id);
  };
  // //console.log(notifications, "-------------");
  React.useEffect(() => {
    endref.current?.scrollIntoView();
    socket.emit("update chats", user.userId);
    // setNotifications(localStorage.getItem("notifications"));
  }, [messages, typer, isTyping, notifications]);
  React.useEffect(() => {
    getMessages();
    compareChat = selectedChat;
  }, [selectedChat]);
  React.useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!compareChat || compareChat._id !== newMessage.chat._id) {
        if (
          !notifications.some((elem) => {
            return JSON.stringify(newMessage) === JSON.stringify(elem);
          })
        ) {
          setNotifications([newMessage, ...notifications]);
          // localStorage.setItem("notifications", [newMessage, ...notifications]);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
    socket.on("chats updated", (chats) => {
      setChats(chats);
    });
  });
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
                      width={"50%"}
                      textAlign={"center"}
                      bg={"green.100"}
                      padding={1}
                      fontFamily={"ubuntu,sans"}
                      borderRadius={"lg"}
                      color={"blackAlpha.700"}
                      fontSize={"xs"}
                      // justifySelf={"flex-start"}
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
                      <Box overflowY={"scroll"}>
                        {messages.map((m, i) => {
                          return (
                            <>
                              <Box
                                mb={1}
                                width={"100%"}
                                display={
                                  Number(
                                    new Date(
                                      messages[i - 1]?.createdAt
                                    ).getDate()
                                  ) !== Number(new Date(m.createdAt).getDate())
                                    ? "flex"
                                    : "none"
                                }
                                flexDir={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                              >
                                <Box
                                  height={"1px"}
                                  bg={"blackAlpha.500"}
                                  width={"25vw"}
                                ></Box>
                                <Text
                                  borderRadius={"lg"}
                                  padding={1.5}
                                  fontWeight={500}
                                  fontSize={"xs"}
                                >
                                  {new Date(m.createdAt)
                                    .toString()
                                    .slice(4, 15)}
                                </Text>
                                <Box
                                  height={"1px"}
                                  bg={"blackAlpha.500"}
                                  width={"25vw"}
                                ></Box>
                              </Box>
                              <Box
                                width={"100%"}
                                display={
                                  Number(
                                    new Date(
                                      messages[i - 1]?.createdAt
                                    ).getMinutes()
                                  ) !==
                                    Number(
                                      new Date(m.createdAt).getMinutes()
                                    ) ||
                                  messages[i - 1]?.sender._id !== m.sender._id
                                    ? "flex"
                                    : "none"
                                }
                                flexDirection={"row"}
                                alignItems={"center"}
                                justifyContent={
                                  m.sender._id === user.userId
                                    ? "flex-end"
                                    : "flex-start"
                                }
                              >
                                {" "}
                                <Tooltip
                                  hasArrow
                                  position={"bottom-start"}
                                  cursor="pointer"
                                  label={m.sender.name}
                                >
                                  <Avatar
                                    visibility={"hidden"}
                                    size={"xs"}
                                    name={m.sender.name}
                                    mt={2}
                                    mr={1.5}
                                  />
                                </Tooltip>
                                <Text
                                  fontSize={"xs"}
                                  padding={1.5}
                                  pb={0}
                                  pt={0}
                                >
                                  {` 0${new Date(m.createdAt)
                                    .getHours()
                                    .toString()}`.slice(-2)}
                                  :
                                  {` 0${new Date(m.createdAt)
                                    .getMinutes()
                                    .toString()}`.slice(-2)}
                                </Text>
                              </Box>
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
                                pb={0.5}
                                pt={0.5}
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
                                  padding={2}
                                  fontStyle={"ubuntu,sans"}
                                  fontSize={"sm"}
                                  color={
                                    m.sender._id === user.userId
                                      ? "white"
                                      : "blackAlpha.800"
                                  }
                                  borderRadius={"lg"}
                                  maxWidth={"50vw"}
                                  minWidth={"5vw"}
                                  bg={
                                    m.sender._id === user.userId
                                      ? "blue.500"
                                      : "blue.100"
                                  }
                                >
                                  {m.content}
                                </Text>
                              </Box>
                            </>
                          );
                        })}
                        <>
                          {" "}
                          {isTyping ? (
                            <Box
                              bg={"transparent"}
                              flexDirection={"row"}
                              alignItems={"center"}
                              justifyContent={"flex-start"}
                              width={"100%"}
                              padding={4}
                              pb={0}
                              display={"flex"}
                            >
                              <Avatar name={typer} size={"xs"} />
                              <Box
                                borderRadius={"lg"}
                                ml={1.5}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"space-evenly"}
                                padding={4}
                                bg={"blue.100"}
                                minWidth={"12%"}
                              >
                                <div
                                  className="d1"
                                  style={{
                                    backgroundColor: "#00000030",
                                    height: "10px",
                                    width: "10px",
                                    borderRadius: "50%",
                                    marginLeft: "2px",
                                  }}
                                ></div>
                                <div
                                  className="d2"
                                  style={{
                                    backgroundColor: "#00000050",
                                    height: "10px",
                                    width: "10px",
                                    borderRadius: "50%",
                                    marginLeft: "2px",
                                  }}
                                ></div>
                                <div
                                  className="d3"
                                  style={{
                                    backgroundColor: "#00000070",
                                    height: "10px",
                                    width: "10px",
                                    borderRadius: "50%",
                                    marginLeft: "2px",
                                  }}
                                ></div>
                              </Box>
                            </Box>
                          ) : (
                            <></>
                          )}{" "}
                        </>
                        <Box ref={endref}></Box>
                      </Box>
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
                  color={"blue.400"}
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
                  colorScheme={"teal"}
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
