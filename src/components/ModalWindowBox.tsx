import React from 'react';
import Dialog from "@mui/material/Dialog";
import {makeStyles} from "@mui/styles";
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import BlockBox from "./BlockBox";

const useStyles = makeStyles(({
  mwWrapper: {
    height: '100%',
    '& .MuiPaper-root': {
      borderRadius: '10px !important',

      width: '400px !important',
      margin: '0'
    }
  }
}));

type AuthModalWindowPropsType = {
  isOpen: boolean,
  handleClose: () => void
}

const Transition = React.forwardRef((
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props}/>
);

export const AuthModalWindow: React.FC<AuthModalWindowPropsType> = ({isOpen, handleClose, children}) => {
  const classes = useStyles();
  return (
    <Dialog className={classes.mwWrapper} open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
      <BlockBox padding="24px">
        {children}
      </BlockBox>
    </Dialog>
  );
};

export default AuthModalWindow;
