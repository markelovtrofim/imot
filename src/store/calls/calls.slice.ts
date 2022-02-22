import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {CallsType} from "./calls.types";

// get all calls
type InputBaseCallsDataType = {
  skip: number,
  limit: number,
  data: any[] | []
};
type ResponseBaseCallsDataType = {
  total: number,
  found: number,
  skip: number,
  limit: number,
  call_ids: string[]
}
export const getBaseCallsData = createAsyncThunk(
  'calls/getBaseCallsData',
  async (payload: InputBaseCallsDataType, thunkAPI) => {
    try {
      // @ts-ignore;
      const {token} = await JSON.parse(localStorage.getItem('token'));
      const response = await axios.post<ResponseBaseCallsDataType>(`https://test.imot.io/new_api/search_calls/?skip=${payload.skip}&limit=${payload.limit}&start_date=2022-02-20&end_date=2022-02-21`, payload.data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(callsSlice.actions.setBaseCallsData(response.data));
      // @ts-ignore;
      await thunkAPI.dispatch(getCallsInfo(thunkAPI.getState().calls.calls[thunkAPI.getState().calls.calls.length - 1]))
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCallsInfo = createAsyncThunk(
  'calls/getCallsInfo',
  async (payload: CallsType[], thunkAPI) => {
    try {
      let localCalls = [];
      // @ts-ignore
      const {token} = await JSON.parse(localStorage.getItem('token'));
      for (let i = 0; i < payload.length; i++) {
        const response = await axios.get(`https://test.imot.io/new_api/call/${payload[i].id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        localCalls.push({
          id: payload[i].id,
          info: response.data,
          stt: null,
          audio: null
        })
      }
      thunkAPI.dispatch(callsSlice.actions.setCallsInfo(localCalls));
    } catch (error) {
      console.log(error);
    }
  }
);

type InitialStateType = {
  bundleLength: number,
  total: number | null,
  found: number | null,
  skip: number | null,
  limit: number | null,
  calls: CallsType[][]
}

const createInitialCalls = (lengthEmptyArray: number = 10) => {
  let output = [];
  for (let i = 0; i < lengthEmptyArray; i++) {
    output.push({
      id: null,
      info: null,
      stt: null,
      audio: null
    });
  }
  return [output];
};

const initialState: InitialStateType = {
  bundleLength: 10,
  total: null as number | null,
  found: null as number | null,
  skip: null as number | null,
  limit: null as number | null,
  calls: createInitialCalls()
};

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    setBaseCallsData(state, action: PayloadAction<ResponseBaseCallsDataType>) {
      if (!state.total) {
        let calls = [];
        for (let i = 0; i < action.payload.call_ids.length; i++){
          calls.push({
            id: action.payload.call_ids[i],
            info: null,
            stt: null,
            audio: null
          })
        }
        state.total = action.payload.total;
        state.found = action.payload.found;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
        state.calls = [calls]
      } else {
        let calls = [];
        for (let i = 0; i < action.payload.call_ids.length; i++){
          calls.push({
            id: action.payload.call_ids[i],
            info: null,
            stt: null,
            audio: null
          })
        }
        state.calls.slice(state.bundleLength);
        state.calls.push(calls);
      }
    },
    setCallsInfo(state, action: PayloadAction<any[]>) {
      state.calls[state.calls.length - 1] = action.payload;
    },
    setEmptyState(state, action: PayloadAction<null>) {
      state.total = null;
      state.found = null;
      state.skip = null;
      state.limit = null;
      state.calls = createInitialCalls()
    }
  }
});
