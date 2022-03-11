import React from 'react';
import {Button, SelectChangeEvent} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {useHistory} from 'react-router-dom';
import LogoPng from '../assets/images/logo.png';
import {RootState} from '../store';
import {setLanguage} from '../store/lang/langActions';
import {translate} from '../localizations';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {removeAuthToken} from "../store/auth/auth.slice";
import {useAppSelector} from "../hooks/redux";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useDispatch} from "react-redux";
import {callsSlice} from "../store/calls/calls.slice";
import {searchSlice} from "../store/search/search.slice";

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
  },
  headerIcon: {
    padding: '14px 35px'
  },
  headerItemText: {
    color: '#738094 !important',
    transition: '0.4s !important',
    opacity: '0.7',
    padding: '13px 20px !important',
    // @ts-ignore
    textTransform: 'none !important',
    '&.Mui-selected': {
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
    width: '185px',
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
    padding: '0 26px !important',
    // @ts-ignore
    textTransform: 'none !important',
    color: '#738094 !important',
    '&:hover': {
      backgroundColor: '#fff !important'
    },
    '& .MuiButton-startIcon svg': {
      fill: '#738094',
    }
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const {language} = useAppSelector((state: RootState) => state.lang);
  const history = useHistory();
  const handleLangChange = (event: SelectChangeEvent) => {
    const currentLang = event.target.value;
    dispatch(setLanguage(currentLang));
  };

  const headerItemsArray: { id: number, path: string, name: string }[] = [
    {id: 1, path: 'calls', name: translate('calls', language)},
    {id: 2, path: 'reports', name: translate('reports', language)},
    {id: 3, path: 'rules', name: translate('markupRules', language)},
    {id: 4, path: 'upload', name: translate('loadCall', language)},
    {id: 5, path: 'dictionaries', name: translate('alert', language)},
    {id: 6, path: 'settings', name: translate('settings', language)},
  ];

  const [alignment, setAlignment] = React.useState('calls');

  const handleRouteChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const logout = () => {
    dispatch(removeAuthToken())
    dispatch(callsSlice.actions.setEmptyState({leaveBundles: 0}));
    dispatch(searchSlice.actions.removeAllState(null));
  }

  return (
    <div className={classes.headerWrapper}>
      <div className={classes.headerInner}>
        <div className={classes.headerLeftBlock}>
          {/* Логотип */}
          <img className={classes.headerIcon} height={25} src={LogoPng} alt=""/>

          {/* Навигация */}
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleRouteChange}
            style={{cursor: 'pointer'}}
          >
            {headerItemsArray.map(item =>
              <ToggleButton key={item.id} disabled={item.path === alignment} onClick={() => {
                history.push(item.path);
              }} className={classes.headerItemText} value={item.path}>
                {item.name}
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </div>

        <div className={classes.headerRightBlock}>
          {/* Смена языка */}
          <Select MenuProps={{
            disableScrollLock: true
          }} className={classes.langHandler} variant='standard' value={language} onChange={handleLangChange}>
            <MenuItem className={classes.langHandlerItem} value={'RU'}>RU</MenuItem>
            <MenuItem className={classes.langHandlerItem} value={'EN'}>EN</MenuItem>
          </Select>

          {/* Выход из аккаунта */}
          <Button className={classes.headerLogout} startIcon={<LogoutSvg/>} onClick={logout}>
            {translate('logout', language)}
          </Button>

        </div>
      </div>
    </div>
  );
}

export default Header;