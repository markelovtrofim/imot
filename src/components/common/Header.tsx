import React, {useEffect, useState} from 'react';
import {Button, LinearProgress, SelectChangeEvent, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {useHistory} from 'react-router-dom';
import LogoImg from '../../assets/images/logo.svg';
import {RootState} from '../../store/store';
import {translate} from '../../localizations';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {removeAuthToken} from "../../store/auth/auth.slice";
import {useAppSelector} from "../../hooks/redux";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useDispatch} from "react-redux";
import {callsSlice} from "../../store/calls/calls.slice";
import {searchSlice} from "../../store/search/search.slice";
import {getGroups} from "../../store/dicts/dicts.slice";
import {getChildUser, getChildUsers, getMe, getUserToken} from "../../store/users/users.slice";
import ContainedSelect from "./Selects/ContainedSelect";
import {getLang, langSlice} from "../../store/lang/lang.slice";

const useStyles = makeStyles(({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1920px',
    height: '100%',
    width: '100%',
    margin: '0 auto'
  },
  headerLeftBlock: {
    display: 'flex',
    alignItems: 'center'
  },
  headerIconWrapper: {
    maxWidth: '73px',
    width: '73px',
    margin: '0 24px 4px 24px'
  },
  headerIcon: {
    display: 'block',
    maxWidth: '100%',
    width: '100%',
    height: 'auto',
  },
  headerItemText: {
    color: '#738094 !important',
    transition: '0.4s !important',
    opacity: '0.7',
    padding: '13px 20px !important',
    // @ts-ignore
    textTransform: 'none !important',
    '&.Mui-selected, &:active': {
      backgroundColor: '#E3E8EF !important',
      color: '#000 !important'
    },
    border: 'none !important',
    outline: 'none !important',
    backgroundColor: '#ffffff !important',
  },
  headerRightBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '53px !important'
  },
  langHandler: {
    '& .MuiInput-input:focus': {
      backgroundColor: '#fff',
    },
    border: 'none',
    outline: 'none',
    '&::before': {
      border: 'none !important'
    },
    '&::after': {
      border: 'none !important'
    }
  },
  langHandlerItem: {
    '&.MuiMenuItem-root': {
      backgroundColor: '#fff !important'
    }
  },
  headerLogout: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0 17px 0 26px !important',
    // @ts-ignore
    textTransform: 'none !important',
    color: '#738094 !important',
    '&:hover': {
      backgroundColor: '#fff !important'
    },
    '& .MuiButton-startIcon': {
      marginRight: '10px',
    },
    '& .MuiButton-startIcon svg': {
      fill: '#738094',
    },
  },
}));

export const LogoutSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.5 10.6663C5.5 10.3902 5.72387 10.1663 6 10.1663H10C10.0921 10.1663 10.1667 10.0917 10.1667 9.99967V1.99967C10.1667 1.90763 10.0921 1.83301 10 1.83301H6C5.72387 1.83301 5.5 1.60915 5.5 1.33301C5.5 1.05687 5.72387 0.833008 6 0.833008H10C10.6443 0.833008 11.1667 1.35534 11.1667 1.99967V9.99967C11.1667 10.644 10.6443 11.1663 10 11.1663H6C5.72387 11.1663 5.5 10.9425 5.5 10.6663Z"/>
      <path
        d="M0.333984 6.74307C0.333984 7.11127 0.632458 7.40974 1.00065 7.40974H4.23798C4.25327 7.64667 4.2724 7.88347 4.29538 8.11994L4.31516 8.3234C4.34731 8.65427 4.69865 8.85233 4.99838 8.70873C6.21699 8.12467 7.32019 7.32554 8.25485 6.3496L8.27485 6.32874C8.45292 6.1428 8.45292 5.84967 8.27485 5.66374L8.25485 5.64287C7.32019 4.66694 6.21699 3.86778 4.99838 3.28377C4.69865 3.14011 4.34731 3.33824 4.31516 3.66907L4.29538 3.87253C4.2724 4.10902 4.25327 4.34579 4.23798 4.58273L1.00065 4.58274C0.632464 4.58274 0.333984 4.8812 0.333984 5.2494V6.74307Z"/>
    </svg>
  );
};

const Header: React.FC = () => {
  const {language} = useAppSelector((state: RootState) => state.lang);

  const classes = useStyles();
  const dispatch = useDispatch();
  const currentUser = useAppSelector(state => state.users.currentUser);

  const {path} = JSON.parse(localStorage.getItem('path') || '{}');

  const history = useHistory();
  let historyPathArray: any = [];
  if (path) {
    historyPathArray = path.split('/');
  }
  const pagePath = history.location.pathname.split('/')[3];
  const activePage = useAppSelector(state => state.dicts.activePage);

  async function handleLangChange(event: SelectChangeEvent) {
    const historyLocal = history.location.pathname;
    const currentLang = event.target.value;
    await dispatch(getLang(currentLang));

    history.location.pathname = '/'
    history.replace(`${currentLang}/${currentUser ? currentUser.id : "_"}/${pagePath}`);
  }

  const childUsers = useAppSelector(state => state.users.childUsers);
  const currentChildUser = useAppSelector(state => state.users.currentChildUser);

  const [alignment, setAlignment] = React.useState("");

  useEffect(() => {
    history.listen((location) => {
      const pathArray = location.pathname.split('/');
      setAlignment(pathArray[3]);
    })
  }, [history]);

  useEffect(() => {
    const pathArray = history.location.pathname.split('/');
    setAlignment(pathArray[3]);
  }, [history]);

  const handleRouteChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  // useEffect(() => {
  //   dispatch(getChildUser());
  //   dispatch(getMe());
  //   dispatch(getChildUsers());
  // }, []);

  const languageParam = historyPathArray[1];
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

  async function getUserData() {
    await dispatch(getMe());
    await dispatch(getChildUser());
    await dispatch(getChildUsers());
  }
  useEffect(() => {
    if (!currentUser) getUserData().then();
  }, [history]);

  const logout = () => {
    dispatch(removeAuthToken());
    dispatch(callsSlice.actions.setEmptyCalls({leaveBundles: 0}));
    dispatch(searchSlice.actions.removeAllState(null));
    history.location.pathname = "/";
    history.push(`/${language}/auth`);
  };

  function login() {
    history.location.pathname = "/";
    history.push(`/${language}/auth`)
  }

  const isAuth = useAppSelector(state => state.auth.isAuth);

  // users changer
  const handleUserChange = async (e: any) => {
    if (e.label === '?????? ????????????????????????') {
      const {mainToken} = JSON.parse(localStorage.getItem('mainToken') || '{}');
      localStorage.setItem('token', JSON.stringify({
        token: mainToken
      }));
    } else {
      await dispatch(getUserToken(e.value));
    }
    window.location.reload();
  };
  const optionsConverter = () => {
    let result = [{value: '', label: '?????? ????????????????????????'}]
    if (childUsers) {
      for (let i = 0; i < childUsers.length; i++) {
        result.push({value: childUsers[i].id, label: childUsers[i].name ? childUsers[i].name : childUsers[i].login});
      }
      return result;
    }
    return []
  };
  const convertedOptions = optionsConverter();
  const convertedValue = convertedOptions.filter((item) => {
    if (currentChildUser) {
      return item.value === currentChildUser.id
    }
  })[0] || {value: '', label: '?????? ????????????????????????'};


  useEffect(() => {
    if (currentUser && currentUser.language) {
      dispatch(langSlice.actions.setLang(currentUser.language));
    }
  }, [currentUser]);

  return (
    <div className={classes.headerWrapper}>
      {/*{loading && <LinearProgress color="primary"/>}*/}
      <div className={classes.headerInner}>
        <div className={classes.headerLeftBlock}>
          {/* ?????????????? */}
          <div className={classes.headerIconWrapper}>
            <img className={classes.headerIcon} height={55} src={LogoImg} alt="Imot.io"/>
          </div>
          {/* ?????????????????? */}
          {isAuth && (
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={handleRouteChange}
              style={{cursor: 'pointer'}}
            >
              {/* Calls */}
              <ToggleButton
                key={0}
                disabled={'calls' === alignment}
                value={'calls'}
                onClick={() => {
                  dispatch(langSlice.actions.setLoading(true));
                  history.location.pathname = '/'
                  history.replace(`${language}/${currentUser ? currentUser.id : "_"}/calls`);
                }}
                className={classes.headerItemText}
              >
                {translate('calls', language)}
              </ToggleButton>

              {/* Reports */}
              <ToggleButton
                key={1}
                disabled={'reports' === alignment}
                value={'reports'}
                onClick={() => {
                  dispatch(langSlice.actions.setLoading(true));
                  history.location.pathname = '/'
                  history.replace(`${language}/${currentUser ? currentUser.id : "_"}/reports`);
                }}
                className={classes.headerItemText}
              >
                {translate('reports', language)}
              </ToggleButton>

              {/* Markuprules */}
              <ToggleButton
                key={2}
                disabled={pagePath === 'markuprules' && pagePath === alignment}
                value={'markuprules'}
                onClick={async () => {
                  dispatch(langSlice.actions.setLoading(true));
                  history.location.pathname = '/'
                  history.replace(`${language}/${currentUser ? currentUser.id : "_"}/markuprules/${activePage}`);
                  await dispatch(getGroups());
                }}
                className={classes.headerItemText}
              >
                {translate('markupRules', language)}
              </ToggleButton>

              {/* Upload */}
              <ToggleButton
                key={3}
                disabled={'upload' === alignment}
                value={'upload'}
                onClick={() => {
                  dispatch(langSlice.actions.setLoading(true));
                  history.location.pathname = '/'
                  history.replace(`${language}/${currentUser ? currentUser.id : "_"}/upload`);
                }}
                className={classes.headerItemText}
              >
                {translate('loadCall', language)}
              </ToggleButton>

              {/* Alert */}
              <ToggleButton
                key={4}
                disabled={'alert' === alignment}
                value={'alert'}
                style={{cursor: 'default !important'}}
                onClick={() => {
                  dispatch(langSlice.actions.setLoading(true));
                  history.location.pathname = '/'
                  history.replace(`${language}/${currentUser ? currentUser.id : "_"}/alert`);
                }}
                className={classes.headerItemText}
              >
                {translate('alert', language)}
              </ToggleButton>

              {/* Settings */}
              <ToggleButton
                key={5}
                disabled={'settings' === alignment}
                value={'settings'}
                onClick={() => {
                  dispatch(langSlice.actions.setLoading(true));
                  history.location.pathname = '/'
                  history.replace(`${language}/${currentUser ? currentUser.id : "_"}/settings`);
                }}
                className={classes.headerItemText}
              >
                {translate('settings', language)}
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </div>


        <div className={classes.headerRightBlock}>
          <div style={{display: 'flex', marginRight: '30px'}}>
            {currentChildUser && currentUser && currentUser.accessRights.includes('admin') && (
              <ContainedSelect
                width={'220px'}
                onSelectChange={handleUserChange}
                options={convertedOptions}
                value={convertedValue}
              />
            )}
            {/* ?????????? ?????????? */}
            <Select
              MenuProps={{
                disableScrollLock: true
              }}
              className={classes.langHandler}
              variant='standard'
              value={language}
              onChange={handleLangChange}
            >
              <MenuItem className={classes.langHandlerItem} value={'ru'}>RU</MenuItem>
              <MenuItem className={classes.langHandlerItem} value={'en'}>EN</MenuItem>
            </Select>
          </div>

          {isAuth ? (
            <>
              {/* ?????????? ???? ???????????????? */}
              <Button className={classes.headerLogout} startIcon={<LogoutSvg/>} onClick={logout}>
                {translate('logout', language)}
              </Button>
            </>
          ) : (
            <>
              {/* ?????????? ???? ???????????????? */}
              <Button className={classes.headerLogout} startIcon={<LogoutSvg/>} onClick={login}>
                ??????????
              </Button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Header;