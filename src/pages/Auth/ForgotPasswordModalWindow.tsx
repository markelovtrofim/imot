import React, {useState} from 'react';
import ModalWindowBox from "../../components/ModalWindowBox";
import {IconButton, Typography} from "@mui/material";
import cn from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../../components/Input";
import {LoadingButton} from "@mui/lab";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(({
  mwTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  mwTitleText: {
    fontWeight: '700 !important'
  },
  mwIconButton: {},
  mwText: {
    color: "#738094 !important",
  },
  mwHelp: {
    marginBottom: '35px !important'
  },
  mwButtonBox: {
    textAlign: 'right'
  }
}));

const ForgotPasswordModalWindow = ({isOpen, handleClose}: any) => {
  const classes = useStyles();

  return (
    <ModalWindowBox isOpen={isOpen} handleClose={handleClose}>
      <div className={classes.mwTitle}>
        <Typography className={cn(classes.mwTitleText, classes.mwText)}>Забыли пароль?</Typography>
        <IconButton className={classes.mwIconButton} onClick={handleClose}>
          <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
        </IconButton>
      </div>
      <Typography className={cn(classes.mwHelp, classes.mwText)}>Ввидите email для восстановление пароля,на него будет
        выслано письмо.</Typography>
      <Input
        name={"email"}
        type={"text"}
        bcColor={"#EEF2F6"}
        label={"Email"}
      />
      <div className={classes.mwButtonBox}>
        <LoadingButton variant="contained" color="primary">
          Отправить
        </LoadingButton>
        <LoadingButton variant="contained" color="secondary">
          Отмена
        </LoadingButton>
      </div>
    </ModalWindowBox>
  );
};

export default ForgotPasswordModalWindow;