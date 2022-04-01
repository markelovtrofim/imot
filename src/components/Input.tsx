import React, {FC} from 'react';
import {TextField} from "@mui/material";
import {makeStyles} from "@mui/styles";

type InputPropsType = {
  name: string,
  type: string,
  bcColor: string,
  label: string,

  autoComplete?: 'on' | 'off',
  handleChange?: (e: React.ChangeEvent<any>) => void,
  value?: string,
  border?: string,
  height?: string
};

const Input: FC<InputPropsType> = (props) => {
  const useStyles = makeStyles(({
    inputRoot: {
      backgroundColor: props.bcColor,
      height: `33px !important`,
      borderRadius: '5px',
      width: '100%',
      border: props.border ?`${props.border} !important` : 'none !important',
      '& .MuiInputLabel-root': {
        cursor: 'text !important',
        color: '#738094 !important',
        fontSize: '14px !important',
        left: '-5px',
        top: '-10px'
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
        padding: '8px 28px 8px 10px !important',
        color: '#738094'
      }
    },
  }));
  const classes = useStyles();
  return <TextField
    className={classes.inputRoot}
    name={props.name}
    type={props.type}
    onChange={props.handleChange}
    autoComplete={props.autoComplete}
    value={props.value} label={props.label}
  />
};

export default Input;
