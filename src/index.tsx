import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {StylesProvider} from '@material-ui/styles';

import App from './App';
import './index.css';
import theme from "./theme";
import {setupStore} from "./store/store";
import {Provider} from "react-redux";

const store = setupStore();

declare global {
  interface Window {
    __store__: any
  }
}
// ЭТО ДЕМО
window.__store__ = store;

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
