import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import libraryBg from "../../../assets/LandingPage.jpg" // your background image

const LandingPage = () => {
  const navigate = useNavigate();
  const text = "Welcome to Library System";

  // Framer Motion variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
        background: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${libraryBg}) center/cover no-repeat`,
      }}
    >
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
          mb={4}
          component={motion.div}
          sx={{ display: "inline-block" }}
        >
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letter}
              animate={{
                y: [20, 0, 20], // moves up and down
                opacity: [0, 1, 0], // fades in and out
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 5,
                delay: index * 0.5,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </Typography>
      </motion.div>

      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
        <Button
          variant="contained"
          color="success"
          sx={{ px: 4, py: 1.5, fontWeight: 600 }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          color="success"
          sx={{ px: 4, py: 1.5, fontWeight: 600 }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </Stack>
    </Box>
  );
};

export default LandingPage;
