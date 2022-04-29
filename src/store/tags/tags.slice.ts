import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {TagDetailedType, TagGroupType, TagType} from "./tags.types";

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

type initialStateType = {
  activeTagId: string | null,

  tagGroups: TagGroupType[] | null[],
  currentTagGroup: TagGroupType | null,

  tags: TagType[] | null[] | null,
  currentTag: TagDetailedType | null | false,

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
  }
});
