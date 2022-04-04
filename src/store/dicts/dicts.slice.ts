import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {DictType, DictTypeDetailed, GroupType, MarkupRulesPagesType} from "./dicts.types";

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
      thunkAPI.dispatch(dictsSlice.actions.setGroups(data));
      thunkAPI.dispatch(dictsSlice.actions.setCurrentGroup(data[0]));

      await thunkAPI.dispatch(getDicts({group: data[0].group}));
    } catch (error) {
      console.log(error);
    }
  }
);

export const getDicts = createAsyncThunk(
  'dicts/getDicts',
  async (payload: { filter?: string, group?: string }, thunkAPI) => {
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
      await thunkAPI.dispatch(getDict(data[0].id));
      thunkAPI.dispatch(dictsSlice.actions.setDicts(data));
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

export const deleteDict = createAsyncThunk(
  'dicts/deleteDict',
  async (payload: string, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    // @ts-ignore
    const currentDict = thunkAPI.getState().dicts.currentDict;
    const {data} = await axios.delete(`https://imot-api.pyzzle.ru/dict/${payload}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(dictsSlice.actions.setCurrentDict(null));
    await thunkAPI.dispatch(getGroups());
    await thunkAPI.dispatch(getDicts({group: currentDict.group}));
  }
)

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
      await thunkAPI.dispatch(getDicts({group: payload.group}));
    } catch (error) {
      console.log(error);
    }
  }
);


type InitialStateType = {
  activePage: MarkupRulesPagesType,

  groups: GroupType[] | null[],
  currentGroup: GroupType | null,

  dicts: DictType[] | null[] | null,
  currentDict: DictTypeDetailed | null,

  loading: {
    groupsBlockLoading: boolean,
    itemsBlockLoading: boolean,
    itemDetailsBlockLoading: boolean
  }
};

const createNullArray = (count: number) => {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(null);
  }
  return result;
};

const initialState: InitialStateType = {
  activePage: 'dictionaries',

  groups: createNullArray(4),
  currentGroup: null,

  dicts: createNullArray(15),
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
    // Active page
    setActivePage(state, action: PayloadAction<MarkupRulesPagesType>) {
      state.activePage = action.payload;
    },

    // Groups
    setGroups(state, action: PayloadAction<GroupType[]>) {
      state.groups = action.payload;
    },
    setCurrentGroup(state, action: PayloadAction<GroupType>) {
      state.currentGroup = action.payload;
    },

    // Dicts
    setDicts(state, action: PayloadAction<DictType[]>) {
      state.dicts = action.payload;
    },
    setEmptyDicts(state, action) {
      state.dicts = createNullArray(15);
    },
    setCurrentDict(state, action: PayloadAction<DictTypeDetailed | null>) {
      state.currentDict = action.payload;
    },

    // Tags

    // Checklists

    // Loading
    setLoading(state, action: PayloadAction<{ type: 'groups' | 'items' | 'itemDetails', value: boolean }>) {
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
