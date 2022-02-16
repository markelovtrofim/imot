import React, {useState} from 'react';
import ModalWindowBox from "../../components/ModalWindowBox";
import {IconButton, Typography} from "@mui/material";
import cn from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../../components/Input";
import {LoadingButton} from "@mui/lab";
import {makeStyles} from "@mui/styles";
import MuiPhoneNumber from 'mui-phone-number';
import {Form, Formik} from "formik";

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
  },
  mwNumberInput: {
    width: '100%',
    '& .MuiInput-root:before': {
      border: 'none !important'
    },
    '& .MuiInput-root:after': {
      border: 'none !important'
    },
    '& .MuiInput-root .MuiInputAdornment-root .MuiButton-root': {
      padding: '12px 15px',
      backgroundColor: '#CDD5DF',
      color: '#000',
      width: '20px',
      borderRadius: '5px 0 0 5px',
      height: '35px'
    },
    '& .MuiInput-root': {
      height: '35px',
      marginLeft: '0px',
      justifyContent: 'space-between',
      borderRadius: '5px',
      backgroundColor: '#EEF2F6',
      fontSize: '14px',
      color: '#738094'
    },
    '& .MuiInput-root input::selection ': {
      backgroundColor: '#EEF2F6'
    },
  }
}));

const ForgotPasswordModalWindow = ({isOpen, handleClose}: any) => {
  const classes = useStyles();
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState<boolean>(true);

  const validate = (values: {
    name: string,
    email: string,
    phoneNumber: string
  }) => {
    console.log(values.phoneNumber.replace(/\D+/g, "").toString().length)
    if (values.name.length > 0 && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email) && values.phoneNumber.replace(/\D+/g, "").toString().length > 5) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  };

  return (
    <ModalWindowBox isOpen={isOpen} handleClose={handleClose}>
      <div className={classes.mwTitle}>
        <Typography className={cn(classes.mwTitleText, classes.mwText)}>Забронировать бесплатную версию</Typography>
        <IconButton className={classes.mwIconButton} onClick={handleClose} tabIndex={-1}>
          <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
        </IconButton>
      </div>
      <Typography className={cn(classes.mwHelp, classes.mwText)}>
        Пожалуйста, заполните форму, и наша команда свяжется с вами
      </Typography>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phoneNumber: ''
        }}
        validate={validate}
        onSubmit={values => {
          alert(JSON.stringify(values, null, 2));
        }}
        render={({
                   handleChange,
                   setFieldValue,
                 }) => {
          return (
            <Form>
              <div style={{marginTop: '25px'}}>
                <Input
                  name={"name"}
                  type={"text"}
                  bcColor={"#EEF2F6"}
                  label={"Ваше имя"}
                  handleChange={handleChange}
                />
              </div>
              <div style={{marginTop: '25px'}}>
                <Input
                  name={"email"}
                  type={"email"}
                  bcColor={"#EEF2F6"}
                  label={"Email"}
                  handleChange={handleChange}
                />
              </div>
              <div style={{margin: '25px 0'}}>
                <Typography style={{color: '#738094', margin: '0 0 10px 9px', fontSize: '11px'}}>Номер
                  телефона</Typography>
                <MuiPhoneNumber onChange={e => setFieldValue("phoneNumber", e)}
                                className={classes.mwNumberInput}
                                defaultCountry={'ru'}/>
              </div>
              <div className={classes.mwButtonBox}>
                <LoadingButton type="submit" disabled={submitButtonDisabled} style={{marginRight: '15px'}}
                               variant="contained"
                               color="primary">
                  Отправить
                </LoadingButton>
                <LoadingButton onClick={handleClose} variant="contained" color="secondary">
                  Отмена
                </LoadingButton>
              </div>
            </Form>
          )
        }}
      >
      </Formik>
    </ModalWindowBox>
  );
};

export default ForgotPasswordModalWindow;