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

const BlockBox: FC<BoxPropsType> = ({width, padding = '0', children}) => {
  const classes = useStyles();
  return (
    <div style={{height: '100%', width: width, padding}} className={classes.boxWrapper}>
      {children}
    </div>
  );
};

export default BlockBox;