/* eslint-disable no-unused-vars */

import React from "react";
import AuthContext from "./AuthContext";
const AuthState = (props) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("Auth")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={isLoggedIn}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
