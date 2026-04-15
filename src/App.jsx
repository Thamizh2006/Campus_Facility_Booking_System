import React, { createContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import Booking from "./pages/BookingPage";
import Login from "./pages/LoginPage";
import About from "./pages/AboutPage";
import AV from "../Frontend/AV";
import Library from "../Frontend/Library";
import ComputerLab from "../Frontend/ComputerLab";
import ConferenceHall from "../Frontend/ConferenceHall";
import IndoorAuditorium from "../Frontend/IndoorAuditorium";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BookingHistory from "./pages/BookingHistoryPage";
import { getStoredUser } from "./lib/api";

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  setUser: () => {},
  logout: () => {},
});

const App = () => {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    }
  }, [user]);

  const authValue = useMemo(
    () => ({
      isLoggedIn: Boolean(user?.token),
      user,
      setUser,
      logout: () => setUser(null),
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!authValue.isLoggedIn ? <Login /> : <Navigate to="/booking" replace />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookinghistory"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/av"
            element={
              <ProtectedRoute>
                <AV />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/computerlab"
            element={
              <ProtectedRoute>
                <ComputerLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conferencehall"
            element={
              <ProtectedRoute>
                <ConferenceHall />
              </ProtectedRoute>
            }
          />
          <Route
            path="/indoorauditorium"
            element={
              <ProtectedRoute>
                <IndoorAuditorium />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={authValue.isLoggedIn ? "/booking" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
