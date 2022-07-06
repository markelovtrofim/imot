import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import cn from 'classnames';
import {PhonePng, DashboardPng, SoundPng} from '../../assets/images/Auth';
import LogoImg from '../../assets/images/logo.svg';
import {authSlice, fetchAuthToken} from "../../store/auth/auth.slice";
import {useAppSelector} from "../../hooks/redux";
import {useFormik} from 'formik';
import {LoadingButton} from "@mui/lab";
import {Redirect, useHistory} from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import Alert from "@mui/material/Alert";
import Input from "../../components/common/Input";
import ForgotPasswordModalWindow from "./ForgotPasswordModalWindow";
import Button from '@mui/material/Button';
import SignUpModalWindow from "./SignUpModalWindow";
import {useDispatch} from "react-redux";
import {getChildUser, getChildUsers, getMe} from "../../store/users/users.slice";

const useStyles = makeStyles(({
  authWrapper: {
    height: '100vh',
    display: 'flex',
  },
  authBothSides: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  authGreetSide: {
    flex: '0 0 54%',
    background: 'linear-gradient(124deg, rgba(126,174,255,1) 0%, rgba(147,173,251,1) 31%, rgba(252,166,233,1) 100%)'
  },
  authText: {
    position: 'relative',
    color: '#FFFFFF !important'
  },
  authWelcome: {
    fontSize: '20px !important',
  },
  authTo: {
    margin: '8px 0 23px 0 !important',
    fontSize: '46px !important',
    fontWeight: '700 !important'
  },
  authHelp: {
    fontSize: '16px !important',
    color: '#F8FAFC !important'
  },

  authPhoneIcon: {
    margin: '0 0 100px 60px'
  },
  authDashboardIcon: {
    marginLeft: '230px'
  },
  authSoundIcon: {
    margin: '60px 0 0 130px'
  },

  authFormSide: {
    flex: '0 0 46%',
    background: 'linear-gradient(124deg, rgba(220,205,247,1) 0%, rgba(252,177,235,1) 100%)'
  },
  authFormInner: {
    width: '320px',
    margin: '0 10px'
  },
  authInputBox: {
    position: 'relative',
    marginBottom: '18px !important'
  },
  authInput: {
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    width: '100%',
    '& .MuiInputLabel-root': {
      color: '#738094 !important',
      fontSize: '14px !important',
      left: '-5px',
      top: '-9px'
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
      padding: '8px 28px 8px 10px !important',
      color: '#738094'
    }
  },
  authLogoBox: {
    textAlign: 'center',
    marginBottom: '56px'
  },
  authPasswordInputIcon: {
    position: 'absolute',
    right: '10px',
    top: '31px'
  },
  authLoginInputIcon: {
    position: 'absolute',
    right: '10px',
    top: '10px'
  },
  authForgotButton: {
    padding: '0 5px !important',
    color: '#722ED1 !important',
    fontWeight: '700 !important',
    // @ts-ignore
    textTransform: 'none !important',
    fontSize: '12px !important',
    position: 'absolute',
    right: '-220px',
    top: '-5px',
  },
  authButton: {
    width: '100%',
    margin: '16px 0 30px 0 !important',
    '& .MuiLoadingButton-loadingIndicator': {
      right: '123px'
    },
  }
}));

const LoginSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.0909 11.4227C12.7593 10.6372 12.2781 9.92377 11.6741 9.32207C11.0719 8.71863 10.3586 8.23751 9.57348 7.90527C9.56645 7.90176 9.55942 7.9 9.55239 7.89648C10.6475 7.10547 11.3594 5.81699 11.3594 4.36328C11.3594 1.95508 9.40825 0.00390625 7.00004 0.00390625C4.59184 0.00390625 2.64067 1.95508 2.64067 4.36328C2.64067 5.81699 3.35258 7.10547 4.4477 7.89824C4.44067 7.90176 4.43364 7.90352 4.42661 7.90703C3.63911 8.23926 2.93247 8.71562 2.32602 9.32383C1.72258 9.926 1.24146 10.6393 0.909224 11.4244C0.582837 12.193 0.406809 13.0171 0.390669 13.852C0.3902 13.8707 0.39349 13.8894 0.400347 13.9068C0.407204 13.9243 0.417488 13.9402 0.430593 13.9537C0.443698 13.9671 0.45936 13.9778 0.476654 13.9851C0.493949 13.9923 0.512527 13.9961 0.531294 13.9961H1.58598C1.66333 13.9961 1.72485 13.9346 1.72661 13.859C1.76176 12.502 2.30668 11.2311 3.26997 10.2678C4.26665 9.27109 5.59028 8.72266 7.00004 8.72266C8.40981 8.72266 9.73344 9.27109 10.7301 10.2678C11.6934 11.2311 12.2383 12.502 12.2735 13.859C12.2752 13.9363 12.3368 13.9961 12.4141 13.9961H13.4688C13.4876 13.9961 13.5061 13.9923 13.5234 13.9851C13.5407 13.9778 13.5564 13.9671 13.5695 13.9537C13.5826 13.9402 13.5929 13.9243 13.5997 13.9068C13.6066 13.8894 13.6099 13.8707 13.6094 13.852C13.5918 13.0117 13.4178 12.1943 13.0909 11.4227ZM7.00004 7.38672C6.19321 7.38672 5.43383 7.07207 4.86254 6.50078C4.29126 5.92949 3.97661 5.17012 3.97661 4.36328C3.97661 3.55645 4.29126 2.79707 4.86254 2.22578C5.43383 1.65449 6.19321 1.33984 7.00004 1.33984C7.80688 1.33984 8.56626 1.65449 9.13754 2.22578C9.70883 2.79707 10.0235 3.55645 10.0235 4.36328C10.0235 5.17012 9.70883 5.92949 9.13754 6.50078C8.56626 7.07207 7.80688 7.38672 7.00004 7.38672Z"
        fill="#2F3747"/>
    </svg>
  );
};

const PasswordSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4.875 11C4.875 10.3787 5.3787 9.875 6 9.875C6.6213 9.875 7.125 10.3787 7.125 11C7.125 11.6213 6.6213 12.125 6 12.125C5.3787 12.125 4.875 11.6213 4.875 11Z"
        fill="#2F3747"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M2.71622 6.94792L2.47964 4.81871C2.44931 4.54573 2.44931 4.27022 2.47964 3.99724L2.49672 3.84356C2.67783 2.21352 3.95929 0.923783 5.58816 0.73215C5.86176 0.69996 6.13821 0.69996 6.41181 0.73215C8.04066 0.923783 9.32211 2.21353 9.50324 3.84357L9.52026 3.99724C9.55064 4.27022 9.55064 4.54573 9.52026 4.8187L9.28371 6.94792L9.79866 6.98902C10.6107 7.05389 11.2738 7.66432 11.4055 8.46824C11.68 10.1449 11.68 11.8552 11.4055 13.5319C11.2738 14.3359 10.6107 14.9463 9.79866 15.0111L8.67659 15.1007C6.89504 15.2429 5.10501 15.2429 3.32345 15.1007L2.20135 15.0111C1.3893 14.9463 0.726226 14.3359 0.594586 13.5319C0.320034 11.8552 0.320034 10.1449 0.594586 8.46824C0.726226 7.66432 1.3893 7.05389 2.20135 6.98902L2.71622 6.94792ZM5.71956 1.84945C5.90586 1.82753 6.09411 1.82753 6.28034 1.84945C7.38936 1.97991 8.26176 2.85802 8.38514 3.9678L8.40216 4.12147C8.42331 4.31188 8.42331 4.50406 8.40216 4.69447L8.16134 6.86234C6.72194 6.76964 5.27804 6.76964 3.83864 6.86234L3.59777 4.69447C3.57661 4.50406 3.57661 4.31188 3.59777 4.12147L3.61484 3.9678C3.73815 2.85802 4.61061 1.97991 5.71956 1.84945ZM8.58704 8.02087C6.86511 7.88347 5.13494 7.88347 3.41297 8.02087L2.29088 8.11049C1.99468 8.13412 1.75282 8.35679 1.7048 8.65004C1.44996 10.2064 1.44996 11.7938 1.7048 13.3501C1.75282 13.6434 1.99468 13.8661 2.29088 13.8897L3.41297 13.9792C5.13494 14.1167 6.86511 14.1167 8.58704 13.9792L9.70911 13.8897C10.0054 13.8661 10.2472 13.6434 10.2952 13.3501C10.5501 11.7938 10.5501 10.2064 10.2952 8.65004C10.2472 8.35679 10.0054 8.13412 9.70911 8.11049L8.58704 8.02087Z"
            fill="#1B202B"/>
    </svg>
  );
};

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [buttonClick, setButtonClick] = useState<boolean>(false);

  const [openChangePasswordWindow, setOpenChangePasswordWindow] = useState<boolean>(false);
  const handleOpenChangePasswordWindow = () => setOpenChangePasswordWindow(true);
  const handleCloseChangePasswordWindow = () => setOpenChangePasswordWindow(false);

  const [openSignUpWindow, setOpenSignUpWindow] = useState<boolean>(false);
  const handleOpenSignUpWindow = () => setOpenSignUpWindow(true);
  const handleCloseSignUpWindow = () => setOpenSignUpWindow(false);

  const error = useAppSelector(state => state.auth.error);
  const {language} = useAppSelector(state => state.lang);
  const currentUser = useAppSelector(state => state.users.currentUser);

  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values) => {
      setButtonClick(true);
      const authData = await dispatch(fetchAuthToken(values));
      setButtonClick(false);

      // @ts-ignore
      if (authData.payload) {
        const meData = await dispatch(getMe());
        // @ts-ignore
        const me = meData.payload;

        await dispatch(getChildUser());
        await dispatch(getChildUsers());

        history.location.pathname = "/";
        history.push(`/${language}/${me ? me.id : "_"}/calls`)
      }

    },
  });

  useEffect(() => {
    return () => {
      setButtonClick(false);
      dispatch(authSlice.actions.setError(null));
    }
  }, [dispatch]);


  return (
    <div className={classes.authWrapper}>
      <div className={cn(classes.authGreetSide, classes.authBothSides)}>
        <div>
          <img className={classes.authPhoneIcon} src={PhonePng} alt=""/>
          <img className={classes.authDashboardIcon} src={DashboardPng} alt=""/>
          <Typography className={cn(classes.authWelcome, classes.authText)}>
            ДОБРО ПОЖАЛОВАТЬ
          </Typography>
          <Typography className={cn(classes.authTo, classes.authText)}>
            В речевую аналитику
          </Typography>
          <Typography className={cn(classes.authHelp, classes.authText)}>
            Войдите, чтобы получить доступ
          </Typography>
          <img className={classes.authSoundIcon} src={SoundPng} alt=""/>
        </div>
      </div>

      <div className={cn(classes.authFormSide, classes.authBothSides)}>
        <div className={classes.authFormInner}>
          <div className={classes.authLogoBox}>
            <img src={LogoImg} height={30} alt="This is Logo icon."/>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className={classes.authInputBox}>
              <Input
                name={"username"}
                type={"text"}
                handleChange={formik.handleChange}
                value={formik.values.username}
                bcColor={"#FFFFFF"}
                label={"Login"}
              />
              <LoginSvg className={classes.authLoginInputIcon}/>
            </div>
            <div className={classes.authInputBox}>
              <Button tabIndex={-1} onClick={() => {
                handleOpenChangePasswordWindow();
              }}
                      className={classes.authForgotButton}>
                Забыли пароль
              </Button>
              <Input
                name={"password"}
                type={"password"}
                handleChange={formik.handleChange}
                value={formik.values.password}
                bcColor={"#FFFFFF"}
                label={"Password"}
              />
              <div style={{width: '32px', height: '100%'}}>
                <PasswordSvg className={classes.authPasswordInputIcon}/>
              </div>
            </div>

            <LoadingButton
              className={classes.authButton} loading={buttonClick} loadingPosition="end"
              endIcon={<SendIcon/>} type="submit"
              variant="contained" color="primary"
            >
              Войти
            </LoadingButton>
          </form>
          <Button
            className={classes.authButton}
            variant="outlined" color="primary"
            onClick={handleOpenSignUpWindow}
          >
            Зарегистрироваться
          </Button>
          <div style={{height: '48px'}}>
            {error ? <Alert severity="error">{error}</Alert> : null}
          </div>
        </div>
        <ForgotPasswordModalWindow isOpen={openChangePasswordWindow} handleClose={handleCloseChangePasswordWindow}/>
        <SignUpModalWindow isOpen={openSignUpWindow} handleClose={handleCloseSignUpWindow}/>
      </div>
    </div>
  );
};

export default Auth;
