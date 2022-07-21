import React, {useEffect, useState} from 'react';

import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {CircularProgress, Typography} from "@mui/material";

import {BlockBox, Search, СontrolBlock} from "../../components/common";
import {useAppSelector} from "../../hooks/redux";
import {callsSlice, getBaseCallsData} from "../../store/calls/calls.slice";
import {searchSlice} from '../../store/search/search.slice';
import {CallIncompleteType} from "../../store/calls/calls.types";
import CallStubMiddleware from "./Call";
import {translate} from "../../localizations";
import CallsHeader from './CallsHeader';
import {langSlice} from "../../store/lang/lang.slice";
import InfiniteScroll from 'react-infinite-scroll-component';

const Calls = React.memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const calls = useAppSelector(state => state.calls.callsIncomplete);
  // const {language} = useAppSelector((state: RootState) => state.lang);

  const [hasMore, setHasMore] = useState(true);

  const pushNewCalls = async () => {
    setHasMore(false);
    await dispatch(getBaseCallsData({}));
    setHasMore(true);
  };

  useEffect(() => {
    document.title = "Звонки | IMOT.io";
    dispatch(langSlice.actions.setLoading(false));
    if (calls.length <= 10) {
      pushNewCalls().then();
    }
    return () => {
      dispatch(searchSlice.actions.setDefaultCriterias(null));
    }
  }, []);

  useEffect(() => {
    return history.listen((location) => {
      if (location.pathname !== '/calls') {
        dispatch(callsSlice.actions.setEmptyCalls({leaveBundles: 10}));
      }
    });
  }, []);

  return (
    <div style={{cursor: 'default'}}>
      <СontrolBlock/>
      <Search pageName="Звонок"/>
      <BlockBox>
        <CallsHeader switchTitleFound={false}/>
        <div>
          <InfiniteScroll
            style={{overflow: "hidden !important"}}
            dataLength={calls.length}
            next={pushNewCalls}
            hasMore={hasMore}
            loader={<></>}
          >
            {calls.length !== 0 ?
              <>
                {calls.map((call: CallIncompleteType) => {
                  return (
                    <CallStubMiddleware
                      callInfo={call.info}
                      expanded={call.expanded}
                    />
                  )
                })}
              </>
              :
              <BlockBox padding={'24px'}>
                <Typography>{translate('callsEmpty', "ru")}</Typography>
              </BlockBox>
            }
          </InfiniteScroll>
        </div>
      </BlockBox>
    </div>
  );
});

export default Calls
