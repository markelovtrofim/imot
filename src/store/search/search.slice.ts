import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {callsSlice} from "../calls/calls.slice";
import {type} from "os";

export const getAllSearchCriterias = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload, thunkAPI) => {
    // @ts-ignore;
    const {token} = await JSON.parse(localStorage.getItem('token'));
    const response = await axios.get(`https://test.imot.io/new_api/search_criterias/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(searchSlice.actions.setAllCriterias(response.data));
  }
)

export const getUserSearchCriterias = createAsyncThunk(
  'search/getBaseSearchCriterias',
  async (payload, thunkAPI) => {
    // @ts-ignore;
    const {token} = await JSON.parse(localStorage.getItem('token'));
    const response = await axios.get(`https://test.imot.io/new_api/search_criterias/default_keys`, {
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
  userCriterias: string[] | null
}

type CriteriasType = {
  title: string,
  key: string,
  selectType: string,
  addMulti: boolean,
  values: string[]
}

const initialState: InitialStateType = {
  date: {
    startDate: null,
    endDate: null
  },
  allCriterias: null,
  userCriterias: null
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<typeof initialState.date>) {
      state.date = action.payload;
    },
    setUserCriterias(state, action: PayloadAction<string[]>) {
      state.userCriterias = action.payload;
    },
    setAllCriterias(state, action: PayloadAction<CriteriasType[]>) {
      state.allCriterias = action.payload
    }
  }
});
