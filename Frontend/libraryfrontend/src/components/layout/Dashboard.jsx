import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
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
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WarningIcon from "@mui/icons-material/Warning";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const isAdminOrLibrarian =
    user?.role === "admin" || user?.role === "librarian";

  const totalBooksBorrowed = isAdminOrLibrarian
    ? records?.filter((record) => !record.return_date).length || 0
    : records?.filter(
        (record) => !record.return_date && record.user === user.id
      ).length || 0;

  const availableBooks = books?.length || 0;

  const overdueBooks = isAdminOrLibrarian
    ? records?.filter(
        (record) =>
          !record.return_date && dayjs(record.due_date).isBefore(dayjs())
      ).length || 0
    : records?.filter(
        (record) =>
          !record.return_date &&
          record.user === user.id &&
          dayjs(record.due_date).isBefore(dayjs())
      ).length || 0;

  const drawerWidth = 280;

  const SidebarContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
      }}
    >
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

  // Quick Actions & Management Tools Config
  const quickActions = [
    {
      label: "View Books",
      icon: <LibraryBooksIcon />,
      color: "success",
      path: "/books",
    },
    {
      label: "Borrow Books",
      icon: <MenuBookIcon />,
      color: "primary",
      path: "/borrows",
    },
    {
      label: isAdminOrLibrarian ? "All Borrowed Books" : "My Books",
      icon: <LibraryBooksIcon />,
      color: "secondary",
      path: "/my-borrows",
    },
    {
      label: "Categories",
      icon: <CategoryIcon />,
      color: "warning",
      path: "/categories",
    },
  ];

  const managementTools = [
    {
      label: "Add Book",
      icon: <AddIcon />,
      color: "secondary",
      path: "/books/new",
    },
    {
      label: "View Members",
      icon: <PeopleIcon />,
      color: "info",
      path: "/users",
    },
    {
      label: "Manage Fines",
      icon: <PaidIcon />,
      color: "error",
      path: "/fines",
    },
  ];

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
            zIndex: 1500,
            bgcolor: "success.main",
            color: "white",
            "&:hover": { bgcolor: "success.dark" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      {!isMobile && (
        <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
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

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: 0 },
          overflowY: "auto",
          pt: { xs: 8, sm: 4, md: 2 },
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
          <Grid container spacing={{ xs: 2, sm: 4 }} mb={6}
            sx={{ml:{xs:2,sm:4,md:6,lg:8}}}>
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
                    mb: 2,
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
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    animation: "float 2s ease-in-out infinite",
                    "@keyframes float": {
                      "0%,100%": { transform: "translateY(0px)" },
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
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    animation: "pulse 1.5s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%,100%": { transform: "scale(1)" },
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="success.main"
              gutterBottom
              sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}
            >
              Quick Actions
            </Typography>
            <Grid
              container
              spacing={{ xs: 2, sm: 3 }}
              mb={6}
              justifyContent="center"
            >
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.07 }}
                  >
                    <Card
                      onClick={() => navigate(action.path)}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        textAlign: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut",
                        }}
                      >
                        {React.cloneElement(action.icon, {
                          sx: { fontSize: 40, color: `${action.color}.main` },
                        })}
                      </motion.div>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        sx={{ mt: 1, color: `${action.color}.main` }}
                      >
                        {action.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Management Tools */}
          {isAdminOrLibrarian && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                color="success.main"
                gutterBottom
                sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}
              >
                Management Tools
              </Typography>
              <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                justifyContent="center"
              >
                {managementTools.map((tool, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ scale: 1.06, rotateY: 6 }}
                    >
                      <Card
                        onClick={() => navigate(tool.path)}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          textAlign: "center",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                        }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                          }}
                        >
                          {React.cloneElement(tool.icon, {
                            sx: { fontSize: 40, color: `${tool.color}.main` },
                          })}
                        </motion.div>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          sx={{ mt: 1, color: `${tool.color}.main` }}
                        >
                          {tool.label}
                        </Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
