import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {
  FragmentRulesItem, FragmentsSelectType,
  GlobalFilterItem,
  GlobalFilterItemDetailed,
  TagDetailedType,
  TagGroupType,
  TagType
} from "./tags.types";
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
      thunkAPI.dispatch(tagsSlice.actions.setTags(data));
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
    const {data} = await axios.get<TagDetailedType>(`https://imot-api.pyzzle.ru/tag_rule/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(tagsSlice.actions.setCurrentTag(data));
    thunkAPI.dispatch(tagsSlice.actions.setDefaultGlobalFilterCriterias(data.globalFilter));
    thunkAPI.dispatch(tagsSlice.actions.setActiveFragments(data.fragmentRules));
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

export const createNullArray = (count: number) => {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(null);
  }
  return result;
};


type initialStateType = {
  activeTagId: string | null,

  tagGroups: TagGroupType[] | null[],
  currentTagGroup: TagGroupType | null,

  tags: TagType[] | null[] | null,
  currentTag: TagDetailedType | null | false,

  allGlobalFilterCriterias: GlobalFilterItemDetailed[],
  defaultGlobalFilterCriterias: GlobalFilterItem[],
  activeGlobalFilterCriterias: GlobalFilterItemDetailed[],

  activeFragments: {
    key: string,
    value: any,
    options: string[] | null,
    selectType: FragmentsSelectType,
    visible: boolean
  }[][],

  error: string | null
};

const initialState: initialStateType = {
  activeTagId: null,

  tagGroups: createNullArray(4),
  currentTagGroup: null,

  tags: createNullArray(15),
  currentTag: null,

  allGlobalFilterCriterias: [],
  defaultGlobalFilterCriterias: [],
  activeGlobalFilterCriterias: [],

  activeFragments: [],

  error: null
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    // группы
    setTagGroups(state, action: PayloadAction<TagGroupType[]>) {
      state.tagGroups = action.payload;
    },
    setCurrentTagGroup(state, action: PayloadAction<TagGroupType>) {
      state.currentTagGroup = action.payload;
    },


    // теги
    setTags(state, action: PayloadAction<TagType[] | null[]>) {
      state.tags = action.payload;
    },
    setCurrentTag(state, action: PayloadAction<TagDetailedType | null>) {
      state.currentTag = action.payload;
    },


    // детали тега
    // глобальные фильтры
    // все критерии
    setAllGlobalFilterCriterias(state, action: PayloadAction<GlobalFilterItemDetailed[]>) {
      state.allGlobalFilterCriterias = action.payload;
    },
    // дефолтные критерии
    setDefaultGlobalFilterCriterias(state, action: PayloadAction<GlobalFilterItem[]>) {
      state.defaultGlobalFilterCriterias = action.payload;
    },
    setDefaultGlobalFilterCriteriaValues(state, action: PayloadAction<GlobalFilterItem>) {
      const criteria = state.defaultGlobalFilterCriterias.find(criteria => (
        criteria.key === action.payload.key
      ));
      if (criteria) {
        const index = state.defaultGlobalFilterCriterias.indexOf(criteria);
        state.defaultGlobalFilterCriterias[index].values = action.payload.values;
      }
    },
    // активные критерии
    setActiveGlobalFilterCriterias(state, action: PayloadAction<GlobalFilterItemDetailed[]>) {
      state.activeGlobalFilterCriterias = action.payload;
    },
    setActiveGlobalFilterCriteria(state, action: PayloadAction<GlobalFilterItemDetailed>) {
      state.activeGlobalFilterCriterias.push(action.payload);
    },
    removeActiveGlobalFilterCriteria(state, action: PayloadAction<GlobalFilterItemDetailed>) {
      const currentActiveCriterias = current(state.activeGlobalFilterCriterias);
      const currentActiveCriteria = currentActiveCriterias.find(criteria => criteria.key === action.payload.key);
      if (currentActiveCriterias) {
        // @ts-ignore
        const criteriaIndex = currentActiveCriterias.indexOf(currentActiveCriteria);
        state.activeGlobalFilterCriterias.splice(criteriaIndex, 1)
      }
    },
    setActiveGlobalFilterCriteriaValues(state, action: PayloadAction<GlobalFilterItemDetailed>) {
      let activeCriterias = cloneDeep(current(state.activeGlobalFilterCriterias));
      const activeCriteria = activeCriterias.find(item => {
        return item.key === action.payload.key
      });
      if (activeCriteria) {
        const activeCriteriaIndex = activeCriterias.indexOf(activeCriteria);
        state.activeGlobalFilterCriterias[activeCriteriaIndex].values = action.payload.values;
      }
    },


    // фрагементы
    setActiveFragments(state, action: PayloadAction<FragmentRulesItem[]>) {
      state.activeFragments.length = 0;
      const fragmentRulesArrayLength = action.payload.length;

      for (let i = 0; i < fragmentRulesArrayLength; i++) {
        const fragmentRulesLocalArray = [];
        for (let ii = 0; ii < Object.keys(action.payload[i]).length; ii++) {
          const key = Object.keys(action.payload[i])[ii];
          // phrasesAndDicts phrases dicts direction fromStart silentBefore silentAfter interruptTime
          if (key === 'phrasesAndDicts') {
            const criteria = current(state.allGlobalFilterCriterias).find(criteria => criteria.key === 'client_text');
            let dictsArray: string[] = [];
            if (criteria) {
              dictsArray = criteria.values;
            }
            fragmentRulesLocalArray.push({
              key: key,
              // @ts-ignore
              value: action.payload[i][key],
              options: [...dictsArray],
              selectType: 'multiString',
              visible: true
            })
          } else if (key === 'direction') {
            fragmentRulesLocalArray.push({
              key: key,
              // @ts-ignore
              value: action.payload[i][key],
              options: ['client_say', 'operator_say', 'client_not_say', 'operator_not_say', 'any_not_say'],
              selectType: 'multiValue',
              visible: false
            })
          } else if (key === 'fromStart') {
            fragmentRulesLocalArray.push({
              key: key,
              // @ts-ignore
              value: action.payload[i][key],
              option: null,
              selectType: 'checkbox',
              visible: false
            })
          } else if (key === 'phrases' || key === 'dicts') {
            fragmentRulesLocalArray.push({
              key: key,
              // @ts-ignore
              value: action.payload[i][key],
              option: null,
              selectType: 'doNotDisplay',
              visible: false
            })
          } else {
            fragmentRulesLocalArray.push({
              key: key,
              // @ts-ignore
              value: action.payload[i][key],
              option: null,
              selectType: 'input',
              visible: false
            })
          }
        }
        // @ts-ignore
        state.activeFragments.push(fragmentRulesLocalArray);
      }
    }
  }
});
