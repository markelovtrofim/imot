import React, {FC} from "react";
import {makeStyles} from "@mui/styles";
import {Fab} from "@mui/material";

type IconButtonPropsType = {
  icon: any,
  backgroundColor: string,
  onClick: (event: any) => void,
  width?: string,
  margin: string,
  disabled?: boolean
};

const IconButton: FC<IconButtonPropsType> = ({disabled, icon, backgroundColor, onClick, width, margin}) => {
  const useButtonStyles = makeStyles(({
    button: {
      '&.MuiButtonBase-root.MuiFab-root': {
        minWidth: '32px',
        padding: '0 8px',
        width: width ? width : '32px',
        height: '32px',
        minHeight: '32px',
        borderRadius: '5px',
        boxShadow: 'none',
        margin: margin,
        backgroundColor: backgroundColor
      }
    }
  }));
  const classes = useButtonStyles()
  return (
    <Fab disabled={disabled} className={classes.button} onClick={(event) => onClick(event)}>
      {icon}
    </Fab>
  );
};

export default IconButton