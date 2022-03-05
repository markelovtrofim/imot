import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {CallsType} from "./calls.types";
import {convertDate} from "../../utils/convertData";
import {AppStore, RootState} from "../index";

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
    // @ts-ignore;
    const {token} = await JSON.parse(localStorage.getItem('token'));
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
  async (payload: any, thunkAPI) => {
    try {
      // @ts-ignore;
      const {token} = await JSON.parse(localStorage.getItem('token'));
      // @ts-ignore;
      const state: RootState = thunkAPI.getState();
      let startDate = convertDate(state.search.date.startDate, 'request');
      let endDate = convertDate(state.search.date.endDate, 'request');
      if (startDate === endDate || !endDate) {
        endDate = startDate;
      }
      debugger
      const response = await axios.post<ResponseBaseCallsDataType>(
      `https://imot-api.pyzzle.ru/search_calls/?` +
      `skip=${payload.skip}&limit=${payload.limit}` +
      `&start_date=${startDate}` +
      `&end_date=${endDate}`,
      payload.data,
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
      debugger
      let localCalls = [];
      // @ts-ignore
      const {token} = await JSON.parse(localStorage.getItem('token'));
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
  skip: number | null,
  limit: number | null,
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
  skip: null,
  limit: null,
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
      state.skip = null;
      state.limit = null;
      state.calls = createInitialCalls()
    },
    setAudio(state, action: PayloadAction<any>) {
      // @ts-ignore
      state.calls[action.payload.index].map(i => {
        console.log(i)
        // @ts-ignore
        if (i.info.id === action.payload.id) {
          debugger
          i.audio = action.payload.audio
        }
      })
    }
  }
});
