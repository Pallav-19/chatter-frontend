/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import AuthContext from "./AuthContext";
import { useLocation } from "react-router-dom";
import parseJwt from "../../../utils/parseJson";
const AuthState = (props) => {
  const location = useLocation();
  const [LoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    if (localStorage.getItem("Auth")) {
      setLoggedIn(true);
      setUser(parseJwt(localStorage.getItem("Auth")));
    } else {
      setUser("");
      setLoggedIn(false);
    }
  }, [location]);

  return (
    <AuthContext.Provider value={{ LoggedIn, setLoggedIn, user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
