import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "./GeneralContext";

export const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { userProfile } = useContext(context);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    userProfile();
  }, [navigate]);

  return <>{children}</>;
};

export const AuthGuard = ({ children }) => {
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);
  return <>{children}</>;
};
