/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import ChatContext from "../contexts/chats/ChatContext";
import Chat from "../chat/Chat";
const Home = () => {
  const context = useContext(ChatContext);
  const { LoggedIn, setLoggedIn } = context;
  return (
    <Box width={"100%"} height={"100%"}>
      {LoggedIn ? (
        <Chat />
      ) : (
        <Tabs
          variant="enclosed-colored"
          width={{ base: "80%", md: "50%" }}
          position="absolute"
          top={"50%"}
          left={"50%"}
          transform={"translate(-50%,-50%)"}
          borderRadius={"lg"}
          boxShadow={"1px 1px 2px rgba(0, 0, 0, 0.444)"}
          height={"90vh"}
        >
          <TabList>
            <Tab fontFamily={"ubuntu,sans"} fontSize={"xl"} width={"50%"}>
              Login
            </Tab>
            <Tab fontFamily={"ubuntu,sans"} fontSize={"xl"} width={"50%"}>
              Signup
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default Home;
