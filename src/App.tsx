import React, {createContext, useEffect, useState} from 'react';

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
import LinearDeterminate from "./components/common/LinearDeterminate";
import {dictsSlice} from "./store/dicts/dicts.slice";
import {tagsSlice} from "./store/tags/tags.slice";
import {getLang, langSlice} from "./store/lang/lang.slice";
import CallPage from "./pages/Calls/CallPage";
import {callsSlice} from "./store/calls/calls.slice";
import Snackbar, {SnackbarType} from "./components/common/Snackbar";


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

const Test = () => {
  const history = useHistory();
  useEffect(() => {
    history.location.pathname = "/";
    history.push("/ru/auth");
  }, [history]);
  return <></>
}

export const SnackbarContext = createContext({});

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
  const searchTagsParams = useAppSelector(state => state.tags.searchParams);
  const searchCallParams = useAppSelector(state => state.calls.callPageSearchParams);
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
  if (!searchCallParams && pathArray[2] === "call") {
    dispatch(callsSlice.actions.setCallPageSearchParams(newSearch));
  }

  useEffect(() => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    // debugger
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


  // Snackbar
  const [snackbar, setSnackbar] = useState<{ type: SnackbarType, text: string, value: boolean, time: number | null }>({
    type: 'success',
    text: '',
    value: false,
    time: null
  });

  return (
    <SnackbarContext.Provider value={{snackbar, setSnackbar}}>
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
              <Redirect to={path ? `${path}` : `/${language}/${currentUser ? currentUser.id : "_"}/calls`}/>
            </Route>

            <Route exact path="/">
              <Redirect to={`/${language}/${currentUser ? currentUser.id : "_"}/calls`}/>
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
              <CallPage/>
            </Route>

          </Switch>
        )}
      </div>
      
      {/* Снаскбар */}
      <div>
        {snackbar.value &&
        <Snackbar
          type={snackbar.type}
          open={snackbar.value}
          onClose={() => {
            setSnackbar({ value: false, type: 'success', time: null, text: '' })
          }}
          text={snackbar.text}
          time={snackbar.time}
        />
        }
      </div>

    </SnackbarContext.Provider>

  );
};

export default App
