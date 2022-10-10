/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
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
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import ChatContext from "../contexts/chats/ChatContext";
const ProfileModal = ({ userReceived, children }) => {
  let id;
  if (userReceived.userId) {
    id = userReceived.userId;
  }
  if (userReceived._id) {
    id = userReceived._id;
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = React.useContext(ChatContext);
  React.useEffect(() => {
    //console.log(user);
    //console.log(id);
  }, []);
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span>
          <IconButton
            icon={<ViewIcon />}
            d={{ base: "flex" }}
            onClick={onOpen}
            _hover={{ color: "white", bg: "blue.500" }}
          ></IconButton>
        </span>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
          >
            {userReceived.image ? (
              <Image
                borderRadius={"full"}
                marginTop="4"
                border={"1px"}
                boxSize="9rem"
                src={
                  "https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg"
                }
                alt={userReceived?.name}
              ></Image>
            ) : (
              <Avatar
                size="2xl"
                cursor={"pointer"}
                name={userReceived?.name}
              ></Avatar>
            )}
            <ModalHeader
              fontFamily={"ubuntu , sans"}
              fontSize={"2rem"}
              textAlign={"center"}
            >
              {userReceived?.name}
            </ModalHeader>
            <Text fontFamily={"ubuntu,sans"} fontSize="1rem">
              <b>Email:</b> {userReceived.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button hidden={!(id == user.userId)} colorScheme="blue" mr={3}>
              Edit Profile
            </Button>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
