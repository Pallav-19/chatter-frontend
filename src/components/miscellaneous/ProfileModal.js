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
import "./ProfileModal.css";
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          ></IconButton>
        </span>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="mbody">
            {user.image ? (
              <Image
                borderRadius={"full"}
                marginTop="4"
                border={"1px"}
                boxSize="9rem"
                src={
                  "https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg"
                }
                alt={user?.name}
              ></Image>
            ) : (
              <Avatar size="2xl" cursor={"pointer"} name={user?.name}></Avatar>
            )}
            <ModalHeader
              className="mheader"
              fontFamily={"ubuntu , sans"}
              fontSize={"2rem"}
            >
              {user?.name}
            </ModalHeader>
            <Text fontFamily={"ubuntu,sans"} fontSize="1rem">
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
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
