import React, {FC} from 'react';
import {makeStyles} from '@mui/styles';

type BoxPropsType = {
  width?: string,
  padding?: string,
  borderRadius?: string,
  border?: string,
  height?: string,
  minHeight?: string,
  margin?: string,
  bcColor?: string,
  boxShadow?: string,
};

const BlockBox: FC<BoxPropsType> = ({bcColor, margin, width, padding = '0', border,
                                     borderRadius = '10px', height = '100%', minHeight, boxShadow, children
                                   }) => {
  const useStyles = makeStyles(({
    boxWrapper: {
      backgroundColor: bcColor ? bcColor : '#FFFFFF',
      margin: margin ? margin : '0px',
      width,
      height,
      minHeight,
      padding,
      border,
      borderRadius,
      boxShadow,
    }
  }));
  const classes = useStyles();
  return <div className={classes.boxWrapper}>
    {children}
  </div>
};

export default BlockBox;