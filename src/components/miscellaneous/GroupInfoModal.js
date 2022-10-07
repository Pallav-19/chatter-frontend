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
} from "@chakra-ui/react";
import ChatContext from "../contexts/chats/ChatContext";
const GroupInfoModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = React.useState();
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const toast = useToast()
  const { selectedChat, setSelectedChat, user } = React.useContext(ChatContext);
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupInfoModal;
