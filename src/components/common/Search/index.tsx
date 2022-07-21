import React, {FC, memo, useEffect, useState} from 'react';
import BlockBox from "../BlockBox";
import {Button, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import {useAppSelector} from "../../../hooks/redux";
import {useDispatch} from "react-redux";
import {callsSlice, getBaseCallsData} from "../../../store/calls/calls.slice";
import {
  getAllSearchCriterias,
  getDefaultCriterias,
  getSearchHash,
  searchSlice
} from "../../../store/search/search.slice";
import {translate} from "../../../localizations";
import {RootState} from "../../../store/store";
import {getAllTemplates, templateSlice} from "../../../store/search/template.slice";
import {CriteriasType} from "../../../store/search/search.types";
import CreateNameTemplateModalWindow from "./CreateNameTemplateModalWindow";
import DeleteTemplateModalWindow from "./DeleteTemplateModalWindow";
import TextSelect from "../Selects/TextSelect/TextSelect";
import {optionsCreator} from "../../../utils/optionsCreator";
import CriteriasList from '../Criterias/CriteriasList';
import SaveCriterias from '../Criterias/SaveCriterias';
import CriteriaTemplate from '../Criterias/CriteriaTemplate';
import {useHistory} from "react-router-dom";
import * as queryString from "querystring";

const useStyles = makeStyles(({
  searchTitle: {
    height: '40px',
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
  searchTitleLeftText: {
    marginRight: '16px !important',
    color: '#2F3747 !important',
    fontWeight: '500 !important',
  },
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
    color: '#22075E !important',
    '&:hover ': {
      textDecoration: 'underline !important',
      backgroundColor: '#e0b8ff !important'
    }
  },
  searchButtonIcon: {
    fill: '#722ED1 !important'
  },

  searchItems: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    // display: 'grid'
  },
  searchItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 22px 16px 0',
    width: '100%',
  },
  searchItemBlock_1: {
    gridRowStart: 1,
    gridRowEnd: 2,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_2: {
    gridRowStart: 2,
    gridRowEnd: 3,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_3: {
    gridRowStart: 3,
    gridRowEnd: 4,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_4: {
    gridRowStart: 4,
    gridRowEnd: 5,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_noWide: {
    width: '30%',
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_Wide: {
    width: '70%',
    display: 'flex',
    alignItems: 'center',
  },
  searchText: {
    marginRight: '8px !important',
    color: '#2F3747 !important',
    // whiteSpace: 'nowrap',
    width: '120px !important',
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
    textTransform: 'none !important',
    borderRadius: '5px !important'
  },
  selectArrow: {
    marginRight: '10px'
  },
  selectArrowOnArrow: {
    marginBottom: '5px'
  },
}));


type FilterPropsType = {
  pageName: string
}

const Search: FC<FilterPropsType> = memo(() => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const defaultCriterias = useAppSelector(state => state.search.defaultCriterias);
  const activeCriterias = useAppSelector(state => state.search.activeCriterias);
  const {language} = useAppSelector((state: RootState) => state.lang);
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const allCriterias = useAppSelector(state => state.search.allCriterias);
  const allTemplates = useAppSelector(state => state.template.allTemplates);

  const searchParams = useAppSelector(state => state.search.searchParams);

  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const searchRequest = async () => {
    setLoading(true);
    dispatch(callsSlice.actions.zeroingSkip(null)); 
    dispatch(callsSlice.actions.setEmptyCalls({leaveBundles: 0}));
    const bastCallDataResponse = await dispatch(getBaseCallsData({}));
    // @ts-ignore
    const bastCallData = bastCallDataResponse.payload;

    history.push(`?searchHash=${bastCallData.search_filter_hash}`); 
    setLoading(false);
  };

  async function convertUrlHash() {
    if (searchParams) {
      let newSearchParams = searchParams;
      if (newSearchParams[0] === "?") {
        newSearchParams = newSearchParams.slice(1);
      }

      const searchParamsObj = queryString.parse(newSearchParams);
      const hash = searchParamsObj.searchHash;
      if (hash) {
        // @ts-ignore
        const searchHashRequestData = await dispatch(getSearchHash(hash));
        // @ts-ignore
        const searchHashRequestError = searchHashRequestData.error;
        // @ts-ignore
        const searchHashRequestPayload = searchHashRequestData.payload;
        if (searchHashRequestError) {
          console.log(searchHashRequestError);
        }
        // @ts-ignore
        if (searchHashRequestPayload) {
          console.log(searchHashRequestPayload);
        }
        debugger
      }
    }
  }

  useEffect(() => {
    convertUrlHash().then()
  }, [])

  function switchSearchItemCLassName(className: string) {
    const classSwitcher: { [id: string]: any } = {};
    classSwitcher['searchItemBlock_1'] = classes.searchItemBlock_1;
    classSwitcher['searchItemBlock_2'] = classes.searchItemBlock_2;
    classSwitcher['searchItemBlock_3'] = classes.searchItemBlock_3;
    classSwitcher['searchItemBlock_4'] = classes.searchItemBlock_4;
    classSwitcher['searchItemBlock_Wide'] = classes.searchItemBlock_Wide;
    classSwitcher['searchItemBlock_noWide'] = classes.searchItemBlock_noWide;
    return classSwitcher[className];
  }
 
  // template select
  const convertedTemplate = optionsCreator(allTemplates);


  const removeAllCriteriasHandler = () => {
    dispatch(templateSlice.actions.setCurrentTemplate(null));
    dispatch(searchSlice.actions.setClearDefaultCriteriasValues(null));
    dispatch(searchSlice.actions.removeAllActiveCriterias(null));
  };

  useEffect(() => {
    if (isAuth && activeCriterias.length < 1 && defaultCriterias.length < 1) {
      dispatch(getAllSearchCriterias());
      dispatch(getDefaultCriterias());
      dispatch(getAllTemplates());
    }
  }, [isAuth]);

  const handleCreateNewTemplateButtonClick = () => {
    setIsOpenRenameMethod('post');
    setIsOpenRenameWindow(true);
  };

  const currentTemplate = useAppSelector(state => state.template.currentTemplate);

  // modal windows states.
  const [isOpenRenameWindow, setIsOpenRenameWindow] = useState<boolean>(false);
  const [isOpenRenameMethod, setIsOpenRenameMethod] = useState<'put' | 'post' | null>(null);

  const [isOpenDeleteWindow, setIsOpenDeleteWindow] = useState<boolean>(false);

  const [op, setOp] = useState<any>([]);
  useEffect(() => {
    setOp(handleMoreSelectClick())
  }, [allCriterias, activeCriterias, defaultCriterias])

  const handleMoreSelectClick = () => {
    // let state = allCriterias;
    // if (state) {
    //   let local = []
    //   const defAcCriterias = [...activeCriterias, ...defaultCriterias]
    //   for (let i = 0; i < state.length; i++) {
    //     if (!defAcCriterias.find((item) => {
    //       if (state) {
    //         return item.key === state[i].key
    //       }
    //     })) {
    //       local.push({value: state[i], label: state[i].title})
    //     }
    //   }
    //   return local
    // }

    if (allCriterias) {
      interface keyable {
        [key: string]: any
      }

      let local: Array<keyable> = [];

      allCriterias.forEach((item, i) => {
        local.push({value: allCriterias[i], label: allCriterias[i].title});
      })

      for (let i = 0; i < local.length; i++) {
        if (activeCriterias.find((item) => item.key === local[i].value.key)) {
          local[i].icon = 'minus';
        } else {
          local[i].icon = 'plus';
        }
      }
      return local
    }
  }

  function onTemplateSelectValueChange(event: any) {
    dispatch(templateSlice.actions.setCurrentTemplate(event.value));
    dispatch(searchSlice.actions.setClearDefaultCriteriasValues(null))
    if (allCriterias) {
      let fullCriteriaLocal: CriteriasType[] = [];
      for (let i = 0; i < event.value.items.length; i++) {
        const obj = allCriterias.find((item) => {
          return item.key === event.value.items[i].key;
        });
        // @ts-ignore
        fullCriteriaLocal.push({...obj, values: event.value.items[i].values})
      }

      let activeCriteriasLocal = [];
      for (let i = 0; i < fullCriteriaLocal.length; i++) {
        const obj = defaultCriterias.find((item) => {
          return item.key === fullCriteriaLocal[i].key
        });
        if (obj) {
          dispatch(searchSlice.actions.setDefaultCriteriaValues({
            key: fullCriteriaLocal[i].key,
            values: fullCriteriaLocal[i].values
          }))
        } else {
          activeCriteriasLocal.push(fullCriteriaLocal[i]);
        }
      }
      dispatch(searchSlice.actions.setActiveCriterias(activeCriteriasLocal))
    }
  }

  function onAllCriteriasSelectValueChange(event: any) {
    let index = -1;
    for (let i in activeCriterias) {
      if (event.value.key === activeCriterias[i].key) {
        index = parseInt(i, 10);
        dispatch(templateSlice.actions.setCurrentTemplate(null));
        dispatch(searchSlice.actions.removeActiveCriteria(activeCriterias[index]));
        break
      }
    }
    if (index < 0) {
      dispatch(searchSlice.actions.setActiveCriterias([...activeCriterias, {...event.value, values: []}]));
      dispatch(templateSlice.actions.setCurrentTemplate(null));
    }
  }

  return (
    <div style={{margin: '24px 0'}}>
      <BlockBox padding="24px 24px 10px 24px" height="100%" minHeight="200px">
        <div className={classes.searchTitle}>
          <div className={classes.searchTitleLeft}>
            <Typography className={classes.searchTitleLeftText} variant="h5">
              {translate('searchTitle', language)}
            </Typography>
            <CriteriaTemplate
              handleValueChange={onTemplateSelectValueChange}
              options={convertedTemplate}
              currentTemplate={currentTemplate}
              allTemplates={allTemplates}
            />
            <div style={{marginTop: '3px', borderLeft: '1px solid #CDD5DF', paddingLeft: '16px'}}>
              {/*<TextSelect*/}
              {/*  name={'templatesSelect'}*/}
              {/*  value={currentTemplate ? {value: currentTemplate, label: currentTemplate.title} : null}*/}
              {/*  handleValueChange={onTemplateSelectValueChange}*/}
              {/*  options={convertedTemplate}*/}
              {/*  iconPosition={'right'}*/}
              {/*  customControl={*/}
              {/*    <div style={{*/}
              {/*      display: 'flex',*/}
              {/*      fontSize: '16px',*/}
              {/*      lineHeight: '24px',*/}
              {/*      color: '#2F3747',*/}
              {/*      marginRight: '5px'*/}
              {/*    }}>*/}
              {/*      {currentTemplate ?*/}
              {/*        <>*/}
              {/*          <Typography style={{color: '#722ED1'}}>{currentTemplate.title}</Typography>*/}
              {/*        </> :*/}
              {/*        <>*/}
              {/*          <Typography style={{*/}
              {/*            fontSize: '16px',*/}
              {/*            lineHeight: '24px',*/}
              {/*            marginRight: '3px',*/}
              {/*            color: '#2F3747'*/}
              {/*          }}>{translate('searchTemp', language)}</Typography>*/}
              {/*          <span style={{fontFamily: '"Inter", sans-serif'}}>*/}
              {/*            ({allTemplates.length})*/}
              {/*          </span>*/}
              {/*        </>*/}
              {/*      }*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*  ifArrowColor={currentTemplate ? '#722ED1' : '#000'}*/}
              {/*  menuPosition={'left'}*/}
              {/*/>*/}
            </div>
          </div>
          {(activeCriterias.length > 0 || defaultCriterias.some(item => item.values.length > 0)) &&
          <SaveCriterias
            currentTemplate={currentTemplate}
            handleSelectChange={(event: any) => {
              if (event.value === 'rename') {
                setIsOpenRenameMethod('put');
                setIsOpenRenameWindow(true);
              } else if (event.value === 'delete') {
                setIsOpenDeleteWindow(true);
              }
            }}
            removeAllCriteriasHandler={removeAllCriteriasHandler}
            handleCreateNewTemplateButtonClick={handleCreateNewTemplateButtonClick}
          />
          }
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', minHeight: '50px'}}> 
          <CriteriasList
            defaultCriterias={defaultCriterias}
            allCriterias={allCriterias}
            activeCriterias={activeCriterias}
          />
            <div style={{display: 'flex', alignItems: 'center', minHeight: '54px'}}>
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
              <div style={{margin: '0 5px 0 20px', whiteSpace: 'nowrap'}}>
                <TextSelect
                  name={'moreSelect'}
                  value={null}
                  handleValueChange={onAllCriteriasSelectValueChange}
                  options={op}
                  iconPosition={'left'}
                  customControl={
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <Typography style={{color: '#722ED1', fontWeight: '700', marginLeft: '5px'}}>{translate('searchMore', language)}</Typography>
                    </div>
                  }
                  ifArrowColor={'#722ED1'}
                  notClose={true}
                  menuPosition={'right'}
                  height={"400px"}
                />
              </div>
            </div> 
          {/*<div className={classes.searchItems}>*/}
          {/*  {defaultCriterias && allCriterias ? defaultCriterias.map(criteria => {*/}
          {/*    const criteriaKey = criteria.key.slice(4);*/}
          {/*    const compResult = allCriterias.filter(v => v.key === criteria.key);*/}
          {/*    return (*/}
          {/*      <div className={classes.searchItem}>*/}
          {/*        <Typography className={classes.searchText}>{compResult[0].title}</Typography>*/}
          {/*        <SearchSelect*/}
          {/*          criteriaFull={compResult[0]}*/}
          {/*          criteriaCurrent={criteria}*/}
          {/*          isDefaultCriteria={true}*/}
          {/*        />*/}
          {/*      </div>*/}
          {/*    )*/}
          {/*  }) : null}*/}
          {/*  {activeCriterias && allCriterias ? activeCriterias.map(criteria => {*/}
          {/*    const compResult = allCriterias.filter(v => v.key === criteria.key);*/}
          {/*    // @ts-ignore*/}
          {/*    const criteriaWide = criteria.wide ? 'searchItemBlock_Wide' : 'searchItemBlock_noWide';*/}
          {/*    // @ts-ignore*/}
          {/*    const criteriaBlock = `searchItemBlock_${criteria.block}`;*/}
          {/*    return (*/}
          {/*      // <div className={switchSearchItemCLassName(criteriaBlock)}>*/}
          {/*      <div className={switchSearchItemCLassName(criteriaWide)}>*/}
          {/*        <div className={classes.searchItem}>*/}
          {/*          <Typography className={classes.searchText}>{criteria.title}</Typography>*/}
          {/*          <SearchSelect*/}
          {/*            criteriaFull={compResult[0]}*/}
          {/*            criteriaCurrent={criteria}*/}
          {/*            isDefaultCriteria={false}*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*        /!* </div> *!/*/}
          {/*      </div>*/}
          {/*    )*/}
          {/*  }) : null}*/}
          {/*</div>*/}
        {/*  <div style={{display: 'flex', alignItems: 'center', minHeight: '54px'}}>*/}
        {/*    <LoadingButton*/}
        {/*      className={classes.searchSearchButton}*/}
        {/*      startIcon={<SearchIcon/>}*/}
        {/*      color="primary"*/}
        {/*      variant="contained"*/}
        {/*      loading={loading}*/}
        {/*      loadingPosition="start"*/}
        {/*      onClick={searchRequest}*/}
        {/*    >*/}
        {/*      {translate('searchButton', language)}*/}
        {/*    </LoadingButton>*/}
        {/*    <div style={{margin: '0 5px 0 20px', whiteSpace: 'nowrap'}}>*/}
        {/*      <TextSelect*/}
        {/*        name={'moreSelect'}*/}
        {/*        value={null}*/}
        {/*        handleValueChange={onAllCriteriasSelectValueChange}*/}
        {/*        options={op}*/}
        {/*        iconPosition={'left'}*/}
        {/*        customControl={*/}
        {/*          <div style={{display: 'flex', alignItems: 'center'}}>*/}
        {/*            <Typography style={{*/}
        {/*              color: '#722ED1',*/}
        {/*              fontWeight: '700',*/}
        {/*              marginLeft: '5px'*/}
        {/*            }}>{translate('searchMore', language)}</Typography>*/}
        {/*            /!* {activeCriterias.length > 0 &&*/}
        {/*                <span style={{marginLeft: '3px', color: '#722ED1', fontWeight: '700'}}>*/}
        {/*                  ({activeCriterias.length})*/}
        {/*                </span>*/}
        {/*                } *!/*/}
        {/*          </div>*/}
        {/*        }*/}
        {/*        ifArrowColor={'#722ED1'}*/}
        {/*        notClose={true}*/}
        {/*        menuPosition={'right'}*/}
        {/*        height={"400px"}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        </div>
      </BlockBox>

      {/*Modal windows*/}
      <CreateNameTemplateModalWindow
        currentTemplate={currentTemplate}
        isOpen={isOpenRenameWindow}
        handleClose={() => {
          setIsOpenRenameWindow(false)
        }}
        method={isOpenRenameMethod}
      />
      <DeleteTemplateModalWindow
        currentTemplate={currentTemplate}
        isOpen={isOpenDeleteWindow}
        handleClose={() => {
          setIsOpenDeleteWindow(false)
        }}
      />
    </div>
  );
});

export default Search;
