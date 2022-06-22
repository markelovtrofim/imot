import React, {useEffect, useState} from 'react';
import ModalWindowBox from "../../components/common/ModalWindowBox";
import {IconButton, Typography} from "@mui/material";
import cn from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../../components/common/Input";
import {LoadingButton} from "@mui/lab";
import {makeStyles} from "@mui/styles";
import {useFormik} from "formik";
import {useAppSelector} from "../../hooks/redux";
import {translate} from "../../localizations";

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
    marginTop: '25px',
    textAlign: 'right'
  }
}));

const ForgotPasswordModalWindow = ({isOpen, handleClose}: any) => {
  const classes = useStyles();
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState<boolean>(true);

  const validate = (values: { email: string }) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      setSubmitButtonDisabled(true);
    } else {
      setSubmitButtonDisabled(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate,
    onSubmit: async (values) => {
      alert(values.email);
    },
  });

  useEffect(() => {
    formik.values.email = '';
  }, [handleClose])

  const {language} = useAppSelector(state => state.lang);

  return (
    <ModalWindowBox
      isMWOpen={isOpen}
      handleMWClose={handleClose}
      text={"Забыли пароль?"}
    >
      <Typography className={cn(classes.mwHelp, classes.mwText)}>
        Ввидите email для восстановление пароля,на него будет
        выслано письмо.
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Input
          name={"email"}
          type={"email"}
          handleChange={formik.handleChange}
          value={formik.values.email}
          bcColor={"#EEF2F6"}
          label={"Email"}
          autoComplete="off"
        />
        <div className={classes.mwButtonBox}>
          <LoadingButton
            disabled={submitButtonDisabled}
            type="submit"
            style={{marginRight: '15px'}}
            variant="contained"
            color="primary"
          >
            {translate("sendButton", language)}
          </LoadingButton>
          <LoadingButton
            onClick={handleClose}
            variant="contained"
            color="secondary"
          >
            {translate("cancelButtonMW", language)}
          </LoadingButton>
        </div>
      </form>
    </ModalWindowBox>
  );
};

export default ForgotPasswordModalWindow;