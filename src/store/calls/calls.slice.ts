import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {
  CallActionDataType,
  CallIncompleteType,
  CallInfoType,
  CallInitialStateType,
  CallsActionDataType,
  CallType,
  SelectedCallType,
  ResponseBaseCallsDataType,
  DictionaryPopupType, CallSttType
} from "./calls.types";
import {RootState} from "../store";
import {instance} from "../api";
import cloneDeep from "lodash.clonedeep";

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


export const getAllUserDicts = createAsyncThunk(
  'dicts/getAllUserDicts',
  async (thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await instance.get(`/dicts/?show_disabled=false&only_local=false`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': `application/json`,
      }
    });
    // @ts-ignore
    // await thunkAPI.dispatch(callsSlice.actions.setAllUserDicts({allUserDicts: data}));
    console.log("DICTS", data);
    return data;
  }
);
export const getAllWordInDictionary = createAsyncThunk(
  'dicts/getAllWordInDictionary',
  async (payload: { id: string }) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await instance.get(`/dict/${payload.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': `application/json`,
      }
    });
    return data;
  }
);
export const updateDict = createAsyncThunk(
  'dicts/updateDictPhrases',
  async (payload: { dictId: string, phrases: any[] }) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      console.log(payload);
      const sendData = {
        phrases: payload.phrases
      }
      // @ts-ignore
      const response = await instance.put<string>(`/dict/${payload.dictId}`, JSON.stringify(sendData), {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log(response);
      console.log(payload);
    } catch (error) {
      console.log(error);
    }
  }
)


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

export const getBaseCallsData = createAsyncThunk(
  'calls/getBaseCallsData',
  async (payload: { sort?: string }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');

      // @ts-ignore;
      const state: RootState = thunkAPI.getState();

      let startDate = convertDate(state.search.date[0]);
      let endDate = convertDate(state.search.date[1]);

      let requestParameters =
        `skip=${state.calls.skip}&limit=${state.calls.limit}` +
        `&start_date=${startDate}` +
        `&end_date=${endDate}` +
        `&sort=${payload.sort ? (payload.sort !== "date" ? payload.sort : "") : ""}`;

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
      const callsIncomplete = thunkAPI.getState().calls.callsIncomplete;
      await thunkAPI.dispatch(getCallsInfo(callsIncomplete.slice(callsIncomplete.length - 10)));
      return data;
    } catch (error) {
      // thunkAPI.dispatch(callsSlice.actions.setEmptyState({leaveBundles: 0}));
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
          expanded: false
        });
      }
      await thunkAPI.dispatch(callsSlice.actions.setCallsInfo(localCalls));
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCallsInfoById = createAsyncThunk(
  'calls/getCallsInfoById',
  async (payload: any[], thunkAPI) => {
    try {
      let localCalls = [];
      const { token } = JSON.parse(localStorage.getItem('token') || '{}');
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

export const getCallStt = createAsyncThunk(
  'calls/getCallStt',
  async (payload: { id: string | any, token?: string | any }, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const {data} = await instance.get(`call/${payload.id}/stt`, {
      headers: {
        'Authorization': `Bearer ${payload.token ? payload.token : token}`
      }
    });
    thunkAPI.dispatch(callsSlice.actions.setStt(data));
    return data;
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
    // ниже штука, которая в теории может помочь загружать аудио постепенно, а не дожедаться его полностью.
    // const source = new MediaSource();
    const blobUrl = URL.createObjectURL(blob);
    thunkAPI.dispatch(callsSlice.actions.setAudio(blobUrl));
    return blobUrl;
  }
);

// export const getAndSetCallInfo = createAsyncThunk(
//   'calls/getAndSetCallInfo',
//   async (payload: { id: string, bundleIndex: number | null }, thunkAPI) => {
//     if (payload.bundleIndex || payload.bundleIndex === 0) {
//       const infoData = await thunkAPI.dispatch(getCallInfo({id: payload.id}));
//       // @ts-ignore
//       const info = infoData.payload;
//       thunkAPI.dispatch(callsSlice.actions.setInfo({info: info, id: payload.id, index: payload.bundleIndex}));
//     }
//   }
// );

// export const getCallsInfoById = createAsyncThunk(
//   'calls/getCallsInfoById',
//   async (payload: any[], thunkAPI) => {
//     try {
//       let localCalls = [];
//       const {token} = JSON.parse(localStorage.getItem('token') || '{}');
//       for (let i = 0; i < payload.length; i++) {
//         const response = await instance.get(`call/${payload[i]}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         localCalls.push({
//           id: payload[i],
//           info: response.data,
//           stt: null,
//           audio: null
//         })
//       }
//       thunkAPI.dispatch(callsSlice.actions.setCallsInfo(localCalls));
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

export const callAction = createAsyncThunk(
  'calls/callAction',
  async (payload: { id: string, data: CallActionDataType }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.post(`call/${payload.id}/action`, payload.data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteCall = createAsyncThunk(
  'calls/deleteCall',
  async (id: string, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.delete(`call/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const callsAction = createAsyncThunk(
  'calls/callsAction',
  async (payload: CallsActionDataType, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.post(`calls/action`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getActionFiles = createAsyncThunk(
  'calls/getActionFiles',
  async (payload: { taskId: string, action: string }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const res = await instance.get(`/task/${payload.taskId}/attachment`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer'
      });
      const contentType = (payload.action === "audio_archive" && 'application/zip') || (payload.action === "stt_export" && "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || "";
      let blob = new Blob([res.data], {type: contentType});
      const downloadUrl = URL.createObjectURL(blob)
      let a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "whileJustFile";
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      console.log(error);
    }
  }
)


export const getTask = createAsyncThunk(
  'calls/getTask',
  async (taskId: string, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await instance.get(`/task/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
)

const createInitialCalls = (lengthEmptyArray: number = 10) => {
  let output = [];
  for (let i = 0; i < lengthEmptyArray; i++) {
    output.push({
      id: null,
      info: null,
      expanded: false
    });
  }
  return output;
};

const initialState: CallInitialStateType = {
  total: null,
  found: null,
  sort: "date",
  skip: 0,
  limit: 10,
  callIds: null,
  callsIncomplete: [],
  currentCall: null,
  selectedCalls: [],
  expandedId: "",
  callPageSearchParams: "",

  popupVisible: false,
  popupPosition: {
    top: 0,
    left: 0,
  },
  allUserDicts: [],
};

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    // actions on calls
    setBaseCallsData(state, action: PayloadAction<ResponseBaseCallsDataType>) {
      // @ts-ignore
      let callsIncomplete: CallIncompleteType[] = [...current(state.callsIncomplete)];
      let selectedCalls: SelectedCallType[] = [];
      for (let i = 0; i < action.payload.call_ids.length; i++) {
        callsIncomplete.push({
          id: action.payload.call_ids[i],
          info: null,
          expanded: false
        });
        selectedCalls.push({callId: action.payload.call_ids[i]});
      }
      state.found = action.payload.found;
      state.skip = action.payload.skip;
      state.limit = action.payload.limit;

      state.total = action.payload.total;
      state.callsIncomplete = [...callsIncomplete];
      state.selectedCalls = [...state.selectedCalls, ...selectedCalls];
    },

    deleteCall(state, action: PayloadAction<{ id: string }>) {
      let currentCalls: CallIncompleteType[] = cloneDeep(current(state.callsIncomplete));
      let call: CallIncompleteType | undefined = currentCalls.find((item: CallIncompleteType) => {
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
      state.currentCall = null;
      state.callsIncomplete = currentCalls
    },

    setCalls(state, action: PayloadAction<CallIncompleteType[]>) {
      state.callsIncomplete = action.payload;
    },

    setCurrentCall(state, action: PayloadAction<CallType | null | false>) {
      state.currentCall = action.payload;
    },

    setCallsInfo(state, action: PayloadAction<any[]>) {
      let callsIncomplete = [...current(state.callsIncomplete)];
      callsIncomplete.splice(state.callsIncomplete.length - 10, 10);
      action.payload.forEach(call => callsIncomplete.push(call));
      state.callsIncomplete = [...callsIncomplete];
    },

    setEmptyCalls(state, action: PayloadAction<{ leaveBundles: number }>) {
      if (action.payload.leaveBundles === 0) {
        state.callsIncomplete = [];
      } else {
        const currentCalls = current(state.callsIncomplete);
        state.callsIncomplete = currentCalls.slice(0, action.payload.leaveBundles);
        state.skip = 10;
      }
    },

    setInfo(state, action: PayloadAction<CallInfoType>) {
      if (state.currentCall) {
        state.currentCall.info = action.payload;
      }
    },

    setAudio(state, action: PayloadAction<string>) {
      if (state.currentCall) {
        state.currentCall.audio = action.payload;
      }
    },

    removeAudio(state, action: PayloadAction<null>) {
      if (state.currentCall) {
        state.currentCall.audio = null;
      }
    },

    setStt(state, action: PayloadAction<CallSttType | null>) {
      if (state.currentCall) {
        state.currentCall.stt = action.payload;
      }
    },

    zeroingSkip(state, action: PayloadAction<null>) {
      state.skip = 0;
    },

    incrementSkip(state, action: PayloadAction<null>) {
      state.skip += state.limit;
    },


    // expanded
    setExpanded(state, action: PayloadAction<{ id: string, value: boolean }>) {
      if (action.payload.id) {
        const callsIncomplete = cloneDeep(current(state.callsIncomplete));
        const currentCall = callsIncomplete.find(call => call.id === action.payload.id.toUpperCase());
        // @ts-ignore
        const currentCallIndex = callsIncomplete.indexOf(currentCall);
        state.expandedId = action.payload.id;
        if (currentCallIndex != -1) {
          state.callsIncomplete[currentCallIndex].expanded = action.payload.value;
        }
      }
    },

    // sorting
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },


    // popup
    setDictionaryPopupParams(state, action: PayloadAction<DictionaryPopupType>) {
      state.popupVisible = action.payload.popupVisible;
      state.popupPosition = action.payload.popupPosition;
    },

    setAllUserDicts(state, action: any) {
      state.allUserDicts = action.payload.allUserDicts;
    },


    // actions on selected calls
    pushSelectedCall(state, action: PayloadAction<SelectedCallType>) {
      state.selectedCalls.push(action.payload);
    },

    removeSelectedCall(state, action: PayloadAction<SelectedCallType>) {
      let currentSelectedCalls = [...current(state.selectedCalls)]
      const callId = currentSelectedCalls.find(selectedCall => selectedCall.callId === action.payload.callId.toUpperCase());
      debugger
      if (callId) {
        const callIdIndex = currentSelectedCalls.indexOf(callId);
        currentSelectedCalls.splice(callIdIndex, 1);
      }
      state.selectedCalls = currentSelectedCalls;
    },

    removeSelectedCalls(state, action: PayloadAction<null>) {
      state.selectedCalls.length = 0;
    },


    // page search params
    setCallPageSearchParams(state, action: PayloadAction<string>) {
      state.callPageSearchParams = action.payload;
    },


    // reset
    callsReset: () => initialState,
  },
});