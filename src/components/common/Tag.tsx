import React, {FC, memo} from 'react';
import Chip from '@mui/material/Chip';
import {makeStyles} from "@mui/styles";
import cn from 'classnames';
import Tooltip from '@mui/material/Tooltip';
type TagPropsType = {
  title: string,
  body: string
};

export const TwoTags: FC<TagPropsType> = memo(({title, body}) => {

  const useStyles = makeStyles(({
    general: {
      height: '24px !important',
      cursor: 'default !important',
      fontFamily: 'Inter, sans-serif !important',
      borderRadius: '0 !important',
    },
    title: {
      borderRadius: `${body ? '0' : '3px'} !important`,
      borderTopLeftRadius: "3px !important",
      borderBottomLeftRadius: "3px !important",
      margin: '0 0 5px 5px !important',
      backgroundColor: '#D6D9DF !important',
      color: `#000000 !important`,
      borderColor: '#D6D9DF !important'
    },
    body: {
      borderTopRightRadius: "3px !important",
      borderBottomRightRadius: "3px !important",
      margin: '0 5px 5px 0 !important',
      backgroundColor: `#722ED1 !important`,
      color: `#fff !important`,
      borderColor: `#722ED1 !important`
    }
  }));
  const classes = useStyles();
  return (
    <span>
      <Chip label={title} className={cn(classes.title, classes.general)}/>
      {body && <Chip label={body} className={cn(classes.body, classes.general)}/>}
    </span>
  )
});


export const TwoTagsMini: FC<TagPropsType> = memo(({title, body}) => {

  const useStyles = makeStyles(({
    general: {
      height: '20px !important',
      cursor: 'default !important',
      fontFamily: 'Inter, sans-serif !important',
      borderRadius: '0 !important',
    },
    title: {
      borderRadius: `${body ? '0' : '3px'} !important`,
      borderTopLeftRadius: "3px !important",
      borderBottomLeftRadius: "3px !important",
      backgroundColor: '#D6D9DF !important',
      color: `#000000 !important`,
      borderColor: '#D6D9DF !important'
    },
    body: {
      borderTopRightRadius: "3px !important",
      borderBottomRightRadius: "3px !important",
      margin: '5px 5px 5px 0 !important',
      backgroundColor: `#722ED1 !important`,
      color: `#fff !important`,
      borderColor: `#722ED1 !important`
    }
  }));
  const classes = useStyles();
  return (
    <span>
      <Chip label={title} className={cn(classes.title, classes.general)}/>
      {body && <Chip label={body} className={cn(classes.body, classes.general)}/>}
    </span>
  )
});

export const BaseTag: FC<{ body: string }> = memo(({body}) => {
  const useStyles = makeStyles(({
    body: {
      zIndex: '2',
      height: '24px !important',
      cursor: 'pointer !important',
      fontFamily: 'Inter, sans-serif !important',
      border: '2px solid #E9ECEF !important',
      borderRadius: '3px !important',
      margin: '2px !important',
      backgroundColor: '#D6D9DF !important',
      color: `#000000 !important`
    }
  }));
  const classes = useStyles();
  return <Chip label={body} className={classes.body}/>
});



export const Fragment: FC<{matchData: string}> = memo(({children, matchData}) => {
  const useStyles = makeStyles(({
    tooltip: {
      borderRadius: "3px",
      fontFamily: 'Inter, sans-serif !important',
      color: '#000 !important',
      fontSize: '14px !important',
      padding: '6px 8px !important',
      backgroundColor : '#fff !important',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    },
    arrow: {
      backgroundColor: '#fff !important'
    },
    body: {
      borderRadius: '3px !important',
      height: '24px !important',
      margin: '5px !important',
      cursor: 'pointer !important',
      backgroundColor: `#D6D9DF !important`,
      color: `#000 !important`,
      fontFamily: 'Inter, sans-serif !important',
      border: `2px solid #D6D9DF !important`,
      "&:hover": {
        borderColor: `#D6D9DF !important`
      }
    }
  }));
  const classes = useStyles();
  return (
    <Tooltip disableInteractive={true} classes={{tooltip: classes.tooltip}} title={matchData} placement="top">
      <Chip label={children} className={classes.body}/>
    </Tooltip>
  )
});
