import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthResponseErrors} from "./auth.types";
import {instance} from "../api";

type AuthType = {
  access_token: "string",
  token_type: "string"
};

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
      await localStorage.setItem('token', JSON.stringify({
        token: response.data.access_token
      }));
      await localStorage.setItem('mainToken', JSON.stringify({
        mainToken: response.data.access_token
      }));
      await thunkAPI.dispatch(authSlice.actions.setAuth(true));
      return response.data;
    } catch (error) {
      // @ts-ignore
      const status = Number(error.message.substr(-3, 3));
      if (status === AuthResponseErrors.FieldsRequired) {
        thunkAPI.dispatch(authSlice.actions.setError('Поля обязательны для ввода'));
      } else if (status === AuthResponseErrors.IncorrectData) {
        thunkAPI.dispatch(authSlice.actions.setError('Неверный логин или пароль'));
      } else {
        thunkAPI.dispatch(authSlice.actions.setError('Непредвиденная ошибка. Перезагрузите приложение.'));
      }
    }
  }
);

export const removeAuthToken = createAsyncThunk(
  'auth/removeAuthToken',
  async (_, {dispatch}) => {
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
