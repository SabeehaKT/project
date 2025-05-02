import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  AppBar,
  Toolbar,
  IconButton,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookIcon from "@mui/icons-material/Book"; // For Journals
import ListIcon from "@mui/icons-material/List"; // For Habits
import authService from "../services/authService"; // Import authService
import { CheckCircleIcon } from "lucide-react";


export default function WelcomePage() {
  const navigate = useNavigate();

  // State for user data, initialized as null until fetched
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [recentActivities, setRecentActivities] = useState([]);
  const [suggestedHabits, setSuggestedHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data and set greeting on component mount
  useEffect(() => {
    // Fetch user data from authService
    const currentUser = authService.getCurrentUser();
    console.log("Current user data:", currentUser.username); // Debug log
    if (currentUser) {
      setUserData({
        username: currentUser.username, // Use username from registration
        lastLogin: null,
      streak: null,
      completionRate: null,
      todayHabits: null,
      totalHabits: null,
      recentAchievement: null,
      });
    } else {
      // Redirect to login if no user is found (optional)
      navigate("/login");
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, [navigate]);
  

  useEffect(() => {
    if (userData?.username) {
      const fetchHabitData = async () => {
        try {
          // Fetch user stats - note that we're accessing the stats property of the response
          const response = await authService.getUserHabitStats(userData.username);
          const statsData = response.stats; // Access the stats property in the response
          
          setUserData((prev) => ({
            ...prev,
            lastLogin: statsData.lastLogin || 'Unknown',
            streak: statsData.streak || 0,
            completionRate: statsData.completionRate || 0,
            todayHabits: statsData.todayHabits || 0,
            totalHabits: statsData.totalHabits || 0,
            completedHabits: statsData.completedHabits || 0,
            recentAchievement: statsData.recentAchievement || 'None',
          }));
    
          // For recent activities and suggested habits, you would need separate API endpoints
          const activitiesResponse = await authService.getUserRecentActivity();
          setRecentActivities(activitiesResponse || []);
          setSuggestedHabits([]);
          
        } catch (error) {
          console.error('Error fetching habit data:', error);
          setUserData((prev) => ({
            ...prev,
            lastLogin: 'Unknown',
            streak: 0,
            completionRate: 0,
            todayHabits: 0,
            totalHabits: 0,
            completedHabits: 0,
            recentAchievement: 'None',
          }));
          setRecentActivities([]);
          setSuggestedHabits([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHabitData();
    }
  }, [userData?.username]);

  // Show a loading state while userData is being fetched
  if (isLoading || !userData) {
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
              sx={{ fontWeight: "bold", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
            >
              Profile
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Welcome Header */}
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#333333" }}>
            {greeting}, {userData.username}!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back! Last login: {userData.lastLogin || "Unknown"}
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <WhatshotIcon sx={{ color: "#f57c00", mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                {userData.streak !== null ? `${userData.streak} days` : "0 days"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current Streak
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Today's Completion
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mr: 1 }}>
                  {userData.todayHabits}/{userData.totalHabits}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  habits
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={userData.totalHabits ? (userData.todayHabits / userData.totalHabits) * 100 : 0}
                sx={{ height: 8, borderRadius: 5, backgroundColor: "#e0e0e0", "& .MuiLinearProgress-bar": { backgroundColor: "#009688" } }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <EmojiEventsIcon sx={{ color: "#ffc107", mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Recent Achievement
                </Typography>
                <Typography variant="body1">
                {userData.recentAchievement && userData.recentAchievement !== 'None' 
                ? userData.recentAchievement 
                : "No achievements yet"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#009688", "&:hover": { backgroundColor: "#00796B" } }}
            size="large"
            onClick={() => navigate("/profile")}
            startIcon={<HomeIcon />}
          >
            Go to Profile
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "#009688", borderColor: "#009688", "&:hover": { borderColor: "#00796B", color: "#00796B" } }}
            size="large"
            onClick={() => navigate("/habitadd")}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add New Habit
          </Button>
        </Box>

        {/* Recent Activity */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
    Recent Activity
  </Typography>
  
  {recentActivities.length === 0 ? (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Typography variant="body1" color="textSecondary">
        No recent activity to show. Start tracking habits to see your progress here!
      </Typography>
    </Box>
  ) : (
    <>
      {recentActivities.map((activity, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 2,
            pb: 2,
            borderBottom: index < recentActivities.length - 1 ? "1px solid #eee" : "none",
          }}
        >
          {/* Icons based on activity type */}
          {activity.type === "completion" && (
            <Box sx={{ bgcolor: "#e8f5e9", p: 1, borderRadius: "50%", display: "flex", mr: 2 }}>
              <CheckCircleIcon sx={{ color: "#2e7d32" }} />
            </Box>
          )}
          {activity.type === "streak" && (
            <Box sx={{ bgcolor: "#fff3e0", p: 1, borderRadius: "50%", display: "flex", mr: 2 }}>
              <WhatshotIcon sx={{ color: "#f57c00" }} />
            </Box>
          )}
          {activity.type === "badge" && (
            <Box sx={{ bgcolor: "#e3f2fd", p: 1, borderRadius: "50%", display: "flex", mr: 2 }}>
              <EmojiEventsIcon sx={{ color: "#1565c0" }} />
            </Box>
          )}
          {activity.type === "new" && (
            <Box sx={{ bgcolor: "#f3e5f5", p: 1, borderRadius: "50%", display: "flex", mr: 2 }}>
              <AddCircleIcon sx={{ color: "#7b1fa2" }} />
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            {/* Activity content based on type */}
            <Typography variant="body1" fontWeight="bold">
              {activity.habitName}
            </Typography>
            
            <Typography variant="body2">
            {activity.type === "completion" && `Completed "${activity.habitName}"`}
            {activity.type === "streak" && `${activity.streakCount} day streak for "${activity.habitName}"`}
            {activity.type === "badge" && `Earned "${activity.badgeName}" badge for "${activity.habitName}"`}
            {activity.type === "new" && `Created new habit "${activity.habitId}"`}
            </Typography>
            
            <Typography variant="caption" color="textSecondary">
              {typeof activity.date === 'string' 
                ? new Date(activity.date).toLocaleDateString() 
                : activity.date.toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  )}
  
  <Box sx={{ textAlign: "center", mt: 2 }}>
    <Button 
      onClick={() => navigate("/stats")} 
      endIcon={<BarChartIcon />}
      sx={{ color: "#009688" }}
    >
      View All Activity
    </Button>
  </Box>
</Paper>

        {/* Suggested Habits */}
        <Paper elevation={3} sx={{ p: 3, mb: 6 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Suggested Habits
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Based on your interests and goals, you might like these habits:
          </Typography>
          <Grid container spacing={2}>
            {suggestedHabits.map((habit, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card sx={{ height: "100%" }}>
                  <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/add-habit")}>
                    <CardContent>
                      <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: habit.color, mb: 1 }} />
                      <Chip label={habit.category} size="small" sx={{ mb: 1 }} />
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {habit.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {habit.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Bottom Navigation */}
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 1 }}>
          <IconButton sx={{ color: "#009688" }} onClick={() => navigate("/home")}>
            <HomeIcon />
          </IconButton>
          <IconButton sx={{ color: "#009688" }} onClick={() => navigate("/habitadd")}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton sx={{ color: "#009688" }} onClick={() => navigate("/habitlist")}>
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

// Icon component for completion status
const CheckIcon = ({ sx }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={sx}>
    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
  </svg>
);