import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {CriteriasType, RequestDataType} from "./search.types";
import cloneDeep from "lodash.clonedeep";

export const getAllSearchCriterias = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await axios.get(`https://imot-api.pyzzle.ru/search_criterias/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(searchSlice.actions.setAllCriterias(response.data));
  }
);

export const getDefaultCriterias = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await axios.get(`https://imot-api.pyzzle.ru/search_criterias/default_keys`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(searchSlice.actions.setDefaultCriterias(response.data));
  }
)

type InitialStateType = {
  date: {
    startDate: string | null,
    endDate: string | null
  },
  allCriterias: CriteriasType[] | null,
  defaultCriterias: RequestDataType[],
  activeCriterias: CriteriasType[]
}

const initialState: InitialStateType = {
  date: {
    startDate: null,
    endDate: null
  },
  allCriterias: null,
  defaultCriterias: [],
  activeCriterias: []
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<typeof initialState.date>) {
      state.date = action.payload;
    },

    setDefaultCriterias(state, action: PayloadAction<string[]>) {
      for (let i = 0; i < action.payload.length; i++) {
        state.defaultCriterias.push({key: action.payload[i], values: []});
      }
    },
    setDefaultCriteriaValues(state, action: PayloadAction<RequestDataType>) {
      const obj = current(state.defaultCriterias).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.defaultCriterias).indexOf(obj);
      debugger
      state.defaultCriterias[index].values = action.payload.values;
    },
    setClearDefaultCriteriasValues(state, action: PayloadAction<null>) {
      for (let i = 0; i < state.defaultCriterias.length; i++) {
        state.defaultCriterias[i] = {...state.defaultCriterias[i], values: []};
      }
    },
    setAllCriterias(state, action: PayloadAction<CriteriasType[]>) {
      state.allCriterias = action.payload;
    },
    setActiveCriterias(state, action: PayloadAction<CriteriasType[]>) {
      state.activeCriterias = action.payload;
    },
    setActiveCriteriaValues(state, action: PayloadAction<RequestDataType>) {
      const obj = current(state.activeCriterias).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriterias).indexOf(obj);
      state.activeCriterias[index].values = action.payload.values;
    },
    removeActiveCriteria(state, action: PayloadAction<CriteriasType>) {
      let activeCriterias = cloneDeep(current(state.activeCriterias));
      const obj = current(state.activeCriterias).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriterias).indexOf(obj);
      activeCriterias.splice(index, 1);
      state.activeCriterias = activeCriterias;
    },
    removeAllActiveCriterias(state, action: PayloadAction<null>) {
      state.activeCriterias = [];
    }
  }
});
