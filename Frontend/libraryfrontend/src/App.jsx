import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import { Box, CssBaseline, Container } from "@mui/material";
import About from "./components/layout/pages/About";
import Contact from "./components/layout/pages/Contact";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Layout Components
import Dashboard from "./components/layout/Dashboard";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Private Route
import PrivateRoute from "./components/PrivateRoute";

// Book Components
import BookList from "./components/books/BookList";
import BookForm from "./components/books/BookForm";

// Borrow Components
import BorrowForm from "./components/borrowings/BorrowForm";
import BorrowList from "./components/borrowings/BorrowList";

// Category Components
import CategoryList from "./components/categories/CategoryList";
import CategoryForm from "./components/categories/CategoryForm";

// Other Components
import BookSearch from "./components/books/BookSearch";
import UserList from "./components/users/UserList";
import BookDetail from "./components/books/BookDetail";
import FinePaymentHistory from "./components/layout/pages/FinePaymentHistory";
import ErrorPage from "./components/layout/pages/ErrorPage";
import LandingPage from "./components/layout/pages/LandingPage";

function AppContent() {
  const location = useLocation();

  // ✅ Hide Header/Footer on login or register page
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #e8f5e9, #ffffff)",
      }}
    >
      {/* ✅ Only show Header if not on login/register */}
      {!hideLayout && <Header />}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 2,
          pt: hideLayout ? 0 : { xs: 8, md: 9 }, // remove top padding on login/register
          pb: hideLayout ? 0 : { xs: 7, md: 8 },
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Public Routes (with Container) */}
          <Route
            path="/login"
            element={
              <Container maxWidth="md">
                <Login />
              </Container>
            }
          />
          <Route
            path="/register"
            element={
              <Container maxWidth="md">
                <Register />
              </Container>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <Dashboard />
                </Container>
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <About />
                </Container>
              </PrivateRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <Contact />
                </Container>
              </PrivateRoute>
            }
          />

          {/* ✅ BookList — Full width (no Container restriction) */}
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <BookList />
              </PrivateRoute>
            }
          />

          <Route
            path="/books/search"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <BookSearch />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/books/:id"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <BookDetail />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/books/new"
            element={
              <PrivateRoute librarianAllowed>
                <Container maxWidth="md">
                  <BookForm />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/borrows"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <BorrowForm />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/my-borrows"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <BorrowList />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <Container maxWidth="lg">
                  <CategoryList />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/categories/new"
            element={
              <PrivateRoute librarianAllowed>
                <Container maxWidth="md">
                  <CategoryForm />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/fines"
            element={
              <PrivateRoute librarianAllowed>
                <Container maxWidth="lg">
                  <FinePaymentHistory />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute adminOnly>
                <Container maxWidth="lg">
                  <UserList />
                </Container>
              </PrivateRoute>
            }
          />

          <Route
            path="/error"
            element={
              <Container maxWidth="md">
                <ErrorPage />
              </Container>
            }
          />

          {/* Default Routes */}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>

      {/* ✅ Only show Footer if not on login/register */}
      {!hideLayout && (
        <Box
          sx={{
            position: { xs: "relative", md: "fixed", lg: "fixed" },
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
          }}
        >
          <Footer />
        </Box>
      )}
    </Box>
  );
}

export default function App() {
  return (
    
      <Router>
        <CssBaseline />
        <AppContent />
        <ToastContainer />
      </Router>

  );
}
