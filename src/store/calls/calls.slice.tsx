import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

// get all calls
type FetchCallsType = {
  skip: number,
  limit: number
};
export const fetchCalls = createAsyncThunk(
  'calls/fetchCalls',
  async ({skip, limit}: FetchCallsType, thunkAPI) => {
    try {
      // @ts-ignore
      const {token} = await JSON.parse(localStorage.getItem('token'));
      const response = await axios.post(`https://test.imot.io/new_api/search_calls/?skip=${skip}&limit=${limit}`, [], {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await thunkAPI.dispatch(callsSlice.actions.setCalls(response.data));
    } catch (error) {
      // @ts-ignore;
      console.log(error);
    }
  }
);

// get certain call
const fetchCertainCall = createAsyncThunk(
  'calls/fetchCertainCall',
  async (payload: { callId: string, index: number }, thunkAPI) => {
    try {
      // @ts-ignore
      const {token} = await JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`https://test.imot.io/new_api/call/${payload.callId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchCertainCallBundle =  createAsyncThunk(
  'calls/fetchCertainCallBundle',
  async (payload: { callIds: string[], range: { start: number, end: number }}, thunkAPI) => {
    try {
      let callsDetailsLocal = [];
      for (let i = payload.range.start; i < payload.range.end; i++) {
        const response = await thunkAPI.dispatch(fetchCertainCall({callId: payload.callIds[i], index: i}))
        callsDetailsLocal.push(response.payload);
      }
      thunkAPI.dispatch(callsSlice.actions.setCallsDetails({body: callsDetailsLocal, range: payload.range}))
      console.log(callsDetailsLocal)
    } catch (error) {
      console.log(error);
    }
  }
);

type CertainCallType = {
  id: string,
  callTime: string,
  callTimeReadable: string,
  clientPhone: string,
  operatorPhone: string,
  userId: string,
  uniqueId: string,
  conversationId: null | any,
  duration: number,
  tags: any[]
};

const initialState = {
  callsBundleCount: 10,
  calls: {
    total: null as null | number,
    found: null as null | number,
    skip: null as null | number,
    limit: null as null | number,
    call_ids: null as null | string[]
  },
  callsDetails: [
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType,
    null as null | CertainCallType
  ]
};

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    setCalls(state, action: PayloadAction<typeof initialState.calls>) {
      if (!state.calls.total) {
        state.calls = action.payload;
      } else {
        // @ts-ignore
        state.calls.call_ids.push(...action.payload.call_ids);
      }
    }
    ,
    setCallsDetails(state, action: PayloadAction<{ body: CertainCallType[], range: { start: number, end: number } }>) {
      for (let i = action.payload.range.start, j = 0; i < action.payload.range.end, j < 20; i++, j++) {
        state.callsDetails.splice(i, 1, action.payload.body[j]);
      }
    },
    setEmptyCertainCalls(state, action: PayloadAction<{body: null[]}>) {
      state.callsDetails.push(...action.payload.body);
    }
  }
});
