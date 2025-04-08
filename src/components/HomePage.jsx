import React from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  AppBar,
  Toolbar,
  Grid,
} from "@mui/material";

import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          background: "#009688",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", letterSpacing: 1, color: "#FFFFFF" }}
          >
            MindPal
          </Typography>
          <Box>
            <Button
              component={Link}
              to="/login"
              sx={{
                color: "#FFFFFF",
                marginRight: 2,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/signup"
              sx={{
                color: "#FFFFFF",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: "#F7F7F7",
          py: 12,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ color: "#333333", mb: 2 }}
          >
            Build Habits That Last
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#333333", mb: 4, maxWidth: "600px", mx: "auto" }}
          >
            Take control of your life with HabitTracker – set goals, track your
            progress, and stay motivated with a personalized experience.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            sx={{
              backgroundColor: "#009688",
              color: "#FFFFFF",
              padding: "12px 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "25px",
              "&:hover": { backgroundColor: "#009688" },
            }}
          >
            Get Started for Free
          </Button>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Healthy Habits"
            sx={{
              width: "80%",
              maxWidth: "600px",
              mt: 6,
              borderRadius: "10px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center", backgroundColor: "#F7F7F7" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#333333", mb: 6 }}
        >
          Why HabitTracker Stands Out
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <FeatureCard
            title="Personalized Plans"
            description="Tailor habits to fit your unique lifestyle and goals."
            image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
          />
          <FeatureCard
            title="Daily Reminders"
            description="Never miss a beat with smart, timely notifications."
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
          />
          <FeatureCard
            title="Progress Tracking"
            description="Visualize your streaks and celebrate milestones."
            image="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
          />
        </Grid>
      </Container>
    </>
  );
}

// Feature Card Component
const FeatureCard = ({ title, description, image }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#FFFFFF",
        borderTop: "4px solid #009688",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "10px",
          mb: 2,
        }}
      />
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#009688" }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: "#333333", mt: 1 }}>
        {description}
      </Typography>
    </Box>
  </Grid>
);