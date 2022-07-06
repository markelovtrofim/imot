import React, { FC, memo, useEffect, useState, useRef } from 'react';
import { getAllReports, getReport, setReports, getCallReport, deleteReport, getSelectors, getTagNames } from "../../store/reports/reports.slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { RootState } from '../../store/store';
import { BlockBox, СontrolBlock } from "../../components/common";
import { DataGrid, GridColDef, GridRowsProp, MuiEvent } from '@mui/x-data-grid';
import { optionsCreator, optionsCreatorVEL, optionsCreatorWithName, optionsCreatorWithKey } from '../../utils/optionsCreator';
import { Typography } from '@mui/material';
import { reportsSlice } from '../../store/reports/reports.slice';
import { LoadingButton } from '@mui/lab';
import ContainedSelect from '../../components/common/Selects/ContainedSelect';
import { translate } from "../../localizations";
import { CallType } from '../../store/calls/calls.types';
import { CriteriasType } from '../../store/search/search.types';
import CallStubMiddleware from '../Calls/Call';
import { getCallsInfoById, callsSlice } from '../../store/calls/calls.slice';
import CallsHeader from '../Calls/CallsHeader';
import CriteriasList from '../../components/common/Criterias/CriteriasList';
import TextSelect from '../../components/common/Selects/TextSelect/TextSelect';
import { getAllSearchCriterias, getDefaultCriterias, searchSlice } from "../../store/search/search.slice"
import Input from "../../components/common/Input";
import Box from '@mui/material/Box';
import Plus from '../../components/common/Buttons/Plus';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import cloneDeep from "lodash.clonedeep";
import { reportsStyles } from './Reports.jss';
import Dialog from "@mui/material/Dialog";
import CircularProgress from '@mui/material/CircularProgress';
import { ExportIcon, OnTopArrow, OnBottomArrow, TrashSvg } from "./Reports.svg";

const Reports = React.memo(() => {
  const classes = reportsStyles();
  const dispatch = useDispatch();
  const { language } = useAppSelector((state: RootState) => state.lang);
  const isAuth = useAppSelector(state => state.auth.isAuth);
  //reports
  const allReports = useAppSelector(state => state.reports.allReports);
  const savedReportsOptions = optionsCreatorWithName(allReports);
  const currentSavedReport = useAppSelector(state => state.reports.currentSavedReport);
  const callReport = useAppSelector(state => state.reports.callReport);
  const totalCalls = useAppSelector(state => state.reports.callReport.report.total_calls);

  //calls
  const calls = useAppSelector<CallType[][]>(state => state.calls.calls);
  const [foundCalls, setFoundCalls] = React.useState<string | number>(0);
  const [callsSwitch, setCallSwitch] = useState(false);

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleExpandedChange = (panel: string | false) => {
    setExpanded(panel);
  };

  //criterias
  const activeCriteriasReports = useAppSelector(state => state.search.activeCriteriasReports);
  const defaultCriterias = useAppSelector(state => state.search.defaultCriterias);
  const allCriterias = useAppSelector(state => state.search.allCriterias);
  const allCriteriasColumn = useAppSelector(state => state.search.allCriterias);
  const activeCriteriasColumn = useAppSelector(state => state.search.activeCriteriasColumn);
  const activeParameters = useAppSelector(state => state.reports.activeParameters);

  const [visibleParameters, setVisibleParameters] = React.useState(false);
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    if (isAuth && activeCriteriasReports.length < 1) {
      dispatch(getDefaultCriterias());
    }
    dispatch(getAllReports());
    func();
    funcForTag();
    funcForCriterias();
    setLoading(false);
  }, []);

  const func = async () => {
    await dispatch(getSelectors());
  }
  const funcForTag = async () => {
    await dispatch(getTagNames());
  }
  const funcForCriterias = async () => {
    await dispatch(getAllSearchCriterias());
  }

  const handleOptionsTypeReports = (options: any) => {
    let local: { value: any, label: string }[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i] === 'calls') {
        local.push({ value: options[i], label: `${translate('reportTypeCalls', language)}` });
      }
    }
    return local;
  }
  const handleOptionsTypeReportsObj = (options: any) => {
    let local = {};
    if (options === 'calls') {
      local = { value: options.group_by, label: `${translate('reportTypeCalls', language)}` };
    }
    return local;
  }

  //to do: переделать
  const handleOptionsReportsSelect = (options: any) => {
    let local: { value: any, label: string, type?: string }[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i] === 'time') {
        local.push({ value: options[i], label: `${translate('reportGroupByRowTime', language)}`, type: 'select' });
      } else if (options[i] === 'search_items') {
        local.push({ value: options[i], label: `${translate('reportGroupByRowSearchItems', language)}`, type: 'title' });
      } else if (options[i] === 'tag') {
        local.push({ value: options[i], label: `${translate('reportGroupByRowTag', language)}`, type: 'select-tag' });
      } else if (options[i] === 'tag_list') {
        // new
        local.push({ value: options[i], label: `${translate('reportGroupByRowTagList', language)}`, type: 'input' });
      } else if (options[i] === 'operator_phone') {
        local.push({ value: options[i], label: `${translate('reportGroupByRowOperatorPhone', language)}`, type: 'boolean' });
      } else if (options[i] === 'client_phone') {
        local.push({ value: options[i], label: `${translate('reportGroupByRowClientPhone', language)}`, type: 'boolean' });
      } else if (options[i] === 'calls_count') {
        local.push({ value: options[i], label: `${translate('reportGroupByRowCallsCount', language)}`, type: 'boolean' });
      } else if (options[i] === 'stt_engine') {
        local.push({ value: options[i], label: `${translate('reportGroupByRowSttEngine', language)}`, type: 'boolean' });
      } else if (options[i] === 'hour') {
        local.push({ value: options[i], label: `${translate('reportGroupByTimeHour', language)}` });
      } else if (options[i] === 'day') {
        local.push({ value: options[i], label: `${translate('reportGroupByTimeDay', language)}` });
      } else if (options[i] === 'week') {
        local.push({ value: options[i], label: `${translate('reportGroupByTimeWeek', language)}` });
      } else {
        local.push({ value: options[i], label: `${translate('reportGroupByTimeMonth', language)}` });
      }
    }
    return local;
  }
  const handleOptionsReportsSelectObj = (options: any) => {
    let local = {};
    if (options.group_by === 'time') {
      local = { value: options.group_by, label: `${translate('reportGroupByRowTime', language)}`, type: 'select' };
    } else if (options.group_by === 'search_items') {
      local = { value: options.group_by, label: `${translate('reportGroupByRowSearchItems', language)}`, type: 'title' };
    } else if (options.group_by === 'tag') {
      local = { value: options.group_by, label: `${translate('reportGroupByRowTag', language)}`, type: 'select-tag' };
    } else if (options.group_by === 'tag_list') {
      // new
      local = { value: options.group_by, label: `${translate('reportGroupByRowTagList', language)}`, type: 'input' };
    } else if (options.group_by === 'operator_phone') {
      local = { value: options.group_by, label: `${translate('reportGroupByRowOperatorPhone', language)}`, type: 'boolean' };
    } else if (options.group_by === 'client_phone') {
      local = { value: options.group_by, label: `${translate('reportGroupByRowClientPhone', language)}`, type: 'boolean' };
    } else if (options.group_by === 'calls_count') {
      local = { value: options.group_by, label: `${translate('reportGroupByRowCallsCount', language)}`, type: 'boolean' };
    } else if (options.group_by === 'stt_engine') {
      local = { value: options.group_by, label: `${translate('reportGroupByRowSttEngine', language)}`, type: 'boolean' };
    } else if (options.group_by === 'hour') {
      local = { value: options.group_by, label: `${translate('reportGroupByTimeHour', language)}` };
    } else if (options.group_by === 'day') {
      local = { value: options.group_by, label: `${translate('reportGroupByTimeDay', language)}` };
    } else if (options.group_by === 'week') {
      local = { value: options.group_by, label: `${translate('reportGroupByTimeWeek', language)}` };
    } else {
      local = { value: options.group_by, label: `${translate('reportGroupByTimeMonth', language)}` };
    }
    return local;
  }


  const handleMoreSelectClick = (allCriteriasArr: CriteriasType[] | null, activeCriterias: CriteriasType[] | null) => {
    if (allCriteriasArr) {
      let local: { value: {}, label: string, icon?: string }[] = [];
      allCriteriasArr.forEach((item, i) => {
        local.push({ value: allCriteriasArr[i], label: allCriteriasArr[i].title });
      })
      for (let i = 0; i < local.length; i++) {
        //@ts-ignore
        if (activeCriterias.find((item) => item.key === local[i].value.key)) {
          local[i].icon = 'minus';
        } else {
          local[i].icon = 'plus';
        }
      }
      return local
    }
  }

  function onAllCriteriasSelectValueChange(event: any) {
    let index = -1;
    for (let i in activeCriteriasReports) {
      if (event.value.key === activeCriteriasReports[i].key) {
        index = parseInt(i, 10);
        dispatch(searchSlice.actions.removeActiveCriteriaReports(activeCriteriasReports[index]));
        break
      }
    }
    if (index < 0) {
      dispatch(searchSlice.actions.setActiveCriteriasReports([...activeCriteriasReports, { ...event.value, values: [] }]));
    }
  }

  function onAllCriteriasColumnSelectValueChange(event: any) {
    let index = -1;
    for (let i in activeCriteriasColumn) {
      if (event.value.key === activeCriteriasColumn[i].key) {
        index = parseInt(i, 10);
        dispatch(searchSlice.actions.removeActiveCriteriaColumnReports(activeCriteriasColumn[index]));
        break
      }
    }
    if (index < 0) {
      dispatch(searchSlice.actions.setActiveCriteriaReportsColumn([...activeCriteriasColumn, { ...event.value, values: [] }]));
    }
  }

  function onAllCriteriasColumnSelectValueChangeTEST(event: any, arrayIndex: number, activeCriterias: CriteriasType[], allCriteriasArr: CriteriasType[], allOptions: any) {
    let index = -1;
    for (let i in activeCriterias) {
      if (event.value.key === activeCriterias[i].key) {
        index = parseInt(i, 10);
        dispatch(reportsSlice.actions.removeActiveCriteriaColumn({ criteria: activeCriterias[index], arrayIndex: arrayIndex }));

        const activeCriteriasArr = cloneDeep(activeCriterias);
        activeCriteriasArr.splice(index, 1);

        const local2 = handleMoreSelectClick(allCriteriasArr, [...activeCriteriasArr]);
        const allOptions = local2;
        dispatch(reportsSlice.actions.setOptionsCriterias({ arrayIndex: arrayIndex, criteria: allOptions }));
        break
      }
    }
    if (index < 0) {
      dispatch(reportsSlice.actions.setActiveCriteriaColumn({ criteria: [...activeCriterias, { ...event.value, values: [] }], arrayIndex: arrayIndex }));
      const local2 = handleMoreSelectClick(allCriteriasArr, [...activeCriterias, { ...event.value, values: [] }]);
      const allOptions = local2;
      dispatch(reportsSlice.actions.setOptionsCriterias({ arrayIndex: arrayIndex, criteria: allOptions }));
    }

  }

  const activeReport = useAppSelector(state => state.reports.activeReport);
  const groupByColumns = useAppSelector(state => state.reports.activeReport.cols_group_by);

  // selectors values
  const selectorsValues = useAppSelector(state => state.reports.selectors);

  //название отчета
  const reportName = useAppSelector(state => state.reports.activeReport.report_name);

  // тип отчета
  const typeReportOptions = handleOptionsTypeReports(selectorsValues.report_types);
  const typeReport = useAppSelector(state => state.reports.activeReport.report_type);
  const typeReportValue = handleOptionsTypeReportsObj(typeReport);

  // по строкам
  const groupByRowsReportOptions = handleOptionsReportsSelect(selectorsValues.rows_groupings);
  const groupByRows = useAppSelector(state => state.reports.activeReport.rows_group_by);
  let groupByRowsValue: any = {};
  if (groupByRows) {
    groupByRowsValue = handleOptionsReportsSelectObj(groupByRows);
  }

  // по времени
  const timeColumnsReportOptions = handleOptionsReportsSelect(selectorsValues.groupings_by_time);
  const [timeColumnsReportValue, setTimeColumnsReportValue] = useState(timeColumnsReportOptions[0]);

  // tag names
  const tagNames = useAppSelector(state => state.reports.tagNames);
  const tagNamesOptions = optionsCreatorVEL(tagNames);
  let tagNamesValue = { value: '', label: '' };
  //@ts-ignore
  if (groupByRows.group_by === 'tag') {
    //@ts-ignore
    tagNamesValue = { label: groupByRows.value, value: groupByRows.value };
  } else {
    tagNamesValue = tagNamesOptions[0];
  }

  const tagNamesColOptions = optionsCreatorVEL(tagNames);
  //@ts-ignore
  let tagNameColFrom = useAppSelector(state => state.reports.activeReport.cols_group_by[0]);
  let tagNamesColValue: any = {};
  if (groupByColumns.length != 0 && groupByColumns[0].group_by === 'tag' && groupByColumns[0].value) {
    tagNamesColValue = { label: tagNameColFrom.value, value: tagNameColFrom.value };
  } else {
    tagNamesColValue = tagNamesOptions[0];
  }

  const [op, setOp] = useState<any>([]);
  useEffect(() => {
    setOp(handleMoreSelectClick(allCriterias, activeCriteriasReports));
  }, [allCriterias, activeCriteriasReports, defaultCriterias]);

  const [opCriteriasColumn, setOpCriteriasColumn] = useState<any>([]);
  useEffect(() => {
    setOpCriteriasColumn(handleMoreSelectClick(allCriteriasColumn, activeCriteriasColumn));
  }, [allCriteriasColumn, activeCriteriasColumn]);

  const [opAddCriterias, setOpAddCriterias] = useState(op);
  useEffect(() => {
    if (allCriterias) {
      setOpAddCriterias(handleMoreSelectClick(allCriterias, []));
    }
  }, [allCriterias])

  // по столбцам
  const groupByColumnsReportOptions = handleOptionsReportsSelect(selectorsValues.cols_groupings);
  let groupByColumnsValue: any = {};
  if (groupByColumns.length != 0) {
    groupByColumnsValue = handleOptionsReportsSelectObj(groupByColumns[0]);
  }

  //call search items
  const callSearchItems = useAppSelector(state => state.reports.activeReport.call_search_items);
  useEffect(() => {
    if (callSearchItems.length != 0) {
      let handleArray: any = [];
      for (let i = 0; i < callSearchItems.length; i++) {
        //@ts-ignore
        let handleArrayItem = allCriterias.find((item) => callSearchItems[i].key === item.key);
        handleArray.push(handleArrayItem);
      }
      let activeSearchItems = cloneDeep(handleArray);
      for (let i = 0; i < activeSearchItems.length; i++) {
        //@ts-ignore
        activeSearchItems[i].values = callSearchItems[i].values;
      }
      dispatch(searchSlice.actions.setActiveCriteriasReports(activeSearchItems));
    }
  }, [callSearchItems])

  useEffect(() => {
    if (timeColumnsReportOptions.length != 0) setTimeColumnsReportValue(timeColumnsReportOptions[0]);
  }, [selectorsValues])

  //название деф столбца
  //@ts-ignore
  const colsGroupDefault = useAppSelector(state => state.reports.activeReport.cols_group_by[0]);
  let reportNameColumnDefault = '';
  if (colsGroupDefault) {
    if (colsGroupDefault.value) {
      //@ts-ignore
      reportNameColumnDefault = colsGroupDefault.value.col_name;
    }
    if (!reportNameColumnDefault) reportNameColumnDefault = '';
  }

  //checkbox diff values in table
  const [checkboxValue, setCheckBoxValue] = useState(false);
  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxValue(event.target.checked);
  }
  //checkbox show values in table
  const [checkboxCalls, setCheckboxCalls] = useState(true);
  const handleChangeCheckCalls = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxCalls(event.target.checked);
  }
  const [checkboxMinutes, setCheckboxMinutes] = useState(true);
  const handleChangeCheckMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxMinutes(event.target.checked);
  }
  const [checkboxPercent, setCheckboxPercent] = useState(true);
  const handleChangeCheckPercent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxPercent(event.target.checked);
  }
  const tableRows = useAppSelector(state => state.reports.tableRows);
  const tableColumns = useAppSelector(state => state.reports.tableColumns);
  const rowGroupHeaderTitle = useAppSelector(state => state.reports.callReport.report.row_group_header);

  //to do: oптимизировать функции ниже
  //for table

  const columnsTable = function () {
    const columnsArray: any[] = [{
      field: 'idName',
      headerName: `${rowGroupHeaderTitle}`,
      minWidth: 160,
      height: 75,
      minHeight: 100,
      flex: 1.5,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'light-header--theme',
    }];
    callReport.report.cols.forEach((item, index) => {
      if (checkboxCalls) {
        columnsArray.push({
          field: `calls_count_${index}`,
          headerName: `Звонки`,
          minWidth: 150,
          height: 75,
          minHeight: 100,
          flex: 1,
          editable: false,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'light-header--theme',
          cellClassName: 'cell-active',
          renderHeader: () => (
            <div className={classes.tableHeaderTitle}>
              <div className={classes.tableHeaderSubTitle}>{item}</div>
              <div className={classes.tableHeaderSubSubTitle}>{'Звонки'}</div>
            </div>
          )
        })
      }

      if (checkboxMinutes) {
        columnsArray.push({
          field: `calls_minutes_${index}`,
          headerName: `Минуты`,
          minWidth: 150,
          height: 75,
          minHeight: 100,
          flex: 1,
          editable: false,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'light-header--theme',
          content: 'minuts',
          renderHeader: () => (
            <div className={classes.tableHeaderTitle}>
              <div className={classes.tableHeaderSubTitle}>{item}</div>
              <div className={classes.tableHeaderSubSubTitle}>{'Минуты'}</div>
            </div>
          )
        })
      }

      if (checkboxPercent) {
        columnsArray.push({
          field: `percent_calls_count_from_total_${index}`,
          headerName: `%`,
          minWidth: 150,
          height: 75,
          minHeight: 100,
          flex: 1,
          editable: false,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'light-header--theme',
          content: 'percent',
          renderHeader: () => (
            <div className={classes.tableHeaderTitle}>
              <div className={classes.tableHeaderSubTitle}>{item}</div>
              <div className={classes.tableHeaderSubSubTitle}>{'%'}</div>
            </div>
          )
        })
      }

    })
    if (checkboxCalls) {
      columnsArray.push({
        field: 'row_sum_calls_count',
        headerName: 'Сумма звонков',
        minWidth: 150,
        height: 75,
        minHeight: 100,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'light-header--theme',
        cellClassName: 'cell-active',
        renderHeader: () => (
          <div className={classes.tableHeaderTitle}>
            <div className={classes.tableHeaderSubTitle}>{'Всего'}</div>
            <div className={classes.tableHeaderSubSubTitle}>{'Сумма звонков'}</div>
          </div>
        )
      })
    }
    if (checkboxMinutes) {
      columnsArray.push({
        field: 'row_sum_calls_minutes',
        headerName: 'Кол-во минут',
        minWidth: 150,
        height: 75,
        minHeight: 100,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'light-header--theme',
        cellClassName: 'dataCell-hover',
        content: 'minuts',
        renderHeader: () => (
          <div className={classes.tableHeaderTitle}>
            <div className={classes.tableHeaderSubTitle}>{'Всего'}</div>
            <div className={classes.tableHeaderSubSubTitle}>{'Кол-во минут'}</div>
          </div>
        )
      })
    }

    if (checkboxPercent) {
      columnsArray.push({
        field: 'row_percent_count_from_total',
        headerName: '%',
        minWidth: 150,
        height: 75,
        minHeight: 100,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'light-header--theme',
        content: 'percent',
        renderHeader: () => (
          <div className={classes.tableHeaderTitle}>
            <div className={classes.tableHeaderSubTitle}>{'Всего'}</div>
            <div className={classes.tableHeaderSubSubTitle}>{'%'}</div>
          </div>
        )
      })
    }
    if (checkboxCalls) {
      columnsArray.push({
        field: 'row_total_processed_calls_count',
        headerName: 'Кол-во всего звонков',
        minWidth: 150,
        height: 75,
        minHeight: 100,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'light-header--theme',
        content: 'percent',
        renderHeader: () => (
          <div className={classes.tableHeaderTitle}>
            <div className={classes.tableHeaderSubTitle}>{'Всего'}</div>
            <div className={classes.tableHeaderSubSubTitle}>{'Кол-во всего звонков'}</div>
          </div>
        )
      })
    }

    return columnsArray
  }
  const columns: GridColDef[] = columnsTable();
  const rowsTable = () => {
    const result: any[] = [];
    const columnsArray: any[] = columnsTable();
    let resultIds: any[] = [];

    callReport.report.rows.forEach((itemRow, indexRow) => {
      //создаем первую id строку
      result.push({});
      result[indexRow].id = indexRow;
      result[indexRow][columnsArray[0].field] = itemRow;

      //создаем пустой массив для callIds
      result[indexRow]['callIds'] = {};

      //количество звонков/ минут/ %
      callReport.report.cols.forEach((itemCol, indexCol) => {
        // @ts-ignore
        result[indexRow][`calls_count_${indexCol}`] = callReport.report.values[itemRow].cols[itemCol].calls_count;
        // @ts-ignore
        result[indexRow][`calls_minutes_${indexCol}`] = callReport.report.values[itemRow].cols[itemCol].calls_minutes;
        // @ts-ignorer
        result[indexRow][`percent_calls_count_from_total_${indexCol}`] = `${callReport.report.values[itemRow].cols[itemCol].percent_calls_count_from_total}%`;

        if (checkboxValue) {
          // @ts-ignore
          const diffValue = callReport.diff_report[itemRow].cols[itemCol].calls_count;
          let diffAdd = '';
          if (diffValue > 0) {
            diffAdd = ` (+${diffValue})`;
          } else {
            diffAdd = ` (${diffValue})`;
          }
          // @ts-ignore
          result[indexRow][`calls_count_${indexCol}`] += diffAdd;

          // @ts-ignore
          const diffValueMinutes = callReport.diff_report[itemRow].cols[itemCol].calls_minutes;
          let diffAddMinutes = '';
          if (diffValueMinutes > 0) {
            diffAddMinutes = ` (+${diffValueMinutes})`;
          } else {
            diffAddMinutes = ` (${diffValueMinutes})`;
          }
          // @ts-ignore
          result[indexRow][`calls_minutes_${indexCol}`] += diffAddMinutes;

          // @ts-ignore
          const diffValuePercent = callReport.diff_report[itemRow].cols[itemCol].percent_calls_count_from_total;
          let diffAddPercent = '';
          if (diffValuePercent > 0) {
            diffAddPercent = ` (+${diffValuePercent}%)`;
          } else {
            diffAddPercent = ` (${diffValuePercent}%)`;
          }
          // @ts-ignore
          result[indexRow][`percent_calls_count_from_total_${indexCol}`] += diffAddPercent;
        }

        // @ts-ignore
        result[indexRow]['callIds'][`calls_count_${indexCol}`] = callReport.report.values[itemRow].cols[itemCol].call_ids;
        //массив ids
        // @ts-ignore
        resultIds.push(...callReport.report.values[itemRow].cols[itemCol].call_ids);
      })
      //общее время по строке
      // @ts-ignore
      result[indexRow]['row_sum_calls_count'] = callReport.report.values[itemRow].row_info.row_sum_calls_count;
      // @ts-ignore
      result[indexRow]['row_sum_calls_minutes'] = callReport.report.values[itemRow].row_info.row_sum_calls_minutes;
      // @ts-ignore
      result[indexRow]['row_percent_count_from_total'] = `${callReport.report.values[itemRow].row_info.row_percent_count_from_total}%`;
      // @ts-ignore
      result[indexRow]['row_total_processed_calls_count'] = callReport.report.values[itemRow].row_info.row_total_processed_calls_count;

      if (checkboxValue) {
        // @ts-ignore
        const diffValue = callReport.diff_report[itemRow].row_info.row_sum_calls_count;
        let diffAdd = '';
        if (diffValue > 0) {
          diffAdd = ` (+${diffValue})`;
        } else {
          diffAdd = ` (${diffValue})`;
        }
        // @ts-ignore
        result[indexRow][`row_sum_calls_count`] += diffAdd;

        // @ts-ignore
        const diffValueMinutes = callReport.diff_report[itemRow].row_info.row_sum_calls_minutes;
        let diffAddMinutes = '';
        if (diffValueMinutes > 0) {
          diffAddMinutes = ` (+${diffValueMinutes})`;
        } else {
          diffAddMinutes = ` (${diffValueMinutes})`;
        }
        // @ts-ignore
        result[indexRow][`row_sum_calls_minutes`] += diffAddMinutes;

        // @ts-ignore
        const diffValuePercent = callReport.diff_report[itemRow].row_info.row_percent_count_from_total;
        let diffAddPercent = '';
        if (diffValuePercent > 0) {
          diffAddPercent = ` (+${diffValuePercent}%)`;
        } else {
          diffAddPercent = ` (${diffValuePercent}%)`;
        }
        // @ts-ignore
        result[indexRow][`row_percent_count_from_total`] += diffAddPercent;

        // @ts-ignore
        const diffValueCount = callReport.diff_report[itemRow].row_info.row_total_processed_calls_count;
        let diffAddCount = '';
        if (diffValueCount > 0) {
          diffAddCount = ` (+${diffValueCount}%)`;
        } else {
          diffAddCount = ` (${diffValueCount}%)`;
        }
        // @ts-ignore
        result[indexRow][`row_total_processed_calls_count`] += diffAddCount;
      }
      //массив ids
      // @ts-ignore
      result[indexRow]['callIds']['row_sum_calls_count'] = resultIds;
      resultIds = [];
    })
    return result;
  }
  const rows: GridRowsProp = rowsTable();

  useEffect(() => {
    dispatch(reportsSlice.actions.setTableRows(rows));
    dispatch(reportsSlice.actions.setTableColumns(columns));

  }, [callReport, checkboxValue, checkboxCalls, checkboxMinutes, checkboxPercent])

  const getCallParameters = async (event: any) => {
    setLoading(true);
    //обнуление параметров
    dispatch(searchSlice.actions.removeAllActiveCriteriasReports(null));
    dispatch(searchSlice.actions.removeAllActiveCriteriasColumnReports(null));
    dispatch(reportsSlice.actions.removeAllActiveParameters(null));
    await dispatch(reportsSlice.actions.setCurrentSavedReport(event));
    await dispatch(getReport(event.value));
    await dispatch(getCallReport());
    hideVisibleParameters();
    setLoading(false);
  }

  //отображение доп группировки по столбцам из сохраненных отчетов - to do:  переделать это
  useEffect(() => {
    if (groupByColumns.length > 0) {
      if (groupByColumns[0].group_by === 'search_items') {
        const test = [];
        //@ts-ignore
        if (groupByColumns[0].value.search_items) {
          //@ts-ignore
          for (let i = 0; i < groupByColumns[0].value.search_items.length; i++) {
            //@ts-ignore
            const groupColumnsItem = groupByColumns[0].value.search_items[i]
            //@ts-ignore
            test.push(allCriterias.filter((item) => item.key === groupColumnsItem.key))
            //@ts-ignore
            dispatch(searchSlice.actions.setActiveCriteriaReportsColumn(allCriterias.filter((item) => item.key === groupColumnsItem.key)))
            dispatch(searchSlice.actions.setActiveCriteriaReportsColumnValues({ key: groupColumnsItem.key, values: [...groupColumnsItem.values] }));
          }
        }
      }
    }

    if (groupByColumns.length > 1) {
      //доп группировки
      for (let i = 1; i < groupByColumns.length; i++) {
        dispatch(reportsSlice.actions.setActiveParameters([{
          select: { options: groupByColumnsReportOptions, value: handleOptionsReportsSelectObj(groupByColumns[i]) },
          tagsVal: { options: tagNamesColOptions, value: tagNamesColValue },
          op: { options: opAddCriterias, value: '' },
          callFilters: { options: opAddCriterias, values: allCriterias, activeValues: [] }
        }]))
        if (groupByColumns[i].group_by === 'tag') {
          dispatch(reportsSlice.actions.setParameterTagstFieldValue({
            arrayIndex: i - 1,
            //@ts-ignore
            value: { value: groupByColumns[i].value, label: groupByColumns[i].value }
          }))
        } else if (groupByColumns[i].group_by === 'search_items') {
          dispatch(reportsSlice.actions.setNameColumnFieldValue({
            arrayIndex: i - 1,
            //@ts-ignore
            value: groupByColumns[i].value.col_name
          }))
          let activeColsCriterias = [];
          //@ts-ignore
          for (let j = 0; j < groupByColumns[i].value.search_items.length; j++) {
            //@ts-ignore
            const searchItem = groupByColumns[i].value.search_items[j];
            //@ts-ignore
            activeColsCriterias.push(allCriterias.filter((item) => item.key === searchItem.key));

            let activeSearchItems = cloneDeep(activeColsCriterias);
            for (let y = 0; y < activeSearchItems.length; y++) {
              activeSearchItems[j][y].values = searchItem.values
            }
            dispatch(reportsSlice.actions.setActiveCriteriaColumn({
              arrayIndex: i - 1,
              criteria: activeSearchItems[j]
            }))
            dispatch(reportsSlice.actions.setOptionsCriterias({
              arrayIndex: i - 1,
              criteria: handleMoreSelectClick(allCriterias, activeSearchItems[j])
            }))
          }
        }
      }
    }
  }, [groupByColumns, activeReport])

  //построение отчета
  const formReport = async () => {
    setLoading(true);
    await dispatch(getCallReport());
    await setLoading(false);
    hideVisibleParameters();
  }

  const [validateInputItem, setValidateInputItem] = useState(false);
  // сохранение отчета
  const saveReportAsync = async () => {
    if (reportName === '') {
      setValidateInputItem(true);
    }
    else {
      setValidateInputItem(false);
      await dispatch(setReports());
      //to do: snackbar
      await dispatch(getAllReports());
      await dispatch(reportsSlice.actions.setCurrentSavedReport({ value: reportName, label: reportName }));
    }
  }
  // удаление отчета
  const deleteReportAsync = async () => {
    await dispatch(deleteReport(currentSavedReport.value));
    await dispatch(getAllReports());
    await dispatch(reportsSlice.actions.setInitialSavedReport(''));
    await handleClose();
    //to do: snackbar
  }

  const getCalls = async (callIds: any[]) => {
    if (callIds.length != 0) {
      dispatch(callsSlice.actions.callsReset());
      await dispatch(getCallsInfoById(callIds));
      setCallSwitch(true);
      setFoundCalls(callIds.length);
    } else setCallSwitch(false);
  }

  const hideVisibleParameters = () => {
    setVisibleParameters(false);
  }
  const showVisibleParameters = () => {
    setVisibleParameters(true);
  }

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  }
  const handleOpen = () => {
    setIsOpen(true);
  }

  //высота таблицы
  const [heightTable, setHeightTable] = useState('1200px');
  const gridWrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridDiv = gridWrapperRef.current;
    if (gridDiv != undefined || gridDiv != null && columns.length > 0 || rows.length > 0) {
      if (gridDiv) {
        const gridEl: HTMLDivElement = gridDiv.querySelector('.MuiDataGrid-root')!;
        const gridElHeader: HTMLDivElement = gridDiv.querySelector('.MuiDataGrid-columnHeaders')!;
        const gridElHeaderInner: HTMLDivElement = gridDiv.querySelector('.MuiDataGrid-columnHeadersInner')!;
        if (gridEl) {
          setHeightTable(`${gridEl.clientHeight}px`);
        }
        if (gridElHeader && gridElHeaderInner) {
          const height = gridElHeaderInner.clientHeight
          gridElHeader.style.minHeight = `${gridElHeaderInner.clientHeight}px`;
          gridElHeader.style.maxHeight = `${gridElHeaderInner.clientHeight}px`;
          gridElHeader.style.lineHeight = `${gridElHeaderInner.clientHeight}px`;
        }
      }
    }
  }, [tableColumns, tableRows, isLoading, activeReport]);

  return (
    <div>
      <СontrolBlock switchEntity={'reports'} />
      <div>
        <div className={classes.reportButtonsGroup}>
          <div className={classes.reportButtonsGroupLeft}>
            <LoadingButton
              className={visibleParameters ? classes.reportOptionsButtonActive : classes.reportOptionsButton}
              color="primary"
              variant="text"
              endIcon={visibleParameters ? <OnTopArrow style={{ margin: '0 7px 0 5px' }} /> : <OnBottomArrow style={{ margin: '0 7px 0 5px' }} />}
              onClick={() => {
                visibleParameters ? hideVisibleParameters() : showVisibleParameters()
              }}
            >
              {translate('reportOptions', language)}
            </LoadingButton>
            <LoadingButton
              className={classes.getReportsButton}
              color="primary"
              variant="contained"
              onClick={formReport}
            >
              {translate('makeReport', language)}
            </LoadingButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ marginRight: '20px', whiteSpace: 'nowrap' }}>{translate('savedReports', language)}:</Typography>
            <div style={{ display: 'flex' }}>
              <ContainedSelect
                height={'38px'}
                width={'265px'}
                marginRight={'0px'}
                justify={'center'}
                onSelectChange={(event) => {
                  getCallParameters(event);
                }}
                options={savedReportsOptions}
                value={currentSavedReport}
              />
            </div>
          </div>
        </div>
      </div>
      {visibleParameters ?
        <BlockBox padding="16px">
          {/* звонки */}
          <div className={classes.filtersBlock}>
            <div className={classes.searchTitle}>
              <div className={classes.searchTitleLeft}>
                <Typography className={classes.searchTitleLeftText} variant="h6">
                  {translate('reportOptions', language)}
                </Typography>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
              <div style={{ width: '100%' }}>
                {/* название */}
                <div className={classes.parameterBlock}>
                  <div className={classes.flexCenter}>
                    <Typography className={classes.parameterItemTitle}>{translate('reportTitle', language)}</Typography>
                    <div style={{ width: '265px' }} className={validateInputItem ? classes.errorInput : classes.reportName}>
                      <span>
                        <Typography className={classes.errorTitle}>{translate('reportTitleMes', language)}</Typography>
                      </span>
                      <Input
                        name={"report_name"}
                        type={"text"}
                        bcColor={"#FFFFFF"}
                        height={'38px'}
                        border={'1px solid #E3E8EF'}
                        label={""}
                        value={reportName}
                        handleChange={(event: any) => {
                          dispatch(reportsSlice.actions.setNameReport(event.target.value))
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* тип отчета */}
                <div className={classes.parameterBlock}>
                  <div className={classes.flexCenter}>
                    <Typography className={classes.parameterItemTitle}>{translate('reportType', language)}</Typography>
                    <ContainedSelect
                      height={'38px'}
                      width={'265px'}
                      justify={'center'}
                      onSelectChange={
                        (event) => {
                          dispatch(reportsSlice.actions.setTypeReport(event.value));
                        }}
                      options={typeReportOptions}
                      value={typeReportValue}
                    />
                  </div>
                </div>

                {/* по строкам */}
                <div className={classes.parameterBlock}>
                  <div className={classes.flexCenter}>
                    <Typography className={classes.parameterItemTitle}>{translate('reportGroupByRow', language)}</Typography>
                    <ContainedSelect
                      height={'38px'}
                      width={'265px'}
                      justify={'flex-end'}
                      onSelectChange={(event) => {
                        if (event.type === 'select-tag') {
                          dispatch(reportsSlice.actions.setActiveRowsGroupBy({ group_by: event.value, value: tagNamesValue.value }));
                        } else if (event.type === 'select') {
                          dispatch(reportsSlice.actions.setActiveRowsGroupBy({ group_by: event.value, value: timeColumnsReportValue.value }));
                        }
                        else {
                          dispatch(reportsSlice.actions.setActiveRowsGroupBy({ group_by: event.value, value: null }));
                        }
                      }}
                      options={groupByRowsReportOptions}
                      value={groupByRowsValue}
                    />
                  </div>
                  {/* по тегу */}
                  {groupByRowsValue && groupByRowsValue.type === 'select-tag' ?
                    <div style={{ width: '265px' }}>
                      <ContainedSelect
                        height={'38px'}
                        width={'265px'}
                        justify={'flex-end'}
                        onSelectChange={(event) => {
                          dispatch(reportsSlice.actions.setActiveRowsGroupBy({ group_by: groupByRowsValue.value, value: event.value }))
                        }}
                        options={tagNamesOptions}
                        value={tagNamesValue}
                      />
                    </div>
                    : <></>
                  }

                  {/* по времени */}
                  {groupByRowsValue && groupByRowsValue.type === 'select' ?
                    <div style={{ width: '265px' }}>
                      <ContainedSelect
                        height={'38px'}
                        width={'265px'}
                        justify={'flex-end'}
                        onSelectChange={(event) => {
                          setTimeColumnsReportValue(event);
                          dispatch(reportsSlice.actions.setActiveRowsGroupBy({ group_by: groupByRowsValue.value, value: event.value }));
                        }
                        }
                        options={timeColumnsReportOptions}
                        value={timeColumnsReportValue}
                      />
                    </div>
                    : <></>
                  }
                </div>

                {/* по столбцам */}
                <div className={classes.parameterBlock}>
                  <div className={classes.parameterBlock}>

                    {/* типо дефолтный */}
                    <div style={{ display: 'inline-flex', color: '#2F3747' }}>
                      <div className={classes.flexCenter}>
                        <Typography className={classes.parameterItemTitle}>{translate('reportGroupByColumns', language)}</Typography>
                        <ContainedSelect
                          height={'38px'}
                          width={'265px'}
                          justify={'flex-end'}
                          onSelectChange={(event) => {
                            if (event.type === 'select-tag') {
                              dispatch(reportsSlice.actions.setDefaultColsTagGroupBy({ group_by: tagNamesColValue }))
                            }
                            else if (event.type === 'title') {
                              dispatch(reportsSlice.actions.setDefaultColsTitleGroupBy({ col_name: reportNameColumnDefault }))
                            }
                            else {
                              dispatch(reportsSlice.actions.setDefaultColsGroupBy({ group_by: event }))
                            }
                          }}
                          options={groupByColumnsReportOptions}
                          value={groupByColumnsValue}
                        />
                      </div>
                    </div>
                    {groupByColumnsValue && groupByColumnsValue.type === 'title' ?
                      <>
                        <div style={{ display: 'inline-flex' }}>
                          <div style={{ marginRight: '20px', minWidth: '265px', width: '265px' }}>
                            <Input
                              name={""}
                              type={"text"}
                              height={'38px'}
                              bcColor={"#FFFFFF"}
                              border={'1px solid #E3E8EF'}
                              label={`${translate('reportColumnHeading', language)}`}
                              value={reportNameColumnDefault}
                              handleChange={(event: any) => {
                                dispatch(reportsSlice.actions.setDefaultColsTitleGroupBy({ col_name: event.target.value }));
                              }}
                            />
                          </div>
                        </div>

                        <div className={classes.parameterSelect}>
                          <TextSelect
                            name={'moreSelect'}
                            value={null}
                            handleValueChange={onAllCriteriasColumnSelectValueChange}
                            options={opCriteriasColumn}
                            iconPosition={'left'}
                            customControl={
                              <div className={classes.filterBlockControl}>
                                <Typography className={classes.filterBlockTitle}>{translate('searchMore', language)}</Typography>
                              </div>
                            }
                            ifArrowColor={'#722ED1'}
                            notClose={true}
                            menuPosition={'right'}
                            height={"400px"}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '177px', marginTop: '16px' }}>
                          {activeCriteriasColumn.length > 0 ?
                            <div className={classes.filterBlockFlex}>
                              <CriteriasList
                                allCriterias={allCriteriasColumn}
                                activeCriterias={activeCriteriasColumn}
                                block={"reports-column"}
                              />
                            </div>
                            : <></>
                          }
                        </div>
                      </>
                      : <></>
                    }
                    {groupByColumnsValue && groupByColumnsValue.type === 'select-tag' ?
                      <div style={{ display: 'inline-flex', width: '265px' }}>
                        <ContainedSelect
                          height={'38px'}
                          width={'265px'}
                          justify={'flex-end'}
                          onSelectChange={(event) => {
                            dispatch(reportsSlice.actions.setDefaultColsTagGroupBy({ group_by: event }))
                          }}
                          options={tagNamesColOptions}
                          value={tagNamesColValue}
                        />
                      </div>
                      :
                      <></>
                    }
                    {groupByColumnsValue && groupByColumnsValue.type === 'input' ?
                      <div style={{ display: 'inline-flex', width: '265px' }}>
                        {/*<SearchSelect*/}

                        {/*/>*/}
                      </div>
                      :
                      <></>
                    }
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ minWidth: '155px' }}>
                      <Plus
                        handleClick={() => {
                          dispatch(reportsSlice.actions.setActiveParameters([{
                            select: { options: groupByColumnsReportOptions, value: groupByColumnsValue },
                            tagsVal: { options: tagNamesColOptions, value: tagNamesColValue },
                            op: { options: opAddCriterias, value: opAddCriterias[0] },
                            callFilters: { options: opAddCriterias, values: allCriterias, activeValues: [] }
                          }]))
                        }}
                      />
                    </div>

                    {/* новые фильтры */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {activeParameters.map((item) => {
                        const arrayIndex = activeParameters.indexOf(item);
                        return (
                          <div style={{ width: '100%', display: 'flex', justifyContent: ' flex-start', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                              <div style={{ height: '16px', minWidth: '18px', marginRight: '5px' }}>
                                <TrashSvg
                                  style={{ width: '100%', height: 'auto' }}
                                  onClick={() => {
                                    dispatch(reportsSlice.actions.removeParameterField({
                                      arrayIndex: arrayIndex,
                                    }));
                                  }}
                                />
                              </div>

                              <div style={{ display: 'flex' }}>
                                <ContainedSelect
                                  height={'38px'}
                                  width={'265px'}
                                  justify={'center'}
                                  onSelectChange={(event: any) => {
                                    dispatch(reportsSlice.actions.setParameterSelectFieldValue({
                                      arrayIndex: arrayIndex,
                                      value: event
                                    }))
                                  }}
                                  options={item[0].select.options}
                                  value={item[0].select.value}
                                />
                              </div>
                              {item[0].select.value && item[0].select.value.type === 'title' ?
                                <>
                                  <div style={{ display: 'inline-flex' }}>
                                    <div style={{ marginRight: '20px', minWidth: '265px', width: '265px' }}>
                                      <Input
                                        name={""}
                                        type={"text"}
                                        height={'38px'}
                                        bcColor={"#FFFFFF"}
                                        border={'1px solid #E3E8EF'}
                                        label={`${translate('reportColumnHeading', language)}`}
                                        value={item[0].nameColumn.value}
                                        handleChange={(event: any) => {
                                          dispatch(reportsSlice.actions.setNameColumnFieldValue({
                                            arrayIndex: arrayIndex,
                                            value: event.target.value
                                          }))
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className={classes.parameterSelect}>
                                    <TextSelect
                                      name={'moreSelect'}
                                      value={null}
                                      handleValueChange={(event: any) => {
                                        onAllCriteriasColumnSelectValueChangeTEST(
                                          event,
                                          arrayIndex,
                                          item[0].callFilters.activeValues,
                                          item[0].callFilters.values,
                                          item[0].callFilters.options
                                        )
                                      }}
                                      options={item[0].callFilters.options}
                                      iconPosition={'left'}
                                      customControl={
                                        <div className={classes.filterBlockControl}>
                                          <Typography className={classes.filterBlockTitle}>{translate('searchMore', language)}</Typography>
                                        </div>
                                      }
                                      ifArrowColor={'#722ED1'}
                                      notClose={true}
                                      menuPosition={'right'}
                                      height={"400px"}
                                    />
                                  </div>
                                  {item[0].callFilters.activeValues.length > 0 ?
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '24px', marginTop: '8px' }}>
                                      <div className={classes.filterBlockFlex}>
                                        <CriteriasList
                                          allCriterias={item[0].callFilters.values}
                                          activeCriterias={item[0].callFilters.activeValues}
                                          index={{ arrayIndex: arrayIndex }}
                                        />
                                      </div>
                                    </div>
                                    : <></>
                                  }
                                </>
                                : <></>
                              }

                              {item[0].select.value && item[0].select.value.type === 'select-tag' ?
                                <div style={{ display: 'inline-flex', width: '265px' }}>
                                  <ContainedSelect
                                    height={'38px'}
                                    width={'265px'}
                                    justify={'flex-end'}
                                    onSelectChange={(event) => {
                                      dispatch(reportsSlice.actions.setParameterTagstFieldValue({
                                        arrayIndex: arrayIndex,
                                        value: event
                                      }))
                                    }
                                    }
                                    options={item[0].tagsVal.options}
                                    value={item[0].tagsVal.value}
                                  />
                                </div>
                                :
                                <></>
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* фильтры звонков */}
          <div>
            <div className={classes.filtersBlock}>
              <div className={classes.filterBlockWrapper}>
                <div className={classes.searchTitleLeft}>
                  <Typography className={classes.searchTitleLeftText} variant="h6">
                    {translate('reportCallFilters', language)}
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ margin: '0 5px 0 20px', whiteSpace: 'nowrap' }}>
                      <TextSelect
                        name={'moreSelect'}
                        value={null}
                        handleValueChange={onAllCriteriasSelectValueChange}
                        options={op}
                        iconPosition={'left'}
                        customControl={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography className={classes.filterBlockTitle}>{translate('searchMore', language)}</Typography>
                          </div>
                        }
                        ifArrowColor={'#722ED1'}
                        notClose={true}
                        menuPosition={'right'}
                        height={"400px"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={classes.criteriaList}>
                <CriteriasList
                  allCriterias={allCriterias}
                  activeCriterias={activeCriteriasReports}
                  block={"reports"}
                />
              </div>
            </div>
          </div>

          <Dialog
            open={isOpen}
            onClose={handleClose}
          >
            <div className={classes.deleteModal}>
              <Typography style={{ fontWeight: '600' }}>{translate('reportDeleteMes', language)}</Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  onClick={handleClose}
                >
                  {translate('cancelButton', language)}
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={deleteReportAsync}
                >
                  {translate('deleteButton', language)}
                </LoadingButton>
              </div>
            </div>
          </Dialog>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {currentSavedReport.value ?
              <LoadingButton
                className={classes.getReportsButton}
                color="error"
                variant="outlined"
                onClick={handleOpen}
              >
                {translate('reportDeleteReport', language)}
              </LoadingButton>
              : <></>
            }
            <LoadingButton
              className={classes.getReportsButton}
              color="primary"
              variant="outlined"
              onClick={saveReportAsync}
            >
              {translate('reportSaveReport', language)}
            </LoadingButton>
          </div>
        </BlockBox>
        : null
      }

      {isLoading ?
        <Box sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '14% 0'
        }}
        >
          <CircularProgress />
        </Box>
        :
        <>
          {callReport.report_parameters_hash ?
            <>
              {totalCalls === 0 ?
                <div className={classes.notFoundCalls}>{translate('reportNotFind', language)}</div>
                :
                <div style={{ marginBottom: '60px' }}>
                  <div className={classes.reportItemInfo}>
                    <div className={classes.flexCenterMb}>
                      <LoadingButton
                        className={classes.reportOptionsButton}
                        color="primary"
                        variant="text"
                        loadingPosition="start"
                        startIcon={<ExportIcon />}
                      >
                        {translate('reportExport', language)}
                      </LoadingButton>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography className={classes.reportTitle} variant="h6">
                          {reportName}
                        </Typography>
                        <FormGroup className={classes.checkboxDiff}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={handleChangeCheck}
                                checked={checkboxValue}
                              />}
                            label={`${translate('reportDiff', language)}`}
                          />
                        </FormGroup>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className={classes.reportFindNumber}>
                        {translate('reportCallFind', language)}: &nbsp;
                        {totalCalls}
                      </div>
                      <FormGroup className={classes.checkboxDiffValues}>
                        <FormControlLabel
                          className={classes.checkboxDiffLabel}
                          control={
                            <Checkbox
                              onChange={handleChangeCheckCalls}
                              checked={checkboxCalls}
                            />}
                          label={`${translate('reportCalls', language)}`}
                        />
                        <FormControlLabel
                          className={classes.checkboxDiffLabel}
                          control={
                            <Checkbox
                              onChange={handleChangeCheckMinutes}
                              checked={checkboxMinutes}
                            />}
                          label={`${translate('reportMinutes', language)}`}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={handleChangeCheckPercent}
                              checked={checkboxPercent}
                            />}
                          label={`${translate('reportPercent', language)}`}
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div className={classes.table}>
                    <div style={{ display: 'flex', height: '100%' }}>
                      <div style={{ flexGrow: 1, background: '#fff', height: heightTable }}>
                        <Box
                          sx={{
                            height: 60,
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                            '& .light-header--theme .MuiDataGrid-columnHeaderTitle': {
                              color: '#738094',
                              fontWeight: 600,
                              padding: '0 5px',
                              lineHeight: 1.3,
                            },
                            '& .MuiDataGrid-root': {
                              backgroundColor: '#fff',
                            },
                            '& .MuiDataGrid-cell': {
                              color: '#2F3747',
                              maxHeight: 'none !important',
                              overflow: 'auto',
                              whiteSpace: 'initial !important',
                              lineHeight: '16px !important',
                              display: 'flex !important',
                              alignItems: 'center',
                              paddingTop: '5px !important',
                              paddingBottom: '5px !important',
                              textAlign: 'center',
                              fontSize: '12px !important',
                            },
                            '.MuiDataGrid-columnSeparator': {
                              display: 'none',
                            },
                            '&.MuiDataGrid-root': {
                              border: 'none',
                            },
                            '& .cell-active': {
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: '#531DAB',
                              fontWeight: '600',
                            },
                            '& .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortIcon': {
                              opacity: '0.5 !important'
                            },
                            // костыль для скрытия пагинации
                            '& .MuiDataGrid-footerContainer': {
                              display: 'none !important'
                            },
                            "& .MuiDataGrid-root .MuiDataGrid-columnHeader .MuiDataGrid-iconButtonContainer": {
                              visibility: "visible",
                              width: 'auto',
                              alignSelf: 'flex-end',
                              marginBottom: '-3px'
                            },
                            '& .MuiDataGrid-columnHeader:nth-of-type(3n + 1) .MuiDataGrid-columnSeparator svg': {
                              // fontSize: '2rem !important',
                              color: 'rgba(115, 128, 148, 0.7) !important'
                            },
                            "& .MuiDataGrid-root .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortIcon": {
                              opacity: 0.5
                            },
                            '& .MuiDataGrid-iconButtonContainer': {
                              '& button': {
                                padding: '1px',
                                '& svg': {
                                  fontSize: '1.1rem',
                                  padding: '1px'
                                }
                              }
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer': {
                              overflow: 'hidden !important',
                              padding: '7px 5px !important'
                            },
                            '& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, ': {
                              outline: 'none !important',
                            },
                            '& .MuiDataGrid-viewport, & .MuiDataGrid-row, & .MuiDataGrid-renderingZone': {
                              maxHeight: 'none !important',
                            },
                            //sticky header
                            '& .MuiDataGrid-columnHeaders': {
                              position: "sticky",
                              top: '-1px',
                              backgroundColor: '#fff',
                              zIndex: 10
                            },
                            '& .MuiDataGrid-virtualScroller': {
                              marginTop: "0 !important"
                            },
                            '& .MuiDataGrid-main': {
                              overflow: "visible"
                            }
                          }}
                        >
                          <div ref={gridWrapperRef} style={{ height: heightTable }}>
                            <DataGrid
                              autoHeight
                              pagination
                              rows={tableRows}
                              columns={tableColumns}
                              pageSize={rows.length}
                              rowsPerPageOptions={[rows.length]}
                              loading={isLoading}
                              disableColumnMenu={true}
                              // disableSelectionOnClick
                              onCellClick={(params, event: MuiEvent<React.MouseEvent>) => {
                                if (params.row.callIds[params.field] != undefined) getCalls(params.row.callIds[params.field]);
                              }}
                            />
                          </div>
                        </Box>
                      </div>
                    </div>
                  </div>
                  <div>
                    {calls.length != 0 && callsSwitch ?
                      <CallsHeader
                        found={foundCalls}
                        switchTitleFound={true}
                      />
                      : <></>
                    }
                    {calls.length != 0 && callsSwitch ?
                      calls.map((callsArrays: CallType[]) => {
                        const callsArrayIndex = calls.indexOf(callsArrays)
                        return (
                          <div>
                            {callsArrays.map((call: CallType) => {
                              return (
                                <CallStubMiddleware
                                  callInfo={call.info} callAudio={call.audio} callStt={call.stt}
                                  bundleIndex={callsArrayIndex} expanded={expanded === call.info?.id}
                                  handleExpandedChange={handleExpandedChange}
                                />
                              )
                            })}
                          </div>
                        )
                      })
                      : <></>
                    }
                  </div>
                </div>
              }
            </>
            :
            <div className={classes.centerMessage}>
              <div className={classes.centerMessageTitle}>
                {translate('reportsMakeReport', language)}
              </div>
            </div>
          }
        </>
      }
    </div>
  )
})
export default Reports;