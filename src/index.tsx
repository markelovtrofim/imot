import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {StylesProvider} from '@material-ui/styles';

import App from './App';
import './index.css';
import theme from "./theme";
import store from "./store";
import {Provider} from "react-redux";


ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <HashRouter>
            <App/>
          </HashRouter>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  </React.StrictMode>, document.getElementById('root')
);
