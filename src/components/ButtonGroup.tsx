import React, {FC, useEffect, useState} from 'react';
import ToggleButton from "@mui/material/ToggleButton";
import {translate} from "../localizations";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {makeStyles} from "@mui/styles";
import {useAppSelector} from "../hooks/redux";
import {RootState} from "../store/store";

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

type ButtonsPropsType = {
  items: {
    value: string,
    onClick: () => void,
    unitOfTime: Date[]
  }[]
};

const ButtonGroup: FC<ButtonsPropsType> = ({items}) => {
  const classes = useStyles();

  const [alignment, setAlignment] = useState<string | null>(null);
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const date = useAppSelector(state => state.search.date);

  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].unitOfTime[0].toString() ===  date[0].toString()) {
        setAlignment(items[i].value);
        break
      } else {
        setAlignment(null);
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