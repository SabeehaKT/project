import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    joinDate: "",
    profileImage: "", // URL will be stored here after upload
    goalStatement: "",
    notificationsEnabled: false,
    emailUpdates: false,
    weeklyReports: false,
    darkMode: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Fetch user profile data from the backend on page load
    axios
      .get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUserData(response.data); // Update state with the fetched data
      })
      .catch((error) => {
        setSnackbarMessage("Failed to load profile");
        setShowSnackbar(true);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const token =localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/auth/updateprofile`, // Your endpoint
        {
          method: "PUT", // HTTP method for updating data
          headers: {
            "Content-Type": "application/json", // Indicate you're sending JSON data
            Authorization: `Bearer ${token}`, // If authentication is required
          },
          body: JSON.stringify(profile), // The data you're sending to update the habit
        }
      );
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to update habit');
      }
  
      const data = await response.json(); // Parse the response JSON
      console.log("Habit updated:", data);
  
      // Handle success, e.g., show a success message
      setEditMode(false); // Set your edit mode state to false
      setShowSnackbar(true); // Show success snackbar
    } catch (error) {
      console.error("Error updating habit:", error);
      // Handle error (e.g., show error message)
    }
  };
  

  const handleLogout = () => {
    // Remove user token and log out
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#009688", padding: 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/welcome")}
            sx={{ marginRight: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
            My Profile
          </Typography>
          {editMode ? (
            <IconButton color="inherit" onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={() => setEditMode(true)}>
              <EditIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 8 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          {/* Profile Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Avatar
              src={userData.profileImage}
              alt={userData.name || "User Avatar"} // Added a fallback in case name is empty
              sx={{
                width: 120,
                height: 120,
                fontSize: "3rem",
                bgcolor: "#009688",
                marginRight: { xs: 0, sm: 4 },
                marginBottom: { xs: 2, sm: 0 },
              }}
            >
              {userData.name
                ? userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}{" "}
              {/* Default to "U" if name is empty */}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              {editMode ? (
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />
              ) : (
                <Typography variant="h4" fontWeight="bold">
                  {userData.name}
                </Typography>
              )}
              <Typography variant="body1" color="textSecondary">
                Member since: {userData.joinDate}
              </Typography>
              {!editMode && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {userData.email}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Personal Information */}
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
            Personal Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {editMode ? (
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />
              ) : (
                <Box sx={{ display: "flex", marginBottom: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ minWidth: 120 }}
                  >
                    Email:
                  </Typography>
                  <Typography variant="body1">{userData.email}</Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ marginBottom: 1 }}
              >
                Personal Goal:
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="goalStatement"
                  value={userData.goalStatement}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="What are your habit goals?"
                />
              ) : (
                <Typography variant="body1" paragraph>
                  {userData.goalStatement}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Preferences Section */}
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
            Preferences
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.notificationsEnabled}
                    onChange={handleChange}
                    name="notificationsEnabled"
                    color="primary"
                    disabled={!editMode}
                  />
                }
                label="Push Notifications"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.emailUpdates}
                    onChange={handleChange}
                    name="emailUpdates"
                    color="primary"
                    disabled={!editMode}
                  />
                }
                label="Email Updates"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.weeklyReports}
                    onChange={handleChange}
                    name="weeklyReports"
                    color="primary"
                    disabled={!editMode}
                  />
                }
                label="Weekly Progress Reports"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.darkMode}
                    onChange={handleChange}
                    name="darkMode"
                    color="primary"
                    disabled={!editMode}
                  />
                }
                label="Dark Mode"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Account Actions */}
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              color="warning"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>

            {editMode && (
              <Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setEditMode(false)}
                  sx={{ marginRight: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Bottom Navigation */}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
        elevation={3}
      >
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 1 }}>
          <IconButton color="primary" onClick={() => navigate("/dashboard")}>
            <HomeIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => navigate("/add-habit")}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => navigate("/stats")}>
            <BarChartIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => navigate("/about")}>
            <InfoIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarMessage.includes("failed") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
