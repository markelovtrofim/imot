import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {CallsType} from "./calls.types";
import {convertDate} from "../../utils/convertData";
import {RootState} from "../index";
import {convertDataForRequest} from "../../utils/convertDataForRequest";

// get all calls
type ResponseBaseCallsDataType = {
  total: number,
  found: number,
  skip: number,
  limit: number,
  call_ids: string[]
}

export const getCallAudio = createAsyncThunk(
  'calls/getCallAudio',
  async (payload: { id: string, bundleIndex: number }, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await axios.get(`https://imot-api.pyzzle.ru/call/${payload.id}/audio`, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'audio/wav'
      }
    });
    const blob = new Blob([data], {
      type: 'audio/wav'
    });
    const blobUrl = URL.createObjectURL(blob);
    thunkAPI.dispatch(callsSlice.actions.setAudio({audio: blobUrl, id: payload.id, index: payload.bundleIndex}))
  }
)

export const getBaseCallsData = createAsyncThunk(
  'calls/getBaseCallsData',
  async (_, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');

      // @ts-ignore;
      const state: RootState = thunkAPI.getState();

      let startDate = convertDate(state.search.date.startDate, 'request');
      let endDate = convertDate(state.search.date.endDate, 'request');
      if (startDate === endDate || !endDate) {
        endDate = startDate;
      }
      const requestData = convertDataForRequest(state.search.defaultCriterias, state.search.activeCriterias);

      const response = await axios.post<ResponseBaseCallsDataType>(
      `https://imot-api.pyzzle.ru/search_calls/?` +
      `skip=${state.calls.skip}&limit=${state.calls.limit}` +
      `&start_date=${startDate}` +
      `&end_date=${endDate}`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(callsSlice.actions.setBaseCallsData(response.data));
      // @ts-ignore
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
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      for (let i = 0; i < payload.length; i++) {
        const response = await axios.get(`https://imot-api.pyzzle.ru/call/${payload[i].id}`, {
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
  callsArrayIndex: number,
  total: number | null,
  found: number | null,
  skip: number,
  limit: number,
  callIds: null,
  calls: CallsType[][] | []
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
  callsArrayIndex: 0,
  total: null,
  found: null,
  skip: 0,
  limit: 10,
  callIds: null,
  calls: createInitialCalls()
};

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    setBaseCallsData(state, action: PayloadAction<ResponseBaseCallsDataType>) {
      if (!state.total) {
        let calls = [];
        for (let i = 0; i < action.payload.call_ids.length; i++) {
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
        for (let i = 0; i < action.payload.call_ids.length; i++) {
          calls.push({
            id: action.payload.call_ids[i],
            info: null,
            stt: null,
            audio: null
          })
        }
        state.calls.slice(state.bundleLength);
        // @ts-ignore
        state.calls.push(calls);
      }
    },
    setCallsInfo(state, action: PayloadAction<any[]>) {
      if (action.payload.length < 1) {
        state.calls = [];
      }
      state.calls[state.calls.length - 1] = action.payload;
    },
    setEmptyState(state, action: PayloadAction<null>) {
      state.total = null;
      state.found = null;
      state.skip = 0;
      state.limit = 10;
      state.calls = createInitialCalls()
    },
    setAudio(state, action: PayloadAction<any>) {
      state.calls[action.payload.index].map(i => {
        // @ts-ignore
        if (i.info.id === action.payload.id) {
          i.audio = action.payload.audio
        }
      })
    },
    incrementSkip(state, action: PayloadAction<null>) {
      state.skip += state.limit;
    }
  }
});
