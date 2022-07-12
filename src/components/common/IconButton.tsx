import React, {FC} from "react";
import {makeStyles} from "@mui/styles";
import {Fab, Tooltip} from "@mui/material";

type TooltipPlacementType =
  'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';

type IconButtonPropsType = {
  onClick: (event: any) => void,
  disabled?: boolean,

  icon: any,
  backgroundColor?: string,
  borderRadius?: string,
  margin?: string,
  width?: string,
  height?: string,

  tooltip?: boolean,
  tooltipTitle?: string,
  tooltipPlacement?: TooltipPlacementType
};

const IconButton: FC<IconButtonPropsType> = (
  {
    // logic
    onClick,
    disabled,

    // styles
    icon,
    backgroundColor,
    borderRadius,
    margin,
    width,
    height,

    // tooltip params
    tooltipTitle,
    tooltipPlacement
  }) => {

  const useButtonStyles = makeStyles(({
    button: {
      '&.MuiButtonBase-root.MuiFab-root': {
        opacity: disabled ? "0.8" : "1",
        minWidth: '32px',
        padding: '0 8px',
        width: width ? width : '32px',
        height: height ? height : '32px',
        minHeight: '32px',
        borderRadius: borderRadius ? borderRadius : '5px',
        boxShadow: 'none',
        margin: margin ? margin : "0",
        backgroundColor: backgroundColor ? backgroundColor : "#E3E8EF"
      }
    },
    tooltip: {
      borderRadius: "3px",
      fontFamily: 'Inter, sans-serif !important',
      color: '#000 !important',
      fontSize: '14px !important',
      backgroundColor: '#fff !important',
      marginBottom: '7px !important',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    },
  }));

  const classes = useButtonStyles()

  return (
    <Tooltip
      title={tooltipTitle ? tooltipTitle : ""}
      placement={tooltipPlacement}
      classes={{tooltip: classes.tooltip}}
    >
      <Fab
        disabled={disabled}
        className={classes.button}
        onClick={(event) => onClick(event)}
      >
        {icon}
      </Fab>
    </Tooltip>
  );
};

export default IconButton;