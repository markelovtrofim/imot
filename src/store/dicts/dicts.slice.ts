import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {DictType, DictTypeDetailed, GroupType} from "./dicts.types";

export const getGroups = createAsyncThunk(
  'dicts/getGroups',
  async (payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'groups', value: true}));
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'items', value: true}));
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: true}));
      const {data} = await axios.get<GroupType[]>(`https://imot-api.pyzzle.ru/dict_groups/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(dictsSlice.actions.setGroups(data));
      thunkAPI.dispatch(dictsSlice.actions.setCurrentGroup(data[0]));
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'groups', value: false}));
      await thunkAPI.dispatch(getDicts({showDisabled: false, group: data[0].group}));
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'items', value: false}));
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: false}));
    } catch (error) {
      console.log(error);
    }
  }
);

export const getDicts = createAsyncThunk(
  'dicts/getDicts',
  async (payload: { showDisabled: boolean, filter?: string, group?: string }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const url = `https://imot-api.pyzzle.ru/dicts/` +
        `?show_disabled=${payload.showDisabled}` +
        `${payload.filter ? `&filter=${payload.filter}` : ''}` +
        `${payload.group ? `&group=${payload.group}` : ''}`
      const {data} = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(dictsSlice.actions.setDicts(data));
      await thunkAPI.dispatch(getDict(data[0].id));
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
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: true}));
      const {data} = await axios.get(`https://imot-api.pyzzle.ru/dict/${payload}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await thunkAPI.dispatch(dictsSlice.actions.setCurrentDict(data));
      thunkAPI.dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: false}));
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateDict = createAsyncThunk(
  'dict/updateDict',
  async (payload: DictTypeDetailed, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await axios.put(`https://imot-api.pyzzle.ru/dict/${payload.id}`, payload, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      await thunkAPI.dispatch(getDicts({showDisabled: false, group: payload.group}));
    } catch (error) {
      console.log(error);
    }
  }
);

type InitialStateType = {
  groups: GroupType[] | null,
  currentGroup: GroupType | null,

  dicts: DictType[] | null,
  currentDict: DictTypeDetailed | null,

  loading: {
    groupsBlockLoading: boolean,
    itemsBlockLoading: boolean,
    itemDetailsBlockLoading: boolean
  }
};

const initialState: InitialStateType = {
  groups: null,
  currentGroup: null,
  dicts: null,
  currentDict: null,
  loading: {
    groupsBlockLoading: false,
    itemsBlockLoading: false,
    itemDetailsBlockLoading: false
  }
};

export const dictsSlice = createSlice({
  name: 'dicts',
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<GroupType[]>) {
      state.groups = action.payload;
    },
    setCurrentGroup(state, action: PayloadAction<GroupType>) {
      state.currentGroup = action.payload;
    },

    setDicts(state, action: PayloadAction<DictType[]>) {
      state.dicts = action.payload;
    },
    setCurrentDict(state, action: PayloadAction<DictTypeDetailed | null >) {
      state.currentDict = action.payload;
    },

    setLoading(state, action: PayloadAction<{type: 'groups' | 'items' | 'itemDetails', value: boolean }>) {
      if (action.payload.type === 'groups') {
        state.loading.groupsBlockLoading = action.payload.value;
      } else if (action.payload.type === 'items') {
        state.loading.itemsBlockLoading = action.payload.value;
      } else if (action.payload.type === 'itemDetails') {
        state.loading.itemDetailsBlockLoading = action.payload.value;
      }
    }
  }
});
