import React, { useState } from "react";
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
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import authService from "../services/authService";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return "";
  };

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    const passwordValidationResult = validatePassword(password);
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (passwordValidationResult) {
      setPasswordError(passwordValidationResult);
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(email, password);
      setAlertMessage(
        "Account created successfully! Redirecting to dashboard..."
      );
      setAlertSeverity("success");
      setShowAlert(true);

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setAlertMessage(
        error.message || "Failed to create account. Please try again."
      );
      setAlertSeverity("error");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#009688", padding: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            HabitTracker
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

      {/* Alert Snackbar */}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

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
              Create Account
            </Typography>

            <Typography
              variant="body1"
              paragraph
              textAlign="center"
              color="textSecondary"
            >
              Join HabitTracker today and start building better habits for a
              better you.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleSignUp}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                        <EmailIcon sx={{ color: emailError ? "error" : "#009688" }} /> {/* Changed color */}
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
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: passwordError ? "error" : "#009688" }} /> {/* Changed color */}
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

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: confirmPasswordError ? "error" : "#009688" }} /> {/* Changed color */}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    sx={{ color: "#009688", "&.Mui-checked": { color: "#009688" } }}
                    required
                  />
                }
                label="I accept the terms and conditions"
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ backgroundColor: "#009688", "&:hover": { backgroundColor: "#00796B" }, mb: 3, py: 1.5 }}
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Already have an account?
              </Typography>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                sx={{ color: "#009688", borderColor: "#009688", "&:hover": { borderColor: "#00796B", color: "#00796B" }, px: 4 }}
                disabled={isLoading}
              >
                Sign In
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
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 1 }}>
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
        </Box>
      </Paper>
    </>
  );
}
