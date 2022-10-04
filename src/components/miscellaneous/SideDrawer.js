/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
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
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ChatContext from "../contexts/chats/ChatContext";
import ProfileModal from "./ProfileModal.js";
import SkeletonComponent from "./SkeletonComponent.js";
import "./SideDrawer.css";
import UserList from "../Avatar/UserList";
const SideDrawer = () => {
  const { user } = React.useContext(ChatContext);
  const { selectedChat, setSelectedChat, chats, setChats } =
    React.useContext(ChatContext);
  const navigate = useNavigate();

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
  };
  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "Enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    try {
      setLoading(true);
      setText(" ");

      const { data } = await axios.get(`/api/user/allUsers?search=${search}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorisation: localStorage.getItem("Auth"),
        },
      });
      if (data.success && data.users.length > 0) {
        setText(" ");
        setSearchResults(await data.users);
        setLoading(false);
      } else {
        toast({
          title: await data.message,
          status: (await data.success) ? "success" : "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setLoading(false);
        setText("Couldn't Search !");
      }
    } catch (err) {
      return toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        `/api/chat/accessChat`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorisation: localStorage.getItem("Auth"),
          },
        }
      );
      if (!chats.find(async (c) => c._id === (await data.chat._id))) {
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
        position: "top-right",
      });
    }
    onClose();
    navigate("/");
  };
  return (
    <div className="sideDrawer">
      <Tooltip label="Search Users to chat" hasArrow placement="bottom">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </Tooltip>
      <Text fontSize={{ base: "md", md: "2xl" }} fontFamily={"ubuntu,sans"}>
        Chatter
      </Text>
      <div>
        <Menu>
          <MenuButton size={{ base: "sm", md: "md" }} mx={"2"} as={Button}>
            <BellIcon fontSize={"2xl"} margin="1"></BellIcon>
          </MenuButton>
          <MenuList></MenuList>
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
            <ProfileModal user={user}>
              <MenuItem>
                <i  className="fa-solid fa-user menuicons"></i>My Profile
              </MenuItem>
            </ProfileModal>

            <MenuDivider />
            <MenuItem
              onClick={() => {
                logout();
              }}
            >
              <i  className="fa-solid fa-right-from-bracket menuicons"></i>Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <Drawer
        className="drawer"
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerCloseButton />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <div className="searchBox">
              <Input
                placeholder="Search by name or email."
                mr={"2"}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </div>
            {loading ? (
              <SkeletonComponent />
            ) : searchResults.length > 0 ? (
              searchResults.map((searchResult) => {
                return <UserList user={searchResult} accessChat={accessChat} />;
              })
            ) : (
              <span>{text}</span>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
