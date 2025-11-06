import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/slices/userSlice";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id));
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Loading users...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: "90%", mx: "auto", mt: 8, mb: 6 }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <ManageAccountsIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="green">
            User Management
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 500, // set scrollable height
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "green" }}>
                <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                  Role
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {user.role}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 500,
                          backgroundColor: "green",
                          "&:hover": {
                            backgroundColor: "red",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserList;
