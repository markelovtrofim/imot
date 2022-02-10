import React from 'react';
import {SelectChangeEvent, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {NavLink} from 'react-router-dom';
import LogoPng from '../assets/images/logo.png';
import {RootState} from '../store';
import {setLanguage} from '../store/actions/langActions';
import {translate} from '../localizations';
import MenuItem from '@mui/material/MenuItem';
import Select  from '@mui/material/Select';
import cn from 'classnames';
import {removeAuthToken} from "../store/reducers/auth.slice";
import {useAppDispatch, useAppSelector} from "../hooks/redux";

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
  headerItem: {
    textDecoration: 'none',
    fontSize: '20px !important',
    padding: '15px 35px',
    transition: '0.2s',
    '&:hover': {
      backgroundColor: '#E3E8EF',
      padding: '15px 35px',
    },
    '&:hover $headerItemText': {
      color: '#000000 !important'
    }
  },
  headerItemText: {
    color: '#738094 !important',
    transition: '0.2s',
    fontSize: '15px !important',
    opacity: '0.7'
  },
  headerItemTextActive: {
    backgroundColor: '#E3E8EF',
    '& $headerItemText': {
      color: '#000000 !important',
      opacity: '1',
    }
  },
  headerRightBlock: {
    display: 'flex'
  },
  langHandler: {
    '& .MuiInput-input:focus': {
      backgroundColor: '#fff',

    },
    marginRight: '25px',
    border: 'none',
    outline: 'none',
    '&::before': {
      border: 'none !important'
    }
  },
  headerLogout: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '&:hover &headerLogoutIcon': {
      fill: '#000000',
    }
  },
  headerLogoutIcon: {
    marginRight: '10px',
    fill: '#212121'
  },
}));

export const LogoutSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.5 10.6663C5.5 10.3902 5.72387 10.1663 6 10.1663H10C10.0921 10.1663 10.1667 10.0917 10.1667 9.99967V1.99967C10.1667 1.90763 10.0921 1.83301 10 1.83301H6C5.72387 1.83301 5.5 1.60915 5.5 1.33301C5.5 1.05687 5.72387 0.833008 6 0.833008H10C10.6443 0.833008 11.1667 1.35534 11.1667 1.99967V9.99967C11.1667 10.644 10.6443 11.1663 10 11.1663H6C5.72387 11.1663 5.5 10.9425 5.5 10.6663Z"/>
      <path d="M0.333984 6.74307C0.333984 7.11127 0.632458 7.40974 1.00065 7.40974H4.23798C4.25327 7.64667 4.2724 7.88347 4.29538 8.11994L4.31516 8.3234C4.34731 8.65427 4.69865 8.85233 4.99838 8.70873C6.21699 8.12467 7.32019 7.32554 8.25485 6.3496L8.27485 6.32874C8.45292 6.1428 8.45292 5.84967 8.27485 5.66374L8.25485 5.64287C7.32019 4.66694 6.21699 3.86778 4.99838 3.28377C4.69865 3.14011 4.34731 3.33824 4.31516 3.66907L4.29538 3.87253C4.2724 4.10902 4.25327 4.34579 4.23798 4.58273L1.00065 4.58274C0.632464 4.58274 0.333984 4.8812 0.333984 5.2494V6.74307Z"/>
    </svg>
  );
};

const Header: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const {language} = useAppSelector((state: RootState) => state.lang);

  const handleChange = (event: SelectChangeEvent) => {
    const currentLang = event.target.value;
    dispatch(setLanguage(currentLang));
  };

  const headerItemsArray: { id: number, path: string, name: string }[] = [
    {id: 1, path: 'calls', name: translate('calls', language)},
    {id: 2, path: 'report', name: translate('markupRules', language)},
    {id: 3, path: 'upload', name: translate('loadCall', language)},
    {id: 4, path: 'dictionaries', name: translate('alert', language)},
    {id: 5, path: 'settings', name: translate('settings', language)},
  ];

  return (
    <div className={classes.headerWrapper}>
      <div className={classes.headerInner}>
        <div className={classes.headerLeftBlock}>
          {/* Логотип */}
          <img className={classes.headerIcon} height={25} src={LogoPng} alt=""/>

          {/* Навигация */}
          {headerItemsArray.map(item =>
            <NavLink key={item.id} activeClassName={classes.headerItemTextActive} className={classes.headerItem} to={`/${item.path}`}>
              <Typography className={classes.headerItemText}>{item.name}</Typography>
            </NavLink>
          )}

        </div>

        <div className={classes.headerRightBlock}>
          {/* Смена языка */}
          <Select MenuProps={{
            disableScrollLock: true
          }} className={classes.langHandler} variant='standard' value={language} onChange={handleChange}>
            <MenuItem value={'RU'}>RU</MenuItem>
            <MenuItem value={'EN'}>EN</MenuItem>
          </Select>

          {/* Выход из аккаунта */}
          <div className={cn(classes.headerLogout, classes.headerItem)} onClick={() => {dispatch(removeAuthToken())}}>
            <LogoutSvg className={classes.headerLogoutIcon}/>
            <Typography className={classes.headerItemText}>{translate('logout', language)}</Typography>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Header;