import { useContext} from "react";
import Header from "./Header";
import Clock from "./Clock";

import context from "../context/GeneralContext";

function Dashboard() {
  const { handleNavigateRoom} = useContext(context);

  

  return (
    <div className="dashboard">
      <Header />
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
              <Clock/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
