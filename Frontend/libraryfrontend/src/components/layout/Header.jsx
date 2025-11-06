import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(135deg, #a8e063, #ffffff)",
        color: "black",
        boxShadow: 3,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MenuBookIcon sx={{ color: "green", fontSize: 32 }} />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "green",
              textDecoration: "none",
            }}
            component={Link}
            to="/"
          >
            Library System
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/dashboard"
            startIcon={<HomeIcon />}
            sx={{
              color: "green",
              fontWeight: 600,
              "&:hover": {
                color: "#2e7d32",
                backgroundColor: "rgba(0, 128, 0, 0.05)",
              },
            }}
          >
            Home
          </Button>

          <Button
            component={Link}
            to="/about"
            startIcon={<InfoIcon />}
            sx={{
              color: "green",
              fontWeight: 600,
              "&:hover": {
                color: "#2e7d32",
                backgroundColor: "rgba(0, 128, 0, 0.05)",
              },
            }}
          >
            About
          </Button>

          <Button
            component={Link}
            to="/contact"
            startIcon={<ContactMailIcon />}
            sx={{
              color: "green",
              fontWeight: 600,
              "&:hover": {
                color: "#2e7d32",
                backgroundColor: "rgba(0, 128, 0, 0.05)",
              },
            }}
          >
            Contact
          </Button>

          <Button
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            variant="outlined"
            sx={{
              color: "green",
              borderColor: "green",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
