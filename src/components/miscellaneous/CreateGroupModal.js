/* eslint-disable no-unused-vars */
import {
  FormControl,
  InputGroup,
  InputRightAddon,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import ChatContext from "../contexts/chats/ChatContext";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  useToast,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import UserList from "../Avatar/UserList";
import SelectedUsers from "./SelectedUsers";

const CreateGroupModal = ({ children, isEditing }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [length, setLength] = React.useState(15);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groupName, setGroupName] = React.useState();
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [searchResult, setSearchResults] = React.useState([]);
  const [search, setSearch] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState(" ");
  const [createLoading, setCreateLoading] = React.useState(false);
  const { chats, setChats, setSelectedChat, selectedChat } =
    React.useContext(ChatContext);
  // const [createLoading,setCreateLoading]
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      setText(" ");

      const { data } = await axios.get(`/api/user/allUsers?search=${search}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          authorisation: localStorage.getItem("Auth"),
        },
      });
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
  };
  const handleSelection = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User already added!",
        duration: "5000",
        status: "warning",
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };
  const handleDelete = (user) => {
    const filtered = selectedUsers.filter((u) => user._id !== u._id);

    setSelectedUsers([...filtered]);
  };
  const handleSubmit = async () => {
    setCreateLoading(true);
    if (selectedUsers.length < 1) {
      toast({
        title: "Select Users!",
        description: " Group cannot be empty",
        duration: "5000",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
    if (!groupName) {
      toast({
        title: "Group name missing!",
        duration: "5000",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
    if (groupName && selectedUsers.length >= 2) {
      try {
        const { data } = await axios.post(
          "/api/chat/createGroup",
          {
            name: groupName,
            users: selectedUsers?.map((u) => u._id),
          },
          {
            headers: {
              authorisation: localStorage.getItem("Auth"),
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
          }
        );
        console.log(data);
        toast({
          title: await data.message,
          duration: "5000",
          status: (await data.success) ? "success" : "error",
          isClosable: true,
          position: "top-left",
        });

        if (await data.success) {
          setChats([await data.group, ...chats]);
          onClose();
          setGroupName("");
          setSelectedUsers([]);
          setSearch("");
        }
        navigate("/");
      } catch (err) {
        toast({
          title: err.message,
          duration: "5000",
          status: "error",
          isClosable: true,
          position: "top-left",
        });
      }
    }
    setCreateLoading(false);
  };
  const handleAdd = async () => {
    setCreateLoading(true);
    try {
      const { data } = await axios.put(
        "/api/chat/addToGroup",
        {
          chatId: selectedChat._id,
          users: selectedUsers?.map((u) => u._id),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            authorisation: localStorage.getItem("Auth"),
          },
        }
      );
      toast({
        title: await data.message,
        duration: "5000",
        status: (await data.success) ? "success" : "error",
        isClosable: true,
        position: "top-left",
      });
      if (await data.success) {
        console.log("success");
        setChats([await data.chat, ...chats]);
        onClose();
        setGroupName("");
        setSelectedUsers([]);
        setSearch("");
        setSelectedChat(await data.chat);
        navigate("/");
      }
    } catch (err) {
      toast({
        title: err.message,
        duration: "5000",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }

    setCreateLoading(false);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setLoading(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            fontFamily={"ubuntu,sans"}
            justifyContent="center"
            fontSize={"2rem"}
          >
            {!isEditing ? "Create New Group" : "Add members to group"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems="center">
            <FormControl>
              <InputGroup>
                <Input
                  autoFocus
                  hidden={isEditing}
                  borderWidth={3}
                  value={groupName}
                  mb={3}
                  placeholder="Enter your group's name!"
                  onChange={(e) => {
                    setGroupName(e.target.value.slice(0, 15));
                    setLength(15 - e.target.value.slice(0, 15).length);
                  }}
                ></Input>
                <InputRightAddon
                  hidden={isEditing}
                  children={length}
                ></InputRightAddon>
              </InputGroup>
            </FormControl>
            <FormControl>
              <Input
                autoFocus={isEditing}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                mb={1}
                borderWidth={3}
                value={search}
                placeholder="Search and select multiple users to add"
              ></Input>
            </FormControl>
          </ModalBody>
          <Box pl={5} pr={5} display={"flex"} width={"100%"} flexWrap={"wrap"}>
            {selectedUsers?.map((su) => {
              return (
                <SelectedUsers
                  key={su._id}
                  user={su}
                  handleClick={() => {
                    handleDelete(su);
                  }}
                />
              );
            })}
          </Box>
          <Box overflowY={"scroll"}>
            {!loading ? (
              search?.length > 0 ? (
                <Box
                  padding={5}
                  display={"flex"}
                  flexDir={"column"}
                  width={"100%"}
                  maxHeight={"40vh"}
                >
                  {searchResult?.map((user) => {
                    return (
                      <UserList
                        isEditing={isEditing}
                        user={user}
                        handleClick={() => {
                          handleSelection(user);
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
                <Stack padding={5} mt={1}>
                  <Skeleton mb={1} height="1.75rem" />
                  <Skeleton height="1.75rem" />
                  <Skeleton height="1.75rem" />
                  <Skeleton height="1.75rem" />
                </Stack>
              </>
            )}{" "}
          </Box>
          <ModalFooter>
            <Button
              isLoading={createLoading}
              loadingText={isEditing ? "Adding" : "Creating"}
              colorScheme="blue"
              disabled={selectedUsers.length < 1 && isEditing ? true : false}
              mr={3}
              onClick={() => {
                if (!isEditing) {
                  handleSubmit();
                } else if (isEditing) {
                  handleAdd();
                }
              }}
            >
              {!isEditing ? "Create Group" : "Add "}
            </Button>
            <Button
              onClick={() => {
                onClose();
                setSearchResults([]);
                setSelectedUsers([]);
                setGroupName("");
                setSearch("");
                setCreateLoading(false);
                setLoading(false);
              }}
              colorScheme={"red"}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
