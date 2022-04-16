import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {DictActionType, DictType, DictTypeDetailed, GroupType, MarkupRulesPagesType} from "./dicts.types";

export const getGroups = createAsyncThunk(
  'dicts/getGroups',
  async (payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await axios.get<GroupType[]>(`https://imot-api.pyzzle.ru/dict_groups/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      debugger
      await thunkAPI.dispatch(dictsSlice.actions.setGroups(data));
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getDicts = createAsyncThunk(
  'dicts/getDicts',
  async (payload: { activeDictIndex?: number, filter?: string, group?: string }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const url = `https://imot-api.pyzzle.ru/dicts/` +
        `?show_disabled=true` +
        `${payload.filter ? `&filter=${payload.filter}` : ''}` +
        `${payload.group ? `&group=${payload.group}` : ''}`
      const {data} = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await thunkAPI.dispatch(dictsSlice.actions.setDicts(data));
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getDict = createAsyncThunk(
  'dict/getDict',
  async (payload: string, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await axios.get(`https://imot-api.pyzzle.ru/dict/${payload}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await thunkAPI.dispatch(dictsSlice.actions.setCurrentDict(data));
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const postDict = createAsyncThunk(
  'dicts/postDict',
  async (payload: DictTypeDetailed, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await axios.post(`https://imot-api.pyzzle.ru/dict/`, payload,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return data;
    } catch(e) {
      debugger
      thunkAPI.dispatch(dictsSlice.actions.setError('Этот словарь нельзя удалить.'))
      return Error;
    }
  }
);

export const deleteDict = createAsyncThunk(
  'dicts/deleteDict',
  async (payload: string, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await axios.delete(`https://imot-api.pyzzle.ru/dict/${payload}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return data;
    } catch(e) {
      thunkAPI.dispatch(dictsSlice.actions.setError('Этот словарь нельзя удалить.'))
      return Error;
    }
  }
);

export const updateDict = createAsyncThunk(
  'dicts/updateDict',
  async (payload: DictTypeDetailed, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await axios.put(`https://imot-api.pyzzle.ru/dict/${payload.id}`, payload, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);


export const dictActions = createAsyncThunk(
  'dicts/dictActions',
  async (payload: {dictId: string, action: DictActionType}, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await axios.post(`https://imot-api.pyzzle.ru/dict/${payload.dictId}/action`, {action: payload.action}, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      debugger
      return data;
    } catch (error) {
      console.log(error);
    }
  }
)


type InitialStateType = {
  activePage: MarkupRulesPagesType | '',
  activeId: string | null,

  groups: GroupType[] | null[],
  currentGroup: GroupType | null,

  dicts: DictType[] | null[] | null,
  currentDict: DictTypeDetailed | null | false,

  error: string | null,
};

const createNullArray = (count: number) => {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(null);
  }
  return result;
};

const initialState: InitialStateType = {
  activePage: '',
  activeId: null,

  groups: createNullArray(4),
  currentGroup: null,

  dicts: createNullArray(15),
  currentDict: null,

  error: null,
};

export const dictsSlice = createSlice({
  name: 'dicts',
  initialState,
  reducers: {
    // Error
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Active page
    setActivePage(state, action: PayloadAction<MarkupRulesPagesType>) {
      state.activePage = action.payload;
    },

    // Groups
    setGroups(state, action: PayloadAction<GroupType[]>) {
      state.groups = action.payload;
    },
    setCurrentGroup(state, action: PayloadAction<GroupType | null>) {
      state.currentGroup = action.payload;
    },

    // Dicts
    setDicts(state, action: PayloadAction<DictType[] | null>) {
      state.dicts = action.payload;
    },
    setEmptyDicts(state, action) {
      state.dicts = createNullArray(15);
    },
    setCurrentDict(state, action: PayloadAction<DictTypeDetailed | null | false>) {
      state.currentDict = action.payload;
    }
  }
});
