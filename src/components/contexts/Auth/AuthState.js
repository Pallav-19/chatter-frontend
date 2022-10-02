/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import AuthContext from "./AuthContext";
import { useLocation } from "react-router-dom";

const AuthState = (props) => {
  const location = useLocation();
  const [LoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    if (localStorage.getItem("Auth")) {
      setLoggedIn(true);
    }
  }, [location]);

  return (
    <AuthContext.Provider value={{ LoggedIn, setLoggedIn, user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
