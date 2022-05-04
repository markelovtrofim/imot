import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {GlobalFilterItemDetailed, TagDetailedType, TagGroupType, TagType} from "./tags.types";
import cloneDeep from "lodash.clonedeep";

// группы.
export const getTagGroups = createAsyncThunk(
  'tags/getTagGroups',
  async (payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await axios.get<TagGroupType[]>(`https://imot-api.pyzzle.ru/tag_rule_groups/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(tagsSlice.actions.setTagGroups(data));
    return data;
  }
)

// теги
export const getTags = createAsyncThunk(
  'tags/getTags',
  async (payload: { filter?: string, group?: string }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const generateEndUrlPart = (payload: { filter?: string, group?: string }): string => {
        if (payload.filter && payload.group) {
          return `?filter=${payload.filter}&group=${payload.group}`;
        } else if (payload.filter) {
          return `?filter=${payload.filter}`;
        } else if (payload.group) {
          return `?group=${payload.group}`;
        }
        return '';
      }
      const url = `https://imot-api.pyzzle.ru/tag_rules/${generateEndUrlPart(payload)}`
      const {data} = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await thunkAPI.dispatch(tagsSlice.actions.setTags(data));
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// детальная информация о теге.
export const getTag = createAsyncThunk(
  'tags/getTag',
  async (id: string, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await axios.get(`https://imot-api.pyzzle.ru/tag_rule/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(tagsSlice.actions.setCurrentTag(data));
    return data
  }
)

// все критерии для глобаного фильтра.
export const getAllGlobalTagFilters = createAsyncThunk(
  'tags/getAllGlobalTagFilters',
  async (payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await axios.get(`https://imot-api.pyzzle.ru/search_criterias/?extended=true`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(tagsSlice.actions.setAllGlobalFilterCriterias(data));
  }
)

type initialStateType = {
  activeTagId: string | null,

  tagGroups: TagGroupType[] | null[],
  currentTagGroup: TagGroupType | null,

  tags: TagType[] | null[] | null,
  currentTag: TagDetailedType | null | false,

  allGlobalFilterCriterias: GlobalFilterItemDetailed[],
  activeGlobalFilterCriterias: GlobalFilterItemDetailed[],

  error: string | null
};

export const createNullArray = (count: number) => {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(null);
  }
  return result;
};

const initialState: initialStateType = {
  activeTagId: null,

  tagGroups: createNullArray(4),
  currentTagGroup: null,

  tags: createNullArray(15),
  currentTag: null,

  allGlobalFilterCriterias: [],
  activeGlobalFilterCriterias: [],

  error: null
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTagGroups(state, action: PayloadAction<TagGroupType[]>) {
      state.tagGroups = action.payload;
    },
    setCurrentTagGroup(state, action: PayloadAction<TagGroupType>) {
      state.currentTagGroup = action.payload;
    },

    setTags(state, action: PayloadAction<TagType[] | null[]>) {
      state.tags = action.payload;
    },
    setCurrentTag(state, action: PayloadAction<TagDetailedType | null>) {
      state.currentTag = action.payload;
    },

    setAllGlobalFilterCriterias(state, action: PayloadAction<GlobalFilterItemDetailed[]>) {
      state.allGlobalFilterCriterias = action.payload;
    },
    setActiveGlobalFilterCriterias(state, action: PayloadAction<GlobalFilterItemDetailed>) {
      state.activeGlobalFilterCriterias.push(action.payload);
    },
    setActiveGlobalFilterCriteriasValues(state, action: PayloadAction<GlobalFilterItemDetailed>) {
      let activeCriterias = cloneDeep(current(state.activeGlobalFilterCriterias));
      const activeCriteria = activeCriterias.find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const activeCriteriaIndex = activeCriterias.indexOf(activeCriteria);

      state.activeGlobalFilterCriterias[activeCriteriaIndex].values = action.payload.values;
    }
  }
});
