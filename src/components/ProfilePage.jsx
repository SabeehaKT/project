import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  Button,
  Grid,
  Avatar,
  Divider,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookIcon from "@mui/icons-material/Book";
import ListIcon from "@mui/icons-material/List";
import authService from "../services/authService";

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // State for user data and form
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: ""
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch user data on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserData({
        username: currentUser.username,
        email: currentUser.email || "user@example.com", // Fallback if email not provided
        fullName: currentUser.fullName || "", 
        bio: currentUser.bio || "No bio added yet",
        memberSince: currentUser.memberSince || "January 2023",
        totalHabits: 7,
        completedHabits: 143,
        currentStreak: 5,
        longestStreak: 14
      });
      
      // Initialize form data with user data
      setFormData({
        username: currentUser.username,
        email: currentUser.email || "user@example.com",
        fullName: currentUser.fullName || "",
        bio: currentUser.bio || ""
      });
    } else {
      // Redirect to login if no user is found
      navigate("/login");
    }
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle save profile
  const handleSaveProfile = () => {
    // Here you would typically call an API to update the user profile
    // For now, we'll just update the local state
    setUserData({
      ...userData,
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      bio: formData.bio
    });
    
    setIsEditing(false);
    setNotification({
      open: true,
      message: "Profile updated successfully!",
      severity: "success"
    });
    
    // You would update the authService user data here
    // authService.updateUserProfile(formData);
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/home");
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Show a loading state while userData is being fetched
  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#009688", padding: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
            MindPal
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<ListIcon />}
              onClick={() => navigate("/habitlist")}
              sx={{ fontWeight: "bold", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
            >
              Habits
            </Button>
            <Button
              color="inherit"
              startIcon={<BookIcon />}
              onClick={() => navigate("/journallist")}
              sx={{ fontWeight: "bold", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
            >
              Journals
            </Button>
            <Button
              color="inherit"
              startIcon={<AccountCircleIcon />}
              onClick={() => navigate("/profile")}
              sx={{ fontWeight: "bold", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              Profile
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        {/* Back Button */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mb: 2, color: "#757575" }}
        >
          Back
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#333333" }}>
              My Profile
            </Typography>
            {isEditing ? (
              <Box>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={handleSaveProfile}
                  sx={{ 
                    backgroundColor: "#009688", 
                    "&:hover": { backgroundColor: "#00796B" },
                    mr: 1
                  }}
                >
                  Save
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsEditing(false)}
                  sx={{ 
                    color: "#757575", 
                    borderColor: "#757575", 
                    "&:hover": { borderColor: "#616161", color: "#616161" } 
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />} 
                onClick={() => setIsEditing(true)}
                sx={{ 
                  color: "#009688", 
                  borderColor: "#009688", 
                  "&:hover": { borderColor: "#00796B", color: "#00796B" } 
                }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
          
          <Grid container spacing={4}>
            {/* Left Column - Avatar and Stats */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    bgcolor: "#009688", 
                    fontSize: "3rem",
                    mb: 2
                  }}
                >
                  {userData.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {userData.username}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Member since {userData.memberSince}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* User Stats */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Stats
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Habits
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {userData.totalHabits}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Completed Habits
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {userData.completedHabits}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Current Streak
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {userData.currentStreak} days
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Longest Streak
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {userData.longestStreak} days
                </Typography>
              </Box>
            </Grid>
            
            {/* Right Column - Profile Details */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Account Information
                  </Typography>
                  
                  {isEditing ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          variant="outlined"
                          multiline
                          rows={4}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {userData.username}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {userData.email}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                          Bio
                        </Typography>
                        <Typography variant="body1">
                          {userData.fullName || "Not provided"}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Aim
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                          {userData.bio}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Account Actions */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Account Actions
                </Typography>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate("/change-password")}
                    sx={{ 
                      color: "#009688", 
                      borderColor: "#009688", 
                      "&:hover": { borderColor: "#00796B", color: "#00796B" } 
                    }}
                  >
                    Change Password
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ 
                      color: "#f44336", 
                      borderColor: "#f44336", 
                      "&:hover": { borderColor: "#d32f2f", color: "#d32f2f" } 
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      {/* Bottom Navigation */}
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
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
      
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={5000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}