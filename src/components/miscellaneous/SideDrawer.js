/* eslint-disable no-unused-vars */
import React from "react";
import {
  Tooltip,
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import AuthContext from "../contexts/Auth/AuthContext";
import "./SideDrawer.css";
import userEvent from "@testing-library/user-event";
const SideDrawer = () => {
  const { user } = React.useContext(AuthContext);
  const [search, setSearch] = React.useState();
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingChat, setLoadingChat] = React.useState();
  return (
    <div className="sideDrawer">
      <Tooltip label="Search Users to chat" hasArrow placement="bottom">
        <Button variant="ghost">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </Tooltip>
      <Text fontSize={"2xl"} fontFamily={"ubuntu,sans"}>
        Chatter
      </Text>
      <div>
        <Menu>
          <MenuButton mx={"2"} as={Button}>
            <BellIcon fontSize={"2xl"} margin="1"></BellIcon>
          </MenuButton>
          <MenuList></MenuList>
        </Menu>
        <Menu>
          <MenuButton mx={"2"} as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor={"pointer"}></Avatar>
          </MenuButton>
          <MenuList></MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default SideDrawer;
