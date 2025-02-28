import { useEffect, useState } from "react";

function Dashboard() {
  const [clock, setClock] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval();
  }, [clock]);
  
  return (
    <div className="dashboard">
      <div className="appOptions">
        <div className="options">
          <div className="creatMeeting option">
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

          <div className="scheduleMeeting option">
            <div>
              <img src="/images/calendar.png" alt="" />
            </div>
            <p>Schedule</p>
          </div>

          <div className="scheduleMeeting option">
            <div>
              <img src="/images/arrow.png" alt="" />
            </div>
            <p>Share screen</p>
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
  );
}

export default Dashboard;
