import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import PaidIcon from "@mui/icons-material/Paid";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
        py: 10,
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box textAlign="center" mb={6}>
          <InfoIcon sx={{ fontSize: 60, color: "success.main" }} />
          <Typography
            variant="h3"
            fontWeight="bold"
            color="success.main"
            mt={1}
          >
            About Our Library Management System
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 2, maxWidth: "800px", mx: "auto" }}
          >
            Empowering libraries with smart technology — making book management,
            borrowing, and tracking seamless, efficient, and user-friendly.
          </Typography>
        </Box>

        {/* Overview Section */}
        <Card
          sx={{
            mb: 6,
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            p: 3,
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              What is the Library Management System?
            </Typography>
            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
              The Library Management System (LMS) is a modern digital platform
              that automates and streamlines every aspect of library operations.
              It allows librarians and administrators to efficiently manage
              books, categories, users, borrowing records, and fines — all in
              one place. Students and members can easily search, borrow, and
              track books from their personal dashboards.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="600" color="success.main">
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
              To simplify the way libraries operate by reducing paperwork,
              improving accuracy, and enhancing accessibility — ensuring that
              knowledge is just a click away for everyone.
            </Typography>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="success.main"
          textAlign="center"
          mb={4}
        >
          Key Features
        </Typography>
        <Grid
          container
          spacing={4}
          mb={6}
          justifyContent="center"
          alignItems="stretch"
        >
          {[
            {
              icon: (
                <LibraryBooksIcon
                  sx={{ fontSize: 50, color: "primary.main" }}
                />
              ),
              title: "Book Management",
              description:
                "Add, update, and organize all books with ease. Categorize them by genre, author, or availability status.",
            },
            {
              icon: (
                <PeopleIcon sx={{ fontSize: 50, color: "secondary.main" }} />
              ),
              title: "User Management",
              description:
                "Manage members, librarians, and administrators with proper role assignments and permissions.",
            },
            {
              icon: (
                <CategoryIcon sx={{ fontSize: 50, color: "success.main" }} />
              ),
              title: "Category Management",
              description:
                "Organize books into multiple categories to make searching and browsing effortless.",
            },
            {
              icon: <PaidIcon sx={{ fontSize: 50, color: "warning.main" }} />,
              title: "Fine Management",
              description:
                "Automatically calculate and manage fines for overdue books to ensure timely returns.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  p: 3,
                  height: "100%", // ensures equal height
                  minHeight: 320, // consistent visual height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box>{feature.icon}</Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {feature.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box textAlign="center" mt={6}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="success.main"
            mb={2}
          >
            Ready to Explore the System?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Experience how easy and efficient managing a library can be.
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => navigate("/dashboard")}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
