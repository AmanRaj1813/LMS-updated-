import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4 },
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.95)),
          url("https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?auto=format&fit=crop&w=1600&q=80")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <ContactMailIcon sx={{ fontSize: 70, color: "success.main" }} />
          <Typography
            variant="h3"
            fontWeight="bold"
            color="success.main"
            mt={1}
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mt: 2,
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
            }}
          >
            Have questions, feedback, or need assistance? We’d love to hear from
            you — reach out anytime!
          </Typography>
        </Box>

        {/* Contact Info Section - 3 Equal Cards */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          mb={8}
        >
          {[
            {
              icon: (
                <LocationOnIcon sx={{ fontSize: 50, color: "success.main" }} />
              ),
              title: "Our Location",
              details: "Fractal,We Work, Pune",
            },
            {
              icon: <PhoneIcon sx={{ fontSize: 50, color: "success.main" }} />,
              title: "Call Us",
              details: "+91 9991238796\nMon - Fri, 9AM - 5PM",
            },
            {
              icon: <EmailIcon sx={{ fontSize: 50, color: "success.main" }} />,
              title: "Email Us",
              details: "support@librarysystem.com\ninfo@librarysystem.com",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 4,
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(245,255,250,0.9))",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {item.icon}
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1.5}
                  sx={{
                    whiteSpace: "pre-line",
                    lineHeight: 1.6,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  {item.details}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form Section */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            p: { xs: 3, sm: 5 },
            maxWidth: 800,
            mx: "auto",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,255,250,0.95))",
            backdropFilter: "blur(10px)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
            },
          }}
        >
          {!submitted ? (
            <>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
                textAlign="center"
                mb={4}
                sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" } }}
              >
                Send Us a Message
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={5}
                    required
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    startIcon={<SendIcon />}
                    sx={{
                      py: 1.3,
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 3,
                      fontSize: "1rem",
                      background: "linear-gradient(135deg, #43a047, #66bb6a)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #388e3c, #4caf50)",
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Stack>
              </form>
            </>
          ) : (
            <Box textAlign="center" py={6}>
              <Typography
                variant="h5"
                color="success.main"
                fontWeight="bold"
                mb={1}
              >
                Thank you for reaching out!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 500, mx: "auto", lineHeight: 1.6 }}
              >
                We’ve received your message and will get back to you shortly.
              </Typography>
              <Button
                variant="outlined"
                color="success"
                sx={{
                  mt: 4,
                  px: 4,
                  py: 1,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </Button>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default Contact;
