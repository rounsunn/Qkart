import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const DisplayLoginLogout = () => {
  const history = useHistory();
  const isUsername = localStorage.getItem("username");

  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleRegisterClick = () => {
    history.push("/register");
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Stack spacing={2} direction="row" display="flex" justifyContent="space-between" alignItems="center">
      {!isUsername ? (
        <>
          <Button onClick={handleLoginClick}>LOGIN</Button>
          <Button variant="contained" onClick={handleRegisterClick}>
            REGISTER
          </Button>
        </>
      ) : (
        <>
          <Box> <Avatar alt="crio.do" src="avatar.png" /> </Box>
          <Box> <p className="username-text">{isUsername}</p> </Box>
          <Box> <Button onClick={handleLogoutClick}>LOGOUT</Button> </Box>
        </>
      )}
    </Stack>
  );
};


const Header = ({ children, hasHiddenAuthButtons=false }) => {
  const history = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
        <Stack spacing={2} direction="row">
          {children}
          {hasHiddenAuthButtons ? <DisplayLoginLogout /> 
          : (
            <Button
              className="explore-button"
              startIcon={<ArrowBackIcon />}
              variant="text"
              onClick={() => history.push("/")}
            >
              Back to explore
            </Button>
          )}
        </Stack>
    </Box>
  );
};

export default Header;
