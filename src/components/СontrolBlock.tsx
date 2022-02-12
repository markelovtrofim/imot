import React, {useState} from 'react';
import {makeStyles} from '@mui/styles';
import BlockBox from './BlockBox';
import {Button, ButtonGroup, InputBase, Typography} from '@mui/material';
import DateRangePicker, {DateRange} from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {translate} from '../localizations';


// Svg
const ArrowSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill={props.fill ? props.fill : "#738094"} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.10228 1.39775C5.8826 1.17808 5.8826 0.821918 6.10228 0.602251C6.32195 0.382583 6.67805 0.382583 6.89773 0.602251L9.89773 3.60227C10.1174 3.82195 10.1174 4.17805 9.89773 4.39772L6.89773 7.39772C6.67805 7.6174 6.32195 7.6174 6.10228 7.39772C5.8826 7.17805 5.8826 6.82195 6.10228 6.60227L8.14198 4.5625H0.875C0.564343 4.5625 0.3125 4.31065 0.3125 4C0.3125 3.68935 0.564343 3.4375 0.875 3.4375H8.14198L6.10228 1.39775Z"/>
    </svg>
  );
};

const CaseSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill={props.fill ? props.fill : "#738094"} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3.81298 1C3.81298 0.689342 3.56114 0.4375 3.25048 0.4375C2.93983 0.4375 2.68798 0.689342 2.68798 1V2.36232C1.56818 2.52063 0.68352 3.40634 0.53376 4.53613L0.468847 5.02584C0.457837 5.10887 0.447315 5.19195 0.437272 5.27506C0.41064 5.49554 0.58434 5.6875 0.806422 5.6875H13.1945C13.4166 5.6875 13.5903 5.49554 13.5637 5.27506C13.5536 5.19195 13.5431 5.10887 13.5321 5.02584L13.4671 4.53613C13.3174 3.40635 12.4327 2.52066 11.313 2.36233V1C11.313 0.689342 11.0611 0.4375 10.7505 0.4375C10.4398 0.4375 10.188 0.689342 10.188 1V2.25072C8.06721 2.06185 5.93376 2.06185 3.81298 2.25072V1Z"/>
      <path
        d="M13.7089 7.1692C13.7023 6.96933 13.5372 6.8125 13.3373 6.8125H0.663626C0.463691 6.8125 0.298571 6.96933 0.292001 7.1692C0.247459 8.5249 0.329809 9.88345 0.538856 11.2269C0.697114 12.2439 1.52336 13.0251 2.54766 13.1261L3.44242 13.2144C5.80872 13.4477 8.19222 13.4477 10.5585 13.2144L11.4532 13.1261C12.4776 13.0251 13.3038 12.2439 13.462 11.2269C13.6711 9.88345 13.7535 8.5249 13.7089 7.1692Z"/>
    </svg>
  );
};

const DownloadSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14"  xmlns="http://www.w3.org/2000/svg" fill={props.fill ? props.fill : "#738094"}>
      <path d="M0.75 10.1875C1.06066 10.1875 1.3125 10.4394 1.3125 10.75V12.25C1.3125 12.3536 1.39645 12.4375 1.5 12.4375H10.5C10.6036 12.4375 10.6875 12.3536 10.6875 12.25V10.75C10.6875 10.4394 10.9394 10.1875 11.25 10.1875C11.5606 10.1875 11.8125 10.4394 11.8125 10.75V12.25C11.8125 12.9749 11.2249 13.5625 10.5 13.5625H1.5C0.775125 13.5625 0.1875 12.9749 0.1875 12.25V10.75C0.1875 10.4394 0.439342 10.1875 0.75 10.1875Z"/>
      <path d="M5.05298 0.8125C4.66726 0.8125 4.34541 1.10734 4.31172 1.49166C4.19649 2.80619 4.17617 4.12719 4.25084 5.44438C4.0656 5.45462 3.88043 5.46648 3.69536 5.47997L2.57822 5.56142C2.1475 5.59277 1.90672 6.07308 2.13926 6.43698C2.93579 7.68355 3.96213 8.76723 5.16361 9.63033L5.61113 9.95185C5.84326 10.1186 6.15593 10.1186 6.38806 9.95185L6.83558 9.63033C8.03708 8.76723 9.06338 7.68355 9.85996 6.43698C10.0925 6.07308 9.85171 5.59277 9.42098 5.56142L8.30386 5.47997C8.11876 5.46648 7.93358 5.45462 7.74833 5.44438C7.82303 4.12719 7.80271 2.80619 7.68751 1.49165C7.65376 1.10734 7.33193 0.8125 6.94621 0.8125H5.05298Z"/>
    </svg>
  );
};

// Styles
const useStyles = makeStyles(({
  controlBlockWrapper: {
    margin: '24px 0',
    display: 'flex',
    justifyContent: 'space-between'
  },
  controlBlockDate: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '900px',
    width: '100%'
  },
  controlBlockDateItem: {
    display: 'flex',
    marginRight: '15px',
    alignItems: 'center'
  },
  controlBlockDownload: {
    display: 'flex'
  },
  controlBlockButtonBox: {
    boxShadow: 'none !important'
},
  controlBlockButton: {
    border: 'none !important',
    outline: 'none !important',
    height: '100%'
  }
}));


const ControlBlock = () => {
  const {language} = useSelector((state: RootState) => state.lang);
  const [value, setValue] = useState<DateRange<Date>>([null, null]);

  const classes = useStyles();
  return (
    <div className={classes.controlBlockWrapper}>
      <div className={classes.controlBlockDate}>

        {/* Ввод точной даты */}
        <BlockBox width={'315px'} padding={'9px 12px'}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              inputFormat="dd/MM/yyyy"
              value={value}
              clearText={'Clear'}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(startProps: any, endProps: any) => (
                <React.Fragment>
                  <div className={classes.controlBlockDateItem}>
                    <Typography>{translate('from', language)}</Typography>
                    <InputBase sx={{ml: 1, flex: 1}} {...startProps}/>
                    <ArrowSvg/>
                  </div>
                  <div className={classes.controlBlockDateItem}>
                    <Typography>{translate('to', language)}</Typography>
                    <InputBase sx={{ml: 1, flex: 1}} {...endProps}/>
                    <CaseSvg/>
                  </div>
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </BlockBox>

        {/* Разные еденицы времени */}
          <ButtonGroup className={classes.controlBlockButtonBox} variant="contained">
            <Button className={classes.controlBlockButton}>{translate('today', language)}</Button>
            <Button className={classes.controlBlockButton}>{translate('yesterday', language)}</Button>
            <Button className={classes.controlBlockButton}>{translate('week', language)}</Button>
            <Button className={classes.controlBlockButton}>{translate('month', language)}</Button>
            <Button className={classes.controlBlockButton}>{translate('year', language)}</Button>
          </ButtonGroup>

      </div>
        <Button variant="contained" startIcon={<DownloadSvg fill="#212121"/>}>
          {translate('download', language)}
        </Button>
    </div>
  );
};

export default ControlBlock;