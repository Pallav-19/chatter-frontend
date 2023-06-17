/* eslint-disable eqeqeq */
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
  PinInputField,
  PinInput,
  HStack,
  FormHelperText,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";
import validator from "validator";

const Login = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [outputOTP, setOutputOTP] = React.useState();
  const [inputOTP, setInputOTP] = React.useState();
  const [newpassword, setNewPassword] = React.useState("");
  const [cshow, setCshow] = React.useState(false);
  const [nshow, setNshow] = React.useState(false);
  const [confirmpassword, setConfirmPassword] = React.useState("");
  const [screen, setScreen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [OTPloading, setOTPLoading] = React.useState(false);
  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [changeLoading, setChangeLoading] = React.useState(false);
  const navigate = useNavigate("/chat");
  const toast = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const handleClick = () => {
    setShow(!show);
  };
  const nhandleClick = () => {
    setNshow(!nshow);
  };
  const chandleclilck = () => {
    setCshow(!cshow);
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
        position: "top-left",
      });
    } else {
      if (!validator.isEmail(email)) {
        errorCount++;
        toast({
          title: "Enter a Valid Email Address",
          status: "warning",
          duration: 5000,
          position: "top-left",
        });
      }
    }
    if (!password) {
      errorCount++;
      toast({
        title: "Enter Password",
        status: "warning",
        duration: 5000,
        position: "top-left",
      });
    }

    if (errorCount === 0) {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login ",
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
        position: "top-left",
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
  const sendOTP = async () => {
    setOTPLoading(true);
    if (email) {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/sendOTP/reset",
        {
          emailOTP: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
             
            Accept: "application/json",
          },
        }
      );
      toast({
        title: await data.message,
        duration: 5000,
        status: (await data.success) ? "success" : "error",
        position: "top-left",
        isClosable: true,
      });
      if (await data.success) {
        setOutputOTP(await data.outputOTP);
        setInputOTP("");
      }
    } else {
      toast({
        title: "Email address missing!",
        duration: 5000,
        status: "error",
        position: "top-left",
        isClosable: true,
      });
    }
    setOTPLoading(false);
  };
  const verifyOTP = () => {
    setVerifyLoading(true);
    if (inputOTP) {
      if (inputOTP == outputOTP) {
        setScreen(true);
        setOutputOTP("");
        setInputOTP("");
      } else {
        toast({
          title: "OTP did not match!",
          duration: 5000,
          status: "error",
          position: "top-left",
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "OTP missing",
        description: "Enter OTP",
        duration: 5000,
        status: "error",
        position: "top-left",
        isClosable: true,
      });
    }
    setVerifyLoading(false);
  };
  const resetPassword = async () => {
    setChangeLoading(true);
    let errorCount = 0;
    if (!newpassword || !confirmpassword) {
      if (!newpassword) {
        errorCount++;
        toast({
          title: "Password missing! ",
          description: "Please enter password",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      } else {
        if (newpassword.length < 5) {
          errorCount++;
          toast({
            title: "Password Must be more than 5 characters!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
        }
      }
      if (!confirmpassword) {
        errorCount++;
        toast({
          title: "Enter Confirm Password",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    } else {
      if (newpassword !== confirmpassword) {
        errorCount++;
        toast({
          title: "Password and Confirm Password Did not match!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }

    if (errorCount === 0) {
      const { data } = await axios.put("http://localhost:5000/api/auth/changePassword", {
        newpassword,
        email,
      });
      if (await data.success) {
        onClose();
        setInputOTP("");
        setOutputOTP("");
        setScreen(false);
      }
      toast({
        title: await data.message,
        status: (await data.success) ? "success" : "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    setChangeLoading(false);
  };

  return (
    <Box padding={"1rem"}>
      <Stack spacing={10}>
        <FormControl>
          {/* <FormLabel>Email address</FormLabel> */}

          <InputGroup>
            <InputLeftAddon
              display={{ base: "none", md: "flex" }}
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
              display={{ base: "none", md: "flex" }}
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
          <Modal
            size={"lg"}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setScreen(false);
              setOutputOTP("");
              setInputOTP("");
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  {!screen ? (
                    <>
                      {outputOTP ? (
                        <>
                          <ModalHeader mt={3} fontSize={"xl"}>
                            Enter OTP received on{" "}
                            <Text color={"blue.500"}>{email}</Text>
                          </ModalHeader>
                          <HStack
                            display={"flex"}
                            alignItems={"center"}
                            width={"100%"}
                            justifyContent={"center"}
                            marginTop={7}
                            marginBottom={5}
                          >
                            <PinInput
                              focusBorderColor="blue.500"
                              autoFocus
                              manageFocus={true}
                              otp
                              type="number"
                              value={inputOTP}
                              onChange={(value) => {
                                setInputOTP(value);
                                //console.log(inputOTP);
                              }}
                            >
                              <PinInputField autoFocus border={"2px solid"} />
                              <PinInputField border={"2px solid"} />
                              <PinInputField border={"2px solid"} />
                            </PinInput>
                          </HStack>
                        </>
                      ) : (
                        <>
                          <FormHelperText color={"blue.500"} mb={3}>
                            You will receive an OTP on the Email entered below!{" "}
                          </FormHelperText>
                          <Input
                            borderWidth={3}
                            value={email}
                            placeholder="Enter Your registered email address here"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          ></Input>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <ModalHeader
                        width={"100%"}
                        textAlign={"left"}
                        mt={3}
                        fontSize={"xl"}
                      >
                        Reset your password here!
                      </ModalHeader>
                      <InputGroup mb={6}>
                        <InputLeftAddon
                          display={{ base: "none", md: "flex" }}
                          fontFamily={"ubuntu,sans"}
                          fontSize={{ base: "xs", md: "lg" }}
                          children={"Password"}
                        ></InputLeftAddon>
                        <Input
                          _placeholder={{ fontSize: { base: "xs", md: "lg" } }}
                          borderWidth={3}
                          placeholder="New Password"
                          isRequired
                          value={newpassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }}
                          type={nshow ? "text" : "password"}
                        />
                        <InputRightElement width={"4.5rem"}>
                          <Button
                            hidden={!newpassword ? true : false}
                            h="1.75rem"
                            size="sm"
                            onClick={nhandleClick}
                          >
                            {nshow ? <ViewOffIcon /> : <ViewIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>

                      <InputGroup mb={6}>
                        <InputLeftAddon
                          display={{ base: "none", md: "flex" }}
                          fontFamily={"ubuntu,sans"}
                          fontSize={{ base: "xs", md: "lg" }}
                          children={"Confirm  Password"}
                        ></InputLeftAddon>
                        <Input
                          _placeholder={{ fontSize: { base: "xs", md: "lg" } }}
                          borderWidth={3}
                          placeholder="Re-type new your password"
                          isRequired
                          value={confirmpassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                          }}
                          type={cshow ? "text" : "password"}
                        />
                        <InputRightElement width={"4.5rem"}>
                          <Button
                            hidden={!confirmpassword ? true : false}
                            h="1.75rem"
                            size="sm"
                            onClick={chandleclilck}
                          >
                            {cshow ? <ViewOffIcon /> : <ViewIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </>
                  )}
                </FormControl>
              </ModalBody>

              <ModalFooter>
                {!screen ? (
                  <>
                    {!outputOTP ? (
                      <Button
                        onClick={() => {
                          sendOTP();
                        }}
                        loadingText="Sending OTP!"
                        colorScheme="blue"
                        mr={3}
                        isLoading={OTPloading}
                      >
                        {outputOTP ? "Resend OTP" : "Send OTP"}
                      </Button>
                    ) : (
                      <Button
                        mr={3}
                        loadingText={"Verifying OTP"}
                        colorScheme={"blue"}
                        isLoading={verifyLoading}
                        onClick={() => {
                          verifyOTP();
                        }}
                      >
                        Verify OTP
                      </Button>
                    )}{" "}
                  </>
                ) : (
                  <>
                    <Button
                      isLoading={changeLoading}
                      loadingText={"Reseting Password"}
                      colorScheme={"blue"}
                      onClick={resetPassword}
                      mr={3}
                    >
                      Reset Password
                    </Button>
                  </>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default Login;
