import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {TemplatesType} from "./template.types";

export const getAllTemplates = createAsyncThunk(
  'template/getAllTemplates',
  async (payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await axios.get(`https://imot-api.pyzzle.ru/search_filters/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    thunkAPI.dispatch(templateSlice.actions.setAllTemplates(response.data));
  }
);

type InitialStateType = {
  allTemplates: TemplatesType[] | null,
  currentTemplateId: string | null
};

const initialState: InitialStateType = {
  allTemplates: null,
  currentTemplateId: null
};

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setAllTemplates(state, action: PayloadAction<TemplatesType[]>) {
      state.allTemplates = action.payload;
    }
  }
});
