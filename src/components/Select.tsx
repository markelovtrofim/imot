import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import {FC, memo, useState} from "react";
import {CriteriasType, RequestDataType} from "../store/search/search.types";
import {searchSlice} from "../store/search/search.slice";
import {useDispatch} from "react-redux";
import {makeStyles} from "@mui/styles";
import {useAppSelector} from "../hooks/redux";
import {current} from "@reduxjs/toolkit";

const useStyles = makeStyles(({
  selectBox: {
    display: 'flex !important',
    alignItems: 'center'
  },
  selectInput: {
    minWidth: '70px',
    width: '100%',
    height: '32px',
    border: `1px solid #E3E8EF`,
    borderRadius: '5px',
    '& input': {

      height: '100%',
      border: `none`,
      borderRadius: '5px',
      opacity: '1',
      backgroundColor: '#E3E8EF'
    }
  }
}));

const CrossSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="8" fill="#738094"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M11.1618 4.83785C11.3896 5.06567 11.3896 5.43503 11.1618 5.66285L5.66187 11.1628C5.43406 11.3906 5.06469 11.3906 4.83688 11.1628C4.60906 10.935 4.60906 10.5656 4.83688 10.3378L10.3368 4.83785C10.5646 4.61004 10.934 4.61004 11.1618 4.83785Z"
            fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.83688 4.83785C5.06469 4.61004 5.43406 4.61004 5.66187 4.83785L11.1618 10.3378C11.3896 10.5656 11.3896 10.935 11.1618 11.1628C10.934 11.3906 10.5646 11.3906 10.3368 11.1628L4.83688 5.66285C4.60906 5.43503 4.60906 5.06567 4.83688 4.83785Z"
            fill="white"/>
    </svg>
  );
};

type SelectType = {
  criteriaFull: CriteriasType,
  criteriaCurrent: CriteriasType | RequestDataType,
  isDefaultCriteria: boolean
};


const CustomSelect: FC<SelectType> = ({criteriaFull, criteriaCurrent, isDefaultCriteria}) => {
  const classes = useStyles();
  const dispatch = useDispatch();


  const removeCriteria = () => {
    dispatch(searchSlice.actions.removeActiveCriteria(criteriaFull));
  };

  const handleChange = (event: any) => {
    const eventConverter = () => {
      let result = [];
      for (let i = 0; i < event.length; i++) {
        result.push(event[i].value);
      }
      return result;
    };

    const eventConverterResult = eventConverter();

    if (isDefaultCriteria) {
      dispatch(searchSlice.actions.setDefaultCriteriaValues({key: criteriaFull.key, values: [...eventConverterResult]}))
    } else {
      dispatch(searchSlice.actions.setActiveCriteriaValues({key: criteriaFull.key, values: [...eventConverterResult]}));
    }
  };
  const converter = (state: any) => {
    let local: { value: string, label: string }[] = [];
    for (let i = 0; i < state.values.length; i++) {
      local.push({value: state.values[i], label: state.values[i]});
    }
    return local;
  };
  const converterFullResult = converter(criteriaFull);
  const converterCurrentResult = converter(criteriaCurrent);
  return (
    <FormControl>
      <div className={classes.selectBox}>
        {criteriaFull.selectType === "multiString" ?
          <CreatableSelect
            className={classes.selectInput}
            placeholder={"Все"}
            closeMenuOnSelect={false}
            isMulti
            value={converterCurrentResult}
            onChange={handleChange}
            options={converterFullResult}
          /> :
          <Select
            placeholder={"Все"}
            closeMenuOnSelect={false}
            isMulti
            className={classes.selectInput}
            value={converterCurrentResult}
            onChange={handleChange}
            options={converterFullResult}
          />
        }
        {isDefaultCriteria
          ? null
          : <CrossSvg onClick={removeCriteria} style={{cursor: 'pointer', marginLeft: '8px'}}/>
        }
      </div>
    </FormControl>
  );
};

export default CustomSelect;
