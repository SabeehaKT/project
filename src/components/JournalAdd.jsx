// JournalAdd.js
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEditor, EditorContent } from "@tiptap/react"; // TipTap imports
import StarterKit from "@tiptap/starter-kit"; // Starter kit with basic features
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";

export default function JournalAdd() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Customize which features to include
        bulletList: true,
        orderedList: true,
        bold: true,
        italic: true,
        underline: true,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      FontFamily,
    ],
    content: "", // Initial content
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); // Update content state with HTML
    },
  });

  // Toolbar button handlers
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const setColor = (color) => editor?.chain().focus().setColor(color).run();
const setFontFamily = (font) => editor?.chain().focus().setFontFamily(font).run();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token')|| sessionStorage.getItem('token');
      const response = await fetch(
        "http://localhost:3000/api/auth/addjournal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ title, content, date: new Date() }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setSnackbar({
          open: true,
          message: "Journal entry added successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/journallist"), 2000);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to add journal",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error adding journal",
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
            onClick={() => navigate("/welcome")}
            sx={{ marginRight: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#FFFFFF" }}
          >
            New Journal Entry
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
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        />
        {/* Custom Toolbar */}
        <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
          <IconButton
            onClick={toggleBold}
            sx={{ color: editor?.isActive("bold") ? "#009688" : "#666" }}
          >
            <FormatBoldIcon />
          </IconButton>
          <IconButton
            onClick={toggleItalic}
            sx={{ color: editor?.isActive("italic") ? "#009688" : "#666" }}
          >
            <FormatItalicIcon />
          </IconButton>
          <IconButton
            onClick={toggleUnderline}
            sx={{ color: editor?.isActive("underline") ? "#009688" : "#666" }}
          >
            <FormatUnderlinedIcon />
          </IconButton>
        </Box>
        {/* Editor Content */}
        <EditorContent
          editor={editor}
          style={{
            height: "400px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            fontFamily: "'Caveat', cursive",
            fontSize: "1.2rem",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflowY: "auto",
          }}
          placeholder="Write your thoughts..."
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            mt: 3,
            backgroundColor: "#009688",
            "&:hover": { backgroundColor: "#00796B" },
          }}
        >
          Save Entry
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
