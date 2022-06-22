import React, {useState} from 'react';
import Dialog from "@mui/material/Dialog";
import {makeStyles} from "@mui/styles";
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import BlockBox from "./BlockBox";
import {IconButton, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {translate} from "../../localizations";
import {useAppSelector} from "../../hooks/redux";

const Transition = React.forwardRef((
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props}/>
);

type AuthModalWindowPropsType = {
  isMWOpen: boolean,
  handleMWClose: () => void,
  text: string,

  width?: string,
  height?: string
}

export const ModalWindow: React.FC<AuthModalWindowPropsType> = (
  {
    isMWOpen,
    handleMWClose,

    text,
    children,

    width,
    height
  }
) => {
  const useStyles = makeStyles(({
    mwWrapper: {
      height: '100% !important',
      '& .MuiPaper-root': {
        overflow: 'hidden',
        borderRadius: '10px !important',
        height: height ? `${height} !important` : 'auto',
        width: width ? `${width} !important` : '400px',
        margin: '0'
      }
    },
    mwTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mwTitleText: {
      fontWeight: '700 !important'
    }
  }));
  const classes = useStyles();

  return (
    <Dialog disableScrollLock={true}
            className={classes.mwWrapper}
            open={isMWOpen} onClose={handleMWClose}
            TransitionComponent={Transition}
    >
      <BlockBox padding="24px">

        {/* Шапка */}
        <div className={classes.mwTitle}>
          <Typography className={classes.mwTitleText}>{text}</Typography>
          <IconButton onClick={handleMWClose}>
            <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
          </IconButton>
        </div>

        <div>
          {children}
        </div>
      </BlockBox>
    </Dialog>
  );
};

export default ModalWindow;
