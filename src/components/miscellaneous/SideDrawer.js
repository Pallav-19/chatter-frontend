/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import axios from "axios";
import {
  Tooltip,
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Box,
  useToast,
  Badge,
} from "@chakra-ui/react";

import { BellIcon, ChevronDownIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import ChatContext from "../contexts/chats/ChatContext";
import ProfileModal from "./ProfileModal.js";
import SkeletonComponent from "./SkeletonComponent.js";
import UserList from "../Avatar/UserList";
const SideDrawer = () => {
  const { user } = React.useContext(ChatContext);
  const { colorMode, toggleColorMode } = useColorMode();
  let {
    selectedChat,
    notifications,
    setNotifications,
    setSelectedChat,
    chats,
    setChats,
    fetchAgain,
    setFetchAgain,
  } = React.useContext(ChatContext);
  const navigate = useNavigate();
  const [load, setLoad] = React.useState(false);
  const [search, setSearch] = React.useState();
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingChat, setLoadingChat] = React.useState(false);
  const [text, setText] = React.useState("  ");
  const { onOpen, isOpen, onClose } = useDisclosure();
  const toast = useToast();
  const logout = () => {
    localStorage.removeItem("Auth");
    navigate("/");

    toast({
      status: "success",
      isClosable: true,
      position: "top-left",
      title: "You have been logged out!",
      duration: 5000,
    });

    window.location.reload();
  };
  const handleSearch = async (query) => {
    setLoad(true);
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      setText(" ");

      const { data } = await axios.get(
        `https://chatter-nfu0.onrender.com/api/user/allUsers?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            authorisation: localStorage.getItem("Auth"),
          },
        }
      );
      if (data.success && data.users.length > 0) {
        setText(" ");
        setSearchResults(await data.users);
      }
      setLoading(false);
    } catch (err) {
      return toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    setLoad(false);
  };
  const getSender = (user, users) => {
    return users[0]?._id === user.userId ? users[1]?.name : users[0]?.name;
  };
  const accessChat = async (selectedUserId) => {
    //console.log(user.userId);
    //console.log(selectedUserId);
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        `https://chatter-nfu0.onrender.com/api/chat/accessChat`,
        { userId: selectedUserId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            authorisation: localStorage.getItem("Auth"),
          },
        }
      );
      if (!chats?.find(async (c) => c._id === (await data.chat?._id))) {
        setChats([await data.chat, ...chats]);
      }
      setSelectedChat(await data.chat);
      setLoadingChat(false);
    } catch (err) {
      return toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    onClose();
    navigate("/");
    setFetchAgain(fetchAgain++);
  };
  return (
    <Box
      display={"flex"}
      alignItems="center"
      justifyContent={"space-between"}
      width={"100%"}
      padding={"0.4rem 0.7rem"}
      borderWidth={"0.3rem"}
    >
      <Tooltip label="Search Users to chat" hasArrow placement="bottom">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </Tooltip>
      <Text
        display={{ base: "none" }}
        fontSize={{ base: "md", md: "2xl" }}
        fontFamily={"ubuntu,sans"}
      >
        Chatter
      </Text>
      <Box>
        <Menu>
          {" "}
          <MenuButton
            size={{ base: "sm", md: "md" }}
            mx={"2"}
            as={Button}
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </MenuButton>
        </Menu>

        <Menu>
          <MenuButton size={{ base: "sm", md: "md" }} mx={"2"} as={Button}>
            <BellIcon fontSize={"2xl"} margin="1"></BellIcon>
            <Badge
              hidden={!notifications.length}
              height={6}
              width={6}
              borderRadius={"50%"}
              colorScheme={"green"}
              padding={1}
            >
              {notifications.length}
            </Badge>
          </MenuButton>
          <MenuList>
            {notifications?.length < 1 ? (
              <MenuItem>No new mesages!</MenuItem>
            ) : (
              notifications?.map((n) => {
                //console.log("map");
                return (
                  <MenuItem
                    onClick={() => {
                      setSelectedChat(n.chat);
                      setNotifications(
                        notifications.filter((notification) => {
                          return n !== notification;
                        })
                      );
                    }}
                  >
                    {n.chat.isGroup
                      ? `New message in ${n.chat.name}`
                      : `${getSender(user, n.chat.users)} sent a message`}
                  </MenuItem>
                );
              })
            )}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            size={{ base: "sm", md: "md" }}
            mx={"2"}
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            <Avatar
              size={{ base: "xs", md: "sm" }}
              cursor={"pointer"}
              name={user?.name}
            ></Avatar>
          </MenuButton>
          <MenuList>
            <ProfileModal userReceived={user}>
              <MenuItem>
                <i
                  style={{ marginRight: "0.5rem" }}
                  className="fa-solid fa-user "
                ></i>
                My Profile
              </MenuItem>
            </ProfileModal>

            <MenuDivider />
            <MenuItem
              onClick={() => {
                logout();
              }}
            >
              <i
                style={{ marginRight: "0.5rem" }}
                className="fa-solid fa-right-from-bracket "
              ></i>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer
        className="drawer"
        placement="left"
        onClose={() => {
          onClose();
          setSearchResults([]);
          setSearch("");
          setLoad(false);
        }}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerCloseButton />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} flexDirection={"row"}>
              <Input
                autoFocus
                placeholder="Search by name or email."
                mr={"2"}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                mb={1}
                value={search}
              />
              {/* <Button isLoading={load} onClick={handleSearch}>
                Go
              </Button> */}
            </Box>
            <Box>
              {!loading ? (
                search?.length > 0 ? (
                  <Box
                    padding={{ base: "2", md: "4" }}
                    display={"flex"}
                    flexDir={"column"}
                    width={"100%"}
                    height={"100%"}
                    overflowY={"hidden"}
                    // maxHeight={"40vh"}
                  >
                    {searchResults?.map((user) => {
                      return (
                        <UserList
                          user={user}
                          handleClick={() => {
                            accessChat(user._id);
                          }}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <></>
                )
              ) : (
                <>
                  <SkeletonComponent />
                </>
              )}{" "}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
