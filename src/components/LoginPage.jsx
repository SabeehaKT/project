import React, { useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import authService from '../services/authService'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    console.log("Login button clicked");
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      console.log("Attempting login with:", { email }); // Don't log password for security
      const response = await authService.login(email, password);
      console.log("Navigating with token:", localStorage.getItem('token'));
      console.log("Login successful, response:", { token: response.token ? "exists" : "missing", user: response.user ? "exists" : "missing" });
      
      // Store based on "Remember me" setting
      if (rememberMe) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        // Remove from sessionStorage if it exists
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        console.log("Stored credentials in localStorage");
      } else {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("user", JSON.stringify(response.user));
        // Remove from localStorage if it exists
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("Stored credentials in sessionStorage");
      }
  
      console.log("Attempting navigation to /welcome");
      // Force navigation using window.location as a fallback if react-router isn't working
      navigate("/welcome");
      // If navigation doesn't work, try this as fallback after a short delay
      setTimeout(() => {
        if (window.location.pathname !== "/welcome") {
          console.log("Fallback navigation to /welcome");
          window.location.href = "/welcome";
        }
      }, 500);
    } catch (error) {
      // Handle errors
      console.error("Login error:", error);
      const errorMessage = error.message || "Failed to log in. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#009688", padding: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            MindPal
          </Typography>
          <Box>
            <IconButton
              color="inherit"
              onClick={() => navigate("/about")}
              aria-label="About page"
            >
              <InfoIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ marginTop: 4, marginBottom: 8 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ marginBottom: 2, textAlign: "center" }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              paragraph
              textAlign="center"
              color="textSecondary"
            >
              Log in to your HabitTracker account to continue your journey
              toward building better habits.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon sx={{ color: "#009688" }} />{" "}
                    {/* Changed color */}
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#009688" }} /> {/* Changed color */}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: "#009688", "&.Mui-checked": { color: "#009688" } }}
                  />
                }
                label="Remember me"
              />

              <MuiLink
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
                underline="hover"
                sx={{ color: "#009688", "&.Mui-checked": { color: "#009688" } }}
              >
                Forgot Password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ backgroundColor: "#009688", "&:hover": { backgroundColor: "#00796B" }, mb: 3, py: 1.5 }}
            >
              Sign In
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Don't have an account?
              </Typography>

              <Button
                variant="outlined"
                sx={{ color: "#009688", borderColor: "#009688", "&:hover": { borderColor: "#00796B", color: "#00796B" }, px: 4 }}
                size="large"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
        elevation={3}
      >
        {/* <Box sx={{ display: "flex", justifyContent: "space-around", p: 1 }}>
          <IconButton sx={{ color: "#009688" }} onClick={() => navigate("/dashboard")}>
            <HomeIcon />
          </IconButton>
          <IconButton sx={{ color: "#009688" }} onClick={() => navigate("/add-habit")}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton sx={{ color: "#009688" }} onClick={() => navigate("/stats")}>
            <BarChartIcon />
          </IconButton>
          <IconButton sx={{ color: "#009688" }} onClick={() => navigate("/about")}>
            <InfoIcon />
          </IconButton>
        </Box> */}
      </Paper>
    </>
  );
}
