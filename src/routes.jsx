// routes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BulkMessage from "./pages/BulkMessage";
import Chat from "./pages/Chat";
import NavBar from "./components/NavBar";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              <NavBar />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bulk-message" element={<BulkMessage />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}
