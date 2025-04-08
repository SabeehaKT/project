// JournalList.js
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
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility"; // For View button
import DeleteIcon from "@mui/icons-material/Delete";

export default function JournalList() {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const token = localStorage.getItem('token')|| sessionStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3000/api/auth/getjournal`,
          {
            method: "GET",
            headers: { 
              "Content-Type": "application/json" ,
              "Authorization": `Bearer ${token}`
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setJournals(data.data);
        } else {
          setSnackbar({
            open: true,
            message: data.error || "Failed to fetch journals",
            severity: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error connecting to server",
          severity: "error",
        });
        console.error("Error fetching journals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')|| sessionStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/auth/deletejournal/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setJournals(journals.filter((journal) => journal._id !== id));
        setSnackbar({
          open: true,
          message: "Journal deleted successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to delete journal",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting journal",
        severity: "error",
      });
      console.error("Error:", error);
    }
  };

  const handleEdit = (journal) => {
    navigate("/journaledit", { state: journal });
  };

  const handleView = (journal) => {
    navigate(`/journalview/${journal._id}`); // Navigate to view page with journal ID in the URL
  };

  // Function to extract first few words from content, stripping HTML
  const getPreviewText = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent; // Parse HTML
    const text = tempDiv.textContent || tempDiv.innerText || ""; // Extract plain text
    const words = text.split(" ").slice(0, 5).join(" "); // Get first 5 words
    return words.length < text.length ? `${words}...` : words;
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
            My Journal
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/journaladd")}
            sx={{
              fontWeight: "bold",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            Add Entry
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
          Your Journal Entries
        </Typography>

        {loading ? (
          <Typography
            variant="body1"
            sx={{ color: "#333333", textAlign: "center" }}
          >
            Loading journals...
          </Typography>
        ) : journals.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ color: "#333333", textAlign: "center" }}
          >
            No journal entries yet. Start writing one!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {journals.map((journal) => (
              <Grid item xs={12} sm={4} key={journal._id}>
                <Card
                  sx={{
                    backgroundColor: "#FFF8E1",
                    border: "1px solid #D3A962",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    height: "180px", // Adjusted height for compact view
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      padding: "16px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between", // Title on left, buttons on right
                        alignItems: "center", // Vertically center title and buttons
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#333333" }}
                      >
                        {journal.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {" "}
                        {/* Reduced gap between buttons */}
                        <IconButton
                          onClick={() => handleEdit(journal)}
                          sx={{ color: "#4A90E2", padding: "4px" }} // Smaller padding
                          size="small" // Smaller button size
                        >
                          <EditIcon fontSize="small" /> {/* Smaller icon */}
                        </IconButton>
                        <IconButton
                          onClick={() => handleView(journal)}
                          sx={{ color: "#009688", padding: "4px" }}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(journal._id)}
                          sx={{ color: "#E94B3C", padding: "4px" }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666666", mt: 1 }}
                    >
                      {new Date(journal.date).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#333333", mt: 1 }}
                    >
                      {getPreviewText(journal.content)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </>
  );
}
