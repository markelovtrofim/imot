import React, {FC, useEffect, useState} from 'react';
import {IconButton, InputBase, Skeleton, Tooltip, Typography} from "@mui/material";
import Checkbox from "../../../components/common/Checkbox";
import Switch from "../../../components/common/Switch";
import CustomControlSelect from "../../../components/common/Selects/CustomControlSelect";
import {InfoCircleActive, InfoCircle} from "../MarkupRules";
import {useAppSelector} from "../../../hooks/redux";
import Field from "../../../components/common/FIeld";
import {makeStyles} from "@mui/styles";
import {useFormik} from "formik";
import {LoadingButton} from "@mui/lab";
import {useDispatch} from "react-redux";
import {
  deleteDict,
  dictActions, dictsSlice,
  getDict,
  getDicts,
  getGroups,
  updateDict
} from "../../../store/dicts/dicts.slice";
import {BlockBox} from "../../../components/common";
import ModalWindow from "../../../components/common/ModalWindowBox";
import CloseIcon from "@mui/icons-material/Close";
import {DictType, DictTypeDetailed, GroupType} from "../../../store/dicts/dicts.types";
import Snackbar, {SnackbarType} from "../../../components/common/Snackbar";
import {useHistory} from "react-router-dom";
import noResultsPng from '../../../assets/images/no-results.png';
import {RootState} from "../../../store/store";
import {translate} from "../../../localizations";

const DictDetailsStubMiddleware: FC = () => {
  const currentDict = useAppSelector(state => state.dicts.currentDict);
  const classes = useStyles();
  if (currentDict === null) {
    return (
      <BlockBox padding={'24px'}>
        <Field label={'Название словаря'}>
          <Skeleton variant={"text"} height={'22px'} width={'100%'} style={{marginTop: '3px'}}/>
        </Field>
        <Field label={'Название группы'}>
          <Skeleton variant={"text"} height={'22px'} width={'100%'} style={{marginTop: '3px'}}/>
        </Field>
        <Field
          label={'Список слов, фраз'}
          labelBrother={
            <div style={{display: 'flex', justifyContent: "space-between", width: '80px', alignItems: 'center'}}>
              <Switch
                onChecked={() => {
                }}
                checked={false}
                disabled={true}
              />
              <InfoCircle/>
            </div>
          }
        >
          <div style={{height: '340px'}}>
            <Skeleton variant={"rectangular"} height={'100%'} width={'100%'}/>
          </div>
        </Field>

        <div style={{marginTop: '45px'}}>
          <div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
            <div>
              <Typography className={classes.rulesText}>Правила</Typography>
              {/* Checkbox block */}
              <div style={{margin: '18px 0 24px 0'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                  <Checkbox disabled={true} style={{marginRight: '8px'}}/>
                  <Typography>Словарь автозамены</Typography>
                </div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <LoadingButton
                type={"submit"}
                style={{marginRight: '24px'}}
                variant={"contained"}
                disabled={true}
              >
                Сохранить
              </LoadingButton>
              <CustomControlSelect
                disabled={true}
                optionsPosition={"top"}
                options={[{value: 'тс не ругайся', label: 'тс завязывай'}]}
                svg={'horizontal'}
                handleSelectChange={() => {
                }}
              />
            </div>
          </div>
        </div>
      </BlockBox>
    )
  } else if (currentDict === false) {
    return (
      <BlockBox padding={'5px 24px 0 24px'}>
        <div style={{textAlign: 'center', marginTop: '150px'}}>
          <img src={noResultsPng} alt=""/>
        </div>
      </BlockBox>
    )
  } else {
    return <DictDetails currentDict={currentDict}/>
  }
};


type DictDetailsPropsType = {
  currentDict: DictTypeDetailed
}

const useStyles = makeStyles(({
  ddTextarea: {
    cursor: 'default',
    minHeight: '340px',
    minWidth: '100%',
    resize: 'none',
    backgroundColor: '#F8FAFC',
    color: '#2F3747',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    border: 'none',
    outline: 'none',
    lineHeight: '25px',
    '&::-webkit-scrollbar': {
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

  ddMWTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ddMWTitleText: {
    fontWeight: '700 !important'
  },
  ddMWButtons: {
    marginTop: '15px',
    textAlign: 'right'
  },

  tooltip: {
    borderRadius: "5px",
    fontFamily: 'Inter, sans-serif !important',
    color: '#000 !important',
    minWidth: '400px',
    fontSize: '14px !important',
    padding: '6px 8px !important',
    backgroundColor: '#fff !important',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    marginTop: '50px !important',
  },

  switchText: {
    marginLeft: '10px !important',
    fontWeight: '700 !important'
  },

  rulesText: {
    fontWeight: '700 !important'
  }
}));

const DictDetails: FC<DictDetailsPropsType> = ({currentDict}) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      title: '',
      phrases: '',
      groupName: ''
    },
    onSubmit: async (values) => {
      setSubmitLoading(true);
      const phrasesParseToObject = () => {
        const phrasesArray = values.phrases.split('\n');
        let phrasesArrayNew = [];
        for (let i = 0; i < phrasesArray.length; i++) {
          if (phrasesArray[i].length > 1) {
            phrasesArrayNew.push(phrasesArray[i]);
          }
        }
        return phrasesArrayNew;
      }
      await dispatch(updateDict({
        ...currentDict,
        phrases: phrasesParseToObject(),
        title: values.title,
        group: values.groupName
      }));
      if (currentDict.group !== formik.values.groupName) {
        const groupsData = await dispatch(getGroups());
        // @ts-ignore
        const groups: GroupType[] = groupsData.payload;
        const currentGroup = groups.filter((item) => item.group === formik.values.groupName)[0];
        dispatch(dictsSlice.actions.setCurrentGroup(currentGroup));
        await dispatch(getDicts({group: formik.values.groupName}))
      }
      if (currentDict.title !== formik.values.title) {
        await dispatch(getDicts({group: currentDict.group}));
      }
      setSubmitLoading(false);
      setSnackbar({type: 'success', value: true, text: 'Изменения сохранены', time: 2000})
    },
  });

  const {language} = useAppSelector((state: RootState) => state.lang);

  const [render, setRender] = useState(false);
  useEffect(() => {
    formik.values.title = currentDict.title
    formik.values.phrases = currentDict.phrases.join("\n")
    formik.values.groupName = currentDict.group ? currentDict.group : currentGroup ? currentGroup.group : ''
    setRender(!render);
  }, [currentDict])

  const createSelectOptions = () => {
    let result = [];
    for (let i = 0; i < currentDict.allowedActions.length; i++) {
      // закинуть translate
      const action = currentDict.allowedActions[i];
      if (action === 'clone') {
        result.push({value: action, label: translate("cloneButton_dictDetailSelect", language)});
      } else if (action === 'delete') {
        result.push({value: action, label: translate("deleteButton_dictDetailSelect", language)});
      } else if (action === 'make_global') {
        result.push({value: action, label: translate("makeGlobal_dictDetailSelect", language)});
      }
    }
    return result;
  };

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // логика открытия модально окна
  // MW - Modal Window
  const [deleteDictMWIsOpen, setDeleteDictMWIsOpen] = useState<boolean>(false);
  const handleMWOpen = () => {
    setDeleteDictMWIsOpen(true);
  };
  const handleMWClose = () => {
    setDeleteDictMWIsOpen(false);
  };

  const error = useAppSelector(state => state.dicts.error);
  useEffect(() => {
    setDeleteLoading(false);
    if (error) {
      setSnackbar({type: 'error', value: true, text: 'Этот словарь нельзя удалить', time: 2000});
    }
  }, [error])

  const currentGroup = useAppSelector(state => state.dicts.currentGroup);
  const history = useHistory();

  // говнокодю по полной)
  const dictHandleDelete = async () => {
    if (currentGroup) {
      setDeleteLoading(true);
      await dispatch(deleteDict(currentDict.id));
      const groupsData = await dispatch(getGroups());
      if (currentGroup.count < 2) {
        // @ts-ignore
        const groups: GroupType[] = groupsData.payload;
        dispatch(dictsSlice.actions.setCurrentGroup(groups[0]));
        const dictsData = await dispatch(getDicts({group: groups[0].group}));
        // @ts-ignore
        const dicts: DictType[] = dictsData.payload;
        history.push(`dictionaries/${dicts[0].id}`)
        await dispatch(getDict(dicts[0].id));
      } else {
        const dataDicts = await dispatch(getDicts({group: currentGroup.group}));
        // @ts-ignore
        const dicts: DictType[] = dataDicts.payload;
        await dispatch(getDict(dicts[0].id));
      }
      handleMWClose();
      setDeleteDictMWIsOpen(false);
      setSnackbar({type: "success", text: 'Словарь удален', value: true, time: 2000});
      setDeleteLoading(false);
    }
  };


  // snackbars
  const [snackbar, setSnackbar] = useState<{ type: SnackbarType, text: string, value: boolean, time: number | null }>({
    type: 'success',
    text: '',
    value: false,
    time: null
  });

  const [checked, setChecked] = useState<boolean>(currentDict.enabled);
  const [checkedDisable, setCheckedDisable] = useState<boolean>(false);

  return (
    <BlockBox padding={'24px'}>
      <form onSubmit={formik.handleSubmit}>
        <Field label={translate("dictName_dictDetail", language)}>
          <InputBase
            disabled={!currentDict.group}
            style={{width: '100%'}}
            name="title"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
        </Field>
        <Field label={translate("groupName_dictDetail", language)}>
          <InputBase
            disabled={!currentDict.group}
            style={{width: '100%'}}
            name="groupName"
            type="text"
            value={formik.values.groupName}
            onChange={formik.handleChange}
          />
        </Field>
        <Field
          label={translate("phrasesList_dictDetail", language)}
          labelBrother={
            <div style={{display: 'flex', justifyContent: "space-between", width: '140px', alignItems: 'center'}}>
              <div>
                {currentDict.allowedActions.includes('enable') && currentDict.allowedActions.includes('disable') &&
                <div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <Switch
                      onChecked={async (e) => {
                        if (currentGroup) {
                          setChecked(!checked);
                          setCheckedDisable(true);
                          setSnackbar({type: 'loading', value: true, text: 'Загрузка...', time: null})
                          await dispatch(dictActions({
                            dictId: currentDict.id,
                            action: currentDict.enabled ? 'disable' : 'enable'
                          }));
                          const groupsData = await dispatch(getGroups());
                          // @ts-ignore
                          const groups: GroupType[] = groupsData.payload;
                          debugger
                          if (currentGroup.count < 2) {
                            dispatch(dictsSlice.actions.setCurrentGroup(groups[0]));
                            const dictsData = await dispatch(getDicts({group: groups[0].group}))
                            // @ts-ignore
                            const dicts: DictType[] = dictsData.payload;
                            await dispatch(getDict(dicts[0].id))
                          } else {
                            const dictsData = await dispatch(getDicts({group: currentGroup.group}))
                            // @ts-ignore
                            const dicts: DictType[] = dictsData.payload;
                            await dispatch(getDict(dicts[0].id))
                          }

                          setSnackbar({type: 'loading', value: false, text: 'Загрузка...', time: null})
                          setSnackbar({
                            type: 'success',
                            value: true,
                            text: `Словарь ${currentDict.enabled ? 'выключен' : 'включён'}`,
                            time: 1000
                          });
                          setChecked(checked);
                          setCheckedDisable(false);
                        }
                      }}
                      checked={checked}
                      disabled={checkedDisable}
                    />
                    <Typography className={classes.switchText}>
                      {currentDict.enabled ? 'Вкл' : 'Выкл'}
                    </Typography>
                  </div>
                </div>
                }
              </div>
              <Tooltip
                disableInteractive={true}
                classes={{tooltip: classes.tooltip}}
                title={
                  <div>
                    <Typography>Правила заполнения словарей</Typography>
                    <ul style={{marginTop: '0', paddingLeft: '20px'}}>
                      <li style={{margin: '5px 0'}}>
                        Каждая фраза размещается на отдельной строке.
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Поиск по содержимому осуществляется по целому слову.
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Поиск части слова осуществляется с заменой окончания символом * (например: в слове интернет*
                        найдет
                        и интернета/интернету/интернетов).
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Между слов во фразе при поиске возможно попадание до трех любых слов
                        (например запись в словаре `плох* интернет` найдет фразу `плохо работает ваш интернет`).
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Для поиска фразы с точным совпадением (без лишних слов) необходимо расставить
                        кавычки (например: "не работает", без кавычек найдет "не знаю наверное работает").
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Для поиска любого кол-ва слов в фразе, вместо пробела нужно поставить символ
                        ~ (например: "телефон~заработал" найдет "телефон сломался,
                        ничего не показывает, что я только ни делал чтобы он заработал").
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Для пропуска не более X слов, нужно вместо
                        пробела поставить нижнее подчёркивание _ столько раз, сколько максимум
                        будет слов (например: "уже_работает" найдет "уже все работает",
                        но не найдет "уже теперь все работает").
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Символ `-` перед словом означает
                        требование остутствие слова в фразе. (например `-не работает`
                        будет находить фразы где есть слово `работает` но перед ним нет слова `не`.
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Символ `!` перед словом означает
                        требование остутствие слова в ЛЮБОЙ части в фразе.
                        (например `!плохо работает` не сработает на фразе `работает очень плохо`).
                      </li>
                      <li style={{margin: '5px 0'}}>
                        Можно указывать несколько слов через слеш `/`, тогда поиска делается
                        по любому их указанных слов. (например:
                        `доброе/добрый утро/день/вечер` найдет и фразы
                        `доброе утро`, `добрый день` и `добрый вечер`).
                      </li>
                      <li style={{margin: '5px 0'}}>
                        У фразы словаря можно указывать `:` и фразу замены, фраза замены используется для
                        словаря автозамены, а так же при применении правла тегирования. В правиле тегирования
                        в значения тега будет проставляться значение указанное после `:` а искать будем по тому
                        что до ':' (например сделаем записи в словаре "беха:bmw","ауди:audi", "иск 5:bmw",
                        и делаем правило тегирования которое ишет эти фразы, и заполняет тег "марка автомобиля",
                        в значение тега будет проставлено audi или bmw).
                      </li>
                    </ul>
                  </div>
                }
                placement="left"
              >
                <div><InfoCircleActive/></div>
              </Tooltip>
            </div>
          }
        >
          <textarea
            className={classes.ddTextarea}
            disabled={!currentDict.group}
            onChange={formik.handleChange}
            value={formik.values.phrases}
            name="phrases"
          />
        </Field>

        <div style={{marginTop: '45px'}}>

          <div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
            <div>
              <Typography className={classes.rulesText}>{translate("rulesName_dictDetail", language)}</Typography>

              {/* Checkbox block */}
              <div style={{margin: '18px 0 24px 0'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                  <Checkbox
                    disabled={!currentDict.group}
                    style={{marginRight: '8px'}}
                  />
                  <Typography>{translate("autocorrectDict_dictDetail", language)}</Typography>
                </div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <LoadingButton
                type={"submit"}
                style={{marginRight: '24px'}}
                variant={"contained"}
                loading={submitLoading}
                disabled={!currentDict.group}
              >
                {translate("saveButton_dictDetail", language)}
              </LoadingButton>
              <div style={{width: '40px', height: '40px'}}>
                {currentDict.allowedActions.length > 0 &&
                <CustomControlSelect
                  disabled={!currentDict}
                  optionsPosition={"top"}
                  options={createSelectOptions()}
                  svg={'horizontal'}
                  handleSelectChange={async (e) => {
                    if (e.value === 'delete') {
                      handleMWOpen();
                    } else if (e.value === 'clone' && currentGroup) {
                      setSnackbar({type: 'loading', value: true, text: 'Загрузка...', time: null})
                      await dispatch(dictActions({
                        dictId: currentDict.id,
                        action: 'clone'
                      }));

                      const groupsData = await dispatch(getGroups());
                      // @ts-ignore
                      const groups: GroupType[] = groupsData.payload;
                      dispatch(dictsSlice.actions.setCurrentGroup(groups[0]))
                      if (currentGroup.count < 2) {
                        const dictsData = await dispatch(getDicts({group: groups[0].group}))
                        // @ts-ignore
                        const dicts: DictType[] = dictsData.payload;
                        debugger
                        await dispatch(getDict(dicts[0].id))
                      } else {
                        const dictsData = await dispatch(getDicts({group: currentGroup.group}))
                        // @ts-ignore
                        const dicts: DictType[] = dictsData.payload;
                        await dispatch(getDict(dicts[0].id))
                      }
                      setSnackbar({type: 'loading', value: false, text: 'Загрузка...', time: null})
                      setSnackbar({type: 'success', value: true, text: 'Словарь склонирован', time: 2000})
                    }
                  }}
                />
                }
              </div>
            </div>
          </div>
        </div>
      </form>

      {snackbar.value &&
      <Snackbar
        type={snackbar.type}
        open={snackbar.value}
        onClose={() => {
          setSnackbar({...snackbar, value: false})
        }}
        text={snackbar.text}
        time={snackbar.time}
      />
      }


      {/* modal window */}
      <ModalWindow isOpen={deleteDictMWIsOpen} handleClose={handleMWClose}>
        <div className={classes.ddMWTitle}>
          <Typography className={classes.ddMWTitleText}>Вы уверены, что хотите удалить словарь?</Typography>
          <IconButton onClick={handleMWClose}>
            <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
          </IconButton>
        </div>

        <Field label={''}>{currentDict.title}</Field>
        <div className={classes.ddMWButtons}>
          <LoadingButton
            loading={deleteLoading}
            style={{marginRight: '15px'}}
            variant="contained"
            color="error"
            onClick={dictHandleDelete}
          >
            {translate("deleteButton_dictDetailMW", language)}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="secondary"
            onClick={handleMWClose}
          >
            {translate("cancelButton_dictDetailMW", language)}

          </LoadingButton>
        </div>
      </ModalWindow>

    </BlockBox>
  );
};

export default DictDetailsStubMiddleware;
