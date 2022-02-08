import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

type AuthType = {
  access_token: "string",
  token_type: "string"
};

export const fetchAuthToken = createAsyncThunk(
  'auth/fetchAuthToken',
  async (authData: {username : string, password: string}, thunkAPI) => {
    // let bodyFormData = new FormData();
    console.log(authData)
    const response = await axios.post<AuthType>('https://test.imot.io/new_api/token', authData)
    localStorage.setItem('token', response.data.access_token);
    console.log(response)
  }
);

const initialState: {isAuth: boolean, isLoading: boolean} = {
  isAuth: false,
  isLoading: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{isAuth: boolean}>) {
      state.isAuth = action.payload.isAuth;
    },
    setLoading(state, action: PayloadAction<{isLoading: boolean}>) {
      state.isLoading = action.payload.isLoading;
    }
  }
});
