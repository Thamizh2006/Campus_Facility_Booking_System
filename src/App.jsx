import React, { useState, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "../Frontend/Home";
import Booking from "../Frontend/Booking";
import Login from "../Frontend/Login";
import About from "../Frontend/About";
import AV from "../Frontend/AV";
import Library from "../Frontend/Library";
import ComputerLab from "../Frontend/ComputerLab";
import ConferenceHall from "../Frontend/ConferenceHall";
import IndoorAuditorium from "../Frontend/IndoorAuditorium";
import ProtectedRoute from "../Frontend/ProtectedRoute";
import BookingHistory from "../Frontend/BookingHistory";

export const AuthContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/home" />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/bookinghistory" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />

          <Route path="/av" element={<ProtectedRoute><AV /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/computerlab" element={<ProtectedRoute><ComputerLab /></ProtectedRoute>} />
          <Route path="/conferencehall" element={<ProtectedRoute><ConferenceHall /></ProtectedRoute>} />
          <Route path="/indoorauditorium" element={<ProtectedRoute><IndoorAuditorium /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
