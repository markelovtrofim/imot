import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export type LangType = 'ru' | 'en';

export const getLang = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload: string, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      await axios.get(`https://imot-api.pyzzle.ru/set_language?language=${payload}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      debugger
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
    }
  }
})