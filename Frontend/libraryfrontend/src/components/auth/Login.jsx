import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  login,
  fetchCurrentUser,
  clearError,
} from "../../redux/slices/authSlice";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      await dispatch(login(credentials)).unwrap();
      await dispatch(fetchCurrentUser()).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // ✅ Disable login button until username and password are filled
  const isFormValid =
    credentials.username.trim() !== "" && credentials.password.trim() !== "";

  return (
    <Box
      sx={{
        height: "calc(100vh - 112px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          borderRadius: 4,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          bgcolor: "white",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
        >
          Library System
        </Typography>
        <Typography
          variant="h5"
          color="success.main"
          fontWeight="bold"
          gutterBottom
        >
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon color="success" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
            onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="success" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              background: "linear-gradient(135deg, #43a047, #66bb6a)",
              color: "white",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              "&:hover": {
                background: "linear-gradient(135deg, #388e3c, #4caf50)",
              },
            }}
            disabled={loading || !isFormValid} // ✅ disabled condition
            startIcon={!loading && <LoginIcon />}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#2e7d32",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Register here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
