import React from 'react';
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import DialogItem from './DialogItem';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const useStyles = makeStyles(({
  cbDialogWrapper: {
    height: '765px',
    width: '100%',
    backgroundColor: '#EEF2F6'
  },
  cbDialogInner: {
    padding: '12.5px 12px'
  },
  cbDialogItems: {
    overflowY: 'auto',
    height: '765px',
    '&::-webkit-scrollbar': {
      width: '4px',
      backgroundColor: 'f1f1f1',
      outline: 'none',

    },
    '&::-webkit-scrollbar-thumb': {
      background: '#A3AEBE',
      height: '50px',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555'
    }
  }
}));

const CallBody = React.memo(({audio}: any) => {
  const classes = useStyles();
  return (
    <div>
      <div style={{height: '250px'}}>
        <AudioPlayer
          autoPlay={false}
          src={audio}
        />
      </div>
      <div style={{display: 'flex'}}>
        <div className={classes.cbDialogWrapper}>
          <div className={classes.cbDialogInner}>
            <Typography style={{
              color: '#738094',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              Текстовый диалог
            </Typography>
            <div className={classes.cbDialogItems}>
              <DialogItem person={'employee'}/>
              <DialogItem person={'customer'}/>
              <DialogItem person={'employee'}/>
              <DialogItem person={'customer'}/>
              <DialogItem person={'employee'}/>
              <DialogItem person={'customer'}/>
              <DialogItem person={'employee'}/>
              <DialogItem person={'customer'}/>
            </div>
          </div>
        </div>
        <div style={{backgroundColor: 'fff', width: '350px'}}>
          <Typography variant="h3" style={{
            overflowY: 'auto',
            marginTop: '100px',
            textAlign: 'center',
            color: 'rgba(0, 0, 0, 0.2)'
          }}>
            Call params
          </Typography>
        </div>
      </div>
    </div>
  );
});

export default CallBody;
