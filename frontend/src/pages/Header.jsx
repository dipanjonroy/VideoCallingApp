import { useContext, useState } from "react";
import context from "../context/GeneralContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { userData, logOut } = useContext(context);
  const [isLogout, setIsLogOut] = useState(false);
  const navigate = useNavigate()

  const handleMouseEnter = () => {
    setIsLogOut(true);
  };

  const handleMouseLeave = () => {
    setIsLogOut(false);
  };

  const handleLogOut = ()=>{
    logOut()
    navigate("/auth")
  }

  return (
    <div className="header">
      <div className="meetingRoomNav">
        <div className="hompageBrand">
          <h2>
            <span>Video</span> App
          </h2>
        </div>

        <div
          className="username-area"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="navigation">
            <span>{userData}</span>
          </div>

          {isLogout && (
            <div className="logout" onClick={handleLogOut}>
              <span>Logout</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
