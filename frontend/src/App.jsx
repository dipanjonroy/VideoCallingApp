import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Alert from "./utils/alert";
import { GeneralContext } from "./context/GeneralContext";
import Dashboard from "./pages/Dashboard";
import VideoComponent from "./pages/VideoComponent";
import Room from "./pages/Room";

function App() {
  return (
    <>
      <BrowserRouter>
        <GeneralContext>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/room/:roomno" element={<VideoComponent/>}/>
          </Routes>
        </GeneralContext>
      </BrowserRouter>
    </>
  );
}

export default App;
