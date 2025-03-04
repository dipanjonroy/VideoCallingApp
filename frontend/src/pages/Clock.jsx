import { useState, useEffect } from "react";

function Clock() {
  
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval();
  }, []); 

  return ( <h2>{time}</h2> );
}

export default Clock;