import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function HabitView() {
  const navigate = useNavigate();
  const location = useLocation();
  const habit = location.state; // Get the habit data passed via navigation
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch video suggestions when component mounts
  useEffect(() => {
    if (habit && habit.category) {
      const fetchVideoSuggestions = async () => {
        setLoading(true);
        try {
          const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3000/api/auth/videosuggestions?category=${encodeURIComponent(
              habit.category
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            setVideos(data.data);
          } else {
            console.error("Failed to fetch videos:", data.error);
          }
        } catch (error) {
          console.error("Error fetching video suggestions:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVideoSuggestions();
    }
  }, [habit]);

  if (!habit) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        No habit selected.
      </Typography>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#009688", padding: 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/habitlist")}
            sx={{ marginRight: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", flexGrow: 1, color: "#FFFFFF" }}
          >
            {habit.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{ marginTop: 6, padding: 4, bgcolor: "#F7F7F7", borderRadius: 2 }}
      >
        <Card
          sx={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #009688",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            mb: 4,
          }}
        >
          <CardContent>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: habit.color,
                  borderRadius: "50%",
                }}
              />
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "#333333" }}
              >
                {habit.title}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "#333333", mb: 2 }}>
              {habit.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={
                  habit.frequency.charAt(0).toUpperCase() +
                  habit.frequency.slice(1)
                }
                sx={{
                  backgroundColor: "#009688",
                  color: "#FFFFFF",
                }}
              />
              {habit.frequency !== "daily" && habit.days.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {habit.days.map((day) => (
                    <Chip
                      key={day}
                      label={day}
                      sx={{
                        backgroundColor: "#F7F7F7",
                        color: "#333333",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
            <Typography variant="body1" sx={{ color: "#333333", mb: 2 }}>
              Category:{" "}
              {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <WhatshotIcon sx={{ color: "#f57c00" }} />
              <Typography variant="body1" sx={{ color: "#333333" }}>
                Streak: {habit.streak} days (Longest: {habit.longestStreak})
              </Typography>
            </Box>
            {habit.badges.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <EmojiEventsIcon sx={{ color: "#ffc107" }} />
                <Typography variant="body1" sx={{ color: "#333333" }}>
                  Badges: {habit.badges.map((b) => b.name).join(", ")}
                </Typography>
              </Box>
            )}
            {habit.reminder && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AccessTimeIcon sx={{ color: "#4A90E2" }} />
                <Typography variant="body1" sx={{ color: "#333333" }}>
                  Reminder: {habit.reminderTime}
                </Typography>
              </Box>
            )}
            <Typography variant="body1" sx={{ color: "#333333" }}>
              Completions: {habit.completions.length} times
            </Typography>
          </CardContent>
        </Card>

        {/* Video Suggestions Section */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#333333", mb: 3 }}
        >
          Video Suggestions
        </Typography>
        {loading ? (
          <Typography variant="body1" sx={{ color: "#333333" }}>
            Loading videos...
          </Typography>
        ) : videos.length === 0 ? (
          <Typography variant="body1" sx={{ color: "#333333" }}>
            No video suggestions found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.videoId}>
                <Card
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#333333", mb: 1 }}
                    >
                      {video.title.length > 50
                        ? `${video.title.substring(0, 50)}...`
                        : video.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666666", mb: 2 }}
                    >
                      {video.description.length > 100
                        ? `${video.description.substring(0, 100)}...`
                        : video.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#999999", mb: 2, display: "block" }}
                    >
                      Published: {new Date(video.publishedAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="contained"
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      sx={{
                        backgroundColor: "#009688",
                        color: "#FFFFFF",
                        "&:hover": { backgroundColor: "#00796b" },
                      }}
                    >
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}