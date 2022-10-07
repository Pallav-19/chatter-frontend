import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
const UserList = ({ user, handleClick }) => {
  return (
    <div>
      <Box
        onClick={handleClick}
        display={"flex"}
        cursor="pointer"
        bg={"#e8e8e8"}
        _hover={{ color: "white", background: "blue.500" }}
        w={"100%"}
        px={3}
        py={2}
        m={2}
        alignItems={"center"}
        color={"black"}
        borderRadius={"lg"}
      >
        <Avatar mr={2} size={"sm"} name={user.name} cursor={"pointer"}></Avatar>
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize={"xs"}>
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default UserList;
