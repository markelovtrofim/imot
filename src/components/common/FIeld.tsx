import React, {FC, memo} from "react";
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";

type FieldPropsType = {
  label: string,
  labelBrother?: any,
  bgColor?: string,
  height?: string,
  width?: string,
  margin?: string,
  padding?: string
}

const Field: FC<FieldPropsType> = memo(({children, label, labelBrother, bgColor, height, width, margin, padding}) => {
  const useStyles = makeStyles(({
    fieldBox: {
      height: height,
      cursor: 'default',
      backgroundColor: bgColor ? bgColor : '#F8FAFC',
      border: '1px solid #EEF2F6',
      padding: padding ? padding : '8px 15px',
      borderRadius: '5px',
      marginTop: '10px'
    },
    fieldLabel: {
      color: '#738094 !important',
      fontWeight: '700 !important',
      fontSize: '13px !important'
    },
  }));
  const classes = useStyles();
  return (
    <div style={{marginTop: '24px', width: width}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography className={classes.fieldLabel}>{label}</Typography>
        {labelBrother}
      </div>
      <div className={classes.fieldBox}>
        <Typography>
          {children}
        </Typography>
      </div>
    </div>
  );
});

export default Field;
