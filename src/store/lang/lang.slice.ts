import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {instance} from "../api";
import {SnackbarType} from "../../components/common/Snackbar";

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
  loading: boolean,
  snackbar: SnackbarType
}

const initialState: InitialStateType = {
  language: 'ru',
  loading: false,
  snackbar: {
    type: 'success',
    text: '',
    value: false,
    time: null
  }
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

    setSnackbar(state, action: PayloadAction<SnackbarType>) {
      state.snackbar = action.payload;
    },

    langReset: () => initialState
  }
})