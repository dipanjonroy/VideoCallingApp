import { useContext } from "react";
import context from "../context/GeneralContext";
import "./alert.css";
import CloseIcon from "@mui/icons-material/Close";

function Alert({ message }) {
  const { closeAlert } = useContext(context);
  return (
    <div className="alertContainer">
      <div className="alert">
        <p>{message}</p>
        <span onClick={closeAlert}>
          <CloseIcon fontSize="small" className="button" />
        </span>
      </div>
    </div>
  );
}

export default Alert;
