/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import AuthContext from "./AuthContext";
const AuthState = (props) => {
  const [LoggedIn, setLoggedIn] = useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("Auth")) {
      setLoggedIn(true);
    }
  }, [LoggedIn]);

  return (
    <AuthContext.Provider value={{ LoggedIn, setLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
