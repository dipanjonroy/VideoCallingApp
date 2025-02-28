import { useCallback, useContext, useEffect, useRef, useState } from "react";
import context from "../context/GeneralContext";
import peer from "../utils/peer";

function Room() {
  const { socket } = useContext(context);

  const localVideoRef = useRef();

  const [remoteSocketId, setRemoteSocketID] = useState("");
  const [isVideo, setIsVideo] = useState(true);
  const [isAudio, setIsAudio] = useState(true);
  const [isScreen, setIsScreen] = useState();

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setIsVideo(true);
      } else {
        setIsVideo(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setIsAudio(true);
      } else {
        setIsAudio(false);
      }

      // if (navigator.mediaDevices.getDisplayMedia()) {
      //   setIsScreen(true);
      // } else {
      //   setIsScreen(false);
      // }

      if (isVideo || isAudio) {
        const getUserMedia = await navigator.mediaDevices.getUserMedia({
          video: isVideo,
          audio: isAudio,
        });

        if (getUserMedia) {
          window.localStream = getUserMedia;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = getUserMedia;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserJoin = ({ username, id }) => {
    setRemoteSocketID(id);
    console.log(username, " is connected to the room.");
  };

  const connectToServer = async () => {
    const offer = await peer.getOffer();
    socket.emit("signal", { to: remoteSocketId, offer });
  };

  const handleReceiveSignal = async ({ from, offer }) => {
    setRemoteSocketID(from);
    const answer = await peer.getAnswer(offer);
    console.log(answer);
    socket.emit("signal:accept", { to: from, answer });
  };

  // const handleSignalAccepted = async ({ from, answer }) => {
  //   await peer.setLocalDescription(answer);
  // };

  useEffect(() => {
    socket.on("user:joined", handleUserJoin);
    socket.on("signal:receive", handleReceiveSignal);
    // socket.on("signal:accepted", handleSignalAccepted);

    getPermissions();

    if (remoteSocketId) {
      connectToServer();
    }

    return () => {
      socket.off("user:joined", handleUserJoin);
      socket.off("signal:receive", handleReceiveSignal);
      // socket.off("signal:accepted", handleSignalAccepted);
    };
  }, [
    socket,
    handleUserJoin,
    handleReceiveSignal,
    getPermissions,
    // handleSignalAccepted,
    ,
  ]);

  return (
    <div>
      <h1>Room</h1>
      <h2>{remoteSocketId ? "Connected" : "No one in the room"}</h2>
      <div>
        <video ref={localVideoRef} autoPlay muted></video>
      </div>
    </div>
  );
}

export default Room;
