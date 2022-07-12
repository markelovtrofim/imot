import React, {useState} from 'react';
import {makeStyles} from '@mui/styles';
import {DateRangePicker,CustomProvider} from 'rsuite';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {translate} from '../../localizations';
import {startOfDay, endOfDay, addDays, subDays, addYears, subMonths} from 'date-fns';

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

const useStyles = makeStyles(({
  dateRangePickerInputs: {
    position: 'relative',
    border: 'none !important',
    outlined: 'none !important',
    minWidth: '222px',
    height: '40px',
    '& .rs-picker-toggle.rs-btn': {
      height: '100%',
      paddingTop: '8px',
      '&:hover:not(.rs-btn-disabled), &.rs-picker-toggle-active': {
        borderColor: '#722ED1'
      },
      '&.rs-picker-toggle-active': {
        boxShadow: '0 0 0 3px rgba(114,46,209,0.25)'
      }
    },
    '& .rs-picker-toggle-value': {
      color: '#575757 !important',
      paddingTop: '1px'
    },
    '& .rs-picker-toggle-clean.rs-btn-close': {
      top: '9px !important',
    }
  },
  dateRangePanel: {
    '& .rs-picker-daterange-panel': {
      display: 'flex',
      '& .rs-picker-daterange-content': {
        backgroundColor: '#fff'
      },
      '& .rs-calendar-header-title': {
        fontSize: '14px',
        lineHeight: '22px',
      },
      '& .rs-picker-toolbar': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: '1px solid #e5e5ea',
        borderTop: 'none',
        '&::before, &::after': {
          content: 'none',
        }
      },
      '& .rs-picker-toolbar-ranges': {
        display: 'flex',
        flexDirection: 'column',
        '& .rs-btn': {
          textAlign: 'left',
          paddingLeft: '0',
          color: '#575757 !important'
        }
      },
      '& .rs-picker-daterange-header': {
        display: 'none',
      },
      '& .rs-btn-icon.rs-btn-xs>.rs-icon': {
        fontSize: '20px',
      },
      '& .rs-calendar-table-cell-selected .rs-calendar-table-cell-content': {
        backgroundColor: '#722ED1 !important'
      },
      '& .rs-btn-primary, & .rs-btn-primary:focus, & .rs-btn-primary:hover': {
        backgroundColor: '#722ED1 !important'
      },
      '& .rs-calendar-table-cell:hover .rs-calendar-table-cell-content': {
        color: '#722ED1 !important',
        backgroundColor: 'rgba(114, 46, 209, 0.15)'
      },
      '& .rs-calendar-table-cell-selected:hover .rs-calendar-table-cell-content': {
        color: '#fff !important'
      },
      '& .rs-calendar-table-cell-in-range:before': {
        backgroundColor: 'rgba(114, 46, 209, 0.15)'
      }
    },
    '.rs-calendar-table-cell-is-today .rs-calendar-table-cell-content': {
      boxShadow: 'inset 0 0 0 1px #722ED1 !important'
    },
  }
}))


const DateRangePickerWrapper = (props: any) => {
  const classes = useStyles();
  const {language} = useSelector((state: RootState) => state.lang);

  return (    
    <DateRangePicker
      id={props.id}
      disabled={props.disabled}
      menuClassName={classes.dateRangePanel}
      ranges={[
        {
          label: translate('today', language),
          value: [startOfDay(new Date()), endOfDay(new Date())],
          closeOverlay: true
        },
        {
          label: translate('lastWeek', language),
          value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
          closeOverlay: true
        },
        {
          label: translate('lastMonth', language),
          value: [startOfDay(subMonths(new Date(), 1)), endOfDay(new Date())],
          closeOverlay: true
        },
        {
          label: translate('lastYear', language),
          value: [startOfDay(addYears(new Date(), -1)), endOfDay(new Date())],
          closeOverlay: true
        },
      ]}
      caretAs={CalendarSvg}
      isoWeek
      appearance="default"
      placeholder={translate('placeholderCalendar', language)}
      format={'dd.MM.yyyy'}
      className={classes.dateRangePickerInputs}
      value={props.value}
      onChange={props.onChange}
      onClean={props.onClean}
    />
  )
}

export default DateRangePickerWrapper;