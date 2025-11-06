import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBorrowRecords } from "../../../redux/slices/borrowSlice";
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
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const FinePaymentHistory = () => {
  const dispatch = useDispatch();
  const { records, loading, error } = useSelector((state) => state.borrows);

  useEffect(() => {
    dispatch(fetchBorrowRecords());
  }, [dispatch]);

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Loading fine records...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  // ✅ Show only records with fine_amount > 0
  const finedRecords = records?.filter((rec) => rec.fine_amount > 0) || [];

  return (
    <Box
      sx={{
        maxWidth: "90%",
        mx: "auto",
        mt: 8,
        mb: 6,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <CurrencyRupeeIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="green">
            Fine Payment History
          </Typography>
        </Box>

        {/* Empty state */}
        {finedRecords.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ py: 4 }}
          >
            No fines found.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "green" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Username
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Book Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Borrow Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Return Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Fine Amount
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {finedRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell>
                      {record.user_info?.username || `User ID: ${record.user}`}
                    </TableCell>
                    <TableCell>
                      {record.book?.title || "Unknown Book"}
                    </TableCell>
                    <TableCell>
                      {new Date(record.borrow_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {record.return_date
                        ? new Date(record.return_date).toLocaleDateString()
                        : "Not returned"}
                    </TableCell>
                    <TableCell sx={{ color: "red", fontWeight: "bold" }}>
                      ₹{record.fine_amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default FinePaymentHistory;
