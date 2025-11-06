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
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import PaidIcon from "@mui/icons-material/Paid";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import AutorenewIcon from "@mui/icons-material/Autorenew"; // For borrowed books
import MenuBookIcon from "@mui/icons-material/MenuBook";     // For available books
import WarningIcon from "@mui/icons-material/Warning";       // For overdue books

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading || !user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
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

  // Sidebar content component
  const SidebarContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
      }}
    >
      {/* Mobile close button */}
      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

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
            width: { xs: 80, md: 100 },
            height: { xs: 80, md: 100 },
            fontSize: { xs: "2rem", md: "2.5rem" },
            mb: 2,
            mt: { xs: 0, md: 8 },
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="text.primary"
          sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
        >
          {user.username}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
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
            fontSize: { xs: "0.875rem", md: "1rem" },
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
              {user.id}
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
  );

  const drawerWidth = 280;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            bgcolor: "success.main",
            color: "white",
            "&:hover": {
              bgcolor: "success.dark",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar - Desktop (Fixed) */}
      {!isMobile && (
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              width: drawerWidth,
              minHeight: "100vh",
              bgcolor: "#fff",
              boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <SidebarContent />
          </Box>
        </Box>
      )}

      {/* Sidebar - Mobile (Drawer) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: 0 },
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", mt: { xs: 6, md: 2 } }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            color="success.main"
            gutterBottom
            sx={{
              mb: 4,
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Dashboard Overview
          </Typography>

          {/* Statistics Cards */}
          <Grid container spacing={{ xs: 2, sm: 4 }} mb={6}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                  borderLeft: "8px solid #2196f3",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                 <Box
        sx={{
          mb:2,
          display: "flex",
          justifyContent: "center",
          animation: "spin 2s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      >
        <AutorenewIcon color="primary" sx={{ fontSize: 50 }} />
      </Box>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color="primary"
                  sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
                >
                  {totalBooksBorrowed}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="h6"
                  sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
                >
                  Books Borrowed
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        borderLeft: "8px solid #4caf50",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Floating Icon */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "center",
          animation: "float 2s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-15px)" },
          },
        }}
      >
        <MenuBookIcon color="success" sx={{ fontSize: 50 }} />
      </Box>

      <Typography
        variant="h3"
        fontWeight="bold"
        color="success.main"
        sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
      >
        {availableBooks}
      </Typography>
      <Typography
        color="text.secondary"
        variant="h6"
        sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
      >
        Books List
      </Typography>
    </Card>
  </Grid>
            <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        borderLeft: "8px solid #ffb300",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Pulsing Icon */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "center",
          animation: "pulse 1.5s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.3)" },
          },
        }}
      >
        <WarningIcon color="warning" sx={{ fontSize: 50 }} />
      </Box>

      <Typography
        variant="h3"
        fontWeight="bold"
        color="warning.main"
        sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
      >
        {overdueBooks}
      </Typography>
      <Typography
        color="text.secondary"
        variant="h6"
        sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
      >
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
            sx={{ mb: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<LibraryBooksIcon />}
                onClick={() => navigate("/books")}
                sx={{
                  py: { xs: 1.2, sm: 1.5 },
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
                  py: { xs: 1.2, sm: 1.5 },
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
                  py: { xs: 1.2, sm: 1.5 },
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {user?.role === "admin" || user?.role === "librarian"
                  ? "All Borrowed Books"
                  : "My Books"}
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
                  py: { xs: 1.2, sm: 1.5 },
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
                sx={{
                  mb: 2,
                  mt: 3,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                Management Tools
              </Typography>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/books/new")}
                    sx={{
                      py: { xs: 1.2, sm: 1.5 },
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Add Book
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate("/users")}
                    sx={{
                      py: { xs: 1.2, sm: 1.5 },
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    View Members
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<PaidIcon />}
                    onClick={() => navigate("/fines")}
                    sx={{
                      py: { xs: 1.2, sm: 1.5 },
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
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