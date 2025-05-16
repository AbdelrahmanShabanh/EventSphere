import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Divider,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

function Login() {
  let [userEmail, setUserEmail] = useState("");
  let [userPass, setUserPass] = useState("");

  let [errorMsg, setErrorMsg] = useState("");
  let [isSubmitting, setIsSubmitting] = useState(false);

  let auth = useContext(AuthContext);
  let nav = useNavigate();

  function updateEmail(e) {
    setUserEmail(e.target.value);
  }

  function updatePassword(e) {
    setUserPass(e.target.value);
  }

  async function submitLoginForm(e) {
    e.preventDefault();

    setErrorMsg("");

    if (!userEmail.trim()) {
      setErrorMsg("Email is required");
      return;
    }

    if (!userPass) {
      setErrorMsg("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      let result = await auth.login(userEmail, userPass);

      if (result.success) {
        nav("/");
      } else {
        setErrorMsg(result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageStyles = {
    marginTop: { xs: 4, sm: 8 },
    marginBottom: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const paperStyles = {
    p: { xs: 3, sm: 4 },
    width: "100%",
    maxWidth: 450,
    borderRadius: 2,
  };
  return (
    <Container component="main" maxWidth="sm">
      <Box sx={pageStyles}>
        <Paper elevation={3} sx={paperStyles}>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="500"
              gutterBottom
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to EventBook
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={submitLoginForm} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={userEmail}
              onChange={updateEmail}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={userPass}
              onChange={updatePassword}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      textDecoration: "none",
                      fontWeight: 500,
                      color: "#1976d2",
                    }}
                  >
                    Sign up now
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
