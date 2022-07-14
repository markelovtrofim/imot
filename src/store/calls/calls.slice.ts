import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {CallActionDataType, CallInfoType, CallType} from "./calls.types";
import {RootState} from "../store";
import {instance} from "../api";
import cloneDeep from "lodash.clonedeep";

// get all calls
type ResponseBaseCallsDataType = {
  total: number,
  found: number,
  skip: number,
  limit: number,
  call_ids: string[]
};

const convertDataForRequest = (defaultCriterias: any, activeCriterias: any) => {
  let requestArray = [];
  for (let i = 0; i < defaultCriterias.length; i++) {
    if (defaultCriterias[i].values.length > 0) {
      requestArray.push({key: defaultCriterias[i].key, values: defaultCriterias[i].values})
    }
  }
  for (let i = 0; i < activeCriterias.length; i++) {
    if (activeCriterias[i].values.length > 0) {
      requestArray.push({key: activeCriterias[i].key, values: activeCriterias[i].values});
    }
  }
  return requestArray;
};

const convertDate = (date: Date | null) => {
  if (date) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1; // Months start at 0!
    let strMm = `${mm}`;

    const dd = date.getDate();
    let strDd = `${dd}`;

    if (mm < 10) strMm = `0${mm}`;
    if (dd < 10) strDd = `0${dd}`;
    return `${yyyy}-${strMm}-${strDd}`;
  }
  return date;
};

// публичный токен - токен, который создается для доступа к конкретному звонку даже для не авторизованных пользователей.
export const getCallPublicToken = createAsyncThunk(
  'calls/getCallPublicToken',
  async (id: string, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await instance.get(`call/${id}/public_token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data;
  }
);

export const getAndSetCallStt = createAsyncThunk(
  'calls/getCallStt',
  async (payload: { id: string, bundleIndex: number }, thunkAPI) => {
    const callSttData = await thunkAPI.dispatch(getCallStt({id: payload.id}));
    // @ts-ignore
    const callStt = callSttData.payload;
    thunkAPI.dispatch(callsSlice.actions.setStt({stt: callStt, id: payload.id, index: payload.bundleIndex}));
  }
);

export const getCallStt = createAsyncThunk(
  'calls/getCallStt',
  async (payload: { id: string | any, token?: string | any }, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await instance.get(`call/${payload.id}/stt`, {
      headers: {
        'Authorization': `Bearer ${payload.token ? payload.token : token}`
      }
    });
    return data;
  }
);


export const getAndSetCallAudio = createAsyncThunk(
  'calls/getAndSetCallAudio',
  async (payload: { id: string, bundleIndex: number }, thunkAPI) => {
    const audioLinkData = await thunkAPI.dispatch(getCallAudio({id: payload.id}));
    // @ts-ignore
    const audioLink = audioLinkData.payload;
    thunkAPI.dispatch(callsSlice.actions.setAudio({audio: audioLink, id: payload.id, index: payload.bundleIndex}))
  }
);

export const getCallAudio = createAsyncThunk(
  'calls/getCallAudio',
  async (payload: { id: string | any, token?: string | any }, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await instance.get(`call/${payload.id}/audio`, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${payload.token ? payload.token : token}`,
        'Content-Type': 'audio/wav'
      }
    });
    const blob = new Blob([data], {
      type: 'audio/wav'
    });
    // ниже штука, которая в теории может помочь загружать аудио постепенно, а не дожедаться его полостью.
    // const source = new MediaSource();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }
);

export const getBaseCallsData = createAsyncThunk(
  'calls/getBaseCallsData',
  async (_, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');

      // @ts-ignore;
      const state: RootState = thunkAPI.getState();

      let startDate = convertDate(state.search.date[0]);
      let endDate = convertDate(state.search.date[1]);

      let requestParameters =
        `skip=${state.calls.skip}&limit=${state.calls.limit}` +
        `&start_date=${startDate}` +
        `&end_date=${endDate}`;

      if (!startDate && !endDate) {
        requestParameters =
          `skip=${state.calls.skip}&limit=${state.calls.limit}`
      }

      const requestData = convertDataForRequest(state.search.defaultCriterias, state.search.activeCriterias);
      const {data} = await instance.post<ResponseBaseCallsDataType>(
        `search_calls/?` +
        requestParameters,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      thunkAPI.dispatch(callsSlice.actions.incrementSkip(null));
      // @ts-ignore
      thunkAPI.dispatch(callsSlice.actions.setBaseCallsData({...data, skip: thunkAPI.getState().calls.skip}));
      // @ts-ignore
      await thunkAPI.dispatch(getCallsInfo(thunkAPI.getState().calls.calls[thunkAPI.getState().calls.calls.length - 1]));
      return data;
    } catch (error) {
      thunkAPI.dispatch(callsSlice.actions.setEmptyState({leaveBundles: 0}));
    }
  }
);

export const getCallsInfo = createAsyncThunk(
  'calls/getCallsInfo',
  async (payload: CallType[], thunkAPI) => {
    try {
      let localCalls = [];
      for (let i = 0; i < payload.length; i++) {
        const callInfoData = await thunkAPI.dispatch(getCallInfo({id: payload[i].id}));
        const callInfo = callInfoData.payload;
        localCalls.push({
          id: payload[i].id,
          info: callInfo,
          stt: null,
          audio: null
        });
      }
      thunkAPI.dispatch(callsSlice.actions.setCallsInfo(localCalls));
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCallInfo = createAsyncThunk(
  'calls/getCallInfo',
  async (payload: { id: string | any, token?: string | any }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.get(`call/${payload.id}`, {
        headers: {
          'Authorization': `Bearer ${payload.token ? payload.token : token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCallsInfoById = createAsyncThunk(
  'calls/getCallsInfoById',
  async (payload: any [], thunkAPI) => {
    try {
      let localCalls = [];
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      for (let i = 0; i < payload.length; i++) {
        const response = await instance.get(`call/${payload[i]}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        localCalls.push({
          id: payload[i],
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

export const callAction =  createAsyncThunk(
  'calls/callAction',
  async (payload: {id: string, data: CallActionDataType}, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.post(`call/${payload.id}/action`, payload.data,  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });


    } catch (error) {
      console.log(error);
    }
  }
);

type InitialStateType = {
  bundleLength: number,
  total: number | null,
  found: number | null,
  skip: number,
  limit: number,
  callIds: null,
  calls: CallType[][] | [],
  selectedCalls: string[],
  isSelectAllCalls: boolean,
  currentCall: CallType | null | false,
  callPageSearchParams: string
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
  total: null,
  found: null,
  skip: 0,
  limit: 10,
  callIds: null,
  calls: createInitialCalls(),

  selectedCalls: [],
  isSelectAllCalls: false,

  currentCall: null,
  callPageSearchParams: ""
};

export const callsSlice = createSlice({
  reducers: {
    setCallPageSearchParams(state, action: PayloadAction<string>) {
      state.callPageSearchParams = action.payload;
    },

    // selected calls actions
    pushSelectedCall(state, action: PayloadAction<string>) {
      state.selectedCalls.push(action.payload);
    },
    removeSelectedCall(state, action: PayloadAction<string>) {
      let currentSelectedCalls = [...current(state.selectedCalls)];
      const callId = currentSelectedCalls.find(id => id === action.payload);
      if (callId) {
        const callIdIndex = currentSelectedCalls.indexOf(callId);
        currentSelectedCalls.splice(callIdIndex, 1);
      }
      state.selectedCalls = currentSelectedCalls;
    },
    setSelectAllCalls(state, action: PayloadAction<boolean>) {
      state.isSelectAllCalls = action.payload;
    },

    deleteCall(state, action: PayloadAction<{id: string, bundleIndex: number | null}>) {
      if (action.payload.bundleIndex || action.payload.bundleIndex === 0) {
        let currentCalls = cloneDeep(current(state.calls[action.payload.bundleIndex]));
        const call = currentCalls.find(item => {
          if (item.info) {
            return item.info.id === action.payload.id;
          }
        })
        let callIndex = -1;
        if (call) {
          callIndex = currentCalls.indexOf(call);
        }
        if (callIndex != -1) {
          currentCalls.splice(callIndex, 1);
        }
        state.calls[action.payload.bundleIndex] = currentCalls
      }
    },

    setBaseCallsData(state, action: PayloadAction<ResponseBaseCallsDataType>) {
      let calls = [];
      for (let i = 0; i < action.payload.call_ids.length; i++) {
        calls.push({
          id: action.payload.call_ids[i],
          info: null,
          stt: null,
          audio: null
        })
      }
      state.found = action.payload.found;
      state.skip = action.payload.skip;
      state.limit = action.payload.limit;

      if (!state.total) {
        state.total = action.payload.total;
        state.calls = [calls]
      } else {
        state.total = action.payload.total;
        state.calls.slice(state.bundleLength);
        // @ts-ignore
        state.calls.push(calls);
      }

    },
    setCallsInfo(state, action: PayloadAction<any[]>) {
      if (action.payload.length < 1) {
        state.calls = []
      } else {
        state.calls[state.calls.length - 1] = action.payload;
      }
    },
    setEmptyState(state, action: PayloadAction<{ leaveBundles: number }>) {
      if (action.payload.leaveBundles === 0) {
        state.calls = [];
      } else {
        const currentCalls = current(state.calls);
        state.calls = currentCalls.slice(0, action.payload.leaveBundles);
        state.skip = 10;
      }
    },
    setInfo(state, action: PayloadAction<{info: CallInfoType | null, id: string, index: number | null}>) {
      if (action.payload.index || action.payload.index === 0) {
        state.calls[action.payload.index].map((item) => {
          if (item.info && (item.info.id === action.payload.id)) {
            debugger
            item.info = action.payload.info;
          }
        });
      }
    },
    setAudio(state, action: PayloadAction<any>) {
      state.calls[action.payload.index].map((item) => {
        if (item.info && (item.info.id === action.payload.id)) {
          item.audio = action.payload.audio
        }
      });
    },
    setStt(state, action: PayloadAction<{ stt: any, id: string, index: number | null}>) {
      if (action.payload.index || action.payload.index === 0) {
        state.calls[action.payload.index].map(i => {
          if (i.info && (i.info.id === action.payload.id)) {
            i.stt = action.payload.stt
          }
        });
      }
    },

    removeAudio(state, action: PayloadAction<{ id: string, bundleIndex: number }>) {
      if (state.calls[0]) {
        state.calls[action.payload.bundleIndex].map(i => {
          // @ts-ignore
          if (i.info.id === action.payload.id) {
            i.audio = null;
          }
        })
      }
    },
    zeroingSkip(state, action: PayloadAction<null>) {
      state.skip = 0;
    },
    incrementSkip(state, action: PayloadAction<null>) {
      state.skip += state.limit;
    },

    callsReset: () => initialState,

    // current call
    setCurrentCall(state, action: PayloadAction<CallType | null | false>) {
      state.currentCall = action.payload;
    }
  },
  name: 'calls',
  initialState
});
