import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {CriteriasType, RequestDataType} from "./search.types";
import cloneDeep from "lodash.clonedeep";
import {instance} from "../api";

export const getAllSearchCriterias = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');

    const response = await instance.get(`search_criterias/`, {
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
    const response = await instance.get(`search_criterias/default_keys`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(searchSlice.actions.setDefaultCriterias(response.data));
    thunkAPI.dispatch(searchSlice.actions.setDefaultCriteriasReport(response.data));
  }
)

export const getSearchHash = createAsyncThunk(
  'search/getSearchHash',
  async (hashKey: string, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    return instance.get(`/search_filter_hash/${hashKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
)

type InitialStateType = {
  searchParams: string,

  date: Date[] | null[],
  allCriterias: CriteriasType[] | null,
  defaultCriterias: RequestDataType[],
  activeCriterias: CriteriasType[],
  defaultCriteriasReport: RequestDataType[],
  activeCriteriasReports: CriteriasType[],
  activeCriteriasColumn: CriteriasType[],
}

const initialState: InitialStateType = {
  searchParams: "",

  date: [new Date(Date.now() - 8760 * 60 * 60 * 1000), new Date(Date.now())],
  allCriterias: null,
  defaultCriterias: [],
  activeCriterias: [],
  defaultCriteriasReport: [],
  activeCriteriasReports: [],
  activeCriteriasColumn: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<string>) {
      state.searchParams = action.payload;
    },

    setDate(state, action: PayloadAction<typeof initialState.date | null[]>) {
      state.date = action.payload;
    },

    setDefaultCriterias(state, action: PayloadAction<string[] | null>) {
      if (!action.payload) {
        state.defaultCriterias.length = 0;
      } else {
        for (let i = 0; i < action.payload.length; i++) {
          state.defaultCriterias.push({key: action.payload[i], values: []});
        }
      }
    },
    setDefaultCriteriaValues(state, action: PayloadAction<RequestDataType>) {
      const obj = current(state.defaultCriterias).find(item => {
        return item.key === action.payload.key
      });
      if (obj) {
        const index = current(state.defaultCriterias).indexOf(obj);
        state.defaultCriterias[index].values = action.payload.values;
      }
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
    },
    removeAllState(state, action: PayloadAction<null>) {
      state.date = [new Date(), new Date()];
      state.allCriterias = null;
      state.defaultCriterias = [];
      state.activeCriterias = [];
    },


    // for reports
    setActiveCriteriasReports(state, action: PayloadAction<CriteriasType[]>) {
      state.activeCriteriasReports = action.payload;
    },

    setDefaultCriteriasReport(state, action: PayloadAction<string[] | null>) {
      if (!action.payload) {
        state.defaultCriteriasReport.length = 0;
      } else {
        for (let i = 0; i < action.payload.length; i++) {
          state.defaultCriteriasReport.push({key: action.payload[i], values: []});
        }
      }
    },
    setDefaultCriteriaValuesReport(state, action: PayloadAction<RequestDataType>) {
      const obj = current(state.defaultCriteriasReport).find(item => {
        return item.key === action.payload.key
      });
      if (obj) {
        const index = current(state.defaultCriteriasReport).indexOf(obj);
        state.defaultCriteriasReport[index].values = action.payload.values;
      }
    },
    setClearDefaultCriteriasValuesReport(state, action: PayloadAction<null>) {
      for (let i = 0; i < state.defaultCriteriasReport.length; i++) {
        state.defaultCriteriasReport[i] = {...state.defaultCriteriasReport[i], values: []};
      }
    },

    setActiveCriteriaReportsValues(state, action: any) {
      const obj = current(state.activeCriteriasReports).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriteriasReports).indexOf(obj);
      debugger
      state.activeCriteriasReports[index].values = action.payload.values;
    },
    removeActiveCriteriaReports(state, action: PayloadAction<CriteriasType>) {
      let activeCriteriasReports = cloneDeep(current(state.activeCriteriasReports));
      const obj = current(state.activeCriteriasReports).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriteriasReports).indexOf(obj);
      activeCriteriasReports.splice(index, 1);
      state.activeCriteriasReports = activeCriteriasReports;
    },
    removeAllActiveCriteriasReports(state, action: PayloadAction<null>) {
      state.activeCriteriasReports = [];
    },

    //for column in report
    setActiveCriteriaReportsColumn(state, action: PayloadAction<CriteriasType[]>) {
      state.activeCriteriasColumn = action.payload;
    },
    setActiveCriteriaReportsColumnValues(state, action: PayloadAction<RequestDataType>) {
      const obj = current(state.activeCriteriasColumn).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriteriasColumn).indexOf(obj);
      state.activeCriteriasColumn[index].values = action.payload.values;
    },

    removeActiveCriteriaColumnReports(state, action: PayloadAction<CriteriasType>) {
      let activeCriteriasColumn = cloneDeep(current(state.activeCriteriasColumn));
      const obj = current(state.activeCriteriasColumn).find(item => {
        return item.key === action.payload.key
      });
      // @ts-ignore
      const index = current(state.activeCriteriasColumn).indexOf(obj);
      activeCriteriasColumn.splice(index, 1);
      state.activeCriteriasColumn = activeCriteriasColumn;
    },
    removeAllActiveCriteriasColumnReports(state, action: PayloadAction<null>) {
      state.activeCriteriasColumn = [];
    },

    searchReset: () => initialState

  }
})