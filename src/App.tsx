import React from 'react';
import {Redirect, Route, Switch, Link} from 'react-router-dom';
import {makeStyles} from '@mui/styles';
import {Typography} from "@mui/material";
import {Header} from "./components";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';

const buttons = [
  <Button key="one">One</Button>,
  <Button key="two">Two</Button>,
  <Button key="three">Three</Button>,
];


const useStyles = makeStyles(({
  wrapper: {
    width: 'auto'
  },
  container: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto'
  }
}));

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Switch>

        {/* Авторизация */}
        <Route exact path="/auth/login">
          <Header/>
          <h1>Login page</h1>
        </Route>

        {/* Звонки */}
        <Route path="/calls">
          <Header/>
          <div className={classes.container}>
            <Typography variant="h3">calls</Typography>

          </div>
        </Route>

        {/* Отсчеты */}
        <Route path="/report">
          <Header/>
          <div className={classes.container}>
            <Typography variant="h3">report</Typography>
          </div>
        </Route>

        {/* Загрузить звонок */}
        <Route path="/upload">
          <Header/>
          <div className={classes.container}>
            <Typography variant="h3">load call</Typography>
          </div>
        </Route>

        {/* Оповещение */}
        <Route path="/dictionaries">
          <Header/>
          <div className={classes.container}>
            <Typography variant="h3">alert</Typography>
          </div>
        </Route>

        {/* Настройки */}
        <Route path="/settings">
          <Header/>
          <div className={classes.container}>
            <Typography variant="h3">settings</Typography>
          </div>
        </Route>

        {/* Авторизация */}
        <Route exact path="/">
          <Redirect to="calls"/>
        </Route>

        <Route exact path="*">
          <Link to="/"><button>на главную</button></Link>
          <h1>404</h1>
        </Route>

      </Switch>
    </div>
  );
}

export default App;
