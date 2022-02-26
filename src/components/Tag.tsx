import React, {FC} from 'react';
import Chip from '@mui/material/Chip';
import {makeStyles} from "@mui/styles";

const CustomChip: FC<any> = ({label, backgroundColor, color, hover}) => {
  const useStyles = makeStyles(({
    root: {
      borderRadius: '5px !important',
      height: '27px !important',
      margin: '5px !important',
      cursor: 'pointer !important',
      backgroundColor: `${backgroundColor} !important`,
      color: `${color} !important`,
      fontFamily: 'Inter, sans-serif !important',
      border: `2px solid ${backgroundColor} !important`,
      "&:hover": {
        borderColor: `${hover} !important`
      }
    }
  }));
  return <Chip label={label} className={useStyles().root}/>
};

export default CustomChip;