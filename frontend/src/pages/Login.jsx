import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import context from "../context/GeneralContext";

function Login() {
  const [selectForm, setSelectForm] = useState(0);
  const { registerUser, loginUser, errorMessage} = useContext(context);

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    const registerFormData = {
      name: fullname,
      username: username,
      email: email,
      password: password,
    };

    await registerUser(registerFormData, setSelectForm);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const loginCredentials = {
      username: username,
      password: password,
    };
    loginUser(loginCredentials);

    console.log(loginCredentials);
  };

  return (
    <div className="authContainer">
      <img src="images/auth.jpg" alt="" />
      <div className="formArea">
        <div className="buttons">
          <button
            className={selectForm === 0 ? "select" : ""}
            onClick={() => setSelectForm(0)}
          >
            Sign up
          </button>
          <button
            className={selectForm === 1 ? "select" : ""}
            onClick={() => setSelectForm(1)}
          >
            Log in
          </button>
        </div>
        <div className="formBox">
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
            className="formArea"
            onSubmit={selectForm === 0 ? handleSignUp : handleLogin}
          >
            {selectForm === 0 ? (
              <TextField
                id="fullname"
                label="Fullname"
                variant="outlined"
                type="text"
                className="formInput"
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            ) : null}

            <TextField
              id="username"
              label="Username"
              variant="outlined"
              type="text"
              className="formInput"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {selectForm === 0 ? (
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                className="formInput"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : null}
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              className="formInput"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p style={{color: "red"}}>{errorMessage}</p>
            <Button variant="contained" className="formBtn" type="submit">
              {selectForm === 0 ? "Sign up" : "Log in"}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Login;
