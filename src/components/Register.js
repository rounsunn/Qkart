import { Button, CircularProgress, Stack, TextField } from "@mui/material"; 
import { Box } from "@mui/system";
import axios from "axios";  
import { useSnackbar } from "notistack";
import React, { useState } from "react";  
import { config } from "../App";  
import { useHistory, Link } from "react-router-dom"; 
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const POST_API = `${config.endpoint}/auth/register`;

  const userInit = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setformData] = useState(userInit);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e, formData) => {
    const name = e.target.name;
    const value = e.target.value;
    setformData({ ...formData, [name]: value });
  };


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
   const register = async (formData) => {
    if ( !validateInput(formData) ) {
      console.log("Invalid input");
    } else {
      console.log("Registering now");
      setIsLoading(true);
      // await new Promise(r => setTimeout(r, 3000));
      try {
        const res = await axios.post(POST_API, {
          username: formData.username,
          password: formData.password,
        });
        console.log(res);
        setIsLoading(false);
        history.push("/login", { from: "Register" });
        enqueueSnackbar("Registered successfully", { variant: "success" });
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
        return null;
      }
      setIsLoading(false);
    }
  };
  

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => { 
    console.log("validating input" );
    if ( !data.username ) { enqueueSnackbar("username required", { variant: "warning" }); } 
    else if ( data.username.length < 6 ) { enqueueSnackbar("username minimum 6 characters", { variant: "warning" }); } 
    else if ( !data.password ) { enqueueSnackbar("password required", { variant: "warning" }); }
    else if ( data.password.length < 6 ) { enqueueSnackbar("password minimum 6 characters", { variant: "warning" }); }
    else if ( data.password !== data.confirmPassword ) { enqueueSnackbar("passwords do not match", { variant: "warning" }); }

    return data.username && data.username.length > 5
            && data.password && data.password.length > 5 
            && data.password === data.confirmPassword;
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
          <h2 className="title">Register</h2>
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
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            title="confirm Password"
            type="password"
            placeholder="Password should match the above"
            fullWidth
            onChange={(e) => handleInputChange(e, formData)}
          />
          { isLoading ? <CircularProgress />
          : (
           <Button variant="contained" onClick={(e) => register(formData)}>
            Register Now
           </Button>
            )
          }
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/Login" className="link">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
