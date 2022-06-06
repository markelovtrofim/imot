import React, {useEffect, useState, FC} from 'react';
import {InputBase, Typography} from "@mui/material";
import {BlockBox} from "../../../../components/common";
import Field from "../../../../components/common/FIeld";
import TextSelect from "../../../../components/common/Selects/TextSelect/TextSelect";
import {useTagDetailsStyles} from './TagDetails.jss';
import {useAppSelector} from "../../../../hooks/redux";
import {
  getAllGlobalTagFilters,
  getTagGroups,
  getTags,
  getTag,
  tagsActions,
  tagsSlice,
  updateTag
} from "../../../../store/tags/tags.slice";
import {useDispatch} from "react-redux";
import Alert from "../../../../components/common/Alert/Alert";
import CustomSelect from "../../../../components/common/Selects/CustomSelect/CustomSelect";
import ContainedSelect from "../../../../components/common/Selects/ContainedSelect";
import CustomCheckbox from "../../../../components/common/Checkbox";
import {useFormik} from "formik";
import Checkbox from "../../../../components/common/Checkbox";
import {PlusSvg, TrashSvg} from "./TagDetails.svg";
import Preloader from '../../../../assets/loading.svg';
import {LoadingButton} from "@mui/lab";
import {translate} from "../../../../localizations";
import {RootState} from "../../../../store/store";
import cloneDeep from "lodash.clonedeep";
import Snackbar, {SnackbarType} from "../../../../components/common/Snackbar";
import noResultsPng from "../../../../assets/images/no-results.png";
import CustomControlSelect from "../../../../components/common/Selects/CustomControlSelect";
import {GroupType} from "../../../../store/dicts/dicts.types";
import Switch from "../../../../components/common/Switch";

export const AddButton: FC<{ onClick?: () => void }> = ({onClick, children}) => {
  const classes = useTagDetailsStyles();
  return (
    <div onClick={onClick} style={{display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer'}}>
      <PlusSvg style={{marginRight: '10px'}}/>
      <Typography className={classes.typographyTitleMini}>{children}</Typography>
    </div>
  );
};

const TagDetails: FC = () => {
  const classes = useTagDetailsStyles();
  const dispatch = useDispatch();

  const currentTag = useAppSelector(state => state.tags.currentTag);
  const allGlobalFilterCriterias = useAppSelector(state => state.tags.allGlobalFilterCriterias);
  const activeGlobalFilterCriterias = useAppSelector(state => state.tags.activeGlobalFilterCriterias);
  const defaultGlobalFilterCriterias = useAppSelector(state => state.tags.defaultGlobalFilterCriterias);
  const activeFragments = useAppSelector(state => state.tags.activeFragments);
  const activeSetTags = useAppSelector(state => state.tags.activeSetTags);
  const currentGroup = useAppSelector(state => state.tags.currentTagGroup);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllGlobalTagFilters());
  }, []);


  // text select
  const handleGlobalFilterSelectClick = () => {
    let state = allGlobalFilterCriterias;
    let localCriterias = []
    if (state && currentTag) {
      const defAcCriterias = [...activeGlobalFilterCriterias, ...currentTag.globalFilter]
      for (let i = 0; i < state.length; i++) {
        if (!defAcCriterias.find((item) => {
          if (state) {
            return item.key === state[i].key
          }
        })) {
          localCriterias.push({value: state[i], label: state[i].title})
        }
      }
      return localCriterias;
    }
    return [];
  }
  const globalFilterOptions = handleGlobalFilterSelectClick();


  // global filter select
  // изменение значения селекта.
  const globalFilterValueHandler = (event: any, isDefault: boolean, criteriaFull: any) => {
    const eventConverter = () => {
      let result = [];
      for (let i = 0; i < event.length; i++) {
        result.push(event[i].value);
      }
      return result;
    };
    const eventConverterResult = eventConverter();
    dispatch(tagsSlice.actions.setActiveGlobalFilterCriteriaValues({
      ...criteriaFull,
      values: [...eventConverterResult]
    }));
  };
  // удаление поле.
  const removeGlobalFilterField = (event: any, criteriaFull: any) => {
    dispatch(tagsSlice.actions.removeActiveGlobalFilterCriteria(criteriaFull));
  };


  const selectConverter = (values: any, defaultValues: any = []) => {
    if (values) {
      let local: { value: any, label: string }[] = [];
      for (let i = 0; i < values.length; i++) {
        // @ts-ignore
        if (!defaultValues.find(item => item === values[i])) {
          local.push({value: values[i], label: values[i]});
        }
      }
      return local;
    }
    return [];
  };

  const actionsSelectConverter = (values: any, defaultValues: any = []) => {
    if (values) {
      let local: { value: any, label: string }[] = [];
      for (let i = 0; i < values.length; i++) {
        // @ts-ignore
        if (!defaultValues.find(item => item === values[i])) {
          local.push({value: values[i], label: values[i]});
        }
      }
      return local;
    }
    return [];
  };

  const addRuleSelectConverter = (values: any) => {
    if (values) {
      let local: { value: any, label: string }[] = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i].key === 'dicts' || values[i].key === 'phrases') {
          continue
        }
        if (!values[i].visible) {
          local.push({value: values[i], label: values[i].title});
        }
      }
      return local;
    }
    return [];
  };


  const formik = useFormik({
    initialValues: {
      // название, группа, приоритет.
      name: '',
      group: '',
      priority: '' as string | number
    },
    onSubmit: async (values) => {
    }
  });

  const {language} = useAppSelector((state: RootState) => state.lang);


  const [render, setRender] = useState(false);
  useEffect(() => {
    if (currentTag) {
      formik.values.name = currentTag.title;
      formik.values.group = 'Название группы';
      formik.values.priority = currentTag.calculatedRulePriority;
    }
    setRender(!render);
  }, [currentTag]);

  // snackbars
  const [snackbar, setSnackbar] = useState<{ type: SnackbarType, text: string, value: boolean, time: number | null }>({
    type: 'success',
    text: '',
    value: false,
    time: null
  });

  async function onClickSaveButton() {
    setLoading(true);

    // global filters convert
    const globalFiltersForRequest = [];
    for (let i = 0; i < activeGlobalFilterCriterias.length; i++) {
      globalFiltersForRequest.push({
        key: activeGlobalFilterCriterias[i].key,
        values: activeGlobalFilterCriterias[i].values
      })
    }

    // бяка а не код
    // fragments convert
    const fragmentsForRequest = [];
    for (let i = 0; i < activeFragments.length; i++) {
      fragmentsForRequest.push({});
      const fragment = activeFragments[i];
      for (let ii = 0; ii < fragment.length; ii++) {
        if (fragment[ii].key === 'phrasesAndDicts') {
          // @ts-ignore
          fragmentsForRequest[i][fragment[ii].key] = [];
          for (let iii = 0; iii < fragment[ii].value.length; iii++) {
            let array = cloneDeep(fragmentsForRequest[i][fragment[ii].key]);
            if (fragment[ii].value[iii].__isNew__) {
              // @ts-ignore
              array.push(fragment[ii].value[iii].value);
            } else {
              //@ts-ignore
              array = fragment[ii].value[iii].value;
            }
            // @ts-ignore
            fragmentsForRequest[i][fragment[ii].key] = array;
          }
        } else {
          // @ts-ignore
          fragmentsForRequest[i][fragment[ii].key] = fragment[ii].value.value;
        }
      }
    }
    // set tags
    // пока не нужна конвертация. пока.

    await dispatch(updateTag({
      ...currentTag,
      title: formik.values.name,
      group: formik.values.group,
      rulePriority: formik.values.priority,
      globalFilter: globalFiltersForRequest,
      fragmentRules: fragmentsForRequest,
      setTags: activeSetTags
    }));

    setLoading(false);
    setSnackbar({
      type: 'success',
      value: true,
      time: 2000,
      text: 'Тег обнавлен'
    })
  }

  if (!currentTag) {
    return (
      <BlockBox padding={'0'} height={'100%'}>
        <div style={{position: 'relative', height: '100%'}}>
          {currentTag === null &&
          <div style={{position: 'absolute', top: '30%', left: '32%'}}>
            <img src={Preloader} alt=""/>
          </div>
          }
          {currentTag === false &&
          <div style={{textAlign: 'center', paddingTop: '150px'}}>
            <img src={noResultsPng} alt=""/>
          </div>
          }
        </div>
      </BlockBox>
    )
  }

  return (
    <BlockBox padding={'0'} height={'100%'}>
      <div className={classes.tdWrapper}>

        {/* Шапка */}
        <div>
          <div className={classes.tdNameAdnPriority}>
            {/* Название тега */}
            <Field
              margin={'0 0 15px 0'}
              label={"Название тега"}
              width={"60%"}
            >
              <InputBase
                value={formik.values.name}
                onChange={formik.handleChange}
                name={"name"}

                className={classes.tdTagNameInput}
                type="text"
              />
            </Field>
            {/* Приоритет */}
            <Field
              label={"Приоритет"}
              width={'15%'}
            >
              <InputBase
                value={formik.values.priority}
                onChange={formik.handleChange}
                name={"priority"}

                className={classes.tdPriorityInput}
                type="number"
              />
            </Field>
          </div>
          {/* Название группы */}
          <Field
            label={"Название группы тега"}
            width={"60%"}
          >
            <InputBase
              value={formik.values.group}
              onChange={formik.handleChange}
              name={"group"}

              className={classes.tdTagNameInput}
              type="text"
            />
          </Field>
        </div>

        {/* Глобальные фильтры */}
        <div style={{width: '100%', margin: '30px 0'}}>
          <Typography className={classes.typographyTitle}>Глобальные настройки тега</Typography>
          <div>
            <div>
              <div>
                {defaultGlobalFilterCriterias.length > 0 &&
                defaultGlobalFilterCriterias.map((currentCriteria) => {
                  const isDefault = true;
                  const criteriaFull = allGlobalFilterCriterias.find((fullCriteria) => {
                    return currentCriteria.key === fullCriteria.key;
                  });
                  if (criteriaFull) {
                    return (
                      <div>
                        <Typography className={classes.typographyTitleMini}>{criteriaFull.title}</Typography>
                        <div style={{display: 'flex'}}>
                          <CustomSelect
                            value={selectConverter(currentCriteria.values)}
                            options={selectConverter(criteriaFull.values, currentCriteria.values)}
                            selectType={criteriaFull.selectType}

                            valueHandler={(event) => globalFilterValueHandler(event, isDefault, criteriaFull)}

                            isDefaultField={isDefault}
                          />
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
              <div>
                {activeGlobalFilterCriterias.map((currentCriteria) => {
                  const isDefault = false;
                  const criteriaFull = allGlobalFilterCriterias.find((fullCriteria) => {
                    return currentCriteria.key === fullCriteria.key;
                  });
                  if (criteriaFull) {
                    return (
                      <div>
                        <Typography className={classes.typographyTitleMini}>{currentCriteria.title}</Typography>

                        <CustomSelect
                          value={selectConverter(currentCriteria.values)}
                          options={selectConverter(criteriaFull.values, currentCriteria.values)}
                          selectType={criteriaFull.selectType}

                          valueHandler={(event) => globalFilterValueHandler(event, isDefault, criteriaFull)}
                          removeSelectHandler={(event: any) => removeGlobalFilterField(event, criteriaFull)}

                          deleteIcon={<TrashSvg style={{cursor: 'pointer', marginLeft: '8px'}}/>}

                          isDefaultField={isDefault}

                          width={'60%'}
                        />

                      </div>
                    )
                  }
                })}
                {activeGlobalFilterCriterias.length < 1 && defaultGlobalFilterCriterias.length < 1 &&
                <Alert
                  iconType={'error'}
                  width={'60%'}
                  text={'У этого тега нет глобальных фильтров'}
                />
                }
                <div style={{marginTop: '19px'}}>
                  <TextSelect
                    value={null}
                    handleValueChange={(event: any) => {
                      dispatch(tagsSlice.actions.setActiveGlobalFilterCriteria({...event.value, values: []}));
                    }}
                    options={globalFilterOptions}
                    iconPosition={'left'}
                    height={'300px'}
                    icon={<PlusSvg style={{marginRight: '10px'}}/>}
                    customControl={
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography className={classes.typographyTitleMini}>Добавить фильтр</Typography>
                      </div>
                    }
                    menuPosition={'left'}
                    name={'tagsGlobalSelect'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Фрагменты */}
        <div>
          <Typography className={classes.typographyTitle}>Фрагменты тега</Typography>
          <div>
            <div>
              <div>
                {activeFragments.length > 0 ?
                  <>
                    {activeFragments.map((displayFragment) => {
                      const arrayIndex = activeFragments.indexOf(displayFragment);
                      return (
                        <div style={{width: '100%', display: 'flex', alignItems: 'center', margin: '20px 0'}}>
                          <div style={{width: '60%'}}>
                            {displayFragment.map((fragmentField) => {
                              const fragmentFieldIndex = displayFragment.indexOf(fragmentField);
                              if (fragmentField.visible) {
                                return (
                                  <div style={{width: '100%'}}>
                                    {
                                      (fragmentField.selectType === 'multiValue' &&
                                        <div style={{width: '100%'}}>
                                          <Typography>{fragmentField.title}</Typography>
                                          <div style={{display: 'flex', alignItems: 'center'}}>
                                            <ContainedSelect
                                              width={'100%'}
                                              height={'30px'}
                                              onSelectChange={(event: any) => {
                                                dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                  arrayIndex: arrayIndex,
                                                  fieldIndex: fragmentFieldIndex,
                                                  value: event
                                                }));
                                              }}
                                              // @ts-ignore
                                              options={fragmentField.options}
                                              value={fragmentField.value}
                                            />
                                            <TrashSvg
                                              style={{marginLeft: '10px'}}
                                              onClick={() => {
                                                dispatch(tagsSlice.actions.removeFragmentField({
                                                  arrayIndex: arrayIndex,
                                                  fieldIndex: fragmentFieldIndex
                                                }));
                                              }}
                                            />
                                          </div>

                                        </div>
                                      ) ||
                                      (fragmentField.selectType === 'multiString' &&
                                        <div style={{width: '100%'}}>
                                          <Typography>{fragmentField.title}</Typography>
                                          <CustomSelect
                                            value={fragmentField.value}
                                            // @ts-ignore
                                            options={fragmentField.options}
                                            selectType={fragmentField.selectType}
                                            isDefaultField={false}
                                            valueHandler={(event: any) => {
                                              dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                arrayIndex: arrayIndex,
                                                fieldIndex: fragmentFieldIndex,
                                                value: event
                                              }));
                                            }}
                                            removeSelectHandler={(event: any) => {
                                              dispatch(tagsSlice.actions.setFragmentField({
                                                index: arrayIndex,
                                                value: fragmentField,
                                                visible: false
                                              }))
                                            }}
                                            deleteIcon={<TrashSvg/>}
                                          />
                                        </div>

                                      ) ||
                                      (fragmentField.selectType === 'checkbox' &&
                                        <div style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          width: '100%',
                                          padding: '10px 0'
                                        }}>
                                          <Typography>{fragmentField.title}</Typography>
                                          <CustomCheckbox
                                            onClick={(event) => {
                                              dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                arrayIndex: arrayIndex,
                                                fieldIndex: fragmentFieldIndex,
                                                // @ts-ignore
                                                value: {value: event.target.checked, label: 'check'}
                                              }));
                                            }}
                                            checked={fragmentField.value.value}
                                          />
                                          <TrashSvg
                                            style={{marginLeft: '10px'}}
                                            onClick={() => {
                                              dispatch(tagsSlice.actions.removeFragmentField({
                                                arrayIndex: arrayIndex,
                                                fieldIndex: fragmentFieldIndex
                                              }));
                                            }}
                                          />
                                        </div>
                                      ) ||
                                      (fragmentField.selectType === 'input' &&
                                        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                          <Field
                                            label={fragmentField.title}
                                            width={"100%"}
                                          >
                                            <InputBase
                                              onChange={(event: any) => {
                                                dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                  arrayIndex: arrayIndex,
                                                  fieldIndex: fragmentFieldIndex,
                                                  value: {value: event.target.value, label: event.target.value}
                                                }));
                                              }}
                                              className={classes.tdTagNameInput}
                                              type="text"
                                              value={fragmentField.value.value}
                                            />
                                          </Field>
                                          <TrashSvg
                                            style={{marginLeft: '10px'}}
                                            onClick={() => {
                                              dispatch(tagsSlice.actions.removeFragmentField({
                                                arrayIndex: arrayIndex,
                                                fieldIndex: fragmentFieldIndex
                                              }));
                                            }}
                                          />
                                        </div>
                                      )
                                    }
                                  </div>
                                )
                              }
                            })}
                            <TextSelect
                              value={null}
                              handleValueChange={(event: any) => {
                                dispatch(tagsSlice.actions.setFragmentField({
                                  index: activeFragments.indexOf(displayFragment),
                                  value: event.value,
                                  visible: true
                                }));
                              }}
                              options={addRuleSelectConverter(displayFragment)}
                              iconPosition={'left'}
                              height={'300px'}
                              icon={<PlusSvg style={{marginRight: '10px'}}/>}
                              customControl={
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                  <Typography className={classes.typographyTitleMini}>Добавить правило</Typography>
                                </div>
                              }
                              menuPosition={'left'}
                              name={'tagsGlobalSelect'}
                            />
                          </div>
                          <TrashSvg
                            style={{marginLeft: '30px'}}
                            onClick={() => {
                              dispatch(tagsSlice.actions.removeFragment(arrayIndex));
                            }}
                          />
                        </div>
                      )
                    })}
                  </>
                  :
                  <Alert
                    iconType={'error'}
                    width={'60%'}
                    text={'У этого тега нет фрагментов'}
                  />
                }
              </div>
            </div>
          </div>
          <div>
            <AddButton
              onClick={() => {
                if (currentTag) {
                  dispatch(tagsSlice.actions.setFragment(null))
                }
              }}
            >
              Добавить фрагмент
            </AddButton>
          </div>
        </div>

        {/* Внутренние теги*/}
        <div style={{margin: '30px 0'}}>
          <Typography className={classes.typographyTitle}>Теги</Typography>
          <div>
            <div>
              {activeSetTags.length > 0 ? activeSetTags.map(tag => {
                  const setTagIndex = activeSetTags.indexOf(tag);
                  return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div style={{width: '60%'}}>
                        <Field
                          label={'Название тега'}
                          width={"100%"}
                        >
                          <InputBase
                            onChange={(event: any) => {
                              dispatch(tagsSlice.actions.setSetTagFieldValue({
                                tagIndex: setTagIndex,
                                fieldKey: event.target.name,
                                value: event.target.value
                              }));
                            }}
                            name={'name'}
                            value={tag.name}
                            className={classes.tdTagNameInput}
                            type="text"
                          />
                        </Field>
                        <Field
                          label={'Значение тега'}
                          width={"100%"}
                        >
                          <InputBase
                            onChange={(event: any) => {
                              dispatch(tagsSlice.actions.setSetTagFieldValue({
                                tagIndex: setTagIndex,
                                fieldKey: event.target.name,
                                value: event.target.value
                              }));
                            }}
                            name={'value'}

                            value={tag.value}
                            className={classes.tdTagNameInput}
                            type="text"
                          />
                        </Field>
                        <div style={{display: 'flex'}}>
                          <Checkbox
                            onClick={(event: any) => {
                              dispatch(tagsSlice.actions.setSetTagFieldValue({
                                tagIndex: setTagIndex,
                                fieldKey: event.target.name,
                                value: event.target.checked
                              }));
                            }}
                            checked={tag.visible}
                            name={'visible'}
                            style={{marginRight: '10px'}}
                          />
                          <Typography className={classes.typographyTitleMini}>Скрыть</Typography>
                        </div>
                      </div>
                      <TrashSvg
                        onClick={() => {
                          dispatch(tagsSlice.actions.removeSetTag(setTagIndex));
                        }}
                        style={{marginLeft: '30px'}}/>
                    </div>
                  )
                }) :
                <Alert
                  iconType={'error'}
                  width={'60%'}
                  text={'У этого тега нет привязанных тегов'}
                />
              }
            </div>
            <AddButton
              onClick={() => {
                if (currentTag) {
                  dispatch(tagsSlice.actions.setSetTag(null))
                }
              }}
            >
              Добавить тег
            </AddButton>
          </div>

        </div>

        {/* Активности */}
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Switch
                onChecked={async (e) => {
                  // if (currentGroup) {
                  //   setChecked(!checked);
                  //   setCheckedDisable(true);
                  //   setSnackbar({type: 'loading', value: true, text: 'Загрузка...', time: null})
                  //   await dispatch(dictActions({
                  //     dictId: currentDict.id,
                  //     action: currentDict.enabled ? 'disable' : 'enable'
                  //   }));
                  //   const groupsData = await dispatch(getGroups());
                  //   // @ts-ignore
                  //   const groups: GroupType[] = groupsData.payload;
                  //   debugger
                  //   if (currentGroup.count < 2) {
                  //     dispatch(dictsSlice.actions.setCurrentGroup(groups[0]));
                  //     const dictsData = await dispatch(getDicts({group: groups[0].group}))
                  //     // @ts-ignore
                  //     const dicts: DictType[] = dictsData.payload;
                  //     await dispatch(getDict(dicts[0].id))
                  //   } else {
                  //     const dictsData = await dispatch(getDicts({group: currentGroup.group}))
                  //     // @ts-ignore
                  //     const dicts: DictType[] = dictsData.payload;
                  //     await dispatch(getDict(dicts[0].id))
                  //   }
                  //
                  //   setSnackbar({type: 'loading', value: false, text: 'Загрузка...', time: null})
                  //   setSnackbar({
                  //     type: 'success',
                  //     value: true,
                  //     text: `Словарь ${currentDict.enabled ? 'выключен' : 'включён'}`,
                  //     time: 1000
                  //   });
                  //   setChecked(checked);
                  //   setCheckedDisable(false);
                  // }
                }}
                checked={true}
                disabled={false}
              />
              <Typography>
                {true ? 'Вкл' : 'Выкл'}
              </Typography>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <LoadingButton
                type={"submit"}
                style={{marginRight: '24px'}}
                variant={"contained"}
                loading={loading}
                onClick={onClickSaveButton}
              >
                {translate("saveButton_dictDetail", language)}
              </LoadingButton>
              <div style={{width: '40px', height: '40px'}}>
                <CustomControlSelect
                  disabled={false}
                  optionsPosition={"top"}
                  options={selectConverter(currentTag.allowedActions)}
                  svg={'horizontal'}
                  handleSelectChange={async (e) => {
                    if (e.value === 'delete') {
                      debugger
                    } else if (e.value === 'clone' && currentGroup) {
                      setSnackbar({type: 'loading', value: true, text: 'Загрузка...', time: null})
                      await dispatch(tagsActions({
                        tagId: currentTag.id,
                        action: 'clone'
                      }));

                      const groupsData = await dispatch(getTagGroups());
                      // @ts-ignore
                      const groups: GroupType[] = groupsData.payload;
                      dispatch(tagsSlice.actions.setCurrentTagGroup(groups[0]))
                      if (currentGroup.count < 2) {
                        const tagsData = await dispatch(getTags({group: groups[0].group}))
                        // @ts-ignore
                        const tags: TagType[] = tagsData.payload;
                        debugger
                        await dispatch(getTag(tags[0].id))
                      } else {
                        const tagsData = await dispatch(getTags({group: currentGroup.group}))
                        // @ts-ignore
                        const tags: TagType[] = tagsData.payload;
                        await dispatch(getTag(tags[0].id))
                      }
                      setSnackbar({type: 'loading', value: false, text: 'Загрузка...', time: null})
                      setSnackbar({type: 'success', value: true, text: 'Словарь склонирован', time: 2000})
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Снаскбар */}
          <div>
            {snackbar.value &&
            <Snackbar
              type={snackbar.type}
              open={snackbar.value}
              onClose={() => {
                setSnackbar({value: false, type: 'success', time: null, text: ''})
              }}
              text={snackbar.text}
              time={snackbar.time}
            />
            }
          </div>

        </div>

      </div>
    </BlockBox>
  )
};

export default TagDetails;
