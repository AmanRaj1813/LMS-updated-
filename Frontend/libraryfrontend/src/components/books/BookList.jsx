import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../redux/slices/bookSlice";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const BookList = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ background: "linear-gradient(135deg, #e8f5e9, #ffffff)" }}
      >
        <CircularProgress color="success" />
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ background: "linear-gradient(135deg, #e8f5e9, #ffffff)" }}
      >
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );

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
          p: 0,
          borderRadius: 4,
          width: "100%",
          maxWidth: 1100,
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ✅ Sticky Header Section */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
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
            gutterBottom
          >
            <MenuBookIcon fontSize="large" />
            Available Books
          </Typography>

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

        {/* ✅ Scrollable Book Grid with hidden scrollbar */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 4,
            scrollBehavior: "smooth",
            // Hide scrollbar (cross-browser)
            "&::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none", // IE/Edge
            "scrollbar-width": "none", // Firefox
          }}
        >
          {books.length === 0 ? (
            <Typography
              textAlign="center"
              color="textSecondary"
              sx={{ fontStyle: "italic" }}
            >
              No books available at the moment.
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "0.3s",
                      borderRadius: 3,
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={() => navigate(`./${book.id}`)}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Author: {book.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Category: {book.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BookList;
