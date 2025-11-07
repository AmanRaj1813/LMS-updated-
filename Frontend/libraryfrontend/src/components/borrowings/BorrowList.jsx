import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBorrowRecords,
  returnBorrowedBook,
  clearBorrowError,
  clearBorrowSuccess,
  sendBorrowerEmail,
} from "../../redux/slices/borrowSlice";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CircularProgress,
  Modal,
  TextField,
  Fade,
  Backdrop,
  IconButton,
  Paper,
  Alert,
  Snackbar,
  Pagination,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";

const BorrowList = () => {
  const dispatch = useDispatch();
  const { records, loading, error, successMessage } = useSelector(
    (state) => state.borrows
  );
  const { user } = useSelector((state) => state.auth);

  const [returningIds, setReturningIds] = useState([]);
  const [emailModal, setEmailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(1);
  const recordsPerPage = 8; // customize per page
  const totalPages = Math.ceil(records?.length / recordsPerPage) || 1;

  const paginatedRecords = records?.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  const isAdminOrLibrarian =
    user?.role === "admin" || user?.role === "librarian";

  useEffect(() => {
    dispatch(fetchBorrowRecords());
  }, [dispatch]);

  const handleReturn = async (id) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      setReturningIds((prev) => [...prev, id]);
      await dispatch(returnBorrowedBook(id));
      dispatch(fetchBorrowRecords());
      setReturningIds((prev) => prev.filter((bookId) => bookId !== id));
    }
  };

  const handleSendEmail = (record) => {
    setSelectedRecord(record);
    setEmailModal(true);
  };

  const handleSubmitEmail = async () => {
    await dispatch(
      sendBorrowerEmail({
        id: selectedRecord.id,
        subject,
        message,
      })
    );
    setEmailModal(false);
    setSubject("");
    setMessage("");
    dispatch(fetchBorrowRecords());
  };

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 112px)",
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 1300,
          borderRadius: 4,
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          height: "85vh",
          overflow: "hidden",
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            mb: 2,
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 100,
            pb: 2,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="green"
            textAlign="center"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
              borderBottom: "3px solid #4caf50",
              display: "inline-block",
              px: 2,
              pb: 1,
              borderRadius: 1,
              mx: "auto",
              mb: 2,
            }}
          >
            {isAdminOrLibrarian ? "All Borrowed Books" : "Your Borrowed Books"}
          </Typography>

          {/* Snackbar for success */}
          <Snackbar
            open={Boolean(successMessage)}
            autoHideDuration={4000}
            onClose={() => dispatch(clearBorrowSuccess())}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => dispatch(clearBorrowSuccess())}
              severity="success"
              sx={{ width: "100%" }}
              elevation={6}
              variant="filled"
            >
              {successMessage}
            </Alert>
          </Snackbar>

          {error && (
            <Typography textAlign="center" color="error" mb={2}>
              ❌ {error}
              <Button
                onClick={() => dispatch(clearBorrowError())}
                size="small"
                sx={{ ml: 1 }}
              >
                Dismiss
              </Button>
            </Typography>
          )}
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: 6,
              }}
            >
              <CircularProgress />
              <Typography mt={2} color="text.secondary">
                Loading borrow records...
              </Typography>
            </Box>
          ) : records && records.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              {user?.role === "member"
                ? "You have not borrowed any books yet."
                : "No borrow records found."}
            </Typography>
          ) : (
            <>
              <Grid container spacing={3} justifyContent="center">
                {paginatedRecords.map((record) => {
                  const isReturned = !!record.return_date;
                  const isOverdue = dayjs(record.due_date).isBefore(dayjs());

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={record.id}>
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                          minHeight: 320,
                          borderRadius: 3,
                          boxShadow: 3,
                          backgroundColor: isReturned ? "#f5f5f5" : "white",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="success.main"
                            gutterBottom
                            noWrap
                          >
                            {record.book?.title || "Unknown Title"}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            Author: {record.book?.author || "N/A"}
                          </Typography>

                          {isAdminOrLibrarian && record.user_info && (
                            <Box
                              sx={{
                                backgroundColor: "#e3f2fd",
                                borderLeft: "4px solid #2e7d32",
                                borderRadius: 1,
                                mt: 2,
                                p: 1.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="success.dark"
                                fontWeight="bold"
                              >
                                Borrowed by: {record.user_info.username}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {record.user_info.email}
                              </Typography>
                            </Box>
                          )}

                          <Typography variant="body2" mt={2}>
                            Borrowed on:{" "}
                            {dayjs(record.borrow_date).format("DD MMM YYYY")}
                          </Typography>
                          <Typography variant="body2">
                            Due Date:{" "}
                            {dayjs(record.due_date).format("DD MMM YYYY")}
                          </Typography>
                          {record.return_date && (
                            <>
                              <Typography variant="body2">
                                Returned on:{" "}
                                {dayjs(record.return_date).format(
                                  "DD MMM YYYY"
                                )}
                              </Typography>

                              {Number(record.fine_amount) > 0 && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  sx={{ fontWeight: "bold", mt: 1 }}
                                >
                                  Fine: ₹{record.fine_amount}
                                </Typography>
                              )}
                            </>
                          )}

                          <Box mt={2}>
                            {isReturned ? (
                              <Typography
                                variant="body2"
                                color="success.main"
                                display="flex"
                                alignItems="center"
                                gap={1}
                              >
                                <CheckCircleIcon fontSize="small" /> Returned
                              </Typography>
                            ) : isOverdue ? (
                              <Typography
                                variant="body2"
                                color="error"
                                display="flex"
                                alignItems="center"
                                gap={1}
                              >
                                <WarningAmberIcon fontSize="small" /> Overdue
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="warning.main"
                                display="flex"
                                alignItems="center"
                                gap={1}
                              >
                                <AccessTimeIcon fontSize="small" /> Borrowed
                              </Typography>
                            )}
                          </Box>
                        </CardContent>

                        <CardActions
                          sx={{
                            flexDirection: "column",
                            gap: 1,
                            px: 2,
                            pb: 2,
                          }}
                        >
                          {!isReturned && user?.role === "member" && (
                            <Button
                              fullWidth
                              variant="contained"
                              color="success"
                              startIcon={<ReplayIcon />}
                              onClick={() => handleReturn(record.id)}
                              disabled={returningIds.includes(record.id)}
                            >
                              {returningIds.includes(record.id)
                                ? "Processing..."
                                : "Return Book"}
                            </Button>
                          )}

                          {isAdminOrLibrarian && record.user_info && (
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              startIcon={<EmailIcon />}
                              onClick={() => handleSendEmail(record)}
                            >
                              Send Email
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Pagination */}
              <Box display="flex" justifyContent="center" mt={4} mb={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="success"
                  size="medium"
                />
              </Box>
            </>
          )}
        </Box>

        {/* Email Modal */}
        <Modal
          open={emailModal}
          onClose={() => setEmailModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 300 }}
        >
          <Fade in={emailModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 400 },
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 2,
                p: 4,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" color="primary">
                  Send Email to {selectedRecord?.user_info?.username}
                </Typography>
                <IconButton onClick={() => setEmailModal(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <TextField
                fullWidth
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                margin="normal"
              />

              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button onClick={() => setEmailModal(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmitEmail}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Paper>
    </Box>
  );
};

export default BorrowList;
