/* eslint-disable no-unused-vars */
import React from "react";
import { FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";
import { InputRightElement } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [cshow, setCshow] = React.useState(false);
  const [confirmpassword, setConfirmPassword] = React.useState("");
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
    if (!email || !name || !password || !confirmpassword) {
      errorCount++;
      toast({
        title: "Please enter All the values !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    if (password.length < 5 && confirmpassword.length < 5) {
      errorCount++;
      toast({
        title: "Password Must be more than 5 characters!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    if (!validator.isEmail(email)) {
      errorCount++;
      toast({
        title: "Invalid Email Address",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    if (password !== confirmpassword) {
      errorCount++;
      toast({
        title: "Password and Confirm Password Did not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    if (name.length < 3) {
      errorCount++;
      toast({
        title: "Name must be 3 characters or more!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    if (errorCount === 0) {
      const response = await axios.post(
        "http://localhost:5100/api/auth/signup",
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
        position: "top-right",
      });
      if (await response.data.success) {
        setConfirmPassword("");
        setEmail("");
        setName("");
        setPassword("");
        localStorage.setItem("Auth", await response.data.token);
        navigate("/");
      }
    }
  };
  return (
    <div>
      {" "}
      <Stack spacing={10}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            isRequired
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
          />

          <FormLabel>Email Address</FormLabel>
          <Input
            isRequired
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
          />
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              isRequired
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

          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              isRequired
              value={confirmpassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              type={cshow ? "text" : "password"}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                disabled={!confirmpassword ? true : false}
                h="1.75rem"
                size="sm"
                onClick={chandleclilck}
              >
                {cshow ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button
            onClick={submitHandler}
            width={"100%"}
            mt={"2rem"}
            colorScheme="blue"
            variant="solid"
          >
            Signup
          </Button>
        </FormControl>
      </Stack>
    </div>
  );
};

export default Signup;
