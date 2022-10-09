/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { useColorMode } from "@chakra-ui/react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
} from "@chakra-ui/react";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import ChatContext from "../contexts/chats/ChatContext";
import Chat from "../chat/Chat";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Home = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const context = useContext(ChatContext);
  const { LoggedIn } = context;
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
          height={{ base: "65%", md: "90%" }}
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
      {!LoggedIn && (
        <Box
          position={"absolute"}
          right={"0"}
          bottom={"10%"}
          width={"4rem"}
          height={"2rem"}
        >
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          />
        </Box>
      )}
    </Box>
  );
};

export default Home;
