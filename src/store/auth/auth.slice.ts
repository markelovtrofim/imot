import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponseErrors } from "./auth.types";
import { instance } from "../api";

type AuthType = {
  access_token: "string",
  token_type: "string"
};

export const registerNewUser = createAsyncThunk(
  'auth/registerNewUser',
  async (authData: { name: string, email: string, phoneNumber: string }) => {
    const { name, email, phoneNumber } = authData;
    const setUserData = {
      fullname: name,
      email: email,
      phone_number: phoneNumber,
      url_base: `${window.location.protocol}//${window.location.host}`,
    };
    const response = await instance.post<string>('/user/register', JSON.stringify(setUserData), {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      }
    });
    console.log(response);
    return response.status;
  }
);

export const approveUserToken = createAsyncThunk(
  'auth/approveToken',
  async (token: any) => {
    const tokenData = {
      token: token
    }
    const response = await instance.post<string>('/user/approve', JSON.stringify(tokenData), {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    console.log(response);
    return response.status;
  }
)

export const fetchAuthToken = createAsyncThunk(
  'auth/fetchAuthToken',
  async (authData: { username: string, password: string }, thunkAPI) => {
    try {
      let bodyFormData = new FormData();
      bodyFormData.append('username', authData.username);
      bodyFormData.append('password', authData.password);
      const response = await instance.post<AuthType>('token', bodyFormData, {
        headers: {
          'Content-Security-Policy': 'block-all-mixed-content'
        }
      });
      localStorage.setItem('token', JSON.stringify({
        token: response.data.access_token
      }));
      localStorage.setItem('mainToken', JSON.stringify({
        mainToken: response.data.access_token
      }));
      thunkAPI.dispatch(authSlice.actions.setAuth(true));
      return response.data;
    } catch (error) {
      // @ts-ignore
      const status = Number(error.message.substr(-3, 3));
      if (status === AuthResponseErrors.FieldsRequired) {
        thunkAPI.dispatch(authSlice.actions.setError('???????? ?????????????????????? ?????? ??????????'));
      } else if (status === AuthResponseErrors.IncorrectData) {
        thunkAPI.dispatch(authSlice.actions.setError('???????????????? ?????????? ?????? ????????????'));
      } else {
        thunkAPI.dispatch(authSlice.actions.setError('???????????????????????????? ????????????. ?????????????????????????? ????????????????????.'));
      }
    }
  }
);

export const removeAuthToken = createAsyncThunk(
  'auth/removeAuthToken',
  async (_, { dispatch }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('path');
    dispatch(authSlice.actions.setAuth(false));
  }
);

type InitialStateType = {
  error: null | string,
  isAuth: boolean,
  isLoading: boolean
};

const initialState: InitialStateType = {
  error: null,
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
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    authReset: () => initialState
  }
});
