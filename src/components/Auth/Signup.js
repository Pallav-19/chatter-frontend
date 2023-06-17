/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  FormControl,
  useToast,
  InputGroup,
  InputRightElement,
  Input,
  Stack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  PinInput,
  PinInputField,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import axios from "axios";
import validator from "validator";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [length, setLength] = React.useState(15);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputOTP, setInputOTP] = React.useState();
  const [outputOTP, setOutputOTP] = React.useState();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmpassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [cshow, setCshow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => {
    setShow(!show);
  };
  const chandleclilck = () => {
    setCshow(!cshow);
  };
  const submitHandler = async () => {
    let errorCount = 0;

    if (!name) {
      errorCount++;
      toast({
        title: "Enter Your Name!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } else {
      if (name.length < 3) {
        errorCount++;
        toast({
          title: "Name must be 3 characters or more!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
    if (!email) {
      errorCount++;
      toast({
        title: "Please your email address!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } else {
      if (!validator.isEmail(email)) {
        errorCount++;
        toast({
          title: "Invalid Email Address",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
    if (!password || !confirmpassword) {
      if (!password) {
        errorCount++;
        toast({
          title: "Enter Password",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      } else {
        if (password.length < 5) {
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
      if (password !== confirmpassword) {
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
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/sendOTP/verification",
        {
          emailOTP: email,
          name,
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
        onOpen();
        setOutputOTP(await data.outputOTP);
        setInputOTP("");
      }
      setLoading(false);
    }
  };
  const verify = async () => {
    setVerifyLoading(true);
    if (inputOTP.length === 3) {
      if (inputOTP == outputOTP) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          { name, email, password },
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
          setVerifyLoading(false);

          setConfirmPassword("");
          setEmail("");
          setName("");
          setPassword("");
          localStorage.setItem("Auth", await response.data.token);
          navigate("/");
        }
      } else {
        toast({
          title: "OTP did not match!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        setVerifyLoading(false);
      }
    } else {
      toast({
        title: "Enter 3 digit OTP",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setVerifyLoading(false);
    }
    setVerifyLoading(false);
  };
  const resend = async () => {
    setResendLoading(true);
    if (inputOTP.length === 3) {
      if (inputOTP == outputOTP) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          { name, email, password },
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
          setResendLoading(false);

          setConfirmPassword("");
          setEmail("");
          setName("");
          setPassword("");
          localStorage.setItem("Auth", await response.data.token);
          navigate("/");
        }
      } else {
        toast({
          title: "OTP did not match!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        setResendLoading(false);
      }
    } else {
      toast({
        title: "Enter 3 digit OTP",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setResendLoading(false);
    }

    setResendLoading(false);
  };
  return (
    <div>
      {" "}
      <Stack spacing={10}>
        <FormControl>
          <InputGroup mb={6} mt={4}>
            <InputLeftAddon
              display={{ base: "none", md: "flex" }}
              fontFamily={"ubuntu,sans"}
              fontSize={{ base: "xs", md: "lg" }}
              children={"Name"}
            ></InputLeftAddon>
            <Input
              autoFocus
              _placeholder={{ fontSize: { base: "xs", md: "lg" } }}
              borderWidth={3}
              placeholder="Enter your name here"
              isRequired
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, 15));
                setLength(15 - e.target.value.slice(0, 15).length);
              }}
              type="text"
            />
            <InputRightAddon children={length}></InputRightAddon>
          </InputGroup>

          <InputGroup mb={6}>
            <InputLeftAddon
              display={{ base: "none", md: "flex" }}
              fontFamily={"ubuntu,sans"}
              fontSize={{ base: "xs", md: "lg" }}
              children={"Email Address"}
            ></InputLeftAddon>{" "}
            <Input
              _placeholder={{ fontSize: { base: "xs", md: "lg" } }}
              borderWidth={3}
              placeholder="Enter your Email address here"
              isRequired
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
            />
          </InputGroup>

          {/* <FormLabel>Password</FormLabel> */}

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
              placeholder="Create a Password"
              isRequired
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

          <InputGroup mb={6}>
            <InputLeftAddon
              display={{ base: "none", md: "flex" }}
              fontFamily={"ubuntu,sans"}
              fontSize={{ base: "xs", md: "lg" }}
              children={"Confirm Password"}
            ></InputLeftAddon>
            <Input
              _placeholder={{ fontSize: { base: "xs", md: "lg" } }}
              borderWidth={3}
              placeholder="Re-type your password"
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
          <Button
            onClick={submitHandler}
            width={"100%"}
            mt={"2rem"}
            colorScheme="blue"
            variant="solid"
            isLoading={loading}
            loadingText="Sending OTP"
          >
            Signup
          </Button>
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader mt={3} fontSize={"xl"}>
                Enter OTP sent to {email}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
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
                    {/* <PinInputField border={"2px solid"} /> */}
                    <PinInputField border={"2px solid"} />
                    <PinInputField border={"2px solid"} />
                    <PinInputField border={"2px solid"} />
                  </PinInput>
                </HStack>
              </ModalBody>

              <ModalFooter>
                <Button
                  isLoading={verifyLoading}
                  loadingText="Verifying OTP!"
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    verify();
                  }}
                >
                  Verify
                </Button>
                <Button
                  isLoading={resendLoading}
                  loadingText="Resending OTP"
                  variant="ghost"
                  colorScheme={"blue"}
                  onClick={resend}
                >
                  Resend OTP
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </FormControl>
      </Stack>
    </div>
  );
};

export default Signup;
