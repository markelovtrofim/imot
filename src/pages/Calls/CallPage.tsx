import React, { useEffect, memo } from 'react';

import { Link, useHistory } from "react-router-dom";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Alert, CircularProgress } from "@mui/material";

import { useAppSelector } from "../../hooks/redux";
import { callsSlice, getCallAudio, getCallInfo, getCallStt } from "../../store/calls/calls.slice";
import Call from "./Call";

const CallPage = memo(() => {

  const useStyles = makeStyles(({
    callPageBox: {
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
    }
  }));
  const classes = useStyles();

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParamsObject = queryString.parse(history.location.search);
    if (searchParamsObject.id && searchParamsObject.token) {
      dispatch(callsSlice.actions.setCallPageSearchParams(history.location.search));
    }
  }, [history]);

  async function fetchCallInfoData() {
    const searchParamsObject = queryString.parse(history.location.search);
    const id = searchParamsObject.id;
    const token = searchParamsObject.token;
    if (id && token) {
      const callInfoData = await dispatch(getCallInfo({ id, token }));
      const callAudioData = await dispatch(getCallAudio({ id, token }));
      const callSttData = await dispatch(getCallStt({ id, token }));

      // @ts-ignore
      const callInfo = callInfoData.payload;

      if (callInfo) {
        dispatch(callsSlice.actions.setCurrentCall({
          // @ts-ignore
          id: id,
          info: callInfo,
          // @ts-ignore
          stt: callSttData.payload,
          // @ts-ignore
          audio: callAudioData.payload
        }));
      } else {
        dispatch(callsSlice.actions.setCurrentCall(false));
      }
    } else {
      dispatch(callsSlice.actions.setCurrentCall(false));
    }
  }

  // добавление параметров поиска
  useEffect(() => {
    fetchCallInfoData().then();
  }, []);

  useEffect(() => {
    document.title = "Звонок | IMOT.io";
    return () => {
      dispatch(callsSlice.actions.setCallPageSearchParams(""));
      dispatch(callsSlice.actions.setCurrentCall(null));
    }
  }, []);

  const currentCall = useAppSelector(state => state.calls.currentCall);
  console.log(currentCall);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const { language } = useAppSelector(state => state.lang);

  return (
    <div style={{ marginTop: '40px' }}>
      {currentCall && (
        <div className={classes.callPageBox}>
          <Call
            callInfo={currentCall.info}
            expanded={true}
            solo={true}
          />
        </div>
      )}
      {currentCall === null && (
        <div style={{ position: 'absolute', top: '35%', left: 'calc(50% - 50px)' }}>
          <CircularProgress style={{ width: '100px', height: '100px' }} />
        </div>
      )}
      {currentCall === false && (
        <div style={{ width: '400px' }}>
          <Alert severity="error">Введены неверные параметры</Alert>
          {isAuth ? (
            <Link style={{ fontSize: '11px', marginLeft: '20px' }} to={`/${language}/${currentUser ? currentUser.id : "_"}/calls`}>
              На главную страницу →
            </Link>
          ) : (
            <Link style={{ fontSize: '11px', marginLeft: '20px' }} to={`/${language}/auth`}>
              Открыть полную версию приложения →
            </Link>
          )}
        </div>
      )}
    </div>
  );
});

export default CallPage;