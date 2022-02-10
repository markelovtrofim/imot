import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

type AuthType = {
  access_token: "string",
  token_type: "string"
};

export const fetchAuthToken = createAsyncThunk(
  'auth/fetchAuthToken',
  async (authData: { username: string, password: string }, {dispatch}) => {
    let bodyFormData = new FormData();
    bodyFormData.append('username', authData.username);
    bodyFormData.append('password', authData.password);
    const response = await axios.post<AuthType>('https://test.imot.io/new_api/token', bodyFormData);
    dispatch(authSlice.actions.setAuth(true));
    localStorage.setItem('token', JSON.stringify({
      token: response.data.access_token
    }));
  }
);

export const removeAuthToken = createAsyncThunk(
  'auth/removeAuthToken',
  async (_, {dispatch}) => {
    localStorage.removeItem('token');
    dispatch(authSlice.actions.setAuth(false));
  }
);

const initialState: { isAuth: boolean, isLoading: boolean } = {
  isAuth: false,
  isLoading: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setLoading(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.isLoading = action.payload.isLoading;
    }
  }
});
