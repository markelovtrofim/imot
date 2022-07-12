export type ReportsType = {
  id: string,
  name: string,
}
export type ReportItemType =  {
  report_name: string,
  report_type: string,
  rows_group_by: {},
  cols_group_by: {},
  call_search_items?: [] | null
}

export type CallReportType = {
  report: CallReportItem,
  diff_report: {},
  report_parameters_hash: string,
}
export type CallReportItem = {
  cols: [],
  rows: [],
  total_calls: number,
  row_group_header: string,
  values: {},
}
export type CallReportItemValues = {
  cols: {},
  row_info: {},
}

export type CallReportItemCols = {
}
export type CallReportItemColsValues = {
  calls_count: number,
  calls_total_minutes: number,
  percent_count_from_total: number,
  call_ids: [] | null
}
export type CallReportItemRow = {
  row_percent_count_from_total: number,
  row_total_calls_count: number,
  row_total_calls_minutes: number,
}


export type ReportParametersType = {
  report_name: string,
  report_type: string,
  period: string | null,
  rows_group_by: {},
  cols_group_by: ColsGroupByParametresType[],
  call_search_items: [],
}
export type ColsGroupByParametresType = {
  group_by: string,
  value?: null | string | {
    col_name: string,
    search_items: [{
      key: string,
      values: []
    }]
  }
}

export type SelectorsValuesParametresType = {
  cols_groupings : [],
  groupings_by_time: [],
  report_types: [],
  rows_groupings: [],
}


export type defaultParamType = {
  select: {
    options: [],
    value: {
      value: string,
      label: string,
      type?: string
    }
  },
  tagsVal: {
    options: [],
    value: {
      value: string,
      label: string,
      type?: string
    }
  },
  op: {
    options: [],
    value: {
      value: string,
      label: string,
      type?: string
    }
  },
  opTags: {
    values: []
  },
  nameColumn: {
    value: string,
  },
  callFilters: {
    options: [],
    values: any,
    activeValues: [],
  },
}