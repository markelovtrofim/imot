import React, {useEffect, useState} from 'react';
import {Redirect, Route, Switch, Link, useHistory} from 'react-router-dom';
import {makeStyles} from '@mui/styles';
import {Button, Typography} from '@mui/material';
import {Header} from './components/common';
import {
  Auth,
  Calls,
  MarkupRules,
  LoadCall,
  Settings
} from './pages';
import {useAppSelector} from "./hooks/redux";
import {authSlice} from "./store/auth/auth.slice";
import {useDispatch} from "react-redux";
import "rsuite/dist/rsuite.min.css";
import LinearDeterminate from "./components/common/LinearDeterminate";
import {dictsSlice} from "./store/dicts/dicts.slice";
import {searchStringParserInObj} from "./pages/MarkupRules/Tags/TagPage";
import {tagsSlice} from "./store/tags/tags.slice";
import {getLang, langSlice} from "./store/lang/lang.slice";
import Call from "./pages/Calls/Call";
import CallPage from "./pages/Calls/CallPage";
import {callsSlice} from "./store/calls/calls.slice";


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

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAuth = useAppSelector(state => state.auth.isAuth);

  const {path} = JSON.parse(localStorage.getItem('path') || '{}');
  let pathArray = [];
  if (path) {
    pathArray = path.split("/");
  }
  const activePage = pathArray[3];
  const isDtOrTg = pathArray[4];


  const currentUser = useAppSelector(state => state.users.currentUser);
  const languageParam = pathArray[1];
  const searchDictsParams = useAppSelector(state => state.dicts.search);
  const {language} = useAppSelector(state => state.lang);

  const history = useHistory();


  // lang changer
  useEffect(() => {
    history.listen(async (location) => {
      let pathArray: any = [];
      if (location.pathname) {
        pathArray = location.pathname.split("/");
      }
      const languageParam = pathArray[1];
      pathArray = location.pathname.split("/");
      pathArray.splice(0, 2);

      if (languageParam === "ru" || languageParam === "en") {
        dispatch(langSlice.actions.setLoading(true));
        await dispatch(getLang(languageParam));
        dispatch(langSlice.actions.setLoading(false));
      } else if (!languageParam || (languageParam !== "ru" && languageParam !== "en")) {
        dispatch(langSlice.actions.setDefaultLang(null));
        if (pathArray.length === 1) {
          history.location.pathname = `/`;
          history.replace(`ru/${pathArray.join("/")}`);
        } else {
          history.location.pathname = `/`;
          history.replace(`ru/${currentUser ? currentUser.id : "_"}/calls`);
        }
      }
    });
  }, [languageParam, currentUser]);

  let newSearch = history.location.search;
  if (newSearch[0] !== '?') {
    newSearch = `?${history.location.search}`
  }
  if (activePage === "markuprules") {
    if (isDtOrTg === "dictionaries") {
      dispatch(dictsSlice.actions.setSearch(newSearch));
    } else if (isDtOrTg === "tags") {
      dispatch(tagsSlice.actions.setSearchParams(newSearch));
    }
  } else if (activePage === "call") {
    debugger
    dispatch(callsSlice.actions.setCallPageSearchParams(newSearch));
  }

  useEffect(() => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    if (token) {
      dispatch(authSlice.actions.setAuth(true))
    }
  }, []);

  // dicts (прототип 2)
  if (!searchDictsParams) {
    let newSearch = history.location.search;
    if (newSearch[0] !== '?') {
      newSearch = `?${history.location.search}`
    }
    dispatch(dictsSlice.actions.setSearch(newSearch));
  }

  useEffect(() => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    if (token) {
      dispatch(authSlice.actions.setAuth(true))
    }
  }, []);


  useEffect(() => {
    history.listen((location) => {
      localStorage.setItem('path', JSON.stringify({
        path: location.pathname
      }));
    })
  }, [history]);

  useEffect(() => {
    const {path} = JSON.parse(localStorage.getItem('path') || '{}')
    if (path) {
      history.push(path);
    }
  }, [])

  const loading = useAppSelector(state => state.lang.language);

  return (
    <div className={classes.wrapper}>
      <div style={{position: 'absolute', top: '0', left: '0', height: '4px', zIndex: '1000'}}>
        {loading && <LinearDeterminate progressIsOver={false}/>}
      </div>

      <Switch>
        {/* Авторизация */}
        <Route exact path="/:lang/auth">
          <Auth/>
        </Route>
        {!isAuth && <Redirect to="/ru/auth"/>}


        {/* Звонки */}
        <Route path="/:lang/:userId/calls">
          <Header/>
          <div className={classes.container}>
            <Calls/>
          </div>
        </Route>

        {/* Звонок */}
        <Route path="/:lang/:userId/call">
          <Header/>
          <div className={classes.container}>
            <CallPage/>
          </div>
        </Route>

        {/* Отсчеты */}
        <Route path="/:lang/:userId/reports">
          <Header/>
          <div className={classes.container}>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h2">Reports</Typography>
            <Typography style={{textAlign: 'center', color: '#722ED1', fontSize: '10px'}} variant="h2">
              in developing</Typography>
          </div>
        </Route>

        {/* Загрузить звонок */}
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
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h2">Alert</Typography>
              <Typography style={{textAlign: 'center', color: '#722ED1', fontSize: '10px'}} variant="h2">in
                developing</Typography>
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

        <Route exact path="/">
          <Redirect to="/:lang/:userId/calls"/>
        </Route>

        <Route exact path="*">
          <div style={{textAlign: "center", marginTop: "250px"}}>
            <h1 style={{fontSize: '80px', marginBottom: '30px'}}>404</h1>
            <Link style={{fontSize: '18px'}} to={`/${language}/${currentUser ? currentUser.id : "_"}/calls`}>
              На главную страницу →
            </Link>
          </div>
        </Route>

      </Switch>
    </div>
  );
};

export default App
