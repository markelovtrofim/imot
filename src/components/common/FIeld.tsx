import React, {FC, memo} from "react";
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";

type FieldPropsType = {
  label: string,
  labelBrother?: any,
  bgColor?: string,
  width?: string,
  height?: string,
  margin?: string,
  padding?: string
}

const Field: FC<FieldPropsType> = memo(({children, label, bgColor, width, height, margin, padding, labelBrother}) => {
  const useStyles = makeStyles(({
    fieldBox: {
      margin: margin ? margin : '0',
      height: height ? height : 'auto',
      width: width ? width : 'auto'
    },
    fieldText: {
      backgroundColor: bgColor ? bgColor : '#F8FAFC',
      border: '1px solid #E3E8EF',
      padding: padding ? padding : '3px 10px',
      borderRadius: '5px',
      marginTop: '10px'
    },
    fieldLabel: {
      cursor: 'default !important',
      color: '#738094 !important',
      fontWeight: '700 !important',
      fontSize: '13px !important'
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.fieldBox}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography className={classes.fieldLabel}>
          {label}
        </Typography>
        {labelBrother}
      </div>
      <div className={classes.fieldText}>
        {children}
      </div>
    </div>
  );
});

export default Field;
