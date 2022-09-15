/* eslint-disable no-unused-vars */
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "./Login";
import Signup from "./Signup";
import "./Home.css";
const Home = () => {
  return (
    <div className="Home">
      <Tabs>
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
    </div>
  );
};

export default Home;
