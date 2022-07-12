import React, {FC, memo} from 'react';
import {Alert, CircularProgress, Snackbar} from "@mui/material";
import {makeStyles} from "@mui/styles";

const InfoSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8.91429 4.34286C8.91429 4.8478 8.50496 5.25714 8 5.25714C7.49504 5.25714 7.08571 4.8478 7.08571 4.34286C7.08571 3.83792 7.49504 3.42857 8 3.42857C8.50496 3.42857 8.91429 3.83792 8.91429 4.34286ZM8 6.85714C8.3787 6.85714 8.68571 7.16416 8.68571 7.54286V12.1143C8.68571 12.493 8.3787 12.8 8 12.8C7.6213 12.8 7.31429 12.493 7.31429 12.1143V7.54286C7.31429 7.16416 7.6213 6.85714 8 6.85714Z" fill="#722ED1"/>
    </svg>
  );
};

const WarningSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM7.5 4.625C7.5 4.55625 7.55625 4.5 7.625 4.5H8.375C8.44375 4.5 8.5 4.55625 8.5 4.625V8.875C8.5 8.94375 8.44375 9 8.375 9H7.625C7.55625 9 7.5 8.94375 7.5 8.875V4.625ZM8 11.5C7.80374 11.496 7.61687 11.4152 7.47948 11.275C7.3421 11.1348 7.26515 10.9463 7.26515 10.75C7.26515 10.5537 7.3421 10.3652 7.47948 10.225C7.61687 10.0848 7.80374 10.004 8 10C8.19626 10.004 8.38313 10.0848 8.52052 10.225C8.6579 10.3652 8.73485 10.5537 8.73485 10.75C8.73485 10.9463 8.6579 11.1348 8.52052 11.275C8.38313 11.4152 8.19626 11.496 8 11.5Z" fill="#FAAD14"/>
    </svg>
  );
};

const ErrorSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="#FF4D4F"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.1618 4.83688C11.3896 5.06469 11.3896 5.43406 11.1618 5.66187L5.66187 11.1618C5.43406 11.3896 5.06469 11.3896 4.83688 11.1618C4.60906 10.934 4.60906 10.5646 4.83688 10.3368L10.3368 4.83688C10.5646 4.60906 10.934 4.60906 11.1618 4.83688Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.83688 4.83688C5.06469 4.60906 5.43406 4.60906 5.66187 4.83688L11.1618 10.3368C11.3896 10.5646 11.3896 10.934 11.1618 11.1618C10.934 11.3896 10.5646 11.3896 10.3368 11.1618L4.83688 5.66187C4.60906 5.43406 4.60906 5.06469 4.83688 4.83688Z" fill="white"/>
    </svg>
  );
};

const SuccessSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="#73D13D"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.0209 5.31295C12.2161 5.50821 12.2161 5.8248 12.0209 6.02006L7.35418 10.6867C7.15892 10.882 6.84238 10.882 6.6471 10.6867L3.98043 8.02004C3.78517 7.82477 3.78517 7.50824 3.98043 7.31297C4.17569 7.1177 4.49228 7.1177 4.68754 7.31297L7.00065 9.62604L11.3138 5.31295C11.5091 5.11769 11.8256 5.11769 12.0209 5.31295Z" fill="white"/>
    </svg>
  );
};

export type SnackbarType = {
  type: string,
  text: string,
  value: boolean,
  time: number | null
}


type SnackbarPropsType = {
  type: string,
  open: boolean,
  onClose: (event: any) => void,
  text: string,
  time: number | null,
  bg?: string
};

const CustomSnackbar: FC<SnackbarPropsType> = memo(({type, open, onClose, text, time, bg}) => {
  const useStyles = makeStyles(({
    snackbar: {
      testAlign: 'center !important'
    }
  }));
  const classes = useStyles();

  const getIcon = () => {
    if (type === 'info') {
      return <InfoSvg/>
    } else if (type === 'warning') {
      return <WarningSvg/>
    } else if (type === 'error') {
      return <ErrorSvg/>
    } else if (type === 'loading') {
      return <CircularProgress style={{width: '16px', height: '16px'}}/>
    } else {
      return <SuccessSvg/>
    }
  };
  const icon = getIcon();
  return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={open}
        onClose={onClose}
        autoHideDuration={time}
        className={classes.snackbar}
      >
        <Alert
          icon={icon}
          sx={{
            padding: '15px 40px',
            fontSize: '15px',
            backgroundColor: bg ? bg : '#fff',
            boxShadow: '0px 9px 28px 8px rgba(0, 0, 0, 0.15), 0px 6px 16px rgba(0, 0, 0, 0.18), 0px 3px 6px -4px rgba(0, 0, 0, 0.22)',
            '& .MuiAlert-icon': {
              paddingTop: '10px !important'
            }
          }}
        >
          {text}
        </Alert>
      </Snackbar>
  );
});

export default CustomSnackbar;