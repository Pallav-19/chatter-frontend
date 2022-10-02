/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import AuthContext from "../contexts/Auth/AuthContext";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Button,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import "./Login.css";
function parseJwt(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}
const Login = () => {
  const { setUser, user } = React.useContext(AuthContext);
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
        const user = parseJwt(await response.data.token);
        setUser(await user);
        console.log(await user);

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
            colorScheme="teal"
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