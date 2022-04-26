import React, {useState} from 'react';
import IconButton from "../../components/IconButton";
import {makeStyles} from "@mui/styles";
import {BlockBox} from "../../components";
import {Alert, Button, Typography} from "@mui/material";
import ContainedSelect from "../../components/Selects/ContainedSelect";
import Snackbar from "../../components/Snackbar";

const DownloadSvg = () => {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M11.666 37.916C12.6325 37.916 13.416 38.6995 13.416 39.666V44.3327C13.416 44.6549 13.6772 44.916 13.9993 44.916H41.9994C42.3216 44.916 42.5827 44.6549 42.5827 44.3327V39.666C42.5827 38.6995 43.3662 37.916 44.3327 37.916C45.2992 37.916 46.0827 38.6995 46.0827 39.666V44.3327C46.0827 46.5878 44.2545 48.416 41.9994 48.416H13.9993C11.7442 48.416 9.91602 46.5878 9.91602 44.3327V39.666C9.91602 38.6995 10.6995 37.916 11.666 37.916Z"
            fill="#738094"/>
      <path
        d="M25.0552 8.75C23.8552 8.75 22.8539 9.66728 22.7491 10.8629C22.3906 14.9526 22.3274 19.0624 22.5597 23.1603C21.9834 23.1921 21.4073 23.2291 20.8315 23.271L17.356 23.5244C16.016 23.622 15.2669 25.1162 15.9903 26.2484C18.4684 30.1266 21.6615 33.498 25.3994 36.1832L26.7917 37.1835C27.5139 37.7022 28.4866 37.7022 29.2088 37.1835L30.6011 36.1832C34.3391 33.498 37.532 30.1266 40.0103 26.2484C40.7336 25.1162 39.9846 23.622 38.6446 23.5244L35.1691 23.271C34.5932 23.2291 34.0171 23.1921 33.4408 23.1603C33.6732 19.0624 33.6099 14.9526 33.2515 10.8629C33.1465 9.66728 32.1453 8.75 30.9453 8.75H25.0552Z"
        fill="#738094"/>
    </svg>
  );
};

const ErrorSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="#FF4D4F"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M11.1618 4.83737C11.3896 5.06518 11.3896 5.43455 11.1618 5.66236L5.66187 11.1623C5.43406 11.3901 5.06469 11.3901 4.83688 11.1623C4.60906 10.9345 4.60906 10.5651 4.83688 10.3373L10.3368 4.83737C10.5646 4.60955 10.934 4.60955 11.1618 4.83737Z"
            fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.83688 4.83737C5.06469 4.60955 5.43406 4.60955 5.66187 4.83737L11.1618 10.3373C11.3896 10.5651 11.3896 10.9345 11.1618 11.1623C10.934 11.3901 10.5646 11.3901 10.3368 11.1623L4.83688 5.66236C4.60906 5.43455 4.60906 5.06518 4.83688 4.83737Z"
            fill="white"/>
    </svg>
  );
};


const LoadCall = () => {
  const useStyles = makeStyles(({
    loadCallInner: {
      padding: '40px 0',
      margin: '0 auto',
    },
    loadCallTitle: {
      textAlign: 'center',
      margin: '24px 0 30px 0 !important',
      fontSize: '18px !important',
      color: '#2F3747 !important',
      fontWeight: '700 !important',
      cursor: 'default'
    },
    loadCallSelectLabel: {
      cursor: 'default',
      marginBottom: '10px !important'
    },
    loadCallButton: {
      width: '100% !important',
      // @ts-ignore
      textTransform: 'none !important'
    }
  }));
  const classes = useStyles();


  const employeeSelectTestOptions = [
    {value: 'Слева', label: 'Слева'},
    {value: 'В центре', label: 'В центре'},
    {value: 'Справа', label: 'Справа'}
  ];
  const [employeeSelectTestValues, setEmployeeSelectTestValues] = useState(employeeSelectTestOptions[0]);

  const metaSelectTestOptions = [
    {value: 'Не вытаскивать', label: 'Не вытаскивать'},
    {value: 'Вытаскивать', label: 'Вытаскивать'}
  ];
  const [metaSelectTestValues, setMetaSelectTestValues] = useState(metaSelectTestOptions[0]);

  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const handleOpen = () => {
    setSnackbarIsOpen(true);
  };
  const handleClose = () => {
    setSnackbarIsOpen(false);
  };

  return (
    <BlockBox margin={'60px auto'} width={'540px'} height={'480px'}>
      <div className={classes.loadCallInner}>
        <div style={{textAlign: 'center'}}>
          <IconButton
            borderRadius={'10px'}
            icon={<DownloadSvg/>}
            backgroundColor={'#E3E8EF'}
            onClick={() => null}
            margin={'0'}
            width={'96px'}
            height={'96px'}
          />
        </div>
        <Typography className={classes.loadCallTitle}>Загрузите аудио в формате MP3 или WAV</Typography>
        <div style={{width: '320px', margin: '0 auto'}}>
          <div style={{marginBottom: '30px'}}>
            <Typography className={classes.loadCallSelectLabel}>Позиция сотрудника</Typography>
            <ContainedSelect
              width={'320px'}
              justify={'center'}
              onSelectChange={(event) => setEmployeeSelectTestValues(event)}
              options={employeeSelectTestOptions}
              value={employeeSelectTestValues}
            />
          </div>
          <div style={{marginBottom: '30px'}}>
            <Typography className={classes.loadCallSelectLabel}>Позиция сотрудника</Typography>
            <ContainedSelect
              width={'320px'}
              justify={'center'}
              onSelectChange={(event) => setMetaSelectTestValues(event)}
              options={metaSelectTestOptions}
              value={metaSelectTestValues}
            />
          </div>
          <Button onClick={handleOpen} variant={"contained"} className={classes.loadCallButton}>Загрузить аудио</Button>
        </div>
      </div>
      <Snackbar
        type={'error'}
        open={snackbarIsOpen}
        onClose={handleClose}
        text={'Эта функция пока не работает'}
        time={2000}
      />
    </BlockBox>
  );
};

export default LoadCall;
