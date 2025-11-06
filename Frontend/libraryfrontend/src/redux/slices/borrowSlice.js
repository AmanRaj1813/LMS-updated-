import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export const fetchBorrowRecords = createAsyncThunk(
  "borrows/fetchBorrowRecords",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/borrow-records");
      console.log("Fetched borrow records:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch borrow records");
    }
  }
);
export const createBorrowRecord = createAsyncThunk(
  "borrows/createBorrowRecord",
  async (borrowData, { rejectWithValue }) => {
    try {
      console.log("Creating borrow record with data:", borrowData);
      const response = await apiClient.post("/borrow-records/", borrowData);
      console.log("Created borrow record response:", response);
      return response;
    } catch (error) {
      console.error("Error creating borrow record:", error);
      return rejectWithValue(
        error.message || " Failed to create borrow record"
      );
    }
  }
);
export const returnBorrowedBook = createAsyncThunk(
  "borrows/returnBorrowedBook",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Returning book with record id", id);
      const response = await apiClient.post(
        `/borrow-records/${id}/return_book/`
      );
      console.log("Book returned", response);
      return { id, message: response.message };
    } catch (error) {
      console.error("Error returning book:", error);
      return rejectWithValue(error.message || "Failed to return return book");
    }
  }
);
export const sendBorrowerEmail = createAsyncThunk(
  "borrows/sendBorrowerEmail",
  async ({ id, subject, message }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/borrow-records/${id}/send_email/`,
        {
          subject,
          message,
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send email");
    }
  }
);

export const deleteBorrowRecord = createAsyncThunk(
  "borrows/deleteBorrowRecords",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/borrow-records/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete borrow record");
    }
  }
);

const borrowSlice = createSlice({
  name: "borrows",
  initialState: {
    records: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBorrowError: (state) => {
      state.error = null;
    },
    clearBorrowSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBorrowRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchBorrowRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBorrowRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBorrowRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
        state.successMessage = "borrow record created successfully";
      })
      .addCase(createBorrowRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(returnBorrowedBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(returnBorrowedBook.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const record = state.records.find((r) => r.id === action.payload.id);
        if (record) {
          record.return_date = new Date().toISOString();
        }
      })
      .addCase(returnBorrowedBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBorrowRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBorrowRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteBorrowRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendBorrowerEmail.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      .addCase(sendBorrowerEmail.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { clearBorrowError, clearBorrowSuccess } = borrowSlice.actions;
export default borrowSlice.reducer;
