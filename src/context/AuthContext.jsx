import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_CONFIG } from "../config";

// Create auth context
export const AuthContext = createContext();

// Auth provider component
export function AuthProvider(props) {
  // State
  let [currentUser, setCurrentUser] = useState(null);
  let [isLoading, setIsLoading] = useState(true);

  // Load saved user on startup
  useEffect(function () {
    // Try to get saved auth data
    let savedToken = localStorage.getItem("token");
    let savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        // Parse the user data
        let userData = JSON.parse(savedUser);

        // Validate token format
        if (typeof savedToken !== "string" || !savedToken.trim()) {
          throw new Error("Invalid token format");
        }

        // Set user state
        setCurrentUser(userData);

        // Set auth header for API calls
        axios.defaults.headers.common["Authorization"] = "Bearer " + savedToken;

        // Log success
        console.log("User session restored successfully");
      } catch (err) {
        // Bad data in localStorage
        console.log("Error loading saved user", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      }
    } else {
      // No saved session
      console.log("No saved user session found");

      // Make sure auth header is cleared
      delete axios.defaults.headers.common["Authorization"];
    }

    // Done loading
    setIsLoading(false);
  }, []);

  // Login function
  async function loginUser(email, password) {
    try {
      // Call API
      let res = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        {
          email: email,
          password: password,
        }
      );

      // Save auth data
      let token = res.data.token;
      let userData = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update app state
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      setCurrentUser(userData);

      return { success: true };
    } catch (err) {
      // Handle login errors
      console.log("Login error:", err);
      let errorMsg = "Login failed";

      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }

      return {
        success: false,
        message: errorMsg,
      };
    }
  }

  // Register function
  async function registerUser(username, email, password) {
    try {
      // Call API
      let res = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        {
          username,
          email,
          password,
        }
      );

      // Save auth data
      let token = res.data.token;
      let userData = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update app state
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      setCurrentUser(userData);

      return { success: true };
    } catch (err) {
      // Handle registration errors
      console.log("Registration error:", err);
      let errorMsg = "Registration failed";

      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }

      return {
        success: false,
        message: errorMsg,
      };
    }
  }

  // Logout function
  function logoutUser() {
    // Clear saved data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear auth header
    delete axios.defaults.headers.common["Authorization"];

    // Update state
    setCurrentUser(null);
  }

  // Check if user is admin
  function checkAdmin() {
    // No user = not admin
    if (!currentUser) return false;

    // Check role
    return currentUser.role === "admin";
  }

  // Create context value object
  let contextValue = {
    user: currentUser,
    loading: isLoading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    isAdmin: checkAdmin,
  };

  // Render provider
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}
