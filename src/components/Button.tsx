import React, {FC} from 'react';
import SendIcon from "@mui/icons-material/Send";
import {LoadingButton} from "@mui/lab";
import {makeStyles} from "@mui/styles";


const Button: FC = (props) => {
  const useStyles = makeStyles(({
    authButton: {
      width: '100%',
      margin: '16px 0 30px 0 !important',
      '& .MuiLoadingButton-loadingIndicator': {
        right: '123px'
      },
    }
  }));
  const classes = useStyles();

  return (
    <LoadingButton {...props}
    >
      {props.children}
    </LoadingButton>
  );
};

export default Button;