import {createAsyncThunk, createSlice, PayloadAction, current} from "@reduxjs/toolkit";
import {
  ReportsType, 
  ReportItemType, 
  CallReportType, 
  CallReportItem,
  CallReportItemValues, 
  CallReportItemCols,
  CallReportItemColsValues, 
  CallReportItemRow, 
  ReportParametersType, 
  ColsGroupByParametresType, 
  SelectorsValuesParametresType,
  defaultParamType
  } from "./reports.types";
import {instance} from "../api";
import {RootState} from "../store";
import cloneDeep from "lodash.clonedeep";


export const getAllReports = createAsyncThunk(
    'reports/getAllReports',
    async (payload, thunkAPI) => {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.get(`reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);
      thunkAPI.dispatch(reportsSlice.actions.setReports(response.data));
    }
);

export const setReports = createAsyncThunk(
    'reports/setReports',
    async (payload: { report_name: string, report_type: string, rows_group_by: {}, cols_group_by: {} }, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const {data} = await instance.post(`reports`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(payload)
      return data;
    } catch(error) {
      console.log(error)
      console.log(payload)
    }
  }
);


export const getReport = createAsyncThunk(
  'reports/getReport',
  async (payload: string, thunkAPI) => {
    try{
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.get(`reports/${payload}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(payload)
      console.log(response.data)
      thunkAPI.dispatch(reportsSlice.actions.setCurrentReportItem(response.data))
      // thunkAPI.dispatch(getCallReport(response.data))
      return
    } catch(error) {
      console.log(error)
      console.log(payload)
    }
  }
)

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

const convertCriterias = (activeCriterias: any) => {
  let requestArray = [];
  // if (activeCriterias.length === 0) return []
  for (let i = 0; i < activeCriterias.length; i++) {
    if (activeCriterias[i].values.length > 0) {
      requestArray.push({key: activeCriterias[i].key, values: activeCriterias[i].values});
    }
  }
  return requestArray;
};

// here
const convertColumn = (obj: any, parameters: any) => {
  // if (parameters.length === 0) return []
  let activeReport = cloneDeep(obj);
  let local = [ ...parameters];
  if(activeReport.cols_group_by[0].group_by === 'tag') return activeReport;
  else {
    let local2 = {...activeReport.cols_group_by[0].value, search_items: local};
    activeReport.cols_group_by[0].value = local2;
    return activeReport; 
  }  
}

const convertColsGroupBy = (obj:any, parameters: any) => {
  let activeReport = {...obj};
  let local: any = [];
  // if (parameters.length === 0) {
  //   activeReport.cols_group_by = [];
  //   return activeReport;
  // }

  for (let i = 0; i < parameters.length; i++) {
    for (let j = 0; j <parameters[i].length; j++) {
      if (!parameters[i][j].select.value) {
        return
      }
      else {
        if (parameters[i][j].select.value.type === 'boolean') {
          local.push({group_by: parameters[i][j].select.value.value})
        }
        if (parameters[i][j].select.value.type === 'select-tag') {
          debugger
          local.push({group_by: parameters[i][j].select.value.value, value: parameters[i][j].tagsVal.value.value});
        }
        if (parameters[i][j].select.value.type === 'title') {
          // @ts-ignores
          local.push( {
            group_by: parameters[i][j].select.value.value,
            value: {
            // @ts-ignore
            col_name: parameters[i][j].nameColumn.value,
            search_items: [{
              // @ts-ignore
              key: parameters[i][j].op.value.value.key,
              values: parameters[i][j].opTags.values,
            }]
            }
          })
        }
      }
    }  
  }   
  let local2 = [...activeReport.cols_group_by, ...local];
  activeReport.cols_group_by = local2;
  return activeReport; 
}

const convertCallSearch = (callSearchArr: any, arr: any) => {
  const local = {...arr};
  local.call_search_items = callSearchArr;
  return local
}

export const getCallReport = createAsyncThunk(
  'make_report/calls/getCallReport',
  async (payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      // @ts-ignore;
      const state: RootState = thunkAPI.getState();
      // @ts-ignore;
      let startDate = convertDate(state.reports.date[0]);
      // @ts-ignore;
      let endDate = convertDate(state.reports.date[1]);

      const requestCriterias = convertCriterias(state.search.activeCriteriasReports);
      console.log(state.search.activeCriteriasColumn);

      const requestSearchItemsColumn = convertCriterias(state.search.activeCriteriasColumn);
      console.log(requestSearchItemsColumn);

      const requestFilters = convertColumn(state.reports.activeReport, requestSearchItemsColumn);
      const requestRowsGroupBy = convertColsGroupBy(requestFilters, state.reports.activeParameters);
      const requestData = convertCallSearch(requestCriterias, requestRowsGroupBy);
      console.log(requestData);


      // const requestCriterias = convertCriterias(state.search.activeCriteriasReports);
      // const requestRowsGroupBy = convertRowsGroupBy(state.reports.activeReport, state.reports.activeParameters);
      // const requestData = convertCallSearch(requestCriterias, requestRowsGroupBy);
      // console.log(requestData);
    
      const response = await instance.post(`reports/make/calls/?start_date=${startDate}&end_date=${endDate}`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data)
      thunkAPI.dispatch(reportsSlice.actions.setCallReport(response.data))
      return response.data
    } catch(error) {
      console.log(error)
    }
  }
)

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (payload: string, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.delete(`reports/${payload}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(payload)
      console.log(response.data)

      thunkAPI.dispatch(getAllReports())
    } catch(error) {
      console.log(error)
      console.log(payload)
    }
  }
)

export const getSelectors = createAsyncThunk(
  'reports/getSelectors',
  async (payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.get(`reports/selectors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
       
      });
      thunkAPI.dispatch(reportsSlice.actions.getSelectorsValues(response.data));

    } catch(error) {
      console.log(error)
      console.log(payload)
    }
  }
)

export const getTagNames = createAsyncThunk(
  'users/getTagNames',
  async(payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.get(`tag_names?only_with_values=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(reportsSlice.actions.setTagNames(response.data));
      return response.data;
     
      } catch(error) {
        console.log(error)
      }
    }
);


type InitialStateType = {
  allReports: ReportsType[],
  currentReport: ReportsType[],
  currentReportItem: ReportItemType,
  callReport: CallReportType,
  date: Date[] | null[],
  activeReport: ReportParametersType,
  selectors: SelectorsValuesParametresType,
  activeParameters: defaultParamType[][],
  tagNames: [] | null,
  tableRows: [],
  tableColumns: [],
}


const initialState: InitialStateType = {
  allReports: [],
  currentReport: [],

  currentReportItem: {
    report_name: '',
    report_type: '',
    rows_group_by: {},
    cols_group_by: {},
    call_search_items: [],
  },
  callReport: {
    report: {
      cols: [],
      rows: [],
      total_calls: 0,
      row_group_header: '',
      values: {
        cols: {},
        row_info: {
          row_percent_count_from_total: 0,
          row_total_calls_count: 0,
          row_total_calls_minutes: 0,
        }
      }
    },
    diff_report: {},
    report_parameters_hash: '',
  },
  date: [new Date(Date.now() -  24 * 7 * 60 * 60 * 1000), new Date(Date.now())],
  activeReport: {
    report_name: '',
    report_type: '',
    rows_group_by: {},
    cols_group_by: [],
    call_search_items: []
  },
  selectors: {
    cols_groupings : [],
    groupings_by_time: [],
    report_types: [],
    rows_groupings: [],
  },
  activeParameters: [],
  tagNames: [],

  tableRows: [],
  tableColumns: [],
}

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports(state, action: PayloadAction<[]>) {
      state.allReports = action.payload;
    },
    setCurrentReport(state, action: any) {
      state.currentReport = action.payload;
    },
    setCurrentReportItem(state, action: any) {
      state.currentReportItem = action.payload;
    },
    setCallReport(state, action: any) {
      state.callReport = action.payload;
      state.callReport.report = action.payload.report;
      state.callReport.diff_report = action.payload.diff_report;        
      state.callReport.report_parameters_hash = action.payload.report_parameters_hash;
    },
    setDate(state, action: PayloadAction<typeof initialState.date | null[]>) {
      state.date = action.payload;
    },

    setTagNames(state, action: PayloadAction<[]>) {
      state.tagNames = action.payload;
    },

    getSelectorsValues(state, action: any) {
      state.selectors = action.payload;
      state.activeReport.report_type = action.payload.report_types[0];
      state.activeReport.rows_group_by = action.payload.rows_groupings[0];
      if (action.payload.cols_groupings[0] === 'tag') {
        // ?? как тут получить значения тегов??
        state.activeReport.cols_group_by = [{group_by: action.payload.cols_groupings[0], value: '' }]
      }
      if (action.payload.rows_groupings[0] === 'time') {
        state.activeReport.rows_group_by = {group_by: action.payload.rows_groupings[0], value: action.payload.groupings_by_time[0]}
      }
    },

    // установление всех параметров отчета по порядку
    setNameReport(state, action: any) {
      state.activeReport.report_name = action.payload;
    },
    setTypeReport(state, action: any) {
      state.activeReport.report_type = action.payload;
    },
    setActiveRowsGroupBy(state, action: any) {
      state.activeReport.rows_group_by = action.payload;
    },

    // первая дефолтная группировка по столбцам
    setDefaultColsGroupBy(state, action: any) {
      if (action.payload.group_by.value === 'calls_count' || action.payload.group_by.value === 'stt_engine') {
        state.activeReport.cols_group_by[0] = {group_by: action.payload.group_by.value};
      }
    },
    // по тегу
    setDefaultColsTagGroupBy(state, action: any) {
      state.activeReport.cols_group_by[0] = {group_by: 'tag', value: action.payload.group_by.value};
    },

    // по search items
    setDefaultColsTitleGroupBy(state, action: any) {
      state.activeReport.cols_group_by[0] = {
        group_by: 'search_items', 
        // @ts-ignore
        value: {
          col_name: action.payload.col_name,
          // search_items: [ 
             // @ts-ignore
            // {
            //   key: action.payload.key,
            // }
          // ]
        }
      }
    },

    convertSearchItems(state, action: any) {
      let requestArray: any= [];

      for (let i = 0; i < action.payload.length; i++) {
        if (action.payload[i].values.length > 0) {
          requestArray.push({key: action.payload[i].key, values: action.payload[i].values});
          // @ts-ignore
          state.activeReport.cols_group_by[0].value.search_items.push({key: action.payload[i].key, values: action.payload[i].values})
        }
      }
    },

    // доп группировки по столбцам
    setActiveParameters(state, action: any) {
      let local: any  = [];
      if (!action.payload) {
        local = {};
      } else {
        local = action.payload;
      }

      let massiv = [];
      for (let i = 0; i < local.length; i++) {
        massiv.push({
          select: {
            options: local[i].select.options,
            value: local[i].select.value,
          },
          tagsVal: {
            options: local[i].tagsVal.options,
            value: local[i].tagsVal.value,
          },
          op: {
            options: local[i].op.options,
            value: local[i].op.value,
          },
          opTags: {
            values: []
          },
          nameColumn: {
            value: '',
          },

          callFilters: {
            //вид для селекта
            options: local[i].callFilters.options,
            // все в изнач виде
            values: local[i].callFilters.values,
            //активные
            activeValues: local[i].callFilters.activeValues,
          }
        })
      }
    // @ts-ignore
      state.activeParameters.push(massiv);
    },
    // выбор селекта
    setParameterSelectFieldValue(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number, value: { value: any, label: string, type: string}}>) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].select.value = action.payload.value;
    },
    //выбор тега
    setParameterTagstFieldValue(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number, value: { value: any, label: string, type: string}}>) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].tagsVal.value = action.payload.value;
    },

    //  названия столбца
    setNameColumnFieldValue(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number, value: string}>) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].nameColumn.value = action.payload.value;
    },


    // выбор фильтра тега
    setFilterFieldValue(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number, value: { value: any, label: string, type: string}}> ) {
       // @ts-ignore
       state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].op.value = action.payload.value;
    },
    // выбор тегов по фильтру
    setFilterFieldTags(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number, value: [string]}> ) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].opTags.values = action.payload.value;
    },


    setActiveCriteriaColumn(state,action: PayloadAction<{arrayIndex: number, fieldIndex: number, criteria: any}>) {
      //@ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.activeValues = action.payload.criteria;
    },
    setOptionsCriterias(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number, criteria: any}>){
      //@ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.options = action.payload.criteria;
    },
    setActiveCriteriaValuesColumn(state,action: PayloadAction<{arrayIndex: number, fieldIndex: number, criteria: any}>) {
      // @ts-ignore
      const obj = current(state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.values).find((item: any)=> {
        return item.key === action.payload.criteria.key;
      });
      // @ts-ignore
      const index = current(state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.values).indexOf(obj);
       // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters[index].activeValues = action.payload.criteria.values;
    },


    removeActiveCriteriaColumn(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number, criteria: any}>) {
       // @ts-ignore
      let activeCriteriasColumn = cloneDeep(current(state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.activeValues));
      console.log(activeCriteriasColumn)
       // @ts-ignore
      const obj = current(state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.activeValues).find((item: any) => {
        return item.key === action.payload.criteria.key
      });
      console.log(obj)
      // @ts-ignore
      const index = current(state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.activeValues).indexOf(obj);
      activeCriteriasColumn.splice(index, 1);
      console.log(index)
       // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][action.payload.fieldIndex].callFilters.activeValues = activeCriteriasColumn;
    },



    // удаление активного доп критерия
    removeParameterField(state, action: PayloadAction<{arrayIndex: number, fieldIndex: number}>) {
      state.activeParameters[action.payload.arrayIndex].splice(action.payload.fieldIndex, 1);
      if (state.activeParameters[action.payload.arrayIndex].length < 1) {
        state.activeParameters.splice(action.payload.arrayIndex, 1);
      }
    },

    setTableRows(state, action: any) {
      state.tableRows = action.payload;
    },

    setTableColumns(state, action: any) {
      state.tableColumns = action.payload;
    },
  } 
})