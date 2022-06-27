import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {instance} from "../api";

export type LangType = 'ru' | 'en';

export const getLang = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload: string, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      await instance.get(`set_language?language=${payload}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(langSlice.actions.setLang(payload))
    } catch (e) {
      console.error(e);
    }
  }
);


type InitialStateType = {
  language: string,
  loading: boolean
}

const initialState: InitialStateType = {
  language: 'ru',
  loading: false
};

export const langSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },

    setDefaultLang(state, action: PayloadAction<null>) {
      state.language = "ru";
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    langReset: () => initialState
  }
})