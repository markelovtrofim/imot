import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import {Dialog, InputBase, Typography} from "@mui/material";
import {translate} from "../localizations";
import {makeStyles} from "@mui/styles";
import {useAppSelector} from "../hooks/redux";
import {RootState} from "../store";
import {searchSlice} from "../store/search/search.slice";
import {useDispatch} from "react-redux";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import BlockBox from "./BlockBox";
import {convertDate} from "../utils/convertData";

// Svg
const ArrowSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill={props.fill ? props.fill : "#738094"}
         xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.10228 1.39775C5.8826 1.17808 5.8826 0.821918 6.10228 0.602251C6.32195 0.382583 6.67805 0.382583 6.89773 0.602251L9.89773 3.60227C10.1174 3.82195 10.1174 4.17805 9.89773 4.39772L6.89773 7.39772C6.67805 7.6174 6.32195 7.6174 6.10228 7.39772C5.8826 7.17805 5.8826 6.82195 6.10228 6.60227L8.14198 4.5625H0.875C0.564343 4.5625 0.3125 4.31065 0.3125 4C0.3125 3.68935 0.564343 3.4375 0.875 3.4375H8.14198L6.10228 1.39775Z"/>
    </svg>
  );
};

const CaseSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill={props.fill ? props.fill : "#738094"}
         xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3.81298 1C3.81298 0.689342 3.56114 0.4375 3.25048 0.4375C2.93983 0.4375 2.68798 0.689342 2.68798 1V2.36232C1.56818 2.52063 0.68352 3.40634 0.53376 4.53613L0.468847 5.02584C0.457837 5.10887 0.447315 5.19195 0.437272 5.27506C0.41064 5.49554 0.58434 5.6875 0.806422 5.6875H13.1945C13.4166 5.6875 13.5903 5.49554 13.5637 5.27506C13.5536 5.19195 13.5431 5.10887 13.5321 5.02584L13.4671 4.53613C13.3174 3.40635 12.4327 2.52066 11.313 2.36233V1C11.313 0.689342 11.0611 0.4375 10.7505 0.4375C10.4398 0.4375 10.188 0.689342 10.188 1V2.25072C8.06721 2.06185 5.93376 2.06185 3.81298 2.25072V1Z"/>
      <path
        d="M13.7089 7.1692C13.7023 6.96933 13.5372 6.8125 13.3373 6.8125H0.663626C0.463691 6.8125 0.298571 6.96933 0.292001 7.1692C0.247459 8.5249 0.329809 9.88345 0.538856 11.2269C0.697114 12.2439 1.52336 13.0251 2.54766 13.1261L3.44242 13.2144C5.80872 13.4477 8.19222 13.4477 10.5585 13.2144L11.4532 13.1261C12.4776 13.0251 13.3038 12.2439 13.462 11.2269C13.6711 9.88345 13.7535 8.5249 13.7089 7.1692Z"/>
    </svg>
  );
};

const useStyles = makeStyles(({
  cbDateItems: {
    display: 'flex',
    margin: '5px 10px 0 0'
  },
  controlBlockDateItem: {
    width: '50%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 0 0 10px',
  },
  calendar: {
    '& .MuiDialog-container': {
      backgroundColor: 'none !important',
      position: 'absolute',
      top: '118px !important',
      left: '148px',
      height: 'auto !important',
      '& .MuiPaper-root': {
        margin: '0'
      }
    }
  },
  calendarInput: {
    '& .MuiInputBase-input': {
      cursor: 'pointer !important',
      width: '100px !important',
      marginLeft: '10px'
    },
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: '#738094'
    }
  },
  controlBlockButtonBox: {
    boxShadow: 'none !important',
    padding: '0 5px',
    marginLeft: '20px'
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
}));

const CustomCalendar = React.memo(() => {
  const dispatch = useDispatch();
  const date = useAppSelector(state => state.search.date);
  const [localDate, setLocalDate] = useState([
    new Date(), new Date()
  ]);

  useEffect(() => {
    const startDate = localDate[0].toLocaleDateString();
    const endDate = localDate[1].toLocaleDateString();
    let newDateFormat = {
      startDate: null as string | null,
      endDate: null as string | null
    };

    if (startDate === endDate) {
      newDateFormat = {
        startDate: startDate,
        endDate: ''
      }
    } else {
      newDateFormat = {
        startDate: startDate,
        endDate: endDate
      };
    }
    dispatch(searchSlice.actions.setDate(newDateFormat));
  }, [localDate]);

  const classes = useStyles();
  const {language} = useAppSelector((state: RootState) => state.lang);

  const [open, setOpen] = React.useState(false);
  const [topHeight, setTopHeight] = React.useState<number>(0);

  const handleClickOpen = () => {
    if (topHeight < 20) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler)
    }
  });
  const scrollHandler = (e: any) => {
    setTopHeight(e.target.documentElement.scrollTop)
    if (e.target.documentElement.scrollTop > 0) {
      handleClose()
    }
  };

  const [alignment, setAlignment] = useState('today');
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };
  return (
    <div style={{display: 'flex', alignItems: 'center', height: '40px'}}>
      <BlockBox padding={"0"} borderRadius={'5px'} border={'1px solid #E3E8EF'}>
        <div className={classes.cbDateItems} onScroll={scrollHandler}>
          <div className={classes.controlBlockDateItem}>
            <Typography>{translate('from', language)}</Typography>
            <InputBase className={classes.calendarInput} disabled value={convertDate(date.startDate, 'display')}
                       onClick={handleClickOpen}/>
            <ArrowSvg/>
          </div>
          <div className={classes.controlBlockDateItem}>
            <Typography>{translate('to', language)}</Typography>
            <InputBase className={classes.calendarInput} disabled value={convertDate(date.endDate, 'display')}
                       onClick={handleClickOpen}/>
            <CaseSvg/>
          </div>
          <Dialog className={classes.calendar} disableScrollLock={true}
                  open={open} onClose={handleClose} BackdropProps={{style: {backgroundColor: "transparent"}}}
          >
            <Calendar
              locale={"ru-RU"}
              onChange={setLocalDate}
              value={localDate}
              selectRange={true}
            />
          </Dialog>
        </div>
      </BlockBox>
      {/* Разные еденицы времени */}
      <ToggleButtonGroup
        className={classes.controlBlockButtonBox}
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton
          disabled={"today" === alignment}
          className={classes.controlBlockButton} value="today"
          onClick={() => {
            setLocalDate([new Date(Date.now()), new Date(Date.now())])
          }}
        >
          {translate('today', language)}
        </ToggleButton>

        <ToggleButton disabled={"yesterday" === alignment}
                      className={classes.controlBlockButton} value="yesterday"
                      onClick={() => {
                        setLocalDate([new Date(Date.now() - 24 * 60 * 60 * 1000), new Date(Date.now() - 24 * 60 * 60 * 1000)])
                      }}
        >
          {translate('yesterday', language)}
        </ToggleButton>

        <ToggleButton
          className={classes.controlBlockButton} disabled={"week" === alignment} value="week"
          onClick={() => {
            setLocalDate([new Date(Date.now() - 168 * 60 * 60 * 1000), new Date()])
          }}
        >
          {translate('week', language)}
        </ToggleButton>

        <ToggleButton
          className={classes.controlBlockButton} disabled={"month" === alignment} value="month"
          onClick={() => {
            setLocalDate([new Date(Date.now() - 720 * 60 * 60 * 1000), new Date()])
          }}
        >
          {translate('month', language)}
        </ToggleButton>

        <ToggleButton
          className={classes.controlBlockButton} disabled={"year" === alignment} value="year"
          onClick={() => {
            setLocalDate([new Date(Date.now() - 8760 * 60 * 60 * 1000), new Date()])
          }}
        >
          {translate('year', language)}
        </ToggleButton>
      </ToggleButtonGroup>

    </div>
  );
})

export default CustomCalendar;