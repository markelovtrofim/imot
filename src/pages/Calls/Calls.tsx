import React, {useEffect, useState} from 'react';
import {BlockBox, Search, СontrolBlock} from "../../components/common";
import {CircularProgress, Typography} from "@mui/material";
import {useAppSelector} from "../../hooks/redux";
import {useDispatch} from "react-redux";
import {callsSlice, getBaseCallsData} from "../../store/calls/calls.slice";
import {CallType} from "../../store/calls/calls.types";
import CallStubMiddleware from "./Call";
import {RootState} from "../../store/store";
import {translate} from "../../localizations";
import {useHistory} from "react-router-dom";
import CallsHeader from './CallsHeader';
import {makeStyles} from '@mui/styles';

import {langSlice} from "../../store/lang/lang.slice";

const useStyles = makeStyles(({
  callsHeader: {},
  callsTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px'
  },
  callsCols: {
    borderTop: '2px solid #F8FAFC',
    padding: '16px 24px',
  },
  callsTitleText: {
    fontWeight: '700 !important'
  }
}))

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


const Calls = React.memo(() => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [fetching, setFetching] = useState<boolean>(false);

  const calls = useAppSelector<CallType[][]>(state => state.calls.calls);

  const found = useAppSelector(state => state.calls.found);
  const total = useAppSelector(state => state.calls.total);

  const {language} = useAppSelector((state: RootState) => state.lang);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleExpandedChange = (callId: string | false) => {
    setExpanded(callId);
    // if (callId) {
    //   history.location.search = "/";
    //   history.push(`?openCall=${callId}`)
    // } else {
    //   history.location.search = "/";
    //   history.push(``)
    // }
  };


  const pushNewCalls = async () => {
    setFetching(true);
    await dispatch(getBaseCallsData());
    setFetching(false);
  };

  useEffect(() => {
    dispatch(langSlice.actions.setLoading(false));
    pushNewCalls().then();
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
      pushNewCalls().then();
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

        <CallsHeader
          found={found}
          total={total}
          switchTitleFound={false}
        />
        <div>
          {/*<InfiniteScroll*/}
          {/*  // @ts-ignore*/}
          {/*  dataLength={found} //This is important field to render the next data*/}
          {/*  next={() => null}*/}
          {/*  hasMore={true}*/}
          {/*  loader={<h4>Loading...</h4>}*/}
          {/*  endMessage={*/}
          {/*    <p style={{ textAlign: 'center' }}>*/}
          {/*      <b>Yay! You have seen it all</b>*/}
          {/*    </p>*/}
          {/*  }*/}
          {/*  // below props only if you need pull down functionality*/}
          {/*  refreshFunction={pushNewCalls}*/}
          {/*  pullDownToRefresh*/}
          {/*  pullDownToRefreshThreshold={50}*/}
          {/*  pullDownToRefreshContent={*/}
          {/*    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>*/}
          {/*  }*/}
          {/*  releaseToRefreshContent={*/}
          {/*    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>*/}
          {/*  }*/}
          {/*>*/}
          {calls.length !== 0 ?
            calls.map((callsArrays: CallType[]) => {
              const callsArrayIndex = calls.indexOf(callsArrays)
              return (
                <div>
                  {callsArrays.map((call: CallType) => {
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

export default Calls
