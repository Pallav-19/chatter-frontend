/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import "./Home.css";
import ChatContext from "../contexts/chats/ChatContext";
import Chat from "../chat/Chat";
const Home = () => {
  const context = useContext(ChatContext);
  const { LoggedIn, setLoggedIn } = context;
  return (
    <div className="Home">
      {LoggedIn ? (
        <Chat />
      ) : (
        <Tabs className="HomeTab">
          <TabList>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Signup</Tab>
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
    </div>
  );
};

export default Home;
