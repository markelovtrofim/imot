import React from 'react';
import SearchSelect from '../Search/SearchSelect';
import {makeStyles} from '@mui/styles';
import {Typography} from "@mui/material";

const useStyles = makeStyles(({
  searchText: {
    marginRight: '8px !important',
    color: '#2F3747 !important',
    whiteSpace: 'nowrap'
  },
}))

const CriteriaItem = (props: any) => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.searchText}>{props.title}</Typography>
      <SearchSelect
        criteriaFull={props.criteriaFull}
        criteriaCurrent={props.criteriaCurrent}
        isDefaultCriteria={props.isDefaultCriteria}
        block={props.block}
        index={props.index}
      />
    </>
  ) 
}

export default CriteriaItem;