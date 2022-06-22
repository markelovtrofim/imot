import React, {FC, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {BlockBox} from "../../components/common";
import {Typography} from "@mui/material";

const MenuItem: FC<{ isActive: boolean, text: string, handleClick: () => void }> = ({isActive, text, handleClick}) => {
  const useMenuItemStyles = makeStyles(({
    menuItem: {
      cursor: 'pointer',
      borderLeft: '2px solid #EEF2F6',
      borderColor: isActive ? '#9254DE' : '#EEF2F6',
      padding: '9px 16px'
    },
    menuItemText: {
      color: isActive ? '#9254DE !important' : '#738094 !important',
      fontWeight: '700 !important'
    }
  }));
  const classes = useMenuItemStyles();
  return (
    <div className={classes.menuItem} onClick={handleClick}>
      <Typography className={classes.menuItemText}>{text}</Typography>
    </div>
  )
}

const Settings = () => {
  const useSettingsStyles = makeStyles(({
    settingsBox: {
      width: '100%',
      height: '810px',
      display: 'flex',
      margin: '40px 0'
    },
    settingsMenu: {
      width: '350px',
      marginRight: '20px',
      height: '100%',
    },
    settingsMenuTitle: {
      fontWeight: '700 !important',
      color: '#738094 !important',
      marginBottom: '24px !important'
    },

    settingsBodyInner: {}
  }));
  const classes = useSettingsStyles();

  const [settingsPageChanger, setSettingsPageChanger] = useState<'menu' | 'body'>('menu');

  return (
    <div className={classes.settingsBox}>
      <div className={classes.settingsMenu}>
        <Typography variant={'h5'} className={classes.settingsMenuTitle}>Настройки</Typography>
        <MenuItem
          text={"Профиль"}
          isActive={settingsPageChanger === 'menu'}
          handleClick={() => {
            setSettingsPageChanger('menu')
          }}
        />
        <MenuItem
          text={"Действия со звонком"}
          isActive={settingsPageChanger === 'body'}
          handleClick={() => {
            setSettingsPageChanger('body')
          }}
        />
      </div>
      <BlockBox width={'450px'} padding={'24px'}>
        <div className={classes.settingsBodyInner}>
          {settingsPageChanger === 'menu' &&
          <div>
            <div>
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h4">Профиль пользователя</Typography>
              <Typography style={{textAlign: 'center', color: '#722ED1', fontSize: '10px'}} variant="h2">
                in developing
              </Typography>
            </div>
          </div>
          }
          {settingsPageChanger === 'body' &&
          <div>
            <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}} variant="h4">Действия со звонком</Typography>
            <Typography style={{textAlign: 'center', color: '#722ED1', fontSize: '10px'}} variant="h2">
              in developing
            </Typography>
          </div>
          }
        </div>
      </BlockBox>
    </div>
  );
};

export default Settings;
