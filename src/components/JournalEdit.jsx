import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function JournalEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const journal = location.state || {}; // Fallback to empty object if state is undefined
  const [title, setTitle] = useState(journal.title || "");
  const [content, setContent] = useState(journal.content || "");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [image, setImage] = useState(journal.image || null); // Existing image path
  const [newImage, setNewImage] = useState(null); // New image to upload

  // Log journal data on mount
  useEffect(() => {
    console.log("Journal object from location.state:", journal);
    console.log("Initial image state:", journal.image);
  }, [journal]);

  // Clean content on mount
  useEffect(() => {
    const cleanedContent = (journal.content || "").replace(/<\/?p>/g, "");
    setContent(cleanedContent);
  }, [journal.content]);

  // Log image state changes
  useEffect(() => {
    console.log("Existing image path:", image);
    console.log("New image file:", newImage);
  }, [image, newImage]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (newImage) {
        formData.append("image", newImage); // New image to upload
      } else if (image) {
        formData.append("imagePath", image); // Keep existing image
      }

      const response = await fetch(
        `http://localhost:3000/api/auth/updatejournal/${journal._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setSnackbar({
          open: true,
          message: "Journal entry updated successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/journallist"), 2000);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update journal",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating journal",
        severity: "error",
      });
      console.error("Error:", error);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#009688", padding: 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/journallist")}
            sx={{ marginRight: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
            Edit Journal Entry
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          marginTop: 6,
          padding: 4,
          bgcolor: "#FFF8E1",
          border: "1px solid #D3A962",
          borderRadius: 2,
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/lined-paper.png')",
          minHeight: "80vh",
        }}
      >
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "& .MuiInputBase-input": {
              padding: "12px 14px",
              fontSize: "1.1rem",
            },
          }}
        />

        {image ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Current Image:</Typography>
            <img
              src={`http://localhost:3000${image}`}
              alt="Journal"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginTop: "10px",
              }}
              onError={(e) => {
                console.error("Image failed to load:", e.target.src);
                setImage(null); // Hide if it fails
              }}
            />
          </Box>
        ) : (
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            No existing image
          </Typography>
        )}

        <TextField
          type="file"
          onChange={(e) => setNewImage(e.target.files[0])}
          sx={{ mb: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          inputProps={{ accept: "image/*" }}
        />

        {newImage && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">New Image Preview:</Typography>
            <img
              src={URL.createObjectURL(newImage)}
              alt="New Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginTop: "10px",
              }}
            />
          </Box>
        )}

        <TextField
          fullWidth
          label="Write your thoughts..."
          multiline
          rows={15}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            fontFamily: "'Caveat', cursive",
            fontSize: "1.2rem",
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#009688",
            "&:hover": { backgroundColor: "#00796B" },
          }}
        >
          Update Entry
        </Button>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}