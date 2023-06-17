/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  useDisclosure,
  IconButton,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Box,
  useToast,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { EditIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import ProfileModal from "../miscellaneous/ProfileModal";
import SelectedUsers from "./SelectedUsers";
import ChatContext from "../contexts/chats/ChatContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const GroupInfoModal = ({ children }) => {
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat, user } = React.useContext(ChatContext);
  const [leaveLoading, setLeaveLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = React.useState("");
  const [length, setLength] = React.useState(selectedChat.name.length);
  const [removeLoading, setRemoveloading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const toast = useToast();

  const handleRemove = async (userId) => {
    if (user.userId !== userId && selectedChat.users.length <= 3) {
      toast({
        title: "Cannot remove!",
        description: "Group must have atleast three members!",
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "top-left",
      });
      return;
    }
    setRemoveloading(true);
    const { data } = await axios.put(
      "http://localhost:5000/api/chat/removeFromGroup",
      {
        chatId: selectedChat._id,
        userId,
        self: user.userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
           
          authorisation: localStorage.getItem("Auth"),
        },
      }
    );
    toast({
      title: await data.message,
      duration: 5000,
      isClosable: true,
      status: (await data.success) ? "success" : "error",
      position: "top-left",
    });
    setRemoveloading(false);
    navigate("/");
    if (await data.success) setSelectedChat(await data.result);
  };
  const handleRename = async () => {
    setRenameLoading(true);
    if (groupChatName) {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/renameGroup",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
             
            authorisation: localStorage.getItem("Auth"),
          },
        }
      );
      toast({
        title: await data.message,
        duration: 5000,
        isClosable: true,
        status: (await data.success) ? "success" : "error",
        position: "top-left",
      });
      navigate("/");
      if (await data.success) {
        setSelectedChat(await data.result);
      }
    }
    setRenameLoading(false);
    toggleEditName();
  };

  const [isEditable, setIsEditable] = React.useState(false);
  const toggleEditName = () => {
    setIsEditable(!isEditable);
    setGroupChatName(selectedChat.name);
  };
  return (
    <>
      <Box
        onClick={() => {
          setGroupChatName(selectedChat?.name);
          onOpen();
        }}
      >
        {children}
      </Box>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsEditable(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent="center"
            alignItems={"center"}
            fontSize={"4xl"}
            padding={5}
          >
            {" "}
            {isEditable ? (
              <InputGroup>
                <Input
                  mt={5}
                  autoFocus
                  width={"100%"}
                  fontFamily={"ubuntu,sans"}
                  fontSize={"2xl"}
                  borderWidth={3}
                  padding={5}
                  value={groupChatName}
                  placeholder="Edit group name here"
                  onChange={(e) => {
                    setGroupChatName(e.target.value.slice(0, 15));
                    setLength(e.target.value.slice(0, 15).length);
                  }}
                ></Input>
              </InputGroup>
            ) : (
              <Text mt={5}>{selectedChat.name}</Text>
            )}
            {!isEditable ? (
              <IconButton
                onClick={() => {
                  toggleEditName();
                }}
                padding={3}
                colorScheme={"blue"}
                ml={3}
              >
                <EditIcon fontSize={"lg"} />
              </IconButton>
            ) : (
              <>
                {" "}
                <IconButton
                  isLoading={renameLoading}
                  disabled={
                    !groupChatName || selectedChat.name === groupChatName
                  }
                  mt={5}
                  padding={4}
                  colorScheme={"green"}
                  ml={3}
                  onClick={() => {
                    handleRename();
                  }}
                >
                  <CheckIcon fontSize={"lg"} />
                </IconButton>
                <IconButton
                  mt={5}
                  onClick={() => {
                    toggleEditName();
                  }}
                  padding={4}
                  colorScheme={"red"}
                  ml={3}
                >
                  <CloseIcon fontSize={"lg"} />
                </IconButton>
              </>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEditable && (
              <Text textAlign={"right"} width={"70%"} mt={-7}>{`${
                15 - length
              }/15`}</Text>
            )}
            <Text textAlign={"right"} mb={4}>
              Created on :{"   "}
              <b>
                {new Date(selectedChat.createdAt).toString().slice(0, 24)}
              </b>{" "}
              by{" "}
              <ProfileModal userReceived={selectedChat.admin}>
                <Text cursor={"pointer"} color="blue.500">
                  {selectedChat.admin.name}
                </Text>
              </ProfileModal>
            </Text>
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton
                    _expanded={{ bg: "blue.500", color: "white" }}
                  >
                    <Box flex="1" textAlign="left">
                      <Text
                        fontFamily={"ubuntu,sans"}
                        fontSize={"2xl"}
                        pl={5}
                        pr={5}
                      >
                        Group Members {"  "} {`(${selectedChat.users.length})`}
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box
                    pl={1}
                    pr={1}
                    maxHeight={"35vh"}
                    overflowY={"scroll"}
                    display={"flex"}
                    width={"100%"}
                    flexWrap={"wrap"}
                  >
                    {selectedChat.users?.map((su) => {
                      //console.log(su._id + "self");
                      //console.log(user.userId + "self");
                      return (
                        <SelectedUsers
                          isEditing={true}
                          Admin={selectedChat.admin._id}
                          isAdmin={
                            user.userId === selectedChat.admin._id
                              ? true
                              : false
                          }
                          key={su._id}
                          user={su}
                          self={su._id === user.userId ? true : false}
                          handleClick={() => {
                            handleRemove(su._id);
                          }}
                        />
                      );
                    })}
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Done
            </Button>
            <Button
              isLoading={removeLoading}
              onClick={() => {
                handleRemove(user.userId);
              }}
              colorScheme="red"
              mr={3}
            >
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupInfoModal;
