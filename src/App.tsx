import React, {useEffect} from 'react';
import {Redirect, Route, Switch, Link} from 'react-router-dom';
import {makeStyles} from '@mui/styles';
import {Button, Typography} from '@mui/material';
import {Header} from './components';
import {Auth, Calls, MarkupRules} from './pages';
import {useAppSelector} from "./hooks/redux";
import {authSlice} from "./store/auth/auth.slice";
import {useDispatch} from "react-redux";

const useStyles = makeStyles(({
  wrapper: {
    width: 'auto',
  },
  container: {
    maxWidth: '1610px',
    margin: '0 auto',
    padding: '0 10px'
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
        <Route path="/reports">
          <Header/>
          <div className={classes.container}>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">reports</Typography>
          </div>
        </Route>

        {/* Загрузить звонок */}
        <Route path="/markuprules">
          <Header/>
          <div className={classes.container}>
            <MarkupRules/>
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
            <div>
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h3">Settings</Typography>
            </div>
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
