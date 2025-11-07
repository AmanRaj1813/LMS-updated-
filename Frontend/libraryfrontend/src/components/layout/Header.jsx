import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navItems = [
    { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { text: "About", icon: <InfoIcon />, path: "/about" },
    { text: "Contact", icon: <ContactMailIcon />, path: "/contact" },
    { text: "Back", icon: <LoginIcon />, path: "/dashboard" },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        width: 250,
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        <MenuBookIcon sx={{ color: "green", fontSize: 32, mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="green">
          Library System
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon sx={{ color: "green" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
          color: "black",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderBottom: "2px solid #a5d6a7",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            px: { xs: 2, sm: 4, md: 6 },
            position: "relative",
          }}
        >
          {/* ✅ Logo & Title - Centered on mobile, left-aligned on desktop */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              position: { xs: "absolute", sm: "static" },
              left: { xs: "50%", sm: "auto" },
              transform: { xs: "translateX(-50%)", sm: "none" },
              textDecoration: "none",
            }}
            component={Link}
            to="/dashboard"
          >
            <MenuBookIcon sx={{ color: "green", fontSize: 30 }} />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: "green",
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
                "&:hover": { color: "#2e7d32" },
              }}
            >
              Library System
            </Typography>
          </Box>

          {/* ✅ Desktop Navigation */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {navItems.slice(0, 3).map((item) => (
              <Button
                key={item.text}
                color="inherit"
                startIcon={item.icon}
                component={Link}
                to={item.path}
                sx={{
                  color: "black",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": { color: "green", bgcolor: "rgba(76,175,80,0.1)" },
                }}
              >
                {item.text}
              </Button>
            ))}
            <Button
              variant="contained"
              color="success"
              startIcon={<LoginIcon />}
              component={Link}
              to="/dashboard"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 3,
                px: 2.5,
                "&:hover": { backgroundColor: "#2e7d32" },
              }}
            >
              Back
            </Button>
          </Box>

          {/* ✅ Mobile Menu Button (always visible on right) */}
          <IconButton
            color="success"
            sx={{
              display: { xs: "flex", sm: "none" },
              position: "absolute",
              right: 10,
            }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ✅ Mobile Drawer Navigation */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
