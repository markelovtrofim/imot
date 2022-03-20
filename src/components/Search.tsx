import React, {FC, useDebugValue, useEffect, useState} from 'react';
import BlockBox from "./BlockBox";
import {Alert, Button, Snackbar, Typography} from "@mui/material";
import SearchSelect from './Select'
import {makeStyles} from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import {useAppSelector} from "../hooks/redux";
import {useDispatch} from "react-redux";
import {callsSlice, getBaseCallsData} from "../store/calls/calls.slice";
import SelectTwo from "./SelectTwo";
import {getAllSearchCriterias, getDefaultCriterias, searchSlice} from "../store/search/search.slice";
import {translate} from "../localizations";
import {RootState} from "../store";
import Select from "react-select";
import {getAllTemplates} from "../store/search/template.slice";
import {TemplateItem, TemplatesType} from "../store/search/template.types";
import {CriteriasType, RequestDataType} from "../store/search/search.types";
import {current} from "@reduxjs/toolkit";

const useStyles = makeStyles(({
  searchTitle: {
    height: '35px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },

  searchTitleLeft: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchTitleLeftText: {},
  searchTitleLeftStick: {
    marginLeft: '16px !important',
    color: '#CDD5DF !important',
    fontSize: '17px !important'
  },

  searchTitleRight: {
    display: 'flex',
    alignItems: 'center'
  },
  searchDeleteAllButton: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '40px',
    cursor: 'pointer'
  },
  searchDeleteAllButtonText: {
    color: '#2F3747 !important'
  },
  searchButton: {
    fontSize: '14px !important',
    // @ts-ignore
    textTransform: 'none !important',
    color: '#22075E !important'
  },
  searchButtonIcon: {
    fill: '#722ED1 !important'
  },

  searchItems: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap'
  },
  searchItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 22px 16px 0'
  },
  searchText: {
    marginRight: '8px !important'
  },
  tagsBox: {
    minWidth: '70px',
    height: '32px',
    backgroundColor: '#F8FAFC',
    border: 'none !important',
    outline: 'none'
  },
  searchSearchButton: {
    // @ts-ignore
    textTransform: 'none !important'
  }
}));

const FolderPlusSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M16.7577 6.67277C17.1038 8.86287 17.079 11.0965 16.6843 13.2782C16.5404 14.0741 15.8813 14.6708 15.0822 14.7285L13.6209 14.8341C10.5605 15.0553 7.48852 15.0553 4.42814 14.8341L3.07734 14.7365C2.21323 14.6741 1.50051 14.0289 1.3448 13.1681C0.963241 11.0588 0.897923 8.9036 1.15102 6.77476L1.39414 4.72991C1.51149 3.74285 2.34055 3 3.32483 3H5.36936C6.25472 3 6.97244 3.72493 6.97244 4.61918C6.97244 4.64872 6.99615 4.67266 7.0254 4.67266H14.799C15.7453 4.67266 16.5513 5.36716 16.7005 6.31101L16.7577 6.67277ZM9.69369 7.7311C9.69369 7.35784 9.39408 7.05523 9.02454 7.05523C8.65498 7.05523 8.35538 7.35784 8.35538 7.7311V9.30813H6.79403C6.42447 9.30813 6.12488 9.61074 6.12488 9.984C6.12488 10.3573 6.42447 10.6599 6.79403 10.6599H8.35538V12.2369C8.35538 12.6102 8.65498 12.9128 9.02454 12.9128C9.39408 12.9128 9.69369 12.6102 9.69369 12.2369V10.6599H11.255C11.6246 10.6599 11.9242 10.3573 11.9242 9.984C11.9242 9.61074 11.6246 9.30813 11.255 9.30813H9.69369V7.7311Z"
            fill="#9254DE"/>
    </svg>
  );
};

const CrossSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M11.1618 4.83785C11.3896 5.06567 11.3896 5.43503 11.1618 5.66285L5.66187 11.1628C5.43406 11.3906 5.06469 11.3906 4.83688 11.1628C4.60906 10.935 4.60906 10.5656 4.83688 10.3378L10.3368 4.83785C10.5646 4.61004 10.934 4.61004 11.1618 4.83785Z"
            fill="black"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.83688 4.83785C5.06469 4.61004 5.43406 4.61004 5.66187 4.83785L11.1618 10.3378C11.3896 10.5656 11.3896 10.935 11.1618 11.1628C10.934 11.3906 10.5646 11.3906 10.3368 11.1628L4.83688 5.66285C4.60906 5.43503 4.60906 5.06567 4.83688 4.83785Z"
            fill="black"/>
    </svg>
  );
};

type FilterPropsType = {
  pageName: string
}

const Search: FC<FilterPropsType> = ({pageName}) => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const defaultCriterias = useAppSelector(state => state.search.defaultCriterias);
  const activeCriterias = useAppSelector(state => state.search.activeCriterias);
  const {language} = useAppSelector((state: RootState) => state.lang);
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const allCriterias = useAppSelector(state => state.search.allCriterias);
  const allTemplates = useAppSelector(state => state.template.allTemplates);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const removeAllCriteriasHandler = () => {
    dispatch(searchSlice.actions.setClearDefaultCriteriasValues(null));
    dispatch(searchSlice.actions.removeAllActiveCriterias(null));
  };

  const searchRequest = async () => {
    setLoading(true);
    dispatch(callsSlice.actions.zeroingSkip(null));
    await dispatch(callsSlice.actions.setEmptyState({leaveBundles: 0}));
    await dispatch(getBaseCallsData());
    setLoading(false);
  };

  // template select
  const converter = (state: TemplatesType[] | null) => {
    if (state) {
      let local: { value: TemplateItem[], label: string }[] = [];
      for (let i = 0; i < state.length; i++) {
        local.push({value: state[i].items, label: state[i].title});
      }
      return local
    }
    return [];
  };
  const convertResult = converter(allTemplates);

  const handleSelectChange = (e: any) => {
    dispatch(searchSlice.actions.setClearDefaultCriteriasValues(null))
    if (allCriterias) {
      let fullCriteriaLocal: CriteriasType[] = [];
      for (let i = 0; i < e.value.length; i++) {
        const obj = allCriterias.find((item) => {
          return item.key === e.value[i].key;
        });
        // @ts-ignore
        fullCriteriaLocal.push({...obj, values: e.value[i].values})
      }

      let activeCriteriasLocal = [];
      for (let i = 0; i < fullCriteriaLocal.length; i++) {
        const obj = defaultCriterias.find((item) => {
          return item.key === fullCriteriaLocal[i].key
        });
        if (obj) {
          dispatch(searchSlice.actions.setDefaultCriteriaValues({key: fullCriteriaLocal[i].key, values: fullCriteriaLocal[i].values}))
        } else {
          activeCriteriasLocal.push(fullCriteriaLocal[i]);
        }
      }
      dispatch(searchSlice.actions.setActiveCriterias(activeCriteriasLocal))
    }
  }

  useEffect(() => {
    if (isAuth && defaultCriterias.length < 1 && activeCriterias.length < 1) {
      dispatch(getDefaultCriterias());
      dispatch(getAllSearchCriterias());
      dispatch(getAllTemplates());
    }
  }, []);

  const customStyles = {
    menu: (provided: any, state: any) => ({
      ...provided,
      width: '200px',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      color: '#000'
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      '& span': {
        opacity: '0'
      },
      border: 'none',
      boxShadow: 'none',
      backgroundColor: '#fff'
    })
  }

  return (
    <div style={{margin: '24px 0'}}>
      <BlockBox padding="34px 24px 10px 24px">
        <div className={classes.searchTitle}>
          <div className={classes.searchTitleLeft}>
            <Typography className={classes.searchTitleLeftText} variant="h5">
              {translate('searchTitle', language)}
            </Typography>
            <div style={{display: 'flex'}}>
              <Typography className={classes.searchTitleLeftStick} variant="h6">|</Typography>
              <Select
                placeholder={'Выбрать'}
                options={convertResult}
                onChange={handleSelectChange}
                styles={customStyles}
                isSearchable={false}
              />
            </div>
          </div>
          {(activeCriterias.length > 0 || defaultCriterias.some(item => item.values.length > 0)) &&
          <div className={classes.searchTitleRight}>
            <div onClick={removeAllCriteriasHandler} className={classes.searchDeleteAllButton}>
              <CrossSvg style={{marginRight: '5px'}}/>
              <Typography
                className={classes.searchDeleteAllButtonText}>{translate('searchClear', language)}</Typography>
            </div>
            <Button
              className={classes.searchButton}
              startIcon={<FolderPlusSvg className={classes.searchButtonIcon}/>}
              color="secondary"
              variant="contained"
              onClick={handleClick}
            >
              {translate('searchSaveTemp', language)}
            </Button>
          </div>}
          <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={500}
                    onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
              Данная функция пока не работает
            </Alert>
          </Snackbar>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', minHeight: '50px'}}>
          <div className={classes.searchItems}>
            {defaultCriterias && allCriterias ? defaultCriterias.map(criteria => {
              const criteriaKey = criteria.key.slice(4);
              const compResult = allCriterias.filter(v => v.key === criteria.key);
              return (
                <div className={classes.searchItem}>
                  <Typography className={classes.searchText}>{criteriaKey}</Typography>
                  <SearchSelect criteriaFull={compResult[0]} criteriaCurrent={criteria} isDefaultCriteria={true}/>
                </div>
              )
            }) : null}
            {activeCriterias && allCriterias ? activeCriterias.map(criteria => {
              const compResult = allCriterias.filter(v => v.key === criteria.key);
              return (
                <div className={classes.searchItem}>
                  <Typography className={classes.searchText}>{criteria.title}</Typography>
                  <SearchSelect criteriaFull={compResult[0]} criteriaCurrent={criteria} isDefaultCriteria={false}/>
                </div>
              )
            }) : null}
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <LoadingButton
              className={classes.searchSearchButton}
              startIcon={<SearchIcon/>}
              color="primary"
              variant="contained"
              loading={loading}
              loadingPosition="start"
              onClick={searchRequest}
            >
              {translate('searchButton', language)}
            </LoadingButton>
            <SelectTwo criterias={allCriterias}/>
          </div>
        </div>
      </BlockBox>
    </div>
  );
};

export default Search;
