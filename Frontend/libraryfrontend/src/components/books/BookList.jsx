import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, deleteBook } from "../../redux/slices/bookSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  CardActions,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DeleteIcon from "@mui/icons-material/Delete";

const BookList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { books, loading, error } = useSelector((state) => state.books);
  const navigate = useNavigate();

  const isAdminOrLibrarian =
    user?.role === "admin" || user?.role === "librarian";

  // ✅ Pagination states
  const [page, setPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await dispatch(deleteBook(id)).unwrap();
        await dispatch(fetchBooks());
        alert("Book deleted successfully!");
        if (location.pathname.includes(`/books/${id}`)) {
          navigate("/books");
        }
      } catch (error) {
        console.error("Failed to delete book:", error);
        alert("Failed to delete book.");
      }
    }
  };

  // ✅ Pagination logic
  const startIndex = (page - 1) * booksPerPage;
  const displayedBooks = books.slice(startIndex, startIndex + booksPerPage);
  const totalPages = Math.ceil(books.length / booksPerPage);

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
          maxWidth: "1400px",
          borderRadius: 4,
          p: 4,
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          height: "80vh",
        }}
      >
        {/* ✅ Header */}
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
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={1}
          >
            <MenuBookIcon fontSize="large" /> Available Books
          </Typography>

          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<SearchIcon />}
              onClick={() => navigate("/books/search")}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #43a047, #66bb6a)",
                "&:hover": {
                  background: "linear-gradient(135deg, #388e3c, #4caf50)",
                },
                fontWeight: "bold",
              }}
            >
              Search Books
            </Button>
          </Box>
        </Box>

        {/* ✅ Scrollable Section */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
              }}
            >
              <CircularProgress color="success" />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : books.length === 0 ? (
            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No books available at the moment.
            </Typography>
          ) : (
            <>
              {/* ✅ Books Grid */}
              <Grid container spacing={3}>
                {displayedBooks.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        cursor: "pointer",
                        height: 250,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => navigate(`./${book.id}`)}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
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
                      {isAdminOrLibrarian && (
                        <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(book.id)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* ✅ Pagination Control */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="success"
                  shape="rounded"
                  size="medium"
                />
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BookList;
