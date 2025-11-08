import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const register = createAsyncThunk('auth/register', async (userData) => {
  const response = await apiClient.post('/users/', userData);
  return response;
});

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await apiClient.post('/api/token/', credentials);
  localStorage.setItem('access_token', response.access);
  localStorage.setItem('refresh_token', response.refresh);
  return response;
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const response = await apiClient.get('/users/me/');
  return response;
});

/**
[User] → enters credentials
   ↓
[Login.jsx] → dispatch(login(credentials))
   ↓
[authSlice → login thunk]
   ↓
[apiClient] → POST /api/token/
   ↓
[Backend (Django)] → returns JWT tokens
   ↓
[authSlice] → stores token in localStorage & updates Redux
   ↓
dispatch(fetchCurrentUser())
   ↓
[apiClient] → GET /users/me/
   ↓
[authSlice] → updates user info
   ↓
React Router → navigate("/dashboard")

*/


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
