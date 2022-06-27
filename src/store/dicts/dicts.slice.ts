import  {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DictActionType, DictType, DictTypeDetailed, GroupType, MarkupRulesPagesType} from "./dicts.types";
import {instance} from "../api";

export const getGroups = createAsyncThunk(
  'dicts/getGroups',
  async (payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await instance.get<GroupType[]>(`dict_groups/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
      const url = `dicts/` +
        `?show_disabled=true` +
        `${payload.filter ? `&filter=${payload.filter}` : ''}` +
        `${payload.group ? `&group=${payload.group}` : ''}`
      const {data} = await instance.get(url, {
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
      const {data} = await instance.get(`dict/${payload}`, {
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
      const {data} = await instance.post(`dict/`, payload,{
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
      const {data} = await instance.delete(`dict/${payload}`, {
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
      const {data} = await instance.put(`dict/${payload.id}`, payload, {
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
      const {data} = await instance.post(`dict/${payload.dictId}/action`, {action: payload.action}, {
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
  activePage: string,
  search: string,

  activeId: string | null,

  groups: GroupType[] | null[],
  currentGroup: GroupType | null,

  dicts: DictType[] | null[] | null,
  currentDict: DictTypeDetailed | null | false | undefined,

  error: string | null
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
  search: '',




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
    setActivePage(state, action: PayloadAction<string>) {
      state.activePage = action.payload;
    },

    // Search params
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
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
    setCurrentDict(state, action: PayloadAction<DictTypeDetailed | null | false | undefined>) {
      state.currentDict = action.payload;
    },

    dictsReset: () => initialState
  }
});
