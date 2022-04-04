import React, {FC, memo, useDebugValue, useEffect, useRef, useState} from 'react';
import {CircularProgress, IconButton, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {BlockBox, Header, Input} from "../../components";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Plus from "../Calls/Body/Buttons/Plus";
import {dictsSlice, getDicts, getGroups} from "../../store/dicts/dicts.slice";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../hooks/redux";
import Groups from "./components/Groups";
import Items from "./components/Items";
import {useFormik} from "formik";
import DictDetails from "./pages/Dicts/Detail";
import ModalWindow from "../../components/ModalWindowBox";
import {useHistory} from "react-router-dom";
import {MarkupRulesPagesType} from "../../store/dicts/dicts.types";
import {useStyles} from "../../App";
import Tags from "./pages/Tags/Detail";
import Checklists from "./pages/Checklists/Detail";

// CUSTOM COMMON COMPONENTS
const SearchInput: FC<{handleMWOpen: () => void}> = ({handleMWOpen}) => {
  const currentGroup = useAppSelector(state => state.dicts.currentGroup);

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      search: ''
    },
    onSubmit: async (values) => {
      if (currentGroup) {
        dispatch(dictsSlice.actions.setCurrentDict(null));
        dispatch(dictsSlice.actions.setLoading({type: 'items', value: true}));
        dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: true}));
        await dispatch(getDicts({group: currentGroup.group, filter: values.search}));
        dispatch(dictsSlice.actions.setLoading({type: 'items', value: false}));
        dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: false}));
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
      width: '100%'
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

  return (
    <div className={classes.searchInputBox}>
      <form onSubmit={formik.handleSubmit} style={{width: '100%'}}>
        <div className={classes.searchInputInputBox}>
          <Input
            handleChange={formik.handleChange}
            value={formik.values.search}
            name={'search'}
            type={'text'}
            height={'30px'}
            bcColor={'#F8FAFC'}
            border={'1px solid #E3E8EF'}
            label={"Поиск"}
          />
          <div className={classes.searchInputSvgBox}>
            <IconButton type={"submit"}>
              <SearchSvg/>
            </IconButton>
          </div>
        </div>
      </form>
      <Plus margin={'0 0 0 16px'} handleClick={() => handleMWOpen()}/>
    </div>
  );
};

// SVG BLOCK
const SearchSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M9.59029 10.2973C7.82342 11.7125 5.23712 11.6011 3.59927 9.9632C1.84191 8.20587 1.84191 5.35663 3.59927 3.59927C5.35663 1.84191 8.20589 1.84191 9.96322 3.59927C11.6011 5.23712 11.7125 7.8234 10.2974 9.59027L13.7344 13.0273C13.9297 13.2226 13.9297 13.5392 13.7344 13.7345C13.5392 13.9297 13.2226 13.9297 13.0274 13.7345L9.59029 10.2973ZM4.30638 9.25614C2.93954 7.88927 2.93954 5.67321 4.30638 4.30638C5.67321 2.93954 7.88929 2.93954 9.25616 4.30638C10.622 5.67221 10.623 7.886 9.25916 9.25314C9.25809 9.25414 9.25709 9.25507 9.25609 9.25614C9.25509 9.25714 9.25409 9.25814 9.25309 9.25914C7.88602 10.6229 5.67221 10.6219 4.30638 9.25614Z"
            fill="#738094"/>
    </svg>
  );
};

export const InfoCircleActive = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M3.25 12C3.25 7.16751 7.16751 3.25 12 3.25C16.8325 3.25 20.75 7.16751 20.75 12C20.75 16.8325 16.8325 20.75 12 20.75C7.16751 20.75 3.25 16.8325 3.25 12ZM13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8ZM12 10.75C12.4142 10.75 12.75 11.0858 12.75 11.5V16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5V11.5C11.25 11.0858 11.5858 10.75 12 10.75Z"
            fill="#9254DE"/>
    </svg>
  );
};

export const Preloader = () => {
  return (
    <div style={{marginTop: '250px', textAlign: 'center'}}>
      <CircularProgress size={58}/>
    </div>
  );
}

const MarkupRules = memo(() => {
  // STYLES BLOCK
  const useMarkupRulesStyles = makeStyles(({
    mrContainer: {
      width: '100%',
      height: '810px',
      margin: '40px 10px',
      display: 'flex',
    },

    // left block
    mrTypeHandlerBlock: {
      width: '58%',
      marginRight: '2%',
      display: 'flex',
    },
    mrTypeHandlerGroups: {
      width: '50%',
      backgroundColor: '#fff',
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px"
    },
    mrTypeHandlerGroupsItem: {
      padding: '24px',
      marginTop: '24px',
      border: '2px solid #9254DE',
      boxShadow: '0px 0px 4px rgba(98, 98, 98, 0.22)',
      borderRadius: '10px',
    },

    mrTypeHandlerItems: {
      paddingTop: '26px',
      overflow: 'hidden',
      width: '50%',
      backgroundColor: '#F8FAFC',
      borderTopRightRadius: "10px",
      borderBottomRightRadius: "10px",
    },
    mrGeneralBlock: {
      marginTop: '24px',
      height: '700px',
      overflow: 'hidden',
      overflowY: 'auto',
      borderRadius: '5px',

      '&::-webkit-scrollbar': {
        paddingTop: '4px',
        width: '4px',
        outline: 'none',
        background: '#CDD5DF'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#A3AEBE',
        height: '50px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#9298A1'
      }
    },
    controlBlockButtonBox: {
      margin: '24px 24px 0 24px',
      boxShadow: 'none !important',
    },
    controlBlockButton: {
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
    },

    // right block
    mrTypeBodyBlock: {
      width: '40%',
    },
  }));
  const classes = useMarkupRulesStyles();
  const appClasses = useStyles();

  // LOGIC BLOCK
  const dispatch = useDispatch();
  const history = useHistory();
  const activePage = useAppSelector(state => state.dicts.activePage);

  // логика перехода между локальными страницами.
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    page: MarkupRulesPagesType,
  ) => {
    dispatch(dictsSlice.actions.setActivePage(page));
  };
  useEffect(() => {
    if (path) {
      // @ts-ignore
      dispatch(dictsSlice.actions.setActivePage(path));
    }
  });
  const path = history.location.pathname.split('/')[2];

  // логика открытия модально окна
  // MW - Modal Window
  const [addDictMWIsOpen, setAddDictMWIsOpen] = useState<boolean>(false);
  const handleMWOpen = () => {
    setAddDictMWIsOpen(true);
  };
  const handleMWClose = () => {
    setAddDictMWIsOpen(false);
  };


  //  запрос за данными (ВЫНЕСТИ В ОТДЕЛЬНЫЙ КОМПОНЕНТ).
  const currentDict = useAppSelector(state => state.dicts.currentDict);
  useEffect(() => {
    if (!currentDict) {
      dispatch(getGroups());
    }
  }, []);


  return (
    <div>
      {(path === 'dictionaries' || path === 'tags' || path === 'checklists') ?
      <div>
        <Header/>
        <div className={appClasses.container}>
          <div className={classes.mrContainer}>
            <ModalWindow isOpen={addDictMWIsOpen} handleClose={() => handleMWClose()}>
              <Input name={'dict'} type={'text'} bcColor={'#F8FAFC'} label={'Добавить словарь'}/>
            </ModalWindow>
            <div className={classes.mrTypeHandlerBlock}>
              <div className={classes.mrTypeHandlerGroups}>

                {/* Роутинг */}
                <ToggleButtonGroup
                  className={classes.controlBlockButtonBox}
                  value={activePage}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton
                    disabled={"dictionaries" === activePage}
                    className={classes.controlBlockButton} value="dictionaries"
                    onClick={() => {
                      history.location.pathname = '/'

                      history.replace('markuprules/dictionaries/1')
                    }}
                  >
                    Словари
                  </ToggleButton>

                  <ToggleButton disabled={"tags" === activePage}
                                className={classes.controlBlockButton} value="tags"
                                onClick={() => {
                                  history.location.pathname = '/'
                                  history.replace('markuprules/tags/1')
                                }}
                  >
                    Теги
                  </ToggleButton>

                  <ToggleButton
                    className={classes.controlBlockButton} disabled={"checklists" === activePage} value="checklists"
                    onClick={() => {
                      history.location.pathname = '/'
                      history.replace('markuprules/checklists/1')
                    }}
                  >
                    Чек-листы
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* GROUPS */}
                <div className={classes.mrGeneralBlock}>
                  <Groups/>
                </div>
              </div>

              {/* ITEMS */}
              <div className={classes.mrTypeHandlerItems}>
                <SearchInput handleMWOpen={handleMWOpen}/>
                <div className={classes.mrGeneralBlock}>
                  <Items/>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className={classes.mrTypeBodyBlock}>
              <BlockBox padding={'5px 24px 0 24px'}>

                {/* Dicts */}
                {activePage === 'dictionaries' && <DictDetails />}

                {/* Tags */}
                {activePage === 'tags' && <Tags/>}

                {/* Checklists */}
                {activePage === 'checklists' && <Checklists/>}
              </BlockBox>
            </div>
          </div>
        </div>
      </div> : <div style={{fontWeight: '700', marginTop: '400px', textAlign: 'center', fontSize: '45px', fontFamily: 'sans-serif'}}>404</div>
      }
    </div>
  );
});

export default MarkupRules;
