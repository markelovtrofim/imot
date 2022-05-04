import React, {FC} from 'react';
import {Alert, CircularProgress} from "@mui/material";
import {InfoSvg, WarningSvg, ErrorSvg, SuccessSvg} from './Alert.svg';

type AlertType = {
  iconType: 'info' | 'warning' | 'error' | 'loading' | 'success',
  padding?: string,
  boxShadow?: string,
  text: string
}

const CustomAlert: FC<AlertType> = (
  {
    iconType,

    padding,
    boxShadow,

    text
  }
) => {
  const getIcon = () => {
    if (iconType === 'info') {
      return {
        icon: <InfoSvg/>,
        color: '#fff'
      }
    } else if (iconType === 'warning') {
      return {
        icon: <WarningSvg/>,
        color: '#fff'
      }
    } else if (iconType === 'error') {
      return {
        icon: <ErrorSvg/>,
        color: '#fff'
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
        padding: padding ? padding : '0',
        fontSize: '15px',
        backgroundColor: alertObject.color,
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