import { useContext, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { Link, useNavigate } from "react-router-dom";
import context from "../context/GeneralContext";

function Dashboard() {
  const [clock, setClock] = useState(new Date().toLocaleTimeString());

  const { connect, handleNavigateRoom } = useContext(context);



 

  useEffect(() => {
    setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval();
  }, [clock]);

  

  // const copyMeetingURL = async (e) => {
  //   try {
  //     await navigator.clipboard.writeText(e.target.value);
  //     setCopied(true);
  //     setTimeout(() => {
  //       setCopied(false);
  //     }, 3000);
  //     console.log("copied");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="dashboard">
      <div className="dashboard-items">
        <div className="appOptions">
          <div className="options">
            <div className="creatMeeting option" onClick={handleNavigateRoom}>
              <div>
                <img src="/images/video-camera.png" alt="" />
              </div>
              <p>Create</p>
            </div>
            <div className="joinMeeting option">
              <div>
                <img src="/images/plus.png" alt="" />
              </div>
              <p>Join</p>
            </div>
          </div>
        </div>

        <div className="meetingSchedule">
          <div className="schedule">
            <div className="clock">
              <h2>{clock}</h2>
            </div>
            <div className="scheduleBody"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
