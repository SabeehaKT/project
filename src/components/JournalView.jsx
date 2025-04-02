import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function JournalView() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the journal ID from the URL
  const [journal, setJournal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        console.log("Token being sent:", token); // Debug log
        if (!token) {
          throw new Error("No token found, please log in again");
        }

        const response = await fetch(`http://localhost:3000/api/auth/getjournal/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          console.log("Fetched journal data:", data.data); // Debug log
          setJournal(data.data);
        } else {
          setError(data.error || "Failed to fetch journal");
        }
      } catch (error) {
        setError(error.message || "Error fetching journal");
        console.error("Error:", error);
      }
    };

    fetchJournal();
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!journal) {
    return <Typography>Loading...</Typography>;
  }

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
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#FFFFFF" }}
          >
            View Journal Entry
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          marginTop: 6,
          padding: 4,
          bgcolor: "#FFF8E1",
          border: "1px solid rgb(194, 182, 162)",
          borderRadius: 2,
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/lined-paper.png')",
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#333333", mb: 2 }}
        >
          {journal.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666666", mb: 3 }}>
          {new Date(journal.date).toLocaleDateString()}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              color: "#333333",
              fontFamily: "'Caveat', cursive",
              fontSize: "1.2rem",
            }}
            dangerouslySetInnerHTML={{ __html: journal.content }}
          />
          {journal.image && (
            <Box
              sx={{
                maxWidth: "40%", // Limit image width for neatness
                textAlign: "right", // Right-align the content
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#333333",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
              </Typography>
              <img
                src={`http://localhost:3000${journal.image}`}
                alt="Journal Image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "8px", // Add slight rounding for neatness
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
                }}
                onError={(e) => console.error("Image failed to load:", e.target.src)}
              />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}