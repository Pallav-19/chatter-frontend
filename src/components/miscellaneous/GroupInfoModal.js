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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const toast = useToast();
  const handleRemove = async (userId) => {
    if (user.userId !== userId) {
      const { data } = await axios.put(
        "/api/chat/removeFromGroup",
        {
          chatId: selectedChat._id,
          userId,
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
      if (await data.success) setSelectedChat(await data.result);
    } else {
      toast({
        title: "Cannot remove yourself",
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "top-left",
      });
    }
  };

  const [isEditable, setIsEditable] = React.useState(false);
  const toggleEditName = () => {
    setIsEditable(!isEditable);
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
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
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
              <Input
                mt={5}
                autoFocus
                width={"70%"}
                fontFamily={"ubuntu,sans"}
                fontSize={"2xl"}
                borderWidth={3}
                padding={5}
                value={groupChatName}
                placeholder="Edit group name here"
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              ></Input>
            ) : (
              <>{selectedChat.name}</>
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
                <IconButton mt={5} padding={3} colorScheme={"green"} ml={3}>
                  <CheckIcon fontSize={"lg"} />
                </IconButton>
                <IconButton
                  mt={5}
                  onClick={() => {
                    toggleEditName();
                  }}
                  padding={3}
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
                        Group Members
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box
                    pl={5}
                    pr={5}
                    display={"flex"}
                    width={"100%"}
                    flexWrap={"wrap"}
                  >
                    {selectedChat.users?.map((su) => {
                      console.log(su._id + "self");
                      console.log(user.userId + "self");
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupInfoModal;
