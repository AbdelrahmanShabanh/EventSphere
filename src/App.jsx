import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, Paper } from "@mui/material";
import { useContext } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { SettingsContext } from "./context/SettingsContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import UserBookings from "./pages/UserBookings";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const { isRtl } = useContext(SettingsContext);

  return (
    <>
      <CssBaseline />

      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          borderRadius: 0,
          bgcolor: "background.default",
        }}
      >
        <Navbar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            direction: isRtl ? "rtl" : "ltr",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <UserBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </Box>
      </Paper>
    </>
  );
}

// Export the app
export default App;
