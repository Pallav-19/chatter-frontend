/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "./Login";
import Signup from "./Signup";
import "./Home.css";
import AuthContext from "./contexts/AuthContext";
import Chat from "./Chat"
const Home = () => {
  const context = useContext(AuthContext);
  const {LoggedIn,setLoggedIn} = context;
  return (
    <div className="Home">
      {LoggedIn?<Chat/>:<Tabs className="HomeTab">
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
      </Tabs>}
    </div>
  );
};

export default Home;
