import React, {useEffect, useState} from 'react';
import ModalWindow from "../../../../components/ModalWindowBox";
import Groups from "../../components/Groups";
import Items from "../../components/Items";
import DictDetails from "./DictsDetail";
import {MarkupRulesButtons, SearchInput} from "../../index";
import {makeStyles} from "@mui/styles";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../../hooks/redux";
import {dictsSlice, getDict, getDicts, getGroups, postDict} from "../../../../store/dicts/dicts.slice";
import {DictType, GroupType} from "../../../../store/dicts/dicts.types";
import {IconButton, InputBase, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Field from "../../../../components/FIeld";
import {LoadingButton} from "@mui/lab";
import Snackbar from "../../../../components/Snackbar";
import {useFormik} from "formik";
import {useHistory} from "react-router-dom";
import {Input} from "../../../../components";
import {RootState} from "../../../../store/store";
import {translate} from "../../../../localizations";

const DictsPage = () => {
  // STYLES BLOCK
  const useDictsStyles = makeStyles(({
    // dp - dicts page
    dpContainer: {
      width: '100%',
      height: '810px',
      margin: '40px 10px',
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
  const classes = useDictsStyles();

  // LOGIC BLOCK
  const history = useHistory();
  const urlArray = history.location.pathname.split('/');
  const urlId = urlArray[3];
  const dispatch = useDispatch();
  const dicts = useAppSelector(state => state.dicts.dicts);
  const groups = useAppSelector(state => state.dicts.groups);
  const currentGroup = useAppSelector(state => state.dicts.currentGroup);
  const currentDict = useAppSelector(state => state.dicts.currentDict);

  // первый рендиринг
  const getStartDictsData = async () => {
    const activeGroupIndex = 0;
    const activeDictsIndex = 0;

    const groupsData = await dispatch(getGroups());
    // @ts-ignore
    const groups: GroupType[] = groupsData.payload;
    dispatch(dictsSlice.actions.setCurrentGroup(groups[activeGroupIndex]));
    const dictsData = await dispatch(getDicts({group: groups[activeGroupIndex].group}));
    if (!urlId) {

      // @ts-ignore
      const dicts: DictType[] = dictsData.payload;
      history.push(`dictionaries/${dicts[activeDictsIndex].id}`)
      await dispatch(getDict(dicts[activeDictsIndex].id));
    } else {
      await dispatch(getDict(urlId));
      // // @ts-ignore
      // const currentDict: DictTypeDetailed = dictData.payload;
      // const groupsData = await dispatch(getGroups());
      // // @ts-ignore
      // const currentGroup = groupsData.payload.filter((item: GroupType) => item.group === currentDict.group)[0];
      // dispatch(dictsSlice.actions.setCurrentGroup(currentGroup));
      // await dispatch(getDicts({group: currentGroup.group}));
    }
  };
  useEffect(() => {
    debugger
    if (!currentDict) {
      getStartDictsData().then()
    } else {
      history.push(`dictionaries/${currentDict.id}`)
    }
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
      debugger
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
            <Groups groups={groups}/>
          </div>
        </div>

        {/* dicts */}
        <div className={classes.dpLeftBlockDicts}>
          <SearchInput
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
            <Items items={dicts}/>
          </div>
        </div>
      </div>

      {/* detail */}
      <div className={classes.dpRightBlock}>
        <DictDetails/>
      </div>

      {/* modal window */}
      <ModalWindow isOpen={addDictMWIsOpen} handleClose={handleMWClose}>
        <div className={classes.MWTitle}>
          <Typography className={classes.MWTitleText}>Введите имя словаря и группы</Typography>
          <IconButton onClick={handleMWClose}>
            <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
          </IconButton>
        </div>

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