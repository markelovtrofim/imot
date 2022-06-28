import React, {useEffect} from 'react';
import {Redirect, Route, Switch, Link, useHistory} from 'react-router-dom';
import {makeStyles} from '@mui/styles';
import {Button, Typography} from '@mui/material';
import {Header} from './components/common';
import {
  Auth,
  Calls,
  Reports,
  MarkupRules,
  LoadCall,
  Settings
} from './pages';
import {useAppSelector} from "./hooks/redux";
import {authSlice} from "./store/auth/auth.slice";
import {useDispatch} from "react-redux";
import "rsuite/dist/rsuite.min.css";


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
  useEffect(() => {
    const {token} = JSON.parse(localStorage.getItem('token') || '{}');
    if (token) {
      dispatch(authSlice.actions.setAuth(true))
    }
  }, []);


  const history = useHistory()

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

  const markupRulesPages = 'dictionaries' || 'tags' || 'checklists'
  return (
    <div className={classes.wrapper}>
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

        {/* Отчеты */}
        <Route path="/reports">
          <Header/>
          <div className={classes.container}>
            <Reports/>
          </div>
          {/* <div className={classes.container}>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">reports</Typography>
          </div> */}
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
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">alert</Typography>
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
