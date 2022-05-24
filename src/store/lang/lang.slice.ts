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
  language: string
}

const initialState: InitialStateType = {
  language: 'ru'
};

export const langSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },

    langReset: () => initialState
  }
})