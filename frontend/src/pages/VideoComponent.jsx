import { useContext, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from "@mui/material/Badge";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import context from "../context/GeneralContext";
import Header from "./Header";
import io from "socket.io-client";

const server_url = "localhost:8000";

let connections = {};

const peerConfigConnection = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const getFirstWord = (name)=>{
  return name.split(" ")[0]
}

function VideoComponent() {
  const [isAccess, setIsAccess] = useState(true);

  const socketRef = useRef();
  const socketIdRef = useRef();

  const localVideoRef = useRef();
  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const [video, setVideo] = useState();
  const [audio, setAudio] = useState();

  const [showModel, setShowModel] = useState();

  const [screenAvailable, setScreenAvailable] = useState();
  const [screen, setScreen] = useState();

  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState(0);
  const [username, setUsername] = useState("");

  const [videos, setVideos] = useState([]);

  const {userData} = useContext(context)

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      // if (navigator.mediaDevices.getDisplayMedia()) {
      //   setScreenAvailable(true);
      // } else {
      //   setScreenAvailable(false);
      // }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({width = 680, height = 480}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });

    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }

    window.localStream = stream;

    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  const getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (error) {
            console.log(error);
          }

          //TODO blacksilence
          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then(() => {})
        .catch((err) => console.log(err));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        console.log(tracks);
        tracks.forEach((track) => track.stop());
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  const gotMessageFromServer = (fromId, message) => {
    let signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const addmessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages)=> [...prevMessages, {sender:sender, data:data}])

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
  }
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addmessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnection
          );

          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candiate })
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            console.log(event);
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              setVideos((videos) => {
                const updateVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updateVideos;
                console.log(videoRef.current);
                return updateVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInline: true,
              };

              setVideos((videos) => {
                const updateVideos = [...videos, newVideo];
                videoRef.current = updateVideos;
                return updateVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (error) {
              console.log(error);
            }

            connections[id2]
              .createOffer()
              .then((description) => {
                connections[id2].setLocalDescription(description).then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                });
              })
              .catch((e) => console.log(e));
          }
        }
      });

      //done
    });
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const connect = () => {
    setIsAccess(false);
    getMedia();
  };

  const handleVideo = () => {
    setVideo(!video);
  };

  const handleAudio = () => {
    setAudio(!audio);
  };

  const handleScreenShare = () => {
    setScreen(true);
  };

  const handleChatWindow = ()=>{
    setShowModel(!showModel)
  }

  const handleSendMessage = (e)=>{
    e.preventDefault()
    socketRef.current.emit('chat-message', message, userData)
    setMessage("")
  }

  return (
    <div>
      {isAccess ? (
        <div className="meetingRoom">
          <Header/>
          <div className="videoArea">
            <div className="video">
              <video ref={localVideoRef} muted autoPlay></video>
            </div>
            <div className="askJoin">
              <h3>Ready to join?</h3>
              <button onClick={connect}>Join room</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="streamContainer">
          <div className="meeting-videos">
            <div className="connectedUserStream">
              {videos.map((video) => (
                <div ley={video.socketId} className="single-video-item">
                  <video
                    data-socket={video.stream}
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                    muted
                  ></video>
                </div>
              ))}
            </div>

            <div className="meetingOwner">
              <div
                className="ownerStrem"
                style={showModel ? { height: "30%" } : undefined}
              >
                <video
                  className="userStream"
                  ref={localVideoRef}
                  autoPlay
                  muted
                ></video>
              </div>

              {showModel && (
                <div className="chatContainer">
                  <div className="chat-heading">
                    <h2>Chats</h2>
                    <IconButton>
                      <CloseIcon />
                    </IconButton>
                  </div>

                  <div className="message-area">
                    <div className="messages">
                      {messages.length > 0 ? (
                        messages.map((message) => {
                          return (
                            <div
                              className={
                                message.sender === userData
                                  ? "message user-message"
                                  : "message"
                              }
                            >
                              <h5>{getFirstWord(message.sender)}</h5>
                              <p>{message.data}</p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="no-message">
                          No messages are available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="chat-typing-box">
                    <form onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        placeholder="Start chatting"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <IconButton type="submit">
                        <SendIcon />
                      </IconButton>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="callerBtns">
            <div className="btns-icons">
              <IconButton onClick={handleVideo}>
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              <IconButton>
                <CallEndIcon style={{ color: "red" }} />
              </IconButton>
              <IconButton onClick={handleAudio}>
                {audio ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
              <IconButton onClick={handleScreenShare}>
                {!screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
              <Badge badgeContent={newMessages} color="primary">
                <IconButton onClick={handleChatWindow}>
                  <ChatIcon />
                </IconButton>
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoComponent;
