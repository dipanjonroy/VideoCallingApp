import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Alert from "./utils/alert";
import { GeneralContext } from "./context/GeneralContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <GeneralContext>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<Login />} />
          </Routes>
        </GeneralContext>
      </BrowserRouter>
    </>
  );
}

export default App;
