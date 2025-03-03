import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


const context = createContext();

export const GeneralContext = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
        setSelectForm(1);
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
        userCred,
        { withCredentials: true }
      );
      const { success, message } = data;

      if (success) {
        showAlert(message);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  //WebRTC - socket
  const meetingIdRef = useRef(uuidv4());

  const handleNavigateRoom = () => {
    navigate(`/room/${meetingIdRef.current}`);
  };

  return (
    <context.Provider
      value={{
        registerUser,
        loginUser,

        handleNavigateRoom,
      }}
    >
      <div className="container">{children}</div>
      {alert && <Alert message={alertMessage} />}
    </context.Provider>
  );
};

export default context;
