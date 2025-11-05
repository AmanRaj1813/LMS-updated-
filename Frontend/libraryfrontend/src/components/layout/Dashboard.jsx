import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, fetchCurrentUser } from "../../redux/slices/authSlice";
import { fetchBooks } from "../../redux/slices/bookSlice";
import { fetchBorrowRecords } from "../../redux/slices/borrowSlice";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import PaidIcon from "@mui/icons-material/Paid";
import dayjs from "dayjs";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.books);
  const { records } = useSelector((state) => state.borrows);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    else if (!user) dispatch(fetchCurrentUser());
  }, [isAuthenticated, user, dispatch, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchBooks());
      dispatch(fetchBorrowRecords());
    }
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  if (loading || !user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #a8e063, #ffffff)",
        }}
      >
        <CircularProgress color="success" size={60} />
      </Box>
    );
  }

  // Calculate statistics based on user role
  const isAdminOrLibrarian =
    user?.role === "admin" || user?.role === "librarian";

  const totalBooksBorrowed = isAdminOrLibrarian
    ? records?.filter((record) => !record.return_date).length || 0
    : records?.filter(
        (record) => !record.return_date && record.user === user.id
      ).length || 0;

  const availableBooks = books?.length || 0;

  const overdueBooks = isAdminOrLibrarian
    ? records?.filter((record) => {
        if (record.return_date) return false;
        return dayjs(record.due_date).isBefore(dayjs());
      }).length || 0
    : records?.filter((record) => {
        if (record.return_date) return false;
        if (record.user !== user.id) return false;
        return dayjs(record.due_date).isBefore(dayjs());
      }).length || 0;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
      }}
    >
      {/* Left Sidebar - Profile Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "280px" },
          minHeight: "100vh",
          bgcolor: "#fff",
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "fixed",
          top: "64px",
          left:0,
          height: { md: "100vh" },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            flex: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "success.main",
              width: 100,
              height: 100,
              fontSize: "2.5rem",
              mb: 2,
              mt: 2,
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {user.email}
          </Typography>
          <Typography
            variant="subtitle1"
            color="success.main"
            sx={{
              mt: 1,
              fontWeight: 700,
              textTransform: "capitalize",
              bgcolor: "#e8f5e9",
              px: 2,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            {user.role}
          </Typography>

          <Divider sx={{ my: 3, width: "100%" }} />

          <Stack spacing={2} sx={{ width: "100%", mb: 3 }}>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="caption" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body2" fontWeight="600">
                #{user.id}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight="600">
                ✓ Active
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
            sx={{
              mt: 4,
              fontWeight: "bold",
              textTransform: "none",
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 5 },
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="success.main"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Dashboard Overview
          </Typography>

          {/* Statistics Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderLeft: "6px solid #2196f3",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {totalBooksBorrowed}
                </Typography>
                <Typography color="text.secondary" variant="body1">
                  Books Borrowed
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderLeft: "6px solid #4caf50",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {availableBooks}
                </Typography>
                <Typography color="text.secondary" variant="body1">
                  Available Books
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderLeft: "6px solid #ffb300",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {overdueBooks}
                </Typography>
                <Typography color="text.secondary" variant="body1">
                  Overdue Books
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Typography
            variant="h6"
            fontWeight="600"
            color="text.primary"
            sx={{ mb: 2 }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<LibraryBooksIcon />}
                onClick={() => navigate("/books")}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                View Books
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<LibraryBooksIcon />}
                onClick={() => navigate("/borrows")}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Borrow Books
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<LibraryBooksIcon />}
                onClick={() => navigate("/my-borrows")}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                My Books
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<CategoryIcon />}
                onClick={() => navigate("/categories")}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Categories
              </Button>
            </Grid>
          </Grid>

          {/* Admin Controls */}
          {["admin", "librarian"].includes(user.role) && (
            <>
              <Typography
                variant="h6"
                fontWeight="600"
                color="text.primary"
                sx={{ mb: 2, mt: 3 }}
              >
                Management Tools
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/books/new")}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    Add Book
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate("/users")}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    View Members
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<PaidIcon />}
                    onClick={() => navigate("/fines")}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    Manage Fines
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;