import { createAsyncThunk, createSlice, PayloadAction, current } from "@reduxjs/toolkit";

import {
  ReportsType,
  CallReportType,
  ReportParametersType,
  SelectorsValuesParametersType,
  defaultParamType
} from "./reports.types";
import { instance } from "../api";
import { RootState } from "../store";
import cloneDeep from "lodash.clonedeep";

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
  for (let i = 0; i < activeCriterias.length; i++) {
    if (activeCriterias[i].values.length > 0) {
      requestArray.push({key: activeCriterias[i].key, values: activeCriterias[i].values});
    }
  }
  return requestArray;
};

const convertColumn = (obj: any, parameters: any) => {
  let activeReport = cloneDeep(obj);
  let local = [ ...parameters];
  let groupByName = activeReport.cols_group_by[0].group_by;
  if(groupByName === 'tag') return activeReport;
  else if (groupByName === 'search_items') {
    let local2 = {...activeReport.cols_group_by[0].value, search_items: local};
    activeReport.cols_group_by[0].value = local2;
    return activeReport;
  } else if (groupByName === 'tag_name_list') {
    return activeReport;
  } else {
    activeReport.cols_group_by[0] = {group_by: groupByName}
    return activeReport
  }
}
const convertColsGroupBy = (obj: any, parameters: any) => {
  let activeReport = {...obj};
  let local: any = [];

  for (let i = 0; i < parameters.length; i++) {
    if (!parameters[i][0].select.value) {
      return
    }
    else {
      if (parameters[i][0].select.value.type === 'boolean') {
        local.push({group_by: parameters[i][0].select.value.value})
      }
      if (parameters[i][0].select.value.type === 'select-tag') {

        local.push({group_by: parameters[i][0].select.value.value, value: parameters[i][0].tagsVal.value.value});
      }
      if (parameters[i][0].select.value.type === 'title') {
        let searchItemsArr = [];
        for(let y = 0; y < parameters[i][0].callFilters.activeValues.length; y++) {
          searchItemsArr.push({
            key: parameters[i][0].callFilters.activeValues[y].key,
            values: parameters[i][0].callFilters.activeValues[y].values,
          })
        }
        // @ts-ignores
        local.push({
          group_by: parameters[i][0].select.value.value,
          value: {
            // @ts-ignore
            col_name: parameters[i][0].nameColumn.value,
            search_items: searchItemsArr,
          }
        })
      }
      if (parameters[i][0].select.value.type === 'input') {
        local.push({group_by: parameters[i][0].select.value.value, value: parameters[i][0].tagsNameList.value});
      }
    }
  }
  let test = activeReport.cols_group_by[0];
  let local2 = [...[test], ...local];
  //here
  activeReport.cols_group_by = local2;
  return activeReport;
}
const convertCallSearch = (callSearchArr: any, arr: any) => {
  const local = {...arr};
  local.call_search_items = callSearchArr;
  return local
}

export const getAllReports = createAsyncThunk(
  'reports/getAllReports',
  async (payload, thunkAPI) => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    const response = await instance.get(`reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    thunkAPI.dispatch(reportsSlice.actions.setReports(response.data));
  }
);

export const setReports = createAsyncThunk(
  'reports/setReports',
  async (payload, thunkAPI) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      // @ts-ignore;
      const state: RootState = thunkAPI.getState();
      const requestActiveCriterias = convertCriterias(state.search.activeCriteriasReports);
      const requestDefaultCriterias = convertCriterias(state.search.defaultCriteriasReport);

      const requestSearchItemsColumn = convertCriterias(state.search.activeCriteriasColumn);
      const requestFilters = convertColumn(state.reports.activeReport, requestSearchItemsColumn);
      const requestColsGroupBy = convertColsGroupBy(requestFilters, state.reports.activeParameters);
      const requestData = convertCallSearch([...requestActiveCriterias, ...requestDefaultCriterias], requestColsGroupBy);
      console.log(requestData);

      const response = await instance.post(`reports`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch(error) {
      console.log(error);
      thunkAPI.dispatch(reportsSlice.actions.setError('???????????????? ?? ?????????????????????? ????????????'))
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
      console.log(response.data)
      thunkAPI.dispatch(reportsSlice.actions.setActiveReport(response.data));
      return
    } catch(error) {
      console.log(error)
    }
  }
)

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
      const requestActiveCriterias = convertCriterias(state.search.activeCriteriasReports);
      const requestDefaultCriterias = convertCriterias(state.search.defaultCriteriasReport);

      const requestSearchItemsColumn = convertCriterias(state.search.activeCriteriasColumn);
      const requestFilters = convertColumn(state.reports.activeReport, requestSearchItemsColumn);
      const requestColsGroupBy = convertColsGroupBy(requestFilters, state.reports.activeParameters);
      const requestData = convertCallSearch([...requestActiveCriterias, ...requestDefaultCriterias], requestColsGroupBy);
      console.log(requestData)
      let requestParameters = `reports/make/calls/?start_date=${startDate}&end_date=${endDate}`;
      if (!startDate && !endDate) {
        requestParameters = `reports/make/calls`
      }

      const response = await instance.post(requestParameters, requestData, {
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
      thunkAPI.dispatch(getAllReports())
    } catch(error) {
      thunkAPI.dispatch(reportsSlice.actions.setError('???????????????? ?? ?????????????????? ????????????'))
      console.log(error)
    }
  }
)

export const getSelectors = createAsyncThunk(
  'reports/getSelectors',
  async (payload, thunkAPI) => {
    try {
      // @ts-ignore;
      const state: RootState = thunkAPI.getState();
      const {token} = JSON.parse(localStorage.getItem('token') || '{}');
      const response = await instance.get(`reports/selectors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      thunkAPI.dispatch(reportsSlice.actions.getSelectorsValues({selectors: response.data, tags: state.reports.tagNames}));
    } catch(error) {
      console.log(error)
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
  currentSavedReport: {value: '', label: ''},
  callReport: CallReportType,
  date: Date[] | null[],
  activeReport: ReportParametersType,
  selectors: SelectorsValuesParametersType,
  activeParameters: defaultParamType[][],
  tagNames: [],
  tableRows: [],
  tableColumns: [],
  error: string | null,
  showCharts: boolean,
}

const initialState: InitialStateType = {
  allReports: [],
  currentSavedReport: {value: '', label: ''},

  //
  callReport: {
    report: {
      cols: [{
        group_id: 0,
        col_name: '',
      }],
      rows: [],
      total_calls: 0,
      row_group_header: '',
      values: {
        any: {
          col_groups: {
            any: {
              any: {
                calls_count: 0,
                calls_minutes: 0,
                percent_calls_count_from_total: 0,
                call_ids: []
              }
            }
          },
          row_info: {
            row_sum_calls_count: 0,
            row_sum_calls_minutes: 0,
            row_percent_count_from_total: 0,
            row_total_processed_calls: {
              count: 0,
              call_ids: []
            },
          }
        },
      }
    },
    diff_report: {
      any: {
        col_groups: {
          any: {
            any: {
              calls_count: 0,
              calls_minutes: 0,
              percent_calls_count_from_total: 0,
              call_ids: []
            }
          }
        },
        row_info: {
          row_sum_calls_count: 0,
          row_sum_calls_minutes: 0,
          row_percent_count_from_total: 0,
          row_total_processed_calls: 0
        }
      },
    },
    report_parameters_hash: '',
  },

  date: [new Date(Date.now() -  24  * 60 * 60 * 1000), new Date(Date.now())],
  activeReport: {
    report_name: '',
    report_type: '',
    period: null,
    rows_group_by: {},
    cols_group_by: [{
      group_by: '',
    }],
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

  error: null,
  showCharts: true,
}

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setReports(state, action: PayloadAction<[]>) {
      state.allReports = action.payload;
    },
    setActiveReport(state, action: any) {
      state.activeReport = action.payload;
    },
    setCurrentSavedReport(state, action: any) {
      state.currentSavedReport = action.payload;
    },
    setInitialSavedReport(state, action: any) {
      state.currentSavedReport = initialState.currentSavedReport;
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
    setPeriod(state, action: any) {
      state.activeReport.period = action.payload;
    },

    setTagNames(state, action: PayloadAction<[]>) {
      state.tagNames = action.payload;
    },

    getSelectorsValues(state, action: any) {
      state.selectors = action.payload.selectors;
      state.activeReport.report_type = action.payload.selectors.report_types[0];
      state.activeReport.rows_group_by = action.payload.selectors.rows_groupings[0];
      if (action.payload.selectors.cols_groupings[0] === 'tag') {
        state.activeReport.cols_group_by = [{group_by: action.payload.selectors.cols_groupings[0], value: action.payload.tags[0]}];
      }
      if (action.payload.selectors.rows_groupings[0] === 'time') {
        state.activeReport.rows_group_by = {group_by: action.payload.selectors.rows_groupings[0], value: action.payload.selectors.groupings_by_time[0]};
      }
    },

    // ???????????????????????? ???????? ???????????????????? ????????????
    setNameReport(state, action: any) {
      state.activeReport.report_name = action.payload;
    },
    setTypeReport(state, action: any) {
      state.activeReport.report_type = action.payload;
    },
    setActiveRowsGroupBy(state, action: any) {
      state.activeReport.rows_group_by = action.payload;
    },

    // ???????????? ?????????????????? ?????????????????????? ???? ????????????????
    setDefaultColsGroupBy(state, action: any) {
      if (action.payload.group_by === 'tag_name_list') {
        state.activeReport.cols_group_by[0] = {group_by: action.payload.group_by, value: [] };
      } else {
        state.activeReport.cols_group_by[0] = { group_by: action.payload.group_by.value };
      }
    },
    // ???? ????????
    setDefaultColsTagGroupBy(state, action: any) {
      if (action.payload.value) {
        state.activeReport.cols_group_by[0] = {group_by: 'tag', value: action.payload.value.value};
      }
    },

    setDefaultColsTagsValue(state, action: any) {
      state.activeReport.cols_group_by[0].value = action.payload.value.value;
    },

    // ???? search items
    setDefaultColsTitleGroupBy(state, action: any) {
      state.activeReport.cols_group_by[0] = {
        group_by: 'search_items',
        // @ts-ignore
        value: {
          col_name: action.payload.col_name,
        }
      }
    },


    setDefaultColTagsName(state, action: any) {
      state.activeReport.cols_group_by[0].value = action.payload;
    },

    // ?????? ?????????????????????? ???? ????????????????
    setActiveParameters(state, action: any) {
      let local: any  = [];
      if (!action.payload) local = {};
      else local = action.payload;
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
          tagsNameList: {
            options: local[i].tagsNameList.options,
            value: local[i].tagsNameList.value,
          },

          callFilters: {
            //?????? ?????? ??????????????
            options: local[i].callFilters.options,
            // ?????? ?? ?????????? ????????
            values: local[i].callFilters.values,
            //????????????????
            activeValues: local[i].callFilters.activeValues,
          }
        })
      }
      // @ts-ignore
      state.activeParameters.push(massiv);
    },
    // ?????????? ??????????????
    setParameterSelectFieldValue(state, action: PayloadAction<{arrayIndex: number, value: { value: any, label: string, type: string}}>) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].select.value = action.payload.value;
    },
    //?????????? ????????
    setParameterTagstFieldValue(state, action: PayloadAction<{arrayIndex: number,  value: { value: any, label: string}}>) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].tagsVal.value = action.payload.value;
    },

    //  ???????????????? ??????????????
    setNameColumnFieldValue(state, action: PayloadAction<{arrayIndex: number, value: string}>) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].nameColumn.value = action.payload.value;
    },

    // ?????????? ?????????????? ????????
    setFilterFieldValue(state, action: PayloadAction<{arrayIndex: number, value: { value: any, label: string, type: string}}> ) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].op.value = action.payload.value;
    },
    // ?????????? ?????????? ???? ??????????????
    setFilterFieldTags(state, action: PayloadAction<{arrayIndex: number,  value: [string]}> ) {
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].opTags.values = action.payload.value;
    },

    setActiveCriteriaColumn(state,action: PayloadAction<{arrayIndex: number, criteria: any}>) {
      //@ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues = action.payload.criteria;
    },
    setOptionsCriterias(state, action: PayloadAction<{arrayIndex: number, criteria: any}>){
      //@ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].callFilters.options = action.payload.criteria;
    },

    //
    setActiveColTagsName(state, action: any) {
      state.activeParameters[action.payload.arrayIndex][0].tagsNameList.value = action.payload.value;
    },

    setActiveCriteriaValuesColumn(state,action: PayloadAction<{arrayIndex: number,  criteria: any}>) {
      // @ts-ignore
      const obj = current(state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues).find((item: any)=> {
        return item.key === action.payload.criteria.key;
      });
      // @ts-ignore
      const index = current(state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues).indexOf(obj);
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues[index].values = action.payload.criteria.values;
    },

    removeActiveCriteriaColumn(state, action: PayloadAction<{arrayIndex: number, criteria: any}>) {
      // @ts-ignore
      let activeCriteriasColumn = cloneDeep(current(state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues));
      // @ts-ignore
      const obj = current(state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues).find((item: any) => {
        return item.key === action.payload.criteria.key
      });
      // @ts-ignore
      const index = current(state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues).indexOf(obj);
      activeCriteriasColumn.splice(index, 1);
      // @ts-ignore
      state.activeParameters[action.payload.arrayIndex][0].callFilters.activeValues = activeCriteriasColumn;
    },

    // ???????????????? ?????????????????? ?????? ????????????????
    removeParameterField(state, action: PayloadAction<{arrayIndex: number}>) {
      state.activeParameters.splice(action.payload.arrayIndex, 1);
    },

    removeAllActiveParameters(state, action: PayloadAction<null>) {
      state.activeParameters = [];
    },

    removeAll(state, action: any) {
      state.callReport = initialState.callReport
    },

    setTableRows(state, action: any) {
      state.tableRows = action.payload;
    },
    setTableColumns(state, action: any) {
      state.tableColumns = action.payload;
    },

    removeTableColumnsRows(state, action: any) {
      state.tableRows = initialState.tableRows;
      state.tableColumns = initialState.tableColumns;
    },

    setShowCharts(state, action: any) {
      state.showCharts = action.payload;
    },

    removeShowChart(state, action: any) {
      state.showCharts = initialState.showCharts;
    },

    resetReportParameters: () => initialState
  }
})