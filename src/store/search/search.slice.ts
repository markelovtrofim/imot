import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {CriteriasType, RequestDataType} from "./search.types";
import cloneDeep from "lodash.clonedeep";

export const getAllSearchCriterias = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload, thunkAPI) => {
    // @ts-ignore;
    const {token} = await JSON.parse(localStorage.getItem('token'));
    const response = await axios.get(`https://imot-api.pyzzle.ru/search_criterias/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(searchSlice.actions.setAllCriterias(response.data));
  }
);

export const getUserSearchCriterias = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload, thunkAPI) => {
    // @ts-ignore;
    const {token} = await JSON.parse(localStorage.getItem('token'));
    const response = await axios.get(`https://imot-api.pyzzle.ru/search_criterias/default_keys`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(searchSlice.actions.setUserCriterias(response.data));
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
    setUserCriterias(state, action: PayloadAction<string[]>) {
      for (let i = 0; i < action.payload.length; i++) {
        state.defaultCriterias.push({key: action.payload[i], values: []});
      }
    },
    updateActiveCriteria(state, action: PayloadAction<RequestDataType>) {
      const obj = current(state.activeCriterias).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriterias).indexOf(obj);
      state.activeCriterias[index].values = action.payload.values;
    },
    setAllCriterias(state, action: PayloadAction<CriteriasType[]>) {
      state.allCriterias = action.payload;
    },
    setActiveCriterias(state, action: PayloadAction<CriteriasType[]>) {
      state.activeCriterias = action.payload;
    },
    removeCriteria(state, action: PayloadAction<CriteriasType>) {
      let activeCriterias = cloneDeep(current(state.activeCriterias));
      const obj = current(state.activeCriterias).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriterias).indexOf(obj);
      activeCriterias.splice(index, 1);
      state.activeCriterias = activeCriterias;
    },
    removeALlCriterias(state, action: PayloadAction<null>) {
      state.activeCriterias = [];
    }
  }
});
