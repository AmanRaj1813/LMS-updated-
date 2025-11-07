import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import libraryBg from "../../../assets/LandingPage.jpg"; // your background image

const LandingPage = () => {
  const navigate = useNavigate();
  const text = "Welcome to Library Management System";

  // Framer Motion variants for the letter animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Floating books drift animation (up-down + side-to-side)
  const floatAnimation = {
    animate: {
      y: [0, -15, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        py: 6,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${libraryBg}) center/cover no-repeat`,
      }}
    >
      {/* Floating Book Icons */}
      <motion.div
        variants={floatAnimation}
        animate="animate"
        style={{ position: "absolute", top: "8%", left: "12%" }}
      >
        <MenuBookIcon
          sx={{
            fontSize: { xs: 35, sm: 55 },
            color: "success.main",
            opacity: 0.7,
          }}
        />
      </motion.div>

      <motion.div
        variants={floatAnimation}
        animate="animate"
        style={{ position: "absolute", top: "18%", right: "10%" }}
      >
        <MenuBookIcon
          sx={{
            fontSize: { xs: 45, sm: 65 },
            color: "success.dark",
            opacity: 0.6,
          }}
        />
      </motion.div>

      <motion.div
        variants={floatAnimation}
        animate="animate"
        style={{ position: "absolute", bottom: "12%", left: "20%" }}
      >
        <MenuBookIcon
          sx={{
            fontSize: { xs: 40, sm: 60 },
            color: "success.light",
            opacity: 0.5,
          }}
        />
      </motion.div>

      {/* Animated Title */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        transition={{ repeat: Infinity, repeatType: "loop", delay: 0 }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          color="success.main"
          mb={5}
          component={motion.div}
          sx={{
            display: "inline-block",
            fontSize: {
              xs: "1.8rem", // Mobile
              sm: "2.5rem", // Tablet
              md: "3rem", // Desktop
              lg: "3.5rem",
            },
            lineHeight: 1.3,
            px: 2,
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            wordWrap: "break-word",
            whiteSpace: "normal",
            maxWidth: "95vw",
          }}
        >
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letter}
              animate={{
                y: [20, 0, 20],
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 5,
                delay: index * 0.15,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </Typography>
      </motion.div>

      {/* Buttons */}
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="center"
      >
        <Button
          variant="contained"
          color="success"
          sx={{
            px: { xs: 4, sm: 6 },
            py: { xs: 1.2, sm: 1.5 },
            fontWeight: 600,
            borderRadius: 3,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            boxShadow: 3,
            "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          color="success"
          sx={{
            px: { xs: 4, sm: 6 },
            py: { xs: 1.2, sm: 1.5 },
            fontWeight: 600,
            borderRadius: 3,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            borderWidth: 2,
            "&:hover": {
              backgroundColor: "success.main",
              color: "white",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </Stack>
    </Box>
  );
};

export default LandingPage;
