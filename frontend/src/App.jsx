import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import { GeneralContext } from "./context/GeneralContext";
import Dashboard from "./pages/Dashboard";
import VideoComponent from "./pages/VideoComponent";
import { UserProtectWrapper, AuthGuard } from "./context/AuthGuard";


function App() {
  return (
    <>
      <BrowserRouter>
        <GeneralContext>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/auth"
              element={
                <AuthGuard>
                  <Login />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <UserProtectWrapper>
                  <Dashboard />
                </UserProtectWrapper>
              }
            />
            <Route
              path="/room/:roomno"
              element={
                <UserProtectWrapper>
                  <VideoComponent />
                </UserProtectWrapper>
              }
            />
          </Routes>
        </GeneralContext>
      </BrowserRouter>
    </>
  );
}

export default App;
