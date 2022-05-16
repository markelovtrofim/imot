import React, {FC} from 'react';
import {Alert, CircularProgress} from "@mui/material";
import {InfoSvg, WarningSvg, ErrorSvg, SuccessSvg} from './Alert.svg';

type AlertType = {
  iconType: 'info' | 'warning' | 'error' | 'loading' | 'success',
  text: string,

  padding?: string,
  boxShadow?: string,
  width?: string
}

const CustomAlert: FC<AlertType> = (
  {
    iconType,

    text,
    padding,
    boxShadow,
    width
  }
) => {
  const getIcon = () => {
    if (iconType === 'info') {
      return {
        icon: <InfoSvg/>,
        color: '#0388D1'
      }
    } else if (iconType === 'warning') {
      return {
        icon: <WarningSvg fill={'#fff'}/>,
        color: '#F57C00'
      }
    } else if (iconType === 'error') {
      return {
        icon: <ErrorSvg/>,
        color: '#D32F2F'
      }
    } else if (iconType === 'loading') {
      return {
        icon: <CircularProgress style={{width: '16px', height: '16px'}}/>,
        color: '#fff'
      }
    } else if (iconType === 'success') {
      return {
        icon: <SuccessSvg/>,
        color: '#fff'
      }
    } else {
      return {
        icon: <div></div>,
        color: '#fff'
      }
    }
  };
  const alertObject = getIcon();
  return (
    <Alert
      icon={alertObject.icon}
      sx={{
        padding: padding ? padding : '0 10px',
        width: width ? width : 'auto',
        fontSize: '15px',
        backgroundColor: alertObject.color,
        color: '#fff',
        boxShadow: boxShadow ? boxShadow : 'none',
        '& .MuiAlert-icon': {
          paddingTop: '10px !important'
        }
      }}
    >
      {text}
    </Alert>
  );
}

export default CustomAlert;