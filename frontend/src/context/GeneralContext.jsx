import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";

const context = createContext();

export const GeneralContext = ({ children }) => {
  const navigate = useNavigate();

  const handleSuccessMessage = (success) => {
    toast.success(success, { position: "bottom-right" });
  };
  const handleErrorMessage = (err) => {
    toast.error(err, { position: "bottom-left" });
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
        handleSuccessMessage(message);
        setSelectForm(1);
      }
    } catch (error) {
      handleErrorMessage(error.response.data.message);
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
        handleSuccessMessage(message);
      }
    } catch (error) {
      handleErrorMessage(error.response.data.message);
    }
  };

  //User Profile
  const [userData, setUserData] = useState();

  const userProfile = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/users/profile",
        { withCredentials: true }
      );

      const { success, user } = data;

      if (success) {
        setUserData(user.name);
      }

      
    } catch (error) {
      console.log(error);
    }
  };

  //logout 

  const logOut = async()=>{
    try {
      const {data} = await axios.get("http://localhost:8000/api/users/logout", {withCredentials: true});
      const{success, message} = data;

      if(success){
        handleSuccessMessage(message)
      }
    } catch (error) {
      handleErrorMessage(error.response.data.message)
    }
  }


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
        logOut,
        handleNavigateRoom,
        userProfile,
        userData,
      }}
    >
      <div className="container">{children}</div>
      <ToastContainer />
    </context.Provider>
  );
};

export default context;
