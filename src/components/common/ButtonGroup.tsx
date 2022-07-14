import React, { FC, useEffect, useState } from 'react';

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";

import { translate } from "../../localizations";
import { useAppSelector } from "../../hooks/redux";
import { RootState } from "../../store/store";
import { reportsSlice } from './../../store/reports/reports.slice';
import { unitsOfTime } from './СontrolBlock';

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
    marginLeft: '45px'
  },
  controlBlockButton: {
    border: 'none !important',
    transition: '0.4s !important',
    outline: 'none !important',
    height: '40px',
    fontSize: '14px !important',
    padding: '8px 16px !important',
    // @ts-ignore
    textTransform: 'none !important',
    color: '#738094 !important',
    backgroundColor: '#ffffff !important',
    whiteSpace: 'nowrap',
    '&.Mui-selected': {
      backgroundColor: '#D6D9DF !important',
      color: '#000 !important'
    }
  },
}));

type ButtonsPropsType = {
  date: Date[] | null[],
  items: {
    value: string,
    onClick: () => void,
    unitOfTime: Date[] | null[]
  }[],
  period?: string | null
};

const periods: { [key: string]: string } = {
  today: 'today',
  yesterday: 'yesterday',
  week: 'this_week',
  month: 'this_mont',
  year: 'this_year',
  allTime: 'all_time'
}

const getPeriod = (period: string) => {
  return periods[period]
}       

const getNamePeriod = (period: string) => {
  return Object.keys(periods).find((key) => periods[key] === period)
}

const ButtonGroup: FC<ButtonsPropsType> = ({date, items, period}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [alignment, setAlignment] = useState<string | null>(null);
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    if (period) {
      //@ts-ignore
      setAlignment(getNamePeriod(period))
      //@ts-ignore
      dispatch(reportsSlice.actions.setDate(unitsOfTime[getNamePeriod(period)]));
    }
  }, [period])


  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      // @ts-ignore
      if (items[i].unitOfTime[0] && date[0] && (items[i].unitOfTime[0].toString() === date[0].toString())) {
        setAlignment(items[i].value);
        dispatch(reportsSlice.actions.setPeriod(getPeriod(items[i].value)))
        break
      } else if (items[i].unitOfTime[0] === null && items[i].unitOfTime[0] === date[0]) {
        setAlignment(items[i].value);
        dispatch(reportsSlice.actions.setPeriod(getPeriod(items[i].value)));
      } else {
        setAlignment(null);
        dispatch(reportsSlice.actions.setPeriod(null));
      }
    }
  }, [date]);

  const {language} = useAppSelector((state: RootState) => state.lang);

  return (
    <div>
      <ToggleButtonGroup
        className={classes.controlBlockButtonBox}
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        {items.map((item) => (
          <ToggleButton
            key={item.value}
            disabled={item.value === alignment}
            className={classes.controlBlockButton}
            value={item.value}
            onClick={item.onClick}
          >
            {translate(item.value, language)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};

export default ButtonGroup;