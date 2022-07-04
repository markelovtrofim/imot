import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {ChildUserType, UserType} from "./users.types";
import {langSlice} from '../lang/lang.slice';
import {instance} from "../api";
import {removeAuthToken} from "../auth/auth.slice";

export const getMe = createAsyncThunk(
  'users/getMe',
  async (payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.get<UserType>(`user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(usersSlice.actions.setCurrentUser(response.data));
      thunkAPI.dispatch(langSlice.actions.setLang(response.data.language));
    } catch (e) {
      thunkAPI.dispatch(removeAuthToken());
    }
  }
);

export const getChildUsers = createAsyncThunk(
  'users/getChildUsers',
  async(payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await instance.get<ChildUserType[]>(`users/?with_childs=false`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(usersSlice.actions.setUsers(response.data));
  }
);

export const getUserToken = createAsyncThunk(
  'users/getChildUsers',
  async(payload: string, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    debugger
    const response = await instance.get(`set_filter_user?user_id=${payload ? payload : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    localStorage.setItem('token', JSON.stringify({
      token: response.data.access_token
    }));
    debugger
  }
);

export const getChildUser = createAsyncThunk(
  'users/getChildUser',
  async(payload: string | void, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await instance.get(`user/filter`, {
      headers: {
        'Authorization': `Bearer ${payload ? payload : token}`
      }
    });
    thunkAPI.dispatch(usersSlice.actions.setCurrentChildUser(response.data));
  }
);

type InitialStateType = {
  currentUser: UserType | null,
  childUsers: ChildUserType[] | null,
  currentChildUser: ChildUserType | null
};

const initialState: InitialStateType = {
  currentUser: null,
  childUsers: null,
  currentChildUser: null
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserType>) {
      state.currentUser = action.payload;
    },
    setUsers(state, action: PayloadAction<ChildUserType[]>) {
      state.childUsers = action.payload;
    },
    setCurrentChildUser(state, action: PayloadAction<ChildUserType>) {
      state.currentChildUser = action.payload;
    }
  }
});
