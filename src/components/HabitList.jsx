import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Snackbar,
  Alert,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility"; // New import for view icon

export default function HabitList() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const chartData = habits.map((habit) => ({
    name: habit.title,
    completionCount: habit.completions.length,
  }));

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token =localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/auth/gethabit",
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
          setHabits(data.data);
        } else {
          setSnackbar({
            open: true,
            message: data.error || "Failed to fetch habits",
            severity: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error connecting to server",
          severity: "error",
        });
        console.error("Error fetching habits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/auth/deletehabit/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setHabits(habits.filter((habit) => habit._id !== id));
        setSnackbar({
          open: true,
          message: "Habit deleted successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to delete habit",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting habit",
        severity: "error",
      });
      console.error("Error:", error);
    }
  };

  const handleToggleCompletion = async (habit) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCompletion = habit.completions.find(
        (c) => new Date(c.date).setHours(0, 0, 0, 0) === today.getTime()
      );
      const isCompletedToday = todayCompletion
        ? todayCompletion.completed
        : false;

      const response = await fetch(
        `http://localhost:3000/api/auth/updatehabit/${habit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: !isCompletedToday,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setHabits(
          habits.map((h) => (h._id === habit._id ? { ...h, ...data.data } : h))
        );
        setSnackbar({
          open: true,
          message: `Habit marked as ${
            !isCompletedToday ? "completed" : "incomplete"
          }!`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update habit",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating habit",
        severity: "error",
      });
      console.error("Error:", error);
    }
  };

  const handleEdit = (habit) => {
    navigate("/habitedit", { state: habit });
  };

  const handleView = (habit) => {
    navigate("/habitview", { state: habit });
  };

  return (
    <>
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
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", flexGrow: 1, color: "#FFFFFF" }}
          >
            My Habits
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/habitadd")}
            sx={{
              fontWeight: "bold",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            Add Habit
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{ marginTop: 6, padding: 4, bgcolor: "#F7F7F7", borderRadius: 2 }}
     

 >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#333333", mb: 4 }}
        >
          Your Habits
        </Typography>
        <Box sx={{ mb: 6, px: 2 }}>
          <Button
            variant="contained"
            onClick={() => setShowChart(!showChart)}
            sx={{
              backgroundColor: "#009688",
              color: "#FFFFFF",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#00796b" },
            }}
          >
            {showChart ? "Hide Completion Chart" : "View Completion Chart"}
          </Button>
          {showChart && (
            <Box
              sx={{
                width: "100%",
                height: 350,
                mt: 4,
                mb: 6,
                p: 3,
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#333333", mb: 2, textAlign: "center" }}
              >
                Habit Completion Overview
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    stroke="#333333"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    height={80}
                    tickline={false}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#333333"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Completions",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#333333",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F7F7F7",
                      border: "1px solid #009688",
                      borderRadius: "4px",
                      color: "#333333",
                    }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="completionCount"
                    fill="#009688"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
        {loading ? (
          <Typography
            variant="body1"
            sx={{ color: "#333333", textAlign: "center" }}
          >
            Loading habits...
          </Typography>
        ) : habits.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ color: "#333333", textAlign: "center" }}
          >
            No habits added yet. Start by adding one!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {habits.map((habit) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const todayDay = today.toLocaleString("en-US", {
                weekday: "long",
              });
              const isDueToday =
                habit.frequency === "daily" ||
                (habit.frequency === "weekly" &&
                  habit.days.includes(todayDay)) ||
                (habit.frequency === "custom" && habit.days.includes(todayDay));

              const todayCompletion = habit.completions.find(
                (c) => new Date(c.date).setHours(0, 0, 0, 0) === today.getTime()
              );
              const isCompletedToday = todayCompletion
                ? todayCompletion.completed
                : false;

              return (
                <Grid item xs={12} sm={4} key={habit._id}>
                  <Card
                    sx={{
                      backgroundColor: isDueToday ? "#e8f5e9" : "#FFFFFF",
                      border: "2px solid #009688",
                      borderRadius: "10px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      height: "350px",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        paddingBottom: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: habit.color,
                              borderRadius: "50%",
                            }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: "#333333" }}
                          >
                            {habit.title}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            onClick={() => handleView(habit)} // New View button
                            sx={{ color: "#4A90E2" }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEdit(habit)}
                            sx={{ color: "#4A90E2" }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(habit._id)}
                            sx={{ color: "#E94B3C" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
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
                        {habit.frequency !== "daily" &&
                          habit.days.length > 0 && (
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
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
                      <Box
                        sx={{
                          maxHeight: "60px",
                          overflowY: "auto",
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#333333" }}>
                          {habit.description}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#333333", mb: 2 }}
                      >
                        Category:{" "}
                        {habit.category.charAt(0).toUpperCase() +
                          habit.category.slice(1)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <WhatshotIcon sx={{ color: "#f57c00" }} />
                        <Typography variant="body2" sx={{ color: "#333333" }}>
                          Streak: {habit.streak} days (Longest:{" "}
                          {habit.longestStreak})
                        </Typography>
                      </Box>
                      {habit.badges.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <EmojiEventsIcon sx={{ color: "#ffc107" }} />
                          <Typography variant="body2" sx={{ color: "#333333" }}>
                            Badges: {habit.badges.map((b) => b.name).join(", ")}
                          </Typography>
                        </Box>
                      )}
                      {habit.reminder && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <AccessTimeIcon sx={{ color: "#4A90E2" }} />
                          <Typography variant="body2" sx={{ color: "#333333" }}>
                            Reminder: {habit.reminderTime}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Checkbox
                          checked={isCompletedToday}
                          onChange={() => handleToggleCompletion(habit)}
                          sx={{
                            color: "#009688",
                            "&.Mui-checked": { color: "#009688" },
                          }}
                        />
                        <Typography variant="body2" sx={{ color: "#333333" }}>
                          Completed Today
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            sx={{
              backgroundColor:
                snackbar.severity === "success" ? "#50C878" : "#E94B3C",
              color: "#FFFFFF",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}