import React, {FC} from 'react';
import {TextField} from "@mui/material";
import {makeStyles} from "@mui/styles";

type InputPropsType = {
  name: string,
  type: string,
  handleChange?: (e: React.ChangeEvent<any>) => void,
  value?: string,
  bcColor: string,
  label: string
};

const Input: FC<InputPropsType> = (props) => {
  const useStyles = makeStyles(({
    inputRoot: {
      backgroundColor: props.bcColor,
      borderRadius: '5px',
      width: '100%',
      '& .MuiInputLabel-root': {
        color: '#738094 !important',
        fontSize: '14px !important',
        left: '-5px',
        top: '-9px'
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
    value={props.value} label={props.label}
  />
};

export default Input;
