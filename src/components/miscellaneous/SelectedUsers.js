/* eslint-disable no-unused-vars */
import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
const SelectedUsers = ({ user, handleClick }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      background={"teal"}
      color={"white"}
      cursor={"pointer"}
      onClick={handleClick}
    >
      {user.name.split(" ")[0]}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default SelectedUsers;
