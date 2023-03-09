import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const POST_API = `${config.endpoint}/auth/login`;

  const userInit = {
    username: "",
    password: "",
  };
  const [formData, setformData] = useState(userInit);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e, formData) => {
    const name = e.target.name;
    const value = e.target.value;
    setformData({ ...formData, [name]: value });
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    if ( !validateInput(formData) ) {
      console.log("Invalid input");
    } else {
      console.log("Logging now");
      setIsLoading(true);
      // await new Promise(r => setTimeout(r, 3000));
      try {
        const res = await axios.post(POST_API, {
          username: formData.username,
          password: formData.password,
        });
        console.log(res);
        setIsLoading(false);
        persistLogin(res.data.token, res.data.username, res.data.balance);
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        history.push("/", { from: "Login" });
      } catch (e) {
        setIsLoading(false);
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
      }
      setIsLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    console.log("validating input" );
    if ( !data.username ) { enqueueSnackbar("username required", { variant: "warning" }); } 
    else if ( !data.password ) { enqueueSnackbar("password required", { variant: "warning" }); }

    return data.username && data.password; 
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the LoggedIn in user
   * @param {string} balance
   *    Wallet balance amount of the LoggedIn in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is LoggedIn in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            variant="outlined"
            label="username"
            name="username"
            title="username"
            placeholder="Enter username"
            fullWidth
            onChange={(e) => handleInputChange(e, formData)}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            title="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            placeholder="Enter a password with minimum 6 characters"
            fullWidth
            onChange={(e) => handleInputChange(e, formData)}
          />
          { isLoading ? <CircularProgress />
          : (
           <Button variant="contained" onClick={(e) => login(formData)}>
            LOGIN TO QKART
           </Button>
            )
          }
          <p className="secondary-action">
            Don’t have an account?{" "}
             <Link to="/Register" className="link">
              Register now
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
