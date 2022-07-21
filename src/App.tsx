import React, {useEffect, memo} from 'react';

import {Redirect, Route, Switch, Link, useHistory} from 'react-router-dom';
import {makeStyles} from '@mui/styles';
import {Typography} from '@mui/material';
import {useDispatch} from "react-redux";
import "rsuite/dist/rsuite.min.css";

import {
  Auth,
  Calls,
  Reports,
  MarkupRules,
  LoadCall,
  Settings
} from './pages';
import {Header} from './components/common';
import {useAppSelector} from "./hooks/redux";
import {authSlice} from "./store/auth/auth.slice";
import {dictsSlice} from "./store/dicts/dicts.slice";
import {tagsSlice} from "./store/tags/tags.slice";
import {getLang, langSlice} from "./store/lang/lang.slice";
import CallPage from "./pages/Calls/CallPage";
import {callsSlice} from "./store/calls/calls.slice";
import Snackbar from "./components/common/Snackbar";
import {getChildUser, getChildUsers, getMe} from "./store/users/users.slice";


export const useStyles = makeStyles(({
  wrapper: {
    width: 'auto',
  },
  container: {
    maxWidth: '1655px',
    margin: '0 auto',
    padding: '0 15px'
  }
}));


const App = memo(() => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const isAuth = useAppSelector(state => state.auth.isAuth);
  const {language} = useAppSelector(state => state.lang);
  const snackbar = useAppSelector(state => state.lang.snackbar)

  const {path} = JSON.parse(localStorage.getItem('path') || '{}');
  let pathArray: string[] = [];
  if (path) {
    pathArray = path.split("/");
  }
  const isDtOrTg = pathArray[4];


  const searchDictsParams = useAppSelector(state => state.dicts.search);
  const searchTagsParams = useAppSelector(state => state.tags.searchParams);
  const searchCallParams = useAppSelector(state => state.calls.callPageSearchParams);

  useEffect(() => {
    history.listen((location) => {
      localStorage.setItem('path', JSON.stringify({
        path: location.pathname
      }));
    })
  }, [history]);

  // костыль параметров поиска
  let newSearch = history.location.search;
  if (newSearch[0] !== '?') {
    newSearch = `?${history.location.search}`
  }
  if (!searchDictsParams && isDtOrTg === "dictionaries") {
    dispatch(dictsSlice.actions.setSearch(newSearch));
  }
  if (searchTagsParams && isDtOrTg === "tags") {
    dispatch(tagsSlice.actions.setSearchParams(newSearch));
  }
  // if (!searchCallParams && pathArray[2] === "call") {
  //   dispatch(callsSlice.actions.setCallPageSearchParams(newSearch));
  // }

  useEffect(() => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    if (token) {
      dispatch(authSlice.actions.setAuth(true))
    }
  }, []);

  return (
    <div>
      <div className={classes.wrapper}>
        {isAuth ? (
          <Switch>
            {/* Звонки */}
            <Route path="/:lang/:userId/calls">
              <Header/>
              <div className={classes.container}>
                <Calls/>
              </div>
            </Route>
            {/* Звонок */}
            <Route path="/:lang/call">
              <Header/>
              <div className={classes.container}>
                <CallPage/>
              </div>
            </Route>
            {/* Отсчеты */}
            <Route path="/:lang/:userId/reports">
              <Header/>
              <div className={classes.container}>
                <Reports/>
              </div>
            </Route>

            {/* Правила разметки */}
            <Route path="/:lang/:userId/markuprules">
              <Header/>
              <MarkupRules/>
            </Route>

            {/* Загрузить звонок */}
            <Route path="/:lang/:userId/upload">
              <Header/>
              <div className={classes.container}>
                <LoadCall/>
              </div>
            </Route>

            {/* Оповещение */}
            <Route path="/:lang/:userId/alert">
              <Header/>
              <div className={classes.container}>
                <div className={classes.container}>
                  <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h2">
                    Alert
                  </Typography>
                  <Typography style={{textAlign: 'center', color: '#722ED1', fontSize: '10px'}} variant="h2">
                    in developing
                  </Typography>
                </div>
              </div>
            </Route>

            {/* Настройки */}
            <Route path="/:lang/:userId/settings">
              <Header/>
              <div className={classes.container}>
                <Settings/>
              </div>
            </Route>

            <Route exact path={`/${language}/auth`}>
              <Redirect to={path ? `${path}` : `/${language}/${"_"}/calls`}/>
            </Route>

            <Route exact path="/">
              <Redirect to={`/${language}/${"_"}/calls`}/>
            </Route>

            <Route exact path="*">
              <div style={{textAlign: "center", marginTop: "250px"}}>
                <h1 style={{fontSize: '80px', marginBottom: '30px'}}>404</h1>
                <Link style={{fontSize: '18px'}} to={`/${language}/${"_"}/calls`}>
                  На главную страницу →
                </Link>
              </div>
            </Route>

          </Switch>
        ) : (
          <Switch>
            {/* Авторизация */}
            <Route exact path="/:lang/auth">
              <Auth/>
            </Route>

            {/* Звонок */}
            <Route path="/:lang/call">
              <Header/>
              <div className={classes.container}>
                <CallPage/>
              </div>
            </Route>

            <Route path="*">
              <div style={{textAlign: "center", marginTop: "250px"}}>
                <h1 style={{fontSize: '80px', marginBottom: '30px'}}>404</h1>
                <Link style={{fontSize: '18px'}} to={`/${language}/auth`}>
                  Авторизоваться →
                </Link>
              </div>
            </Route>

          </Switch>
        )}
      </div>

       {/* Снаскбар */}
      <div>
        {snackbar.value && (
          <Snackbar
            type={snackbar.type}
            open={snackbar.value}
            onClose={() => {
              dispatch(langSlice.actions.setSnackbar({value: false, type: 'success', time: null, text: ''}));
            }}
            text={snackbar.text}
            time={snackbar.time}
          />
        )}
      </div>

    </div>
  );
});

export default App
