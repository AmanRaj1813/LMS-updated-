import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, searchBooks } from "../../redux/slices/bookSlice";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const BookSearch = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");

  // ✅ Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        dispatch(searchBooks(searchTerm));
      } else {
        dispatch(fetchBooks());
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchField, dispatch]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 112px)",
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 1100,
          borderRadius: 4,
          p: 4,
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          height: "80vh",
        }}
      >
        {/* Static Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="green"
            textAlign="center"
          >
            Library System
          </Typography>
          <Typography
            variant="h5"
            color="success.main"
            fontWeight="bold"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={1}
          >
            <SearchIcon fontSize="large" />
            Book Search
          </Typography>
        </Box>

        {/* Search Controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Search Field"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="isbn">ISBN</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label={`Search by ${searchField}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Scrollable Results */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress color="success" />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!loading && books && books.length > 0 ? (
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 2,
                      "&:hover": { boxShadow: 5 },
                      height: "100%",
                      transition: "0.2s",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                      >
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Author:</strong> {book.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Category:</strong> {book.category || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>ISBN:</strong> {book.ISBN || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            !loading && (
              <Typography
                textAlign="center"
                color="text.secondary"
                mt={3}
                fontSize="1rem"
              >
                No books found.
              </Typography>
            )
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BookSearch;
