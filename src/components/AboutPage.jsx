import React from "react";
import { 
  Typography, 
  Box, 
  Container, 
  Paper,
  Grid,
  Divider,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";

export default function AboutPage() {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#009688", padding: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            MindPal
          </Typography>
          <Box>
            <IconButton color="inherit" onClick={() => navigate("/profile")}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 8 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2, textAlign: "center" }}>
            About MindPal
          </Typography>
          
          <Typography variant="body1" paragraph>
            Welcome to HabitTracker, your personal companion for building better habits and achieving your goals. 
            We believe that small, consistent actions lead to remarkable transformations. Our platform is designed 
            to help you establish positive routines, track your progress, and stay motivated on your journey.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
            Our Mission
          </Typography>
          
          <Typography variant="body1" paragraph>
            Our mission is to empower individuals to take control of their daily routines and transform their lives 
            through the power of habit formation. We provide the tools and insights needed to make lasting change 
            accessible to everyone.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
            Key Features
          </Typography>
          
          <Grid container spacing={3} sx={{ marginBottom: 4 }}>
            <FeatureItem 
              icon={<AddCircleOutlineIcon fontSize="large" color="primary" />}
              title="Personalized Habit Creation" 
              description="Create custom habits tailored to your specific goals and needs. Set frequency, reminders, and categories."
            />
            
            <FeatureItem 
              icon={<BarChartIcon fontSize="large" color="primary" />}
              title="Progress Tracking" 
              description="Visualize your progress with intuitive charts and statistics. Monitor streaks and celebrate milestones."
            />
            
            <FeatureItem 
              icon={<DashboardIcon fontSize="large" color="primary" />}
              title="Dashboard Overview" 
              description="Get a comprehensive view of all your habits and achievements in one convenient dashboard."
            />
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
            How It Works
          </Typography>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 4 }}>
            <StepItem 
              number="1" 
              title="Create Your Habits" 
              description="Define the habits you want to build, set their frequency, and customize reminders."
            />
            
            <StepItem 
              number="2" 
              title="Track Daily Progress" 
              description="Check off completed habits and build streaks as you maintain consistency."
            />
            
            <StepItem 
              number="3" 
              title="Review and Adjust" 
              description="Analyze your performance data and refine your habit system for better results."
            />
            
            <StepItem 
              number="4" 
              title="Celebrate Achievements" 
              description="Earn badges and milestone rewards as you make progress on your habit journey."
            />
          </Box>
          
          {/* <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate("/dashboard")}
              startIcon={<DashboardIcon />}
              sx={{ marginRight: 2 }}
            >
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate("/add-habit")}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add First Habit
            </Button>
          </Box> */}
        </Paper>
      </Container>
      
      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1100 
        }} 
        elevation={3}
      >
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 1 }}>
          <IconButton color="primary" onClick={() => navigate("/dashboard")}>
            <HomeIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => navigate("/add-habit")}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => navigate("/stats")}>
            <BarChartIcon />
          </IconButton>
          <IconButton color="primary" sx={{ color: "#009688" }}>
            <InfoIcon />
          </IconButton>
        </Box> */}
      </Paper>
    </>
  );
}

// Feature Item Component
const FeatureItem = ({ icon, title, description }) => (
  <Grid item xs={12} sm={4}>
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {icon}
      <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </Box>
  </Grid>
);

// Step Item Component
const StepItem = ({ number, title, description }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
    <Avatar 
      sx={{ 
        bgcolor: "#009688", 
        width: 36, 
        height: 36, 
        fontSize: "1.2rem", 
        fontWeight: "bold" 
      }}
    >
      {number}
    </Avatar>
    <Box>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </Box>
  </Box>
);