import React, {FC, memo} from 'react';
import Chip from '@mui/material/Chip';
import {makeStyles} from "@mui/styles";
import cn from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import {components} from "react-select";


const getRandomColor = () => {
  const colorsArray = [
    {backgroundColor: "#FFCCC7", color: "#A8071A", hover: "#F9AEA7"},
    {backgroundColor: "#D6E4FF", color: "#061178", hover: "#BED3FE"},
    {backgroundColor: "#D9F7BE", color: "#237804", hover: "#9EEC5A"}
  ];
  const random = Math.floor(Math.random() * 3);
  return colorsArray[random];
};

type TagPropsType = {
  title: string,
  body: string
};

export const TwoTags: FC<TagPropsType> = memo(({title, body}) => {
  const {backgroundColor, color, hover} = getRandomColor();

  const useStyles = makeStyles(({
    general: {
      height: '27px !important',
      cursor: 'default !important',
      fontFamily: 'Inter, sans-serif !important',
      border: '2px solid #E9ECEF !important',
      borderRadius: '0 !important',
    },
    title: {
      borderRadius: `${body ? '0' : '5px'} !important`,
      borderTopLeftRadius: "5px !important",
      borderBottomLeftRadius: "5px !important",
      margin: '5px 0 5px 5px !important',
      backgroundColor: '#E9ECEF !important',
      color: `#000000 !important`
    },
    body: {
      borderTopRightRadius: "5px !important",
      borderBottomRightRadius: "5px !important",
      margin: '5px 5px 5px 0 !important',
      backgroundColor: `${backgroundColor} !important`,
      color: `${color} !important`,
      borderColor: `${backgroundColor} !important`
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
      height: '27px !important',
      cursor: 'pointer !important',
      fontFamily: 'Inter, sans-serif !important',
      border: '2px solid #E9ECEF !important',
      borderRadius: '5px !important',
      margin: '2px !important',
      backgroundColor: '#E9ECEF !important',
      color: `#000000 !important`
    }
  }));
  const classes = useStyles();
  return <Chip label={body} clickable className={classes.body}/>
});


export const Fragment: FC<{matchData: string}> = memo(({children, matchData}) => {
  const {backgroundColor, color, hover} = getRandomColor();
  const useStyles = makeStyles(({
    tooltip: {
      borderRadius: "5px",
      fontFamily: 'Inter, sans-serif !important',
      color: '#000 !important',
      fontSize: '14px !important',
      padding: '6px 8px !important',
      backgroundColor: '#fff !important',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    },
    arrow: {
      backgroundColor: '#fff !important'
    },
    body: {
      borderRadius: '5px !important',
      height: '27px !important',
      margin: '5px !important',
      cursor: 'pointer !important',
      backgroundColor: `${backgroundColor} !important`,
      color: `${color} !important`,
      fontFamily: 'Inter, sans-serif !important',
      border: `2px solid ${backgroundColor} !important`,
      "&:hover": {
        borderColor: `${hover} !important`
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
