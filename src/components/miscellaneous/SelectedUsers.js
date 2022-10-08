/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
const SelectedUsers = ({
  user,
  handleClick,
  isEditing,
  isAdmin,
  self,
  Admin,
  key,
}) => {
  return (
    <Box
      bg={Admin === user._id ? "purple.500" : "blue.500"}
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      // background={"blue.500"}
      color={"white"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Avatar mr={1} size={"xs"} name={user.name} />
      {user.name}
      <CloseIcon
        cursor={"pointer"}
        onClick={handleClick}
        pl={1}
        hidden={isEditing && isAdmin === false}
        display={isEditing && (self || isAdmin === false) ? "none" : ""}
      />
    </Box>
  );
};

export default SelectedUsers;
