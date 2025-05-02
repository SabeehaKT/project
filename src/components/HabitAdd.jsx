import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PaletteIcon from "@mui/icons-material/Palette";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Adjust URL to match your backend

export default function HabitAdd() {
  const navigate = useNavigate();
  const [habitData, setHabitData] = useState({
    title: "",
    description: "",
    frequency: "daily",
    category: "",
    reminder: false,
    reminderTime: "",
    color: "#4A90E2",
  });

  const [selectedDays, setSelectedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const categories = [
    "Health",
    "Fitness",
    "Productivity",
    "Learning",
    "Mindfulness",
    "Diet",
    "Sleep",
    "Other",
  ];

  const colors = ["#50C878", "#E94B3C", "#F5A623", "#4A90E2", "#333333"];

  // Initialize Socket.IO and request notification permission
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    socket.emit("register", userId);

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          setSnackbar({
            open: true,
            message: "Please enable notifications for habit reminders!",
            severity: "warning",
          });
        }
      });
    }

    // Listen for notifications from the server
    socket.on("notification", (message) => {
      setSnackbar({
        open: true,
        message,
        severity: "info",
      });

      if (Notification.permission === "granted") {
        new Notification("Habit Reminder", {
          body: message,
          icon: "/reminder-icon.png",
        });
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("notification");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "reminder" && value && !prev.reminderTime
        ? { reminderTime: "08:00" }
        : {}),
    }));
  };

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/auth/createhabit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...habitData,
          days: selectedDays,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({
          open: true,
          message: "Habit created successfully!",
          severity: "success",
        });

        // Register reminder with the backend
        if (habitData.reminder) {
          await registerReminder(
            habitData.title,
            habitData.reminderTime,
            selectedDays,
            habitData.frequency
          );
        }

        navigate("/habitlist");
      } else {
        setSnackbar({ open: true, message: data.error, severity: "error" });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred!",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerReminder = async (title, time, days, frequency) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await fetch("http://localhost:3000/api/auth/registerReminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          time,
          days,
          frequency,
          userId,
        }),
      });
    } catch (error) {
      console.error("Error registering reminder:", error);
    }
  };

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
          <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1, color: "#FFFFFF" }}>
            Add New Habit
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{ marginTop: 6, padding: 4, bgcolor: "#F7F7F7", borderRadius: 2 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#009688" }}>
            Create a New Habit
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: habitData.color,
                borderRadius: "50%",
              }}
            />
            <TextField
              required
              fullWidth
              label="Habit Title"
              name="title"
              value={habitData.title}
              onChange={handleChange}
              placeholder="e.g., Morning Meditation"
              InputLabelProps={{ style: { color: "#333333" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#009688" },
                  "&:hover fieldset": { borderColor: "#009688" },
                  "&.Mui-focused fieldset": { borderColor: "#009688" },
                },
              }}
            />
          </Box>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={habitData.description}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="What do you want to achieve with this habit?"
            InputLabelProps={{ style: { color: "#333333" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#009688" },
                "&:hover fieldset": { borderColor: "#009688" },
                "&.Mui-focused fieldset": { borderColor: "#009688" },
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: "#333333" }}>Frequency</InputLabel>
            <Select
              name="frequency"
              value={habitData.frequency}
              onChange={handleChange}
              label="Frequency"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#009688" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#009688" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#009688" },
              }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {habitData.frequency === "weekly" || habitData.frequency === "custom" ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {days.map((day) => (
                <Chip
                  key={day}
                  label={day}
                  onClick={() => handleDayToggle(day)}
                  color={selectedDays.includes(day) ? "primary" : "default"}
                  sx={{
                    margin: 0.5,
                    backgroundColor: selectedDays.includes(day) ? "#009688" : "#F7F7F7",
                    color: selectedDays.includes(day) ? "#FFFFFF" : "#333333",
                  }}
                />
              ))}
            </Box>
          ) : null}

          <FormControl fullWidth>
            <InputLabel sx={{ color: "#333333" }}>Category</InputLabel>
            <Select
              name="category"
              value={habitData.category}
              onChange={handleChange}
              label="Category"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#009688" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#009688" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#009688" },
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category.toLowerCase()}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center", gap: 1, color: "#333333" }}
            >
              <PaletteIcon color="primary" /> Choose a color:
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => setHabitData((prev) => ({ ...prev, color }))}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: color,
                    cursor: "pointer",
                    border: habitData.color === color ? "3px solid #333333" : "none",
                  }}
                />
              ))}
            </Box>
          </Box>

          <FormControl>
            <Typography variant="subtitle1" sx={{ color: "#333333" }}>
              Reminder Settings:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 1 }}>
              <Chip
                label={habitData.reminder ? "Reminders On" : "Reminders Off"}
                color={habitData.reminder ? "success" : "default"}
                onClick={() =>
                  setHabitData((prev) => ({
                    ...prev,
                    reminder: !prev.reminder,
                  }))
                }
                sx={{
                  backgroundColor: habitData.reminder ? "#50C878" : "#F7F7F7",
                  color: habitData.reminder ? "#FFFFFF" : "#333333",
                  cursor: "pointer",
                }}
              />
              {habitData.reminder && (
                <TextField
                  type="time"
                  name="reminderTime"
                  value={habitData.reminderTime}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <AccessTimeIcon color="primary" />,
                    style: { color: "#009688" },
                  }}
                  sx={{
                    width: 150,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#009688" },
                      "&:hover fieldset": { borderColor: "#009688" },
                      "&.Mui-focused fieldset": { borderColor: "#009688" },
                    },
                  }}
                />
              )}
            </Box>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/habitlist")}
              sx={{
                padding: "10px 20px",
                borderColor: "#009688",
                color: "#009688",
                "&:hover": {
                  backgroundColor: "rgba(74, 144, 226, 0.1)",
                  borderColor: "#4A90E2",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                padding: "10px 20px",
                backgroundColor: "#009688",
                color: "#FFFFFF",
                "&:hover": { backgroundColor: "#009688" },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(74, 144, 226, 0.5)",
                  color: "#FFFFFF",
                },
              }}
            >
              {isLoading ? "Creating..." : "Create Habit"}
            </Button>
          </Box>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              severity={snackbar.severity}
              sx={{
                backgroundColor: snackbar.severity === "success" ? "#50C878" : "#E94B3C",
                color: "#FFFFFF",
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </>
  );
}