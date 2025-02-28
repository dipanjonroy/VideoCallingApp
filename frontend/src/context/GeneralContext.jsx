import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Alert from "../utils/alert";
import { io } from "socket.io-client";

const context = createContext();



export const GeneralContext = ({ children }) => {
  //Alert
  const [alertMessage, setAlertMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const closeAlert = () => {
    setAlert(false);
  };

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 2000);
    }
    return () => clearTimeout();
  }, [alert]);

  //Handle success message
  const showAlert = (message) => {
    setAlertMessage(message);
    setAlert(true);
  };

  //user register
  const registerUser = async (userData, setSelectForm) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/register",
        userData
      );
      const { success, message } = data;
      if (success) {
        showAlert(message);
        setSelectForm(1)

      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  //user login
  const loginUser = async (userCred) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/login",
        userCred, {withCredentials: true}
      );
      const { success, message } = data;

      if (success) {
        showAlert(message);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };


  //socket
  const socket = io("localhost:8000");

  return (
    <context.Provider
      value={{ registerUser, closeAlert, loginUser, errorMessage, socket}}
    >
      <div className="container">{children}</div>
      {alert && <Alert message={alertMessage} />}
    </context.Provider>
  );
};

export default context;


