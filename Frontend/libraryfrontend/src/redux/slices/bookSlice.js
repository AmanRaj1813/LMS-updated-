import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// 🔹 Fetch all books
export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await apiClient.get('/books/');
  return response;
});

// 🔹 Fetch a single book by ID (optional)
export const fetchBookById = createAsyncThunk('books/fetchBookById', async (id) => {
  const response = await apiClient.get(`/books/${id}/`);
  return response;
});

// // ✅ Search books (with optional search)
export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (searchTerm = "", { rejectWithValue }) => {
    try {
      const endpoint = searchTerm
        ? `/books/?search=${encodeURIComponent(searchTerm)}`
        : "/books/";
      const data = await apiClient.get(endpoint);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const createBook = createAsyncThunk('books/createBook',async(bookData)=>{
    console.log("📤 Creating book with data:", bookData);
    const response = await apiClient.post('/books/',bookData);
    console.log("📥 Created book response:", response);
    return response;
})
export const updateBook = createAsyncThunk('books/updateBook',async({id,updatedData})=>{
const response = await apiClient.put(`/books/${id}/`,updatedData);
return response;
})
export const deleteBook = createAsyncThunk('books/deleteBook',async(id)=> {
    await apiClient.delete(`/books/${id}/`);
    return id;
})
const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    selectedBook: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBookError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Book By ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.books[index] = action.payload;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🗑️ Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // searchbook
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },

});

export const { clearBookError } = bookSlice.actions;
export default bookSlice.reducer;
