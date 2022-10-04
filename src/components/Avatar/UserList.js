import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
const UserList = ({ user, accessChat }) => {
  return (
    <div>
      <Box
        onClick={() => {
          accessChat(user._id);
        }}
        display={"flex"}
        cursor="pointer"
        bg={"#e8e8e8"}
        _hover={{ color: "white", background: "#38b2ac" }}
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
