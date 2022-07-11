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
  diff_report:  { [key: string]: CallReportItemValues },
  report_parameters_hash: string,
}
export type CallReportItem = {
  cols: [],
  rows: [],
  total_calls: number,
  row_group_header: string,
  values: { [key: string]: CallReportItemValues },
}
export type CallReportItemValues = {
  cols: { [key: string]: CallReportItemCols },
  row_info: CallReportItemRow,
}
export type CallReportItemCols = {
  calls_count: number,
  calls_minutes: number,
  percent_count_from_total: number,
  percent_calls_count_from_total: number,
  call_ids: []
}
export type CallReportItemRow = {
  row_sum_calls_count: number,
  row_sum_calls_minutes: number,
  row_percent_count_from_total: number,
  row_total_processed_calls_count: number,
}

export type ReportParametersType = {
  report_name: string,
  report_type: string,
  rows_group_by: {},
  cols_group_by: ColsGroupByParametersType[],
  call_search_items: [],
}
export type ColsGroupByParametersType = {
  group_by: string,
  value?: string | {
    col_name: string,
    search_items: [{
      key: string,
      values: []
    }]
  }
}

export type SelectorsValuesParametersType = {
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