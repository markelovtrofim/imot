import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {makeStyles} from "@mui/styles";
import {Checkbox, InputBase, ListItemText} from "@mui/material";
import {BaseTag} from "./Tag";
import {FC, useState} from "react";
import {CriteriasType, RequestDataType} from "../store/search/search.types";
import {searchSlice} from "../store/search/search.slice";
import {useDispatch} from "react-redux";

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
    "&:focus": {
      borderColor: `red`,
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
  const [selectDataArray, setSelectDataArray] = useState<string[]>(criteriaCurrent.values)

  const removeCriteria = () => {
    setSelectDataArray([]);
    dispatch(searchSlice.actions.removeActiveCriteria(criteriaFull));
  };

  const handleChange = (event: any) => {
    const {target: {value}} = event;
    setSelectDataArray(value);
    if (isDefaultCriteria) {
      dispatch(searchSlice.actions.setDefaultCriteriaValues({key: criteriaFull.key, values: [...value]}))
    } else {
      debugger
      dispatch(searchSlice.actions.setActiveCriteriaValues({key: criteriaFull.key, values: [...value]}));
    }
  };

  return (
    <FormControl>
      <div className={classes.selectBox}>
        <Select
          MenuProps={{
            disableScrollLock: true
          }}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={criteriaCurrent.values}
          onChange={handleChange}
          input={<InputBase className={classes.selectInput}/>}
          renderValue={(selected) => {
            if (selected.length > 1) {
              return <div style={{display: 'flex'}}>
                <BaseTag body={selected[0]}/>
                <BaseTag body={`+${selected.length - 1}`}/>
              </div>
            }
            return <BaseTag body={selected[0]}/>
          }}
        >
          {criteriaFull.values ? criteriaFull.values.map((name: string) => {
            return (
              <MenuItem key={name} value={name}>
                <ListItemText primary={name}/>
                <Checkbox checked={selectDataArray.indexOf(name) > -1}/>
              </MenuItem>
            )
          }) : null}
        </Select>
        {isDefaultCriteria
          ? null
          : <CrossSvg onClick={removeCriteria} style={{cursor: 'pointer', marginLeft: '8px'}}/>
        }
      </div>
    </FormControl>
  );
};

export default CustomSelect;
