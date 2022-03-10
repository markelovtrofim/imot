import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {makeStyles} from "@mui/styles";
import {Checkbox, CircularProgress, InputBase, ListItemText, Typography} from "@mui/material";
import {FC, useEffect} from "react";
import {useDispatch} from "react-redux";
import {CriteriasType} from "../store/search/search.types";
import cn from 'classnames';
import {searchSlice} from "../store/search/search.slice";
import {useAppSelector} from "../hooks/redux";
import {translate} from "../localizations";
import {RootState} from "../store";

const useStyles = makeStyles(({
  select: {
    margin: '0 26px 0 5px',
    '& .MuiSelect-select': {
      padding: '0 0 0 32px !important'
    },
    '& svg': {
      left: '9px',
      fill: '#722ED1',
      width: '17px'
    }
  },
  selectInput: {
    display: 'flex !important',
    flexDirection: 'row-reverse',
    backgroundColor: 'none',
    border: 'none'
  },
  selectText: {
    position: 'relative',
    color: '#722ED1 !important',
    fontWeight: '700 !important'
  },
  selectParentheses: {
    position: 'absolute',
    left: '62px'
  },
  selectItem: {
    width: '280px',
  }
}));

type SelectType = {
  criterias: CriteriasType[] | null,
};

export const PlusSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M5.99941 0C6.43163 0 6.78201 0.350386 6.78201 0.782609V11.2174C6.78201 11.6496 6.43163 12 5.99941 12C5.56718 12 5.2168 11.6496 5.2168 11.2174V0.782609C5.2168 0.350386 5.56718 0 5.99941 0Z"
            fill="#73D13D"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M0 6.00038C0 5.56816 0.350386 5.21777 0.782609 5.21777H11.2174C11.6496 5.21777 12 5.56816 12 6.00038C12 6.4326 11.6496 6.78299 11.2174 6.78299H0.782609C0.350386 6.78299 0 6.4326 0 6.00038Z"
            fill="#73D13D"/>
    </svg>
  );
};

const CustomSelect: FC<SelectType> = ({criterias}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const activeCriterias = useAppSelector(state => state.search.activeCriterias);
  const {language} = useAppSelector((state: RootState) => state.lang);


  const handleChange = (event: any) => {
    const {target: {value}} = event;
    dispatch(searchSlice.actions.setActiveCriterias([...activeCriterias, {...value[value.length - 1], values :[]}]));
  };

  return (
    <Select
      MenuProps={{
        disableScrollLock: true
      }}
      className={classes.select}
      multiple
      onChange={handleChange}
      value={activeCriterias.length > 0 ? activeCriterias : ['test']}
      input={<InputBase className={classes.selectInput}/>}
      renderValue={(selected) => {
        if (selected[0] == 'test') {
          return <div style={{display: 'flex'}}>
            <Typography className={classes.selectText}>{translate('searchMore', language)}</Typography>
          </div>
        } else {
          return (
            <div style={{display: 'flex'}}>
              <Typography className={classes.selectText}>Еще</Typography>
              <Typography className={cn(classes.selectText, classes.selectParentheses)}>({selected.length})</Typography>
            </div>
          )
        }
      }}
    >
      {criterias ? criterias.map((criteria: CriteriasType) => {
          if (!activeCriterias.find((item) => {
            return item.key === criteria.key
          })) {
            return (
              // @ts-ignore
              <MenuItem className={classes.selectItem} key={criteria.key} value={criteria}>
                <ListItemText primary={criteria.title}/>
                <PlusSvg/>
              </MenuItem>
            )
          }
        }) :
        <div className={classes.selectItem}>
          <div style={{textAlign: 'center'}}>
            <CircularProgress color="primary"/>
          </div>
        </div>
      }
    </Select>
  );
}

export default CustomSelect;