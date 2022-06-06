import React from 'react';
import Dialog from "@mui/material/Dialog";
import {makeStyles} from "@mui/styles";
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import BlockBox from "./BlockBox";

const Transition = React.forwardRef((
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props}/>
);

type AuthModalWindowPropsType = {
  isOpen: boolean,
  handleClose: () => void,
  width?: string,
  height?: string
}

export const ModalWindow: React.FC<AuthModalWindowPropsType> = ({
                                                                  isOpen, handleClose,
                                                                  width, height,
                                                                  children
}) => {
  const useStyles = makeStyles(({
    mwWrapper: {
      height: '100% !important',
      '& .MuiPaper-root': {
        overflow: 'hidden',
        borderRadius: '10px !important',
        height: height ? `${height} !important` : 'auto',
        width: width ? `${width} !important` : 'auto',
        margin: '0'
      }
    }
  }));
  const classes = useStyles();
  return (
    <Dialog disableScrollLock={true} className={classes.mwWrapper} open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
      <BlockBox padding="24px">
        {children}
      </BlockBox>
    </Dialog>
  );
};

export default ModalWindow;
