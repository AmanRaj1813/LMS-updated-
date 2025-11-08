import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBorrowRecord } from "../../redux/slices/borrowSlice";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const BorrowForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.borrows);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    book_id: "",
    due_date: "",
  });

  const [books, setBooks] = useState([]);

  // ✅ Fetch available books only
  useEffect(() => {
    const fetchAvailableBooks = async () => {
      try {
        const response = await apiClient.get("/books/");
        const availableBooks = response.filter(
          (book) => book.status === "available"
        );
        setBooks(availableBooks);
      } catch (err) {
        toast.error("Failed to fetch books");
      }
    };
    fetchAvailableBooks();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.book_id || !formData.due_date) {
      toast.error("Please select a book and due date");
      return;
    }

    try {
      await dispatch(createBorrowRecord(formData)).unwrap();
      toast.success("Book borrowed successfully!");
      setFormData({ book_id: "", due_date: "" });
        const response = await apiClient.get("/books/");
        const availableBooks = response.filter((book) => book.status === "available");
        setBooks(availableBooks);
    } catch (err) {
      toast.error(err || "Failed to borrow book");
    }
  };

  //  Restrict access to logged-in users
  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9fafc",
        }}
      >
        <Card sx={{ maxWidth: 400, p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Access Denied
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Please log in to borrow books.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 128px)", // keep header/footer visible
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f2f1 0%, #a5d6a7 100%)",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <LibraryBooksIcon sx={{ color: "green", fontSize: 32, mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Borrow a Book
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Book Selection */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Book</InputLabel>
              <Select
                name="book_id"
                value={formData.book_id}
                label="Select Book"
                onChange={handleChange}
              >
                {books.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.title} — {b.author}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Due Date */}
            <TextField
              fullWidth
              margin="normal"
              label="Due Date"
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{
                mt: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Borrow Book"
              )}
            </Button>

            {error && (
              <Typography
                color="error"
                textAlign="center"
                variant="body2"
                mt={2}
              >
                {error}
              </Typography>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BorrowForm;
