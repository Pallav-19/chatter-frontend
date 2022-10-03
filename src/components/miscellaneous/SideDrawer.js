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
import AuthContext from "../contexts/Auth/AuthContext";
import ProfileModal from "./ProfileModal.js";
import SkeletonComponent from "./SkeletonComponent.js";
import ChatContext from "../contexts/chats/ChatContext";
import "./SideDrawer.css";
import UserList from "../Avatar/UserList";
const SideDrawer = () => {
  const { user } = React.useContext(AuthContext);
  const { selectedChat, setSelectedChat } = React.useContext(ChatContext);
  const navigate = useNavigate();

  const [search, setSearch] = React.useState();
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingChat, setLoadingChat] = React.useState(false);
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
      const { data } = await axios.get(
        `http://localhost:5100/api/user/allUsers?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorisation: localStorage.getItem("Auth"),
          },
        }
      );
      setSearchResults(await data.users);
      setLoading(false);
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
      setSelectedChat(await data.response);
      setLoadingChat(false);
      onClose();
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
  return (
    <div className="sideDrawer">
      <Tooltip label="Search Users to chat" hasArrow placement="bottom">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </Tooltip>
      <Text fontSize={"2xl"} fontFamily={"ubuntu,sans"}>
        Chatter
      </Text>
      <div>
        <Menu>
          <MenuButton mx={"2"} as={Button}>
            <BellIcon fontSize={"2xl"} margin="1"></BellIcon>
          </MenuButton>
          <MenuList></MenuList>
        </Menu>
        <Menu>
          <MenuButton mx={"2"} as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor={"pointer"} name={user?.name}></Avatar>
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>
                <i class="fa-solid fa-user menuicons"></i>My Profile
              </MenuItem>
            </ProfileModal>

            <MenuDivider />
            <MenuItem
              onClick={() => {
                logout();
              }}
            >
              <i class="fa-solid fa-right-from-bracket menuicons"></i>Logout
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
            ) : (
              searchResults.map((searchResult) => {
                return <UserList user={searchResult} accessChat={accessChat} />;
              })
              // <span>results</span>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
