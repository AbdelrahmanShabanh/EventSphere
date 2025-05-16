import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

function ProtectedRoute(props) {
  const authData = useContext(AuthContext);

  if (authData.loading) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          backgroundColor: "#fafafa",
        }}
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (!authData.user) {
    console.log("Access denied: Not logged in");
    return <Navigate to="/login" replace />;
  }

  if (props.adminOnly && !authData.isAdmin()) {
    console.log("Access denied: Admin only");
    return <Navigate to="/" replace />;
  }

  return props.children;
}
ProtectedRoute.defaultProps = {
  adminOnly: false,
};

export default ProtectedRoute;
