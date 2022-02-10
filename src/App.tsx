import React, {useEffect} from 'react';
import {Redirect, Route, Switch, Link} from 'react-router-dom';
import {makeStyles} from '@mui/styles';
import {Button, Typography} from '@mui/material';
import {Header} from './components';
import {Auth, Calls} from './pages';
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {authSlice} from "./store/reducers/auth.slice";

const useStyles = makeStyles(({
  wrapper: {
    width: 'auto'
  },
  container: {
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto'
  }
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.auth.isAuth);
  useEffect(() => {
    // @ts-ignore
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      dispatch(authSlice.actions.setAuth(true));
    }
  });

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

        {/* Отсчеты */}
        <Route path="/report">
          <Header/>
          <div className={classes.container}>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">report</Typography>
          </div>
        </Route>

        {/* Загрузить звонок */}
        <Route path="/upload">
          <Header/>
          <div className={classes.container}>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">load call</Typography>
          </div>
        </Route>

        {/* Оповещение */}
        <Route path="/dictionaries">
          <Header/>
          <div className={classes.container}>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">alert</Typography>
          </div>
        </Route>

        {/* Настройки */}
        <Route path="/settings">
          <Header/>
          <div className={classes.container}>
            <div>
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">Settings</Typography>
            </div>
          </div>
        </Route>

        <Route exact path="/">
          <Redirect to="calls"/>
        </Route>

        <Route exact path="*">
          <Button variant="contained"><Link to="/">На главную страницу.</Link></Button>
          <h1>404</h1>
        </Route>

      </Switch>
    </div>
  );
}

export default App;
