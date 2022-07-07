import React, {useEffect, useState} from 'react';
import {makeStyles} from '@mui/styles';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import ButtonGroup from "./ButtonGroup";
import {useAppSelector} from "../../hooks/redux";
import {searchSlice} from "../../store/search/search.slice";
import Snackbar from "./Snackbar";
import DateRangePickerWrapper from './DateRangePickerWrapper';
import {reportsSlice} from './../../store/reports/reports.slice';

// Svg
const DownloadSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"
         fill={props.fill ? props.fill : "#738094"}>
      <path
        d="M0.75 10.1875C1.06066 10.1875 1.3125 10.4394 1.3125 10.75V12.25C1.3125 12.3536 1.39645 12.4375 1.5 12.4375H10.5C10.6036 12.4375 10.6875 12.3536 10.6875 12.25V10.75C10.6875 10.4394 10.9394 10.1875 11.25 10.1875C11.5606 10.1875 11.8125 10.4394 11.8125 10.75V12.25C11.8125 12.9749 11.2249 13.5625 10.5 13.5625H1.5C0.775125 13.5625 0.1875 12.9749 0.1875 12.25V10.75C0.1875 10.4394 0.439342 10.1875 0.75 10.1875Z"/>
      <path
        d="M5.05298 0.8125C4.66726 0.8125 4.34541 1.10734 4.31172 1.49166C4.19649 2.80619 4.17617 4.12719 4.25084 5.44438C4.0656 5.45462 3.88043 5.46648 3.69536 5.47997L2.57822 5.56142C2.1475 5.59277 1.90672 6.07308 2.13926 6.43698C2.93579 7.68355 3.96213 8.76723 5.16361 9.63033L5.61113 9.95185C5.84326 10.1186 6.15593 10.1186 6.38806 9.95185L6.83558 9.63033C8.03708 8.76723 9.06338 7.68355 9.85996 6.43698C10.0925 6.07308 9.85171 5.59277 9.42098 5.56142L8.30386 5.47997C8.11876 5.46648 7.93358 5.45462 7.74833 5.44438C7.82303 4.12719 7.80271 2.80619 7.68751 1.49165C7.65376 1.10734 7.33193 0.8125 6.94621 0.8125H5.05298Z"/>
    </svg>
  );
};

const CalendarSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{position: 'absolute', right: '8px',  top: 'calc(50% - 8px)'}}
    >
      <path 
        d="M4.64286 0.9375V1.875H8.35714V0.9375C8.35714 0.419824 8.7721 0 9.28571 0C9.79933 0 10.2143 0.419824 10.2143 0.9375V1.875H11.6071C12.3761 1.875 13 2.50459 13 3.28125V4.6875H0V3.28125C0 2.50459 0.623594 1.875 1.39286 1.875H2.78571V0.9375C2.78571 0.419824 3.20067 0 3.71429 0C4.2279 0 4.64286 0.419824 4.64286 0.9375ZM0 5.625H13V13.5938C13 14.3701 12.3761 15 11.6071 15H1.39286C0.623594 15 0 14.3701 0 13.5938V5.625ZM1.85714 8.90625C1.85714 9.16406 2.06491 9.375 2.32143 9.375H3.25C3.50536 9.375 3.71429 9.16406 3.71429 8.90625V7.96875C3.71429 7.71094 3.50536 7.5 3.25 7.5H2.32143C2.06491 7.5 1.85714 7.71094 1.85714 7.96875V8.90625ZM5.57143 8.90625C5.57143 9.16406 5.78036 9.375 6.03571 9.375H6.96429C7.21964 9.375 7.42857 9.16406 7.42857 8.90625V7.96875C7.42857 7.71094 7.21964 7.5 6.96429 7.5H6.03571C5.78036 7.5 5.57143 7.71094 5.57143 7.96875V8.90625ZM9.75 7.5C9.49464 7.5 9.28571 7.71094 9.28571 7.96875V8.90625C9.28571 9.16406 9.49464 9.375 9.75 9.375H10.6786C10.9339 9.375 11.1429 9.16406 11.1429 8.90625V7.96875C11.1429 7.71094 10.9339 7.5 10.6786 7.5H9.75ZM1.85714 12.6562C1.85714 12.9141 2.06491 13.125 2.32143 13.125H3.25C3.50536 13.125 3.71429 12.9141 3.71429 12.6562V11.7188C3.71429 11.4609 3.50536 11.25 3.25 11.25H2.32143C2.06491 11.25 1.85714 11.4609 1.85714 11.7188V12.6562ZM6.03571 11.25C5.78036 11.25 5.57143 11.4609 5.57143 11.7188V12.6562C5.57143 12.9141 5.78036 13.125 6.03571 13.125H6.96429C7.21964 13.125 7.42857 12.9141 7.42857 12.6562V11.7188C7.42857 11.4609 7.21964 11.25 6.96429 11.25H6.03571ZM9.28571 12.6562C9.28571 12.9141 9.49464 13.125 9.75 13.125H10.6786C10.9339 13.125 11.1429 12.9141 11.1429 12.6562V11.7188C11.1429 11.4609 10.9339 11.25 10.6786 11.25H9.75C9.49464 11.25 9.28571 11.4609 9.28571 11.7188V12.6562Z" fill="#B37FEB"/>
    </svg>
  )
}

// Styles
const useStyles = makeStyles(({
  controlBlockWrapper: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  },
  controlBlockDate: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '665px',
    width: '100%',
  },
  cbDateItems: {
    display: 'flex',
  },
  controlBlockDateItem: {
    display: 'flex',
    marginRight: '15px',
    alignItems: 'center',
  },
  controlBlockDownload: {
    display: 'flex'
  },
  controlBlockButtonBox: {
    boxShadow: 'none !important',
    padding: '0 5px'
  },
  controlBlockButton: {
    border: 'none !important',
    transition: '0.4s !important',
    outline: 'none !important',
    height: '40px',
    fontSize: '14px !important',
    // @ts-ignore
    textTransform: 'none !important',
    color: '#738094 !important',
    backgroundColor: '#ffffff !important',
    '&.Mui-selected': {
      backgroundColor: '#D6D9DF !important',
      color: '#000 !important'
    }
  },
  cbButtonWithIcon: {
    padding: '0 20px !important',
    '& .MuiButton-startIcon svg': {
      fill: '#738094',
    }
  },
}))

export const unitsOfTime = {
  today: [new Date(Date.now()), new Date(Date.now())],
  yesterday: [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date(Date.now() - 24 * 60 * 60 * 1000)],
  week: [new Date(Date.now() - 168 * 60 * 60 * 1000), new Date(Date.now())],
  month: [new Date(Date.now() - 720 * 60 * 60 * 1000), new Date(Date.now())],
  year: [new Date(Date.now() - 8760 * 60 * 60 * 1000), new Date(Date.now())],
  allTime: [null, null]
}

const ControlBlock = (props: any) => {

  const element = document.getElementById("dateRangePicker");
  if (element) {
    element.classList.remove("rs-picker-toggle-active");
  }

  const {language} = useSelector((state: RootState) => state.lang);
  const classes = useStyles();
  const dateSearch = useAppSelector(state => state.search.date);
  const dateReports = useAppSelector(state => state.reports.date);
  const dispatch = useDispatch();

  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [disabledCalendar, setDisabledCalendar] = useState<boolean>(false);
  const [disabledCalendarReport, setDisabledCalendarReport] = useState<boolean>(false);

  useEffect(() => {
    if (dateSearch[0] === null) setDisabledCalendar(true)
    if (dateReports[0] === null) setDisabledCalendarReport(true)
  }, [dateSearch, dateReports])

  return (
    <div className={classes.controlBlockWrapper}>
      <div className={classes.controlBlockDate}>
        {/* Ввод точной даты */}
        <div style={{height: '40px', display: 'flex'}}>
          {props.switchEntity === 'reports' ?
            <DateRangePickerWrapper
              id={'dateRangePicker'}
              value={dateReports}
              disabled={disabledCalendarReport}
              onChange={(value: [Date, Date],) => {
                dispatch(reportsSlice.actions.setDate(value));
              }}
              onClean={() => {
                dispatch(reportsSlice.actions.setDate([null, null]));
              }}
            />
            :
            <DateRangePickerWrapper
              id={'dateRangePicker'}
              value={dateSearch}
              disabled={disabledCalendar}
              onChange={(value: [Date, Date],) => {
                dispatch(searchSlice.actions.setDate(value));
              }}
              onClean={() => {
                dispatch(searchSlice.actions.setDate([null, null]));
              }}
            />
          }
          {props.switchEntity === 'reports' ?
            <ButtonGroup
              date={dateReports}
              items={[
                {
                  value: 'today', onClick: () => {
                    setDisabledCalendarReport(false);
                    dispatch(reportsSlice.actions.setDate(unitsOfTime.today));
                  }, unitOfTime: unitsOfTime.today
                },
                {
                  value: 'yesterday', onClick: () => {
                    setDisabledCalendarReport(false);
                    dispatch(reportsSlice.actions.setDate(unitsOfTime.yesterday));
                  }, unitOfTime: unitsOfTime.yesterday
                },
                {
                  value: 'week', onClick: () => {
                    setDisabledCalendarReport(false);
                    dispatch(reportsSlice.actions.setDate(unitsOfTime.week));
                  }, unitOfTime: unitsOfTime.week
                },
                {
                  value: 'month', onClick: () => {
                    setDisabledCalendarReport(false);
                    dispatch(reportsSlice.actions.setDate(unitsOfTime.month));
                  }, unitOfTime: unitsOfTime.month
                },
                {
                  value: 'year', onClick: () => {
                    setDisabledCalendarReport(false);
                    dispatch(reportsSlice.actions.setDate(unitsOfTime.year));
                  }, unitOfTime: unitsOfTime.year
                },
                {
                  value: 'allTime', onClick: () => {
                    setDisabledCalendarReport(true);
                    dispatch(reportsSlice.actions.setDate(unitsOfTime.allTime));
                  }, unitOfTime: unitsOfTime.allTime
                },
              ]}
            />
            :
            <ButtonGroup
              date={dateSearch}
              items={[
                {
                  value: 'today', onClick: () => {
                    setDisabledCalendar(false);
                    dispatch(searchSlice.actions.setDate(unitsOfTime.today));
                  }, unitOfTime: unitsOfTime.today
                },
                {
                  value: 'yesterday', onClick: () => {
                    setDisabledCalendar(false);
                    dispatch(searchSlice.actions.setDate(unitsOfTime.yesterday));
                  }, unitOfTime: unitsOfTime.yesterday
                },
                {
                  value: 'week', onClick: () => {
                    setDisabledCalendar(false);
                    dispatch(searchSlice.actions.setDate(unitsOfTime.week));
                  }, unitOfTime: unitsOfTime.week
                },
                {
                  value: 'month', onClick: () => {
                    setDisabledCalendar(false);
                    dispatch(searchSlice.actions.setDate(unitsOfTime.month));
                  }, unitOfTime: unitsOfTime.month
                },
                {
                  value: 'year', onClick: () => {
                    setDisabledCalendar(false);
                    dispatch(searchSlice.actions.setDate(unitsOfTime.year));
                  }, unitOfTime: unitsOfTime.year
                },
                {
                  value: 'allTime', onClick: () => {
                    setDisabledCalendar(true);
                    dispatch(searchSlice.actions.setDate(unitsOfTime.allTime));
                  }, unitOfTime: unitsOfTime.allTime
                },
              ]}
            />
          }
        </div>
      </div>
      <Snackbar
        type={'error'}
        open={errorSnackbar}
        onClose={() => {
          setErrorSnackbar(false);
        }}
        text={'Эта функция пока не работает'}
        time={2000}
      />
    </div>
  );
};

export default ControlBlock;