import React, {useState} from 'react';
import {makeStyles} from '@mui/styles';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {translate} from '../../localizations';
import cn from 'classnames';
import {DateRangePicker} from 'rsuite';
import ButtonGroup from "./ButtonGroup";
import {useAppSelector} from "../../hooks/redux";
import {searchSlice} from "../../store/search/search.slice";
import Snackbar from "./Snackbar";
import Input from "./Input";


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
  dateRangePickerInputs: {
    position: 'relative',
    border: 'none !important',
    outlined: 'none !important',
    '& div .rs-picker-toggle-caret': {
      position: 'absolute',
      right: '10px !important',
    },
  },
  test: {
    '& .rs-picker-daterange-panel': {
      '& .rs-picker-daterange-content': {
        backgroundColor: '#fff'
      }
    }
  }

}))

export const unitsOfTime = {
  today: [new Date(Date.now()), new Date(Date.now())],
  yesterday: [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date(Date.now() - 24 * 60 * 60 * 1000)],
  week: [new Date(Date.now() - 168 * 60 * 60 * 1000), new Date(Date.now())],
  month: [new Date(Date.now() - 720 * 60 * 60 * 1000), new Date(Date.now())],
  year: [new Date(Date.now() - 8760 * 60 * 60 * 1000), new Date(Date.now())]
}

const ControlBlock = () => {

  const element = document.getElementById("dateRangePicker");
  if (element) {
    element.classList.remove("rs-picker-toggle-active");
  }

  const {language} = useSelector((state: RootState) => state.lang);
  const classes = useStyles();
  const date = useAppSelector(state => state.search.date);
  const dispatch = useDispatch();

  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);


  return (
    <div className={classes.controlBlockWrapper}>
      <div className={classes.controlBlockDate}>
        {/* Ввод точной даты */}
        <div style={{height: '40px', display: 'flex'}}>
          <DateRangePicker
            id={'dateRangePicker'}
            menuClassName={classes.test}
            ranges={[]}
            appearance="subtle"
            placeholder="Subtle"
            format={'dd/MM/yyyy'}
            className={classes.dateRangePickerInputs}
            // @ts-ignore
            value={date}
            onChange={(value,) => {
              // @ts-ignore
              dispatch(searchSlice.actions.setDate(value));
            }}
            onClean={() => {
              dispatch(searchSlice.actions.setDate([null, null]));
            }}
          />
          {
            <div style={{}}>

            </div>
          }
          <ButtonGroup
            items={[
              {
                value: 'today', onClick: () => {
                  dispatch(searchSlice.actions.setDate(unitsOfTime.today))
                }, unitOfTime: unitsOfTime.today
              },
              {
                value: 'yesterday', onClick: () => {
                  dispatch(searchSlice.actions.setDate(unitsOfTime.yesterday))
                }, unitOfTime: unitsOfTime.yesterday
              },
              {
                value: 'week', onClick: () => {
                  dispatch(searchSlice.actions.setDate(unitsOfTime.week))
                }, unitOfTime: unitsOfTime.week
              },
              {
                value: 'month', onClick: () => {
                  dispatch(searchSlice.actions.setDate(unitsOfTime.month))
                }, unitOfTime: unitsOfTime.month
              },
              {
                value: 'year', onClick: () => {
                  dispatch(searchSlice.actions.setDate(unitsOfTime.year))
                }, unitOfTime: unitsOfTime.year
              }
            ]}
          />
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