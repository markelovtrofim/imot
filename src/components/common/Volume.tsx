import React from "react";
import {makeStyles} from "@mui/styles";
import {Slider} from "@mui/material";

const BullhornSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.2244 11.2706C13.5199 8.43094 13.5199 5.56828 13.2244 2.72862C13.132 1.84042 12.1079 1.3905 11.3912 1.92324L8.65546 3.95684C7.79306 4.59789 6.74712 4.94406 5.67259 4.94406H3.11979C2.7516 4.94406 2.45312 5.24253 2.45312 5.61072V8.38848C2.45312 8.75668 2.7516 9.05514 3.11979 9.05514H5.67259C6.74713 9.05514 7.79306 9.40134 8.65546 10.0424L11.3912 12.076C12.1079 12.6087 13.132 12.1588 13.2244 11.2706Z"
        fill="#738094"/>
      <path
        d="M6.06257 10.5351C6.10087 10.3855 6.06786 10.2265 5.97315 10.1045C5.87843 9.98253 5.73265 9.91113 5.57819 9.91113H4.24485C4.05547 9.91113 3.88233 10.0181 3.79764 10.1875L3.13097 11.5209C3.01712 11.7486 3.09253 12.0255 3.30612 12.164L4.72877 13.0867C4.86384 13.1743 5.03283 13.1915 5.18278 13.1329C5.33273 13.0743 5.44531 12.9471 5.48522 12.7911L6.06257 10.5351Z"
        fill="#A3AEBE"/>
    </svg>
  );
};

const useStyles = makeStyles(({
  volumeBox: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '5px',
    width: '140px',
    backgroundColor: '#E3E8EF'
  },
  volume: {
    margin: '0 10px',
    '&.MuiSlider-root': {
      '& .MuiSlider-thumb': {
        '&:active, &:focus, &:hover, & .Mui-active, &.Mui-focusVisible': {
          boxShadow: 'none'
        },
        '&::before, &::after': {
          display: 'none'
        },
        color: '#fff',
        border: '3px solid #722ED1',
        width: '14px',
        height: '14px'
      }
    }
  }
}));


const Volume = () => {
  const classes = useStyles();
  return (
    <div className={classes.volumeBox}>
      <BullhornSvg style={{marginLeft: '10px'}}/>
      <Slider
        defaultValue={50}
        className={classes.volume}
      />
    </div>
  );
};

export default Volume;
