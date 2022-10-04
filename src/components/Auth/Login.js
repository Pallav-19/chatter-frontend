/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import ChatContext from "../contexts/chats/ChatContext";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Button,
  InputRightElement,
  useToast,
  Input,
  Stack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import validator from "validator";
import "./Login.css";

const Login = () => {
  const { setUser, user } = React.useContext(ChatContext);
  const navigate = useNavigate("/chat");
  const toast = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const handleClick = () => {
    setShow(!show);
  };
  const handleSubmit = async () => {
    let errorCount = 0;
    if (!email || !password) {
      errorCount++;
      toast({
        title: "Every field must be filled!",
        status: "warning",
        duration: 5000,
        position: "top-right",
      });
    }
    if (!validator.isEmail(email)) {
      errorCount++;
      toast({
        title: "Enter a Valid Email",
        status: "warning",
        duration: 5000,
        position: "top-right",
      });
    }
    if (errorCount === 0) {
      const response = await axios.post(
        "http://localhost:5100/api/auth/login ",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast({
        title: await response.data.message,
        status: (await response.data.success) ? "success" : "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      if (await response.data.success) {
        setEmail("");
        setPassword("");
        localStorage.setItem("Auth", await response.data.token);
        navigate("/");
      }
    }
  };

  return (
    <div className="Login">
      <Stack spacing={10}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
          />
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={show ? "text" : "password"}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                disabled={!password ? true : false}
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button
            onClick={handleSubmit}
            width={"100%"}
            mt={"2rem"}
            colorScheme="blue"
            variant="solid"
          >
            Login
          </Button>
        </FormControl>
      </Stack>
    </div>
  );
};

export default Login;
