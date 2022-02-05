import React, {FC} from 'react';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(({
  boxWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px'
  }
}));

type BoxPropsType = {
  width?: string,
  padding: string
};

export const BlockBox: FC<BoxPropsType> = ({width, padding = '0', children}) => {
  const classes = useStyles();
  return (
    <div style={{width: width, padding}} className={classes.boxWrapper}>
      {children}
    </div>
  );
};