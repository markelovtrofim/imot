import React, {FC, useEffect} from 'react';
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import DialogItem from './DialogItem';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {callsSlice} from "../../store/calls/calls.slice";
import {useDispatch} from "react-redux";
import {CallsInfoType} from "../../store/calls/calls.types";

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

type CallBodyPropsType = {
  callInfo: CallsInfoType,
  callAudio: string | null,
  callStt: any | null,
  bundleIndex: number,
  expanded: boolean
};

const CallBody: FC<CallBodyPropsType> = React.memo(({callInfo, callAudio, callStt, bundleIndex, expanded}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!expanded && callAudio) {
      dispatch(callsSlice.actions.removeAudio({id: callInfo.id, bundleIndex}));
    }
  },[expanded]);

  return (
    <div>
      <div style={{height: '250px'}}>
        <AudioPlayer
          // @ts-ignore
          tabIndex={-1}
          src={callAudio ? callAudio : ''}
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
              {callStt && callStt.fragments.map((phrase: any) => {
                return (
                  <DialogItem person={phrase.direction} text={phrase.text}/>
                )
              })}
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
