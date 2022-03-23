import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {TemplateType} from "./template.types";

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

export const getTemplate = createAsyncThunk(
  'template/getTemplate',
  async (payload: string, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await axios.get(`https://imot-api.pyzzle.ru/search_filter/${payload}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(templateSlice.actions.setCurrentTemplate(response.data));
  }
);

export const createTemplate = createAsyncThunk(
  'template/createTemplate',
  async (payload: { title: string, items: any[] }, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await axios.post(`https://imot-api.pyzzle.ru/search_filter`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await thunkAPI.dispatch(getTemplate(response.data));
    thunkAPI.dispatch(getAllTemplates());
  }
);

export const updateTemplate = createAsyncThunk(
  'template/updateTemplate',
  async (payload: TemplateType, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await axios.put(`https://imot-api.pyzzle.ru/search_filter/${payload.id}`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await thunkAPI.dispatch(getTemplate(response.data));
    thunkAPI.dispatch(getAllTemplates());
  }
);

export const deleteTemplate = createAsyncThunk(
  'template/updateTemplate',
  async (payload: string, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await axios.delete(`https://imot-api.pyzzle.ru/search_filter/${payload}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(getAllTemplates());
    return response.data.title;
  }
);

type InitialStateType = {
  allTemplates: TemplateType[],
  currentTemplate: TemplateType | null
};

const initialState: InitialStateType = {
  allTemplates: [],
  currentTemplate: null
};

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setAllTemplates(state, action: PayloadAction<TemplateType[]>) {
      state.allTemplates = action.payload;
    },
    setCurrentTemplate(state, action: PayloadAction<TemplateType | null>) {
      state.currentTemplate = action.payload;
    }
  }
});
