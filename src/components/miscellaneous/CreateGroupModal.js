/* eslint-disable no-unused-vars */
import { FormControl, useDisclosure } from "@chakra-ui/react";
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

const CreateGroupModal = ({ children }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groupName, setGroupName] = React.useState();
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [searchResult, setSearchResults] = React.useState([]);
  const [search, setSearch] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState(" ");
  const { chats, setChats } = React.useContext(ChatContext);
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
          authorisation: localStorage.getItem("Auth"),
        },
      });
      if (data.success && data.users.length > 0) {
        setText(" ");
        setSearchResults(await data.users);
        console.log(await data.users);
        setLoading(false);
      }
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
    if (!selectedUsers) {
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
    if (groupName && selectedUsers) {
      console.log(JSON.stringify(selectedUsers.map((u) => u._id)));
      try {
        const { data } = await axios.post(
          "/api/chat/createGroup",
          {
            name: groupName,
            users: selectedUsers.map((u) => u._id),
          },
          {
            headers: {
              authorisation: localStorage.getItem("Auth"),
              "Content-Type": "application/json",
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
          setSelectedUsers("");
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
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            fontFamily={"ubuntu,sans"}
            justifyContent="center"
            fontSize={"2rem"}
          >
            Create New Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems="center">
            <FormControl>
              <Input
                value={groupName}
                mb={3}
                placeholder="Enter your group's name!"
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                mb={1}
                value={search}
                placeholder="Add users e.g. Pallav,John"
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
                  {searchResult?.slice(0, 4).map((user) => {
                    return (
                      <UserList
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
              colorScheme="blue"
              mr={3}
              onClick={() => {
                handleSubmit();
              }}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
