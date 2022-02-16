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
      thunkAPI.dispatch(callsSlice.actions.setCalls(response.data));
    } catch (error) {
      // @ts-ignore;
      console.log(error);
    }
  }
);

// get certain call
export const fetchCertainCall = createAsyncThunk(
  'calls/fetchCertainCall',
  async (payload: {callId: string, index: number}, thunkAPI) => {
    try {
      // @ts-ignore
      const {token} = await JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`https://test.imot.io/new_api/call/${payload.callId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      thunkAPI.dispatch(callsSlice.actions.setCertainCall({call: response.data, index: payload.index}));
    } catch (error) {
      // @ts-ignore;
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
  ]
};

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    setCalls(state, action: PayloadAction<typeof initialState.calls>) {
      state.calls = action.payload;
    },
    setCertainCall(state, action: PayloadAction<{ call: CertainCallType, index: number }>) {
      state.callsDetails.splice(action.payload.index, 1, action.payload.call)
    }
  }
});
