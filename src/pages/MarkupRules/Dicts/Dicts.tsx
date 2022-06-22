import React, {useEffect, useState} from 'react';
import ModalWindow from "../../../components/common/ModalWindowBox";
import Groups from "../../../components/MarkupRules/Groups/Groups";
import Items from "../../../components/MarkupRules/Items/Items";
import DictDetails from "./DictsDetail";
import {MarkupRulesButtons, SearchInput} from "../MarkupRules";
import {makeStyles} from "@mui/styles";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../hooks/redux";
import {dictsSlice, getDict, getDicts, getGroups, postDict} from "../../../store/dicts/dicts.slice";
import {DictType, GroupType} from "../../../store/dicts/dicts.types";
import {LoadingButton} from "@mui/lab";
import Snackbar from "../../../components/common/Snackbar";
import {useFormik} from "formik";
import {useHistory} from "react-router-dom";
import {Input} from "../../../components/common";
import {RootState} from "../../../store/store";
import {translate} from "../../../localizations";
import queryString from 'query-string';

export function createQueryString(queryObj: any) {
  let str = '';
  for (let key in queryObj) {
    str += `&${key}=${queryObj[key]}`;
  }
  if (str.length > 1) {
    const output = str.slice(1);
    return `?${output}`
  }
  return "";
}

const DictsPage = () => {
  // STYLES BLOCK
  const useDictsStyles = makeStyles(({
    // dp - dicts page
    dpContainer: {
      width: '100%',
      height: '810px',
      margin: '40px 10px 60px 10px',
      display: 'flex'
    },

    // left block
    dpLeftBlock: {
      width: '58%',
      marginRight: '2%',
      display: 'flex',
    },
    dpLeftBlockGroups: {
      width: '50%',
      backgroundColor: '#fff',
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px"
    },

    dpLeftBlockDicts: {
      paddingTop: '26px',
      overflow: 'hidden',
      width: '50%',
      backgroundColor: '#F8FAFC',
      borderTopRightRadius: "10px",
      borderBottomRightRadius: "10px",
    },

    dpBothBox: {
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

    // right block
    dpRightBlock: {
      width: '40%',
    },

    MWTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px'
    },
    MWTitleText: {
      fontWeight: '700 !important'
    },
    MWButtons: {
      marginTop: '15px',
      textAlign: 'right'
    },
    MWInput: {
      width: '100%',
      height: '20px',
      '&:input': {
        padding: '0'
      }
    }
  }));

  // LOGIC BLOCK
  const classes = useDictsStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const dicts = useAppSelector(state => state.dicts.dicts);
  const currentGroup = useAppSelector(state => state.dicts.currentGroup);
  const currentDict = useAppSelector(state => state.dicts.currentDict);
  const search = useAppSelector(state => state.dicts.search);

  useEffect(() => {
    return history.listen((location) => {
      debugger
      const currentSearch = createQueryString(queryString.parse(location.search));
      let oldSearchConverted = search;
      if (oldSearchConverted[0] !== '?') {
        oldSearchConverted = `?${search}`
      }
      if (currentSearch !== oldSearchConverted) {
        queryByParameters(location.search);
      }
    });
  }, [search]);


  function searchStringParserInObj(initialString: string) {
    const searchString = initialString.slice(1);
    const searchStringArray = searchString.split("&");

    let output: any = {};
    for (let i = 0; i < searchStringArray.length; i++) {
      const query = queryString.parse(searchStringArray[i]);
      output = {...output, ...query}
    }
    return output;
  }

  async function queryByParameters(search: string) {
    const groupsData = await dispatch(getGroups());
    // @ts-ignore
    const groups: GroupType[] = groupsData.payload;

    const searchParams = searchStringParserInObj(search);

    // @ts-ignore
    const currentGroupLocal = groups.find(item => {
      if (item) {
        return item.group === searchParams.group
      }
    });
    if (currentGroupLocal && currentGroup && currentGroupLocal.group !== currentGroup.group) {
      dispatch(dictsSlice.actions.setEmptyDicts(null));
    }
    dispatch(dictsSlice.actions.setCurrentDict(null));

    if (currentGroupLocal) {
      dispatch(dictsSlice.actions.setCurrentGroup(currentGroupLocal));
      await dispatch(getDicts({group: currentGroupLocal.group}));
    }
    if (searchParams.id) {
      await dispatch(getDict(searchParams.id));
    }
  }

  // первый рендиринг
  const getStartDictsData = async () => {
    const groupsData = await dispatch(getGroups());
    // @ts-ignore
    const groups: GroupType[] = groupsData.payload;


    if (search.length < 2) {
      dispatch(dictsSlice.actions.setCurrentGroup(groups[0]));
      const dictsData = await dispatch(getDicts({group: groups[0].group}));
      // @ts-ignore
      const dicts: DictType[] = dictsData.payload;
      dispatch(dictsSlice.actions.setSearch(`?group=${groups[0].group}&id=${dicts[0].id}`));
      history.location.pathname = '/';
      history.replace(`markuprules/dictionaries?group=${groups[0].group}&id=${dicts[0].id}`)
      await dispatch(getDict(dicts[0].id));
    } else {
      queryByParameters(search);

      history.location.pathname = '/';
      let newSearch = search;
      if (search[0] !== '?') {
        newSearch = `?${search}`;
      }
      history.replace(`markuprules/dictionaries${newSearch}`);
    }
  };
  useEffect(() => {
    getStartDictsData().then();
  }, []);


  const dictHandleAddSubmit = async (e: any) => {
    if (currentGroup) {
      setAddButtonLoading(true);
      // @ts-ignore
      const newDictIdData = await dispatch(postDict({
        title: e.dictName,
        owner: null,
        sttAutoReplace: null,
        enabled: true,
        group: e.groupName,
        usedRules: [],
        allowedUsers: [],
        phrases: []
      }))
      // @ts-ignore
      const newDictId = newDictIdData.payload;
      const groupsData = await dispatch(getGroups());
      // @ts-ignore
      const group = groupsData.payload.filter((item) => item.group === e.groupName)[0];
      dispatch(dictsSlice.actions.setCurrentGroup(group))
      await dispatch(getDicts({group: e.groupName}));
      await dispatch(getDict(newDictId));
      setSuccessSnackbarOpen(true);
      setAddButtonLoading(false);
      setAddDictMWIsOpen(false);
      formik.values.dictName = '';
      formik.values.groupName = '';
    }
  };
  const formik = useFormik({
    initialValues: {
      dictName: '',
      groupName: ''
    },
    onSubmit(e) {
      dictHandleAddSubmit(e).then()
    }
  });


  // modal window(MW) открытие/закрытие.
  const [addDictMWIsOpen, setAddDictMWIsOpen] = useState<boolean>(false);
  const handleMWOpen = () => {
    setAddDictMWIsOpen(true);
  };
  const handleMWClose = () => {
    setAddDictMWIsOpen(false);
  };
  const [addButtonLoading, setAddButtonLoading] = useState<boolean>(false);

  const [isErrorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);
  const [isSuccessSnackbarOpen, setSuccessSnackbarOpen] = useState<boolean>(false);

  const {language} = useAppSelector((state: RootState) => state.lang);


  return (
    <div className={classes.dpContainer}>
      <div className={classes.dpLeftBlock}>
        <div className={classes.dpLeftBlockGroups}>
          {/* local url handler */}
          <MarkupRulesButtons/>

          {currentGroup &&
          <Snackbar
            type={'success'}
            open={isSuccessSnackbarOpen}
            onClose={() => {
              setSuccessSnackbarOpen(false)
            }}
            text={`Словарь добавлен`}
            time={2000}
          />}

          {/* groups */}
          <div className={classes.dpBothBox}>
            <Groups/>
          </div>
        </div>

        {/* dicts */}
        <div className={classes.dpLeftBlockDicts}>
          <SearchInput
            onSubmit={async (values: any) => {
              const searchObj = searchStringParserInObj(history.location.search);
              debugger
              dispatch(dictsSlice.actions.setEmptyDicts(null));
              dispatch(dictsSlice.actions.setCurrentDict(null));
              const dictsData = await dispatch(getDicts({group: searchObj.group, filter: values.search}));
              // @ts-ignore
              const dicts: DictType[] = dictsData.payload;
              if (dicts.length < 1) {
                await dispatch(dictsSlice.actions.setCurrentDict(false));
              } else {
                await dispatch(getDict(dicts[0].id));
              }
            }}
            handleMWOpen={handleMWOpen}/>
          <Snackbar
            type={'error'}
            open={isErrorSnackbarOpen}
            onClose={() => {
              setErrorSnackbarOpen(false)
            }}
            text={'В эту группу нельзя добавить словарь'}
            time={2000}
          />

          <div className={classes.dpBothBox}>
            <Items
              items={dicts}
              currentItem={currentDict}
            />
          </div>
        </div>
      </div>

      {/* detail */}
      <div className={classes.dpRightBlock}>
        <DictDetails/>
      </div>

      {/* modal window */}
      <ModalWindow
        isMWOpen={addDictMWIsOpen}
        handleMWClose={handleMWClose}
        width={'400px'}
        text={"Введите имя словаря и группы"}
      >

        <form onSubmit={formik.handleSubmit}>
          <Input
            height={'36px'}
            value={formik.values.dictName}
            handleChange={formik.handleChange}
            name={'dictName'}
            type={'text'}
            bcColor={'#F8FAFC'}
            label={'Словарь'}
          />
          <div style={{marginTop: '20px'}}>
            <Input
              height={'36px'}
              value={formik.values.groupName}
              handleChange={formik.handleChange}
              name={'groupName'}
              type={'text'}
              bcColor={'#F8FAFC'}
              label={'Группа'}
            />
          </div>

          <div className={classes.MWButtons}>
            <LoadingButton
              loading={addButtonLoading}
              style={{marginRight: '15px'}}
              variant="contained"
              color="primary"
              type="submit"
            >
              {translate("sendButton", language)}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="secondary"
              onClick={handleMWClose}
            >
              {translate("cancelButton", language)}
            </LoadingButton>
          </div>
        </form>
      </ModalWindow>

    </div>
  );
};

export default DictsPage;