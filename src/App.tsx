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
  const isDtOrTg = pathArray[2];

  const searchDictsParams = useAppSelector(state => state.dicts.search);

  const history = useHistory();

  // dicts (прототип 2)
  if (!searchDictsParams) {
    let newSearch = history.location.search;
    if (newSearch[0] !== '?') {
      newSearch = `?${history.location.search}`
    }
    if (isDtOrTg === "dictionaries") {
      dispatch(dictsSlice.actions.setSearch(newSearch));
    } else if (isDtOrTg === "tags") {
      dispatch(tagsSlice.actions.setSearchParams(newSearch));
    }
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

  const [loading, setLoading] = useState(false);

  return (
    <div className={classes.wrapper}>
      <div style={{position: 'absolute', top: '0', left: '0', height: '4px', zIndex: '1000'}}>
        {loading && <LinearDeterminate progressIsOver={false}/>}
      </div>

      <Switch>

        {/* Авторизация */}
        <Route exact path="/auth">
          <Auth/>
        </Route>
        {!isAuth && <Redirect to="/auth"/>}

        {/* Звонки */}
        <Route path="/calls">
          <Header/>
          <div className={classes.container}>
            <Calls/>
          </div>
        </Route>

        {/* Отсчеты */}
        <Route path="/reports">
          <Header/>
          <div className={classes.container}>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h2">Reports</Typography>
            <Typography style={{textAlign: 'center', color: '#722ED1', fontSize: '10px'}} variant="h2">in developing</Typography>
          </div>
        </Route>

        {/* Загрузить звонок */}
        <Route path="/markuprules">
          <MarkupRules/>
        </Route>

        {/* Загрузить звонок */}
        <Route path="/upload">
          <Header/>
          <div className={classes.container}>
            <LoadCall/>
          </div>
        </Route>


        {/* Оповещение */}
        <Route path="/alert">
          <Header/>
          <div className={classes.container}>
            <div className={classes.container}>
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h2">Alert</Typography>
              <Typography style={{textAlign: 'center', color: '#722ED1', fontSize: '10px'}} variant="h2">in developing</Typography>
            </div>
          </div>
        </Route>

        {/* Настройки */}
        <Route path="/settings">
          <Header/>
          <div className={classes.container}>
            <Settings/>
          </div>
        </Route>

        <Route exact path="/">
          <Redirect to="calls"/>
        </Route>

        <Route exact path="*">
          <Button variant="outlined"><Link to="/">На главную страницу.</Link></Button>
          <h1>404</h1>
        </Route>

      </Switch>
    </div>
  );
};

export default App
