/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import ChatContext from "../contexts/chats/ChatContext";
import {
  FormControl,
  Text,
  InputGroup,
  Button,
  InputRightElement,
  useToast,
  Input,
  Stack,
  Box,
  InputLeftAddon,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";
import validator from "validator";

const Login = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [outputOTP, setOutputOTP] = React.useState();
  const [inputOTP, setInputOTP] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate("/chat");
  const toast = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const handleClick = () => {
    setShow(!show);
  };
  const handleSubmit = async () => {
    setLoading(true);
    let errorCount = 0;
    if (!email) {
      errorCount++;
      toast({
        title: "Enter your Email Address!",
        status: "warning",
        duration: 5000,
        position: "top-right",
      });
    } else {
      if (!validator.isEmail(email)) {
        errorCount++;
        toast({
          title: "Enter a Valid Email Address",
          status: "warning",
          duration: 5000,
          position: "top-right",
        });
      }
    }
    if (!password) {
      errorCount++;
      toast({
        title: "Enter Password",
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
    setLoading(false);
  };

  return (
    <Box padding={"1rem"}>
      <Stack spacing={10}>
        <FormControl>
          {/* <FormLabel>Email address</FormLabel> */}

          <InputGroup>
            <InputLeftAddon
              fontFamily={"ubuntu,sans"}
              fontSize={{ base: "xs", md: "lg" }}
              children={"Email Address"}
            ></InputLeftAddon>
            <Input
              _placeholder={{ fontSize: { base: "xs", md: "lg" } }}
              autoFocus
              borderWidth={3}
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
            />
          </InputGroup>

          {/* <FormLabel>Password</FormLabel> */}
          <InputGroup mt={10}>
            <InputLeftAddon
              fontFamily={"ubuntu,sans"}
              fontSize={{ base: "xs", md: "lg" }}
              children={"Password"}
            ></InputLeftAddon>
            <Input
              _placeholder={{ fontSize: { base: "xs", md: "lg" } }}
              placeholder="Enter password"
              borderWidth={3}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={show ? "text" : "password"}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                hidden={!password ? true : false}
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button
            onClick={handleSubmit}
            width={"100%"}
            mt={12}
            colorScheme="blue"
            variant="solid"
            isLoading={loading}
          >
            Login
          </Button>
          <Text onClick={onOpen} mt={"10"}>
            {" "}
            <Link
              color={"blue.500"}
              textDecoration="underline"
              colorScheme={"blue"}
            >
              Forgot Password?
            </Link>
          </Text>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader mt={3} fontSize={"xl"}></ModalHeader>
              <ModalCloseButton />
              <ModalBody></ModalBody>

              <ModalFooter>
                <Button loadingText="Verifying OTP!" colorScheme="blue" mr={3}>
                  Verify
                </Button>
                <Button
                  loadingText="Resending OTP"
                  variant="ghost"
                  colorScheme={"blue"}
                >
                  Resend OTP
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default Login;
