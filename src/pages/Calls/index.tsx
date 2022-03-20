import React, {useDebugValue, useEffect, useState} from 'react';
import Search from "../../components/Search";
import {BlockBox, СontrolBlock} from "../../components";
import {CircularProgress, Select, Skeleton, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Grid from "@mui/material/Grid";
import {useAppSelector} from "../../hooks/redux";
import {useDispatch} from "react-redux";
import {callsSlice, getBaseCallsData} from "../../store/calls/calls.slice";
import {CallsType} from "../../store/calls/calls.types";
import CallStubMiddleware from "./Call";
import {getAllSearchCriterias, getDefaultCriterias} from "../../store/search/search.slice";
import {RootState} from "../../store";
import {translate} from "../../localizations";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(({
  callsHeader: {},
  callsTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 24px'
  },
  callsCols: {
    borderTop: '2px solid #F8FAFC',
    padding: '16px 24px',
  },
  callsTitleText: {
    fontWeight: '700 !important'
  }
}));

const ClockSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="19" viewBox="0 0 20 19" fill={props.fill ? props.fill : '#738094'}
       xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.53033 0.469667C4.82322 0.762557 4.82322 1.23744 4.53033 1.53033L2.03033 4.03033C1.73744 4.32322 1.26256 4.32322 0.969667 4.03033C0.676778 3.73744 0.676778 3.26256 0.969667 2.96967L3.46967 0.469667C3.76256 0.176778 4.23744 0.176778 4.53033 0.469667Z"
      fill="#738094"/>
    <path fillRule="evenodd" clipRule="evenodd"
          d="M10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5C14.6944 18.5 18.5 14.6944 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5ZM10.75 5C10.75 4.58579 10.4142 4.25 10 4.25C9.5858 4.25 9.25 4.58579 9.25 5V10C9.25 10.2586 9.3832 10.4989 9.6025 10.636L12.6025 12.511C12.9538 12.7305 13.4165 12.6238 13.636 12.2725C13.8555 11.9212 13.7488 11.4585 13.3975 11.239L10.75 9.5843V5Z"
          fill="#738094"/>
    <path
      d="M15.4697 1.53033C15.1768 1.23744 15.1768 0.762557 15.4697 0.469667C15.7626 0.176778 16.2374 0.176778 16.5303 0.469667L19.0303 2.96967C19.3232 3.26256 19.3232 3.73744 19.0303 4.03033C18.7374 4.32322 18.2626 4.32322 17.9697 4.03033L15.4697 1.53033Z"
      fill="#738094"/>
  </svg>
);

const ArrowsSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="6" height="12" viewBox="0 0 6 12" fill={props.fill ? props.fill : '#738094'}
       xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M2.56736 0.75C2.75981 0.416667 3.24094 0.416667 3.43339 0.75L5.16544 3.75C5.35789 4.08333 5.11733 4.5 4.73243 4.5H1.26832C0.883424 4.5 0.642861 4.08333 0.835311 3.75L2.56736 0.75Z"/>
    <path
      d="M3.43264 11.25C3.24019 11.5833 2.75906 11.5833 2.56661 11.25L0.834562 8.25C0.642112 7.91667 0.882675 7.5 1.26757 7.5H4.73168C5.11658 7.5 5.35714 7.91667 5.16469 8.25L3.43264 11.25Z"/>
  </svg>
);

const Calls = React.memo(() => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState<boolean>(false);

  const calls = useAppSelector(state => state.calls.calls);
  const found = useAppSelector(state => state.calls.found);

  const {language} = useAppSelector((state: RootState) => state.lang);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleExpandedChange = (panel: string) => {
    setExpanded(panel);
  };

  const pushNewCalls = async () => {
    setFetching(true);
    await dispatch(getBaseCallsData());
    setFetching(false);
  };

  useEffect(() => {
    pushNewCalls();
    return () => setFetching(false);
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler)
    }
  });
  const scrollHandler = (e: any) => {
    // @ts-ignore
    if (found > 10 && calls[0][0].info && !fetching && (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 500)) {
      pushNewCalls();
    }
  };

  const history = useHistory();

  useEffect(() => {
    return history.listen((location) => {
      if (location.pathname !== '/calls') {
        dispatch(callsSlice.actions.setEmptyState({leaveBundles: 1}));
      }
    });
  }, []);

  return (
    <div style={{cursor: 'default'}}>
      <СontrolBlock/>
      <Search pageName="Звонок"/>
      <BlockBox>
        <div className={classes.callsHeader}>
          <div className={classes.callsTitle}>
            <Typography className={classes.callsTitleText}>{translate('callsLastCalls', language)}</Typography>
            <Skeleton animation="wave" width={120}/>
          </div>
          <Grid container className={classes.callsCols}>

            <Grid item xs={0.5} style={{minWidth: '50px', display: 'flex', alignItems: 'center'}}>
              <span style={{marginRight: '15px'}}><ClockSvg/></span>
              <ArrowsSvg/>
            </Grid>

            <Grid item xs={1.23} style={{minWidth: '100px', display: 'flex', alignItems: 'center'}}>
              <Typography style={{marginRight: '15px'}}>{translate('callsEmployee', language)}</Typography>
              <ArrowsSvg/>
            </Grid>

            <Grid item xs={3.5} style={{minWidth: '130px', display: 'flex', alignItems: 'center'}}>
              <Typography style={{marginRight: '15px'}}>{translate('callsCustomer', language)}</Typography>
              <ArrowsSvg/>
            </Grid>

            <Grid item xs={1} style={{minWidth: '130px', display: 'flex', alignItems: 'center'}}>
              <Typography style={{marginRight: '15px'}}>{translate('callsTag', language)}</Typography>
              <ArrowsSvg/>
            </Grid>

          </Grid>
        </div>

        <div>
          {calls.length !== 0 ?
            calls.map((callsArrays: CallsType[]) => {
              // @ts-ignore
              const callsArrayIndex = calls.indexOf(callsArrays)
              return (
                <div>
                  {callsArrays.map((call: CallsType) => {
                    return (
                      <CallStubMiddleware
                        callInfo={call.info} callAudio={call.audio} callStt={call.stt}
                        bundleIndex={callsArrayIndex} expanded={expanded === call.info?.id}
                        handleExpandedChange={handleExpandedChange}
                      />
                    )
                  })}
                </div>
              )
            }) :
            <BlockBox padding={'24px'}><Typography>{translate('callsEmpty', language)}</Typography></BlockBox>}
        </div>

        <div style={{textAlign: 'center'}}>
          {fetching && <CircularProgress color="primary"/>}
        </div>

      </BlockBox>
    </div>
  );
});
// @ts-ignore

export default Calls
