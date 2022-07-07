import React, { FC, memo, useEffect } from 'react';
import { CircularProgress, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Header, Input } from "../../components/common";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Plus from "../../components/common/Buttons/Plus";
import { dictsSlice, getDict, getDicts } from "../../store/dicts/dicts.slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { MarkupRulesPagesType } from "../../store/dicts/dicts.types";
import { useStyles } from "../../App";
import DictsPage from "./Dicts/Dicts";
import TagPage, { searchStringParserInObj } from "./Tags/TagPage";
import ChecklistsPage from "./Checklists/Checklists";
import { RootState } from "../../store/store";
import { translate } from '../../localizations';
import { tagsSlice } from "../../store/tags/tags.slice";
import { langSlice } from "../../store/lang/lang.slice";

// CUSTOM COMMON COMPONENTS
type SearchInputType = {
  onSubmit: (values: any) => void,
  handleMWOpen: () => void
};

export const SearchInput: FC<SearchInputType> = ({ onSubmit, handleMWOpen }) => {
  // привет, предупреждаю после просмотра этого куска кода может пойти кровь из глаз.
  // как-нибудь порефакторю.

  const searchTagsParams = useAppSelector(state => state.tags.searchParams);
  const searchDictsParams = useAppSelector(state => state.dicts.search);
  const search = useAppSelector(state => state.tags.searchInput);

  const { path } = JSON.parse(localStorage.getItem('path') || '{}');
  const pathArray = path.split("/");
  const isDtOrTg = pathArray[4];


  const dispatch = useDispatch();
  const history = useHistory();

  const searchInHistory = searchStringParserInObj(history.location.search).search;


  useEffect(() => {
    if (searchInHistory) {
      if (isDtOrTg === "dictionaries") {
        const searchObj = searchStringParserInObj(history.location.search);
        if (searchObj.search) {
          dispatch(dictsSlice.actions.setSearch(`?group=${searchObj.group}&id=${searchObj.id}&search=${searchObj.search}`));
          dispatch(tagsSlice.actions.setSearchInput(searchObj.search));
          debugger
        } else if (searchStringParserInObj(searchDictsParams).search) {
          debugger
          dispatch(dictsSlice.actions.setSearch(`?group=${searchObj.group}&id=${searchObj.id}`));
          dispatch(tagsSlice.actions.setSearchInput(""));
          onSubmit({ search: "" });
        }
      } else if (isDtOrTg === "tags") {
        const searchObj = searchStringParserInObj(history.location.search);
        if (searchObj.search) {
          dispatch(tagsSlice.actions.setSearchParams(`?group=${searchObj.group}&id=${searchObj.id}&search=${searchObj.search}`));
          dispatch(tagsSlice.actions.setSearchInput(searchObj.search));
          // onSubmit({search: searchObj.search});
        } else {
          dispatch(tagsSlice.actions.setSearchParams(`?group=${searchObj.group}&id=${searchObj.id}`));
          dispatch(tagsSlice.actions.setSearchInput(""));
          onSubmit({ search: "" });
        }
      }
    }

  }, [searchInHistory]);

  const userIdData = useAppSelector(state => state.users.currentUser?.id);
  const userId = userIdData ? userIdData : "_";

  const formik = useFormik({
    initialValues: {
      search: ''
    },
    onSubmit: async (values) => {
      onSubmit({ search: search })
      if (search) {
        if (isDtOrTg === "dictionaries") {
          const searchObj = searchStringParserInObj(history.location.search);
          if (searchObj.search) {
            dispatch(dictsSlice.actions.setSearch(`?group=${searchObj.group}&id=${searchObj.id}&search=${search}`));
            history.location.pathname = '/';
            history.replace(`${language}/${userId}/markuprules/dictionaries?group=${searchObj.group}&id=${searchObj.id}&search=${search}`)
          } else {
            let newSearchDictsParams = searchDictsParams;
            if (newSearchDictsParams[0] != "?") {
              newSearchDictsParams = `?${newSearchDictsParams}`
            }
            dispatch(dictsSlice.actions.setSearch(`${newSearchDictsParams}&search=${search}`));
            history.location.pathname = '/';
            history.replace(`${language}/${userId}/markuprules/dictionaries${newSearchDictsParams}&search=${search}`);
          }
        } else if (isDtOrTg === "tags") {
          const searchObj = searchStringParserInObj(history.location.search);
          if (searchObj.search) {
            dispatch(tagsSlice.actions.setSearchParams(`?group=${searchObj.group}&id=${searchObj.id}&search=${search}`));
            history.location.pathname = '/';
            history.replace(`${language}/${userId}/markuprules/tags?group=${searchObj.group}&id=${searchObj.id}&search=${search}`)
          } else {
            let newSearchTagsParams = searchTagsParams;
            if (newSearchTagsParams[0] != "?") {
              newSearchTagsParams = `?${newSearchTagsParams}`
            }
            dispatch(tagsSlice.actions.setSearchParams(`${newSearchTagsParams}&search=${search}`));
            history.location.pathname = '/';
            history.replace(`${language}/${userId}/markuprules/tags${newSearchTagsParams}&search=${search}`)
          }
        }

      } else {

        if (isDtOrTg === "dictionaries") {
          const searchObj = searchStringParserInObj(history.location.search);
          dispatch(tagsSlice.actions.setSearchParams(`?group=${searchObj.group}&id=${searchObj.id}`));
          history.location.pathname = '/';
          history.replace(`${language}/${userId}/markuprules/dictionaries?group=${searchObj.group}&id=${searchObj.id}`)
        } else if (isDtOrTg === "tags") {
          const searchObj = searchStringParserInObj(history.location.search);
          dispatch(tagsSlice.actions.setSearchParams(`?group=${searchObj.group}&id=${searchObj.id}`));
          history.location.pathname = '/';
          history.replace(`${language}/${userId}/markuprules/tags?group=${searchObj.group}&id=${searchObj.id}`);
        }
      }
    },
  });
  const useStyles = makeStyles(({
    searchInputBox: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 24px',
    },
    searchInputInputBox: {
      position: 'relative',
      width: '100%',
    },
    searchInputSvgBox: {
      textAlign: 'center',
      paddingTop: '9px',
      position: 'absolute',
      top: '-7.5px',
      right: '-1px',
      width: '32px',
      height: 'calc(100% - 9px)'
    }
  }));
  const classes = useStyles();
  const { language } = useAppSelector((state: RootState) => state.lang);

  return (
    <div className={classes.searchInputBox}>
      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <div className={classes.searchInputInputBox}>
          <Input
            handleChange={(e) => {
              dispatch(tagsSlice.actions.setSearchInput(e.target.value));
            }}
            value={search}
            name={'search'}
            type={'text'}
            height={'35px'}
            bcColor={'#F8FAFC'}
            border={'1px solid #E3E8EF'}
            label={translate('searchInputText_dicts', language)}
          />
          <div className={classes.searchInputSvgBox}>
            <IconButton type={"submit"}>
              <SearchSvg />
            </IconButton>
          </div>
        </div>
      </form>
      <Plus margin={'0 0 0 16px'} handleClick={handleMWOpen} />
    </div>
  );
};

export const MarkupRulesButtons = () => {
  const useStyles = makeStyles(({
    buttonsBox: {
      margin: '24px 24px 0 24px',
      boxShadow: 'none !important',
    },
    button: {
      border: 'none !important',
      transition: '0.4s !important',
      outline: 'none !important',
      height: '40px',
      fontSize: '14px !important',
      // @ts-ignore
      textTransform: 'none !important',
      color: '#738094 !important',
      backgroundColor: '#EEF2F6 !important',
      '&.Mui-selected, &:active': {
        backgroundColor: '#D6D9DF !important',
        color: '#000 !important'
      },
      '&.Mui-disabled': {
        cursor: 'pointer'
      }
    }
  }));
  const dispatch = useDispatch();
  const classes = useStyles();

  const history = useHistory();
  const { language } = useAppSelector((state: RootState) => state.lang);


  // LOGIC BLOCK
  const activePage = useAppSelector(state => state.dicts.activePage);
  // логика перехода между локальными страницами.
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    page: MarkupRulesPagesType,
  ) => {
    dispatch(dictsSlice.actions.setActivePage(page));
  };

  useEffect(() => {
    dispatch(langSlice.actions.setLoading(false));
  }, []);

  const userIdData = useAppSelector(state => state.users.currentUser?.id);
  const userId = userIdData ? userIdData : "_";

  return (
    <ToggleButtonGroup
      className={classes.buttonsBox}
      value={activePage}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton
        disabled={"dictionaries" === activePage}
        className={classes.button} value="dictionaries"
        onClick={() => {
          dispatch(langSlice.actions.setLoading(true));
          dispatch(tagsSlice.actions.setSearchInput(""));
          history.location.search = "";
          history.location.pathname = '/'
          history.replace(`${language}/${userId}/markuprules/dictionaries`)
        }}
      >
        {translate('buttonDictsName_dicts', language)}
      </ToggleButton>

      <ToggleButton
        className={classes.button} value="tags"
        onClick={() => {
          dispatch(langSlice.actions.setLoading(true));
          dispatch(tagsSlice.actions.setSearchInput(""));
          history.location.search = "";
          history.location.pathname = '/'
          history.replace(`${language}/${userId}/markuprules/tags`)
        }}
      >
        {translate('buttonTagsName_dicts', language)}
      </ToggleButton>

      {/*<ToggleButton*/}
      {/*  className={classes.button} disabled={"checklists" === activePage} value="checklists"*/}
      {/*  onClick={() => {*/}
      {/*    history.location.pathname = '/'*/}
      {/*    history.replace('markuprules/checklists')*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {translate('buttonChecklistsName_dicts', language)}*/}
      {/*</ToggleButton>*/}
    </ToggleButtonGroup>
  );
};

// SVG BLOCK
export const SearchSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M9.59029 10.2973C7.82342 11.7125 5.23712 11.6011 3.59927 9.9632C1.84191 8.20587 1.84191 5.35663 3.59927 3.59927C5.35663 1.84191 8.20589 1.84191 9.96322 3.59927C11.6011 5.23712 11.7125 7.8234 10.2974 9.59027L13.7344 13.0273C13.9297 13.2226 13.9297 13.5392 13.7344 13.7345C13.5392 13.9297 13.2226 13.9297 13.0274 13.7345L9.59029 10.2973ZM4.30638 9.25614C2.93954 7.88927 2.93954 5.67321 4.30638 4.30638C5.67321 2.93954 7.88929 2.93954 9.25616 4.30638C10.622 5.67221 10.623 7.886 9.25916 9.25314C9.25809 9.25414 9.25709 9.25507 9.25609 9.25614C9.25509 9.25714 9.25409 9.25814 9.25309 9.25914C7.88602 10.6229 5.67221 10.6219 4.30638 9.25614Z"
        fill="#738094" />
    </svg>
  );
};
export const InfoCircleActive = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M3.25 12C3.25 7.16751 7.16751 3.25 12 3.25C16.8325 3.25 20.75 7.16751 20.75 12C20.75 16.8325 16.8325 20.75 12 20.75C7.16751 20.75 3.25 16.8325 3.25 12ZM13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8ZM12 10.75C12.4142 10.75 12.75 11.0858 12.75 11.5V16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5V11.5C11.25 11.0858 11.5858 10.75 12 10.75Z"
        fill="#9254DE" />
    </svg>
  );
};
export const InfoCircle = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.916 2.66602C6.80787 2.66602 2.66602 6.80787 2.66602 11.916C2.66602 17.0242 6.80787 21.166 11.916 21.166C17.0242 21.166 21.166 17.0242 21.166 11.916C21.166 6.80787 17.0242 2.66602 11.916 2.66602ZM11.916 19.5968C7.67506 19.5968 4.23521 16.157 4.23521 11.916C4.23521 7.67506 7.67506 4.23521 11.916 4.23521C16.157 4.23521 19.5968 7.67506 19.5968 11.916C19.5968 16.157 16.157 19.5968 11.916 19.5968Z"
        fill="#738094" />
      <path
        d="M10.666 7.85649C10.666 8.17223 10.7914 8.47503 11.0147 8.69829C11.238 8.92154 11.5408 9.04697 11.8565 9.04697C12.1722 9.04697 12.475 8.92154 12.6983 8.69829C12.9215 8.47503 13.047 8.17223 13.047 7.85649C13.047 7.54076 12.9215 7.23796 12.6983 7.0147C12.475 6.79144 12.1722 6.66602 11.8565 6.66602C11.5408 6.66602 11.238 6.79144 11.0147 7.0147C10.7914 7.23796 10.666 7.54076 10.666 7.85649ZM12.6501 11.4279C12.6501 10.9896 12.2948 10.6343 11.8565 10.6343C11.4182 10.6343 11.0628 10.9896 11.0628 11.4279C11.0628 11.7747 11.0628 12.1148 11.0628 12.166V16.1921C11.0628 16.2446 11.0628 16.6143 11.0628 16.9835C11.0628 17.4218 11.4182 17.7771 11.8565 17.7771C12.2948 17.7771 12.6501 17.4218 12.6501 16.9835C12.6501 16.6143 12.6501 16.2446 12.6501 16.1921V12.166C12.6501 12.1148 12.6501 11.7747 12.6501 11.4279Z"
        fill="#738094" />
    </svg>
  );
};

const MarkupRules = memo(() => {
  const history = useHistory();
  const path = history.location.pathname.split('/');
  const pathActivePage = path[4];
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Правила разметки | IMOT.io";
    if (pathActivePage) {
      dispatch(dictsSlice.actions.setActivePage(pathActivePage));
    } else {
      dispatch(dictsSlice.actions.setActivePage('dictionaries'));
    }
  }, []);

  const appClasses = useStyles();
  // для перерисовки
  const activePage = useAppSelector(state => state.dicts.activePage);
  return (
    <div>
      {(activePage === 'dictionaries' || activePage === 'tags' || activePage === 'checklists')
        ?
        <div>
          <div className={appClasses.container}>
            {activePage === 'dictionaries' && <DictsPage />}
            {activePage === 'tags' && <TagPage />}
            {activePage === 'checklists' && <ChecklistsPage />}
          </div>
        </div>
        :
        <div>
          <div style={{
            fontWeight: '700',
            marginTop: '400px',
            textAlign: 'center',
            fontSize: '45px',
            fontFamily: 'sans-serif'
          }}>
            404
          </div>
        </div>

      }
    </div>
  );
});

export default MarkupRules;
