import React, {FC} from 'react';
import {makeStyles} from '@mui/styles';

type BoxPropsType = {
  width?: string,
  padding?: string,
  borderRadius?: string,
  border?: string,
  height?: string,
  margin?: string
};

const BlockBox: FC<BoxPropsType> = ({margin, width, padding = '0', border,
                                     borderRadius = '10px', height = '100%', children
                                   }) => {
  const useStyles = makeStyles(({
    boxWrapper: {
      backgroundColor: '#FFFFFF',
      height: height,
      margin: margin ? margin : '0px',
      width,
      padding,
      border,
      borderRadius
    }
  }));
  const classes = useStyles();
  return <div className={classes.boxWrapper}>
    {children}
  </div>
};

export default BlockBox;