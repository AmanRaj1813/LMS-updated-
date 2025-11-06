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

function AppContent() {
  const location = useLocation();

  // ✅ Hide Header/Footer on login or register page
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

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
        <Container maxWidth="md">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
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
                  <BookSearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/books/:id"
              element={
                <PrivateRoute>
                  <BookDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/books/new"
              element={
                <PrivateRoute librarianAllowed>
                  <BookForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/borrows"
              element={
                <PrivateRoute>
                  <BorrowForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-borrows"
              element={
                <PrivateRoute>
                  <BorrowList />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <CategoryList />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories/new"
              element={
                <PrivateRoute librarianAllowed>
                  <CategoryForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/fines"
              element={
                <PrivateRoute librarianAllowed>
                  <FinePaymentHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute adminOnly>
                  <UserList />
                </PrivateRoute>
              }
            />
            <Route path="/error" element={<ErrorPage />} />
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Container>
      </Box>

      {/* ✅ Only show Footer if not on login/register */}
      {!hideLayout && (
        <Box
          sx={{
            position: "fixed",
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
    <Provider store={store}>
      <Router>
        <CssBaseline />
        <AppContent />
        <ToastContainer />
      </Router>
    </Provider>
  );
}
