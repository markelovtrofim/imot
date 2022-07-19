import React, { useEffect, useState, FC, useContext } from 'react';
import { IconButton, InputBase, Typography } from "@mui/material";
import { BlockBox } from "../../../../components/common";
import Field from "../../../../components/common/FIeld";
import TextSelect from "../../../../components/common/Selects/TextSelect/TextSelect";
import { useTagDetailsStyles } from './TagDetails.jss';
import { useAppSelector } from "../../../../hooks/redux";
import {
  getAllGlobalTagFilters,
  getTagGroups,
  getTags,
  getTag,
  tagsActions,
  tagsSlice,
  updateTag, deleteTag
} from "../../../../store/tags/tags.slice";
import { useDispatch } from "react-redux";
import Alert from "../../../../components/common/Alert/Alert";
import CustomSelect from "../../../../components/common/Selects/CustomSelect/CustomSelect";
import ContainedSelect from "../../../../components/common/Selects/ContainedSelect";
import CustomCheckbox from "../../../../components/common/Checkbox";
import { useFormik } from "formik";
import Checkbox from "../../../../components/common/Checkbox";
import { PlusSvg, TrashSvg } from "./TagDetails.svg";
import Preloader from '../../../../assets/loading.svg';
import { LoadingButton } from "@mui/lab";
import { translate } from "../../../../localizations";
import { RootState } from "../../../../store/store";
import cloneDeep from "lodash.clonedeep";
import noResultsPng from "../../../../assets/images/no-results.png";
import CustomControlSelect from "../../../../components/common/Selects/CustomControlSelect";
import { GroupType } from "../../../../store/dicts/dicts.types";
import Switch from "../../../../components/common/Switch";
import ModalWindow from "../../../../components/common/ModalWindowBox";
import { TagGroupType, TagType } from "../../../../store/tags/tags.types";
import { useHistory } from "react-router-dom";
import {langSlice} from "../../../../store/lang/lang.slice";

export const AddButton: FC<{ onClick?: () => void }> = ({ onClick, children }) => {
  const classes = useTagDetailsStyles();
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer' }}>
      <PlusSvg style={{ marginRight: '10px' }} />
      <Typography className={classes.typographyTitleMiniThree}>{children}</Typography>
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
  const history = useHistory();

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
          localCriterias.push({ value: state[i], label: state[i].title })
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
          local.push({ value: values[i], label: values[i] });
        }
      }
      return local;
    }
    return [];
  };

  const createSelectOptions = () => {
    let result = [];
    if (currentTag) {
      for (let i = 0; i < currentTag.allowedActions.length; i++) {
        // закинуть translate
        const action = currentTag.allowedActions[i];
        if (action === 'clone') {
          result.push({ value: action, label: translate("cloneButton_dictDetailSelect", language) });
        } else if (action === 'delete') {
          result.push({ value: action, label: translate("deleteButton_dictDetailSelect", language) });
        } else if (action === 'make_global') {
          result.push({ value: action, label: translate("makeGlobal_dictDetailSelect", language) });
        }
      }
    }
    return result;
  };
  const addRuleSelectConverter = (values: any) => {
    if (values) {
      let local: { value: any, label: string }[] = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i].key === 'dicts' || values[i].key === 'phrases') {
          continue
        }
        if (!values[i].visible) {
          local.push({ value: values[i], label: values[i].title });
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

  const { language } = useAppSelector((state: RootState) => state.lang);



  const [render, setRender] = useState(false);
  useEffect(() => {
    if (currentTag && currentGroup) {
      formik.values.name = currentTag.title;
      formik.values.group = currentTag.group ? currentTag.group : currentGroup.group
      formik.values.priority = currentTag.calculatedRulePriority;
    }
    setRender(!render);
  }, [currentTag]);
  const userIdData = useAppSelector(state => state.users.currentUser?.id);
  const userId = userIdData ? userIdData : "_";

  // ${language}/${userId}/

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
    let fragmentsForRequest: any = [];
    for (let i = 0; i < activeFragments.length; i++) {
      fragmentsForRequest.push({});
      const fragment = activeFragments[i];
      for (let ii = 0; ii < fragment.length; ii++) {
        if (fragment[ii].key === 'phrasesAndDicts') {
          fragmentsForRequest[i][fragment[ii].key] = [];
          if (fragment[ii].value) {
            for (let iii = 0; iii < fragment[ii].value.length; iii++) {
              let array: any = cloneDeep(fragmentsForRequest[i][fragment[ii].key]);
              array.push(fragment[ii].value[iii].value);
              fragmentsForRequest[i][fragment[ii].key] = array;
            }
          } else {
            debugger
          }
        } else {
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
    dispatch(langSlice.actions.setSnackbar({
      type: 'success',
      value: true,
      time: 2000,
      text: 'Тег обнавлен'
    }))
  }

  const [deleteMWIsOpen, setDeleteMWIsOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  function handleDeleteMWOpen() {
    setDeleteMWIsOpen(true);
  }

  function handleDeleteMWClose() {
    setDeleteMWIsOpen(false);
  }


  if (!currentTag) {
    return (
      <BlockBox padding={'0'} height={'100%'}>
        <div style={{ position: 'relative', height: '100%' }}>
          {currentTag === null && (
            <div style={{ position: 'absolute', top: '30%', left: '32%' }}>
              <img src={Preloader} alt="" />
            </div>
          )}
          {currentTag === false && (
            <div style={{ textAlign: 'center', paddingTop: '150px' }}>
              <img src={noResultsPng} alt="" />
            </div>
          )}
          {currentTag === undefined && (
            <div></div>
          )}
        </div>
      </BlockBox>
    );
  }


  return (
    <BlockBox padding={'0'} height={'auto'}>
      <div className={classes.tdWrapper}>

        {/* Шапка */}
        <div>
          <div className={classes.tdNameAdnPriority}>
            {/* Название тега */}
            <Field
              margin={'0 5% 15px 0'}
              label={"Название тега"}
              width={"100%"}
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
              width={'11%'}
              padding={"3px 0 3px 0"}
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
            margin={'0 0 15px 0'}
            width={"84%"}
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
        <div style={{ width: '100%', margin: '30px 0' }}>
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
                          <div style={{ display: 'flex' }}>
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

                          deleteIcon={<TrashSvg style={{ cursor: 'pointer', marginLeft: '8px' }} />}

                          isDefaultField={isDefault}

                          width={'60%'}
                        />

                      </div>
                    )
                  }
                })}
                {activeGlobalFilterCriterias.length < 1 && defaultGlobalFilterCriterias.length < 1 &&
                  <Alert
                    width={'84%'}
                    text={'У этого тега нет глобальных фильтров'}
                  />
                }
                <div style={{ marginTop: '19px' }}>
                  <TextSelect
                    value={null}
                    handleValueChange={(event: any) => {
                      dispatch(tagsSlice.actions.setActiveGlobalFilterCriteria({ ...event.value, values: [] }));
                    }}
                    options={globalFilterOptions}
                    iconPosition={'left'}
                    height={'300px'}
                    icon={<PlusSvg style={{ marginRight: '10px' }} />}
                    customControl={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography className={classes.typographyTitleMiniTwo}>Добавить фильтр</Typography>
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
          <Typography className={classes.typographyTitle}>Правило на фрагменты</Typography>
          <div>
            <div>
              <div>
                {activeFragments.length > 0 ?
                  <>
                    {activeFragments.map((displayFragment) => {
                      const arrayIndex = activeFragments.indexOf(displayFragment);
                      return (
                        <div
                          style={{ width: '100%', display: 'flex', borderBottom: '1px solid #E3E8EF', margin: '10px 0' }}>
                          <div style={{ width: '84%' }}>
                            {displayFragment.map((fragmentField) => {
                              const fragmentFieldIndex = displayFragment.indexOf(fragmentField);
                              if (fragmentField.visible) {
                                return (
                                  <div style={{ width: '100%', marginBottom: '15px' }}>
                                    {
                                      (fragmentField.selectType === 'multiValue' &&
                                        <div style={{ width: '100%' }}>
                                          <Typography
                                            className={classes.typographyTitleMiniTwo}>{fragmentField.title}</Typography>
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <ContainedSelect
                                              width={'100%'}
                                              height={'35px'}
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
                                          </div>

                                        </div>
                                      ) ||
                                      (fragmentField.selectType === 'multiString' &&
                                        <div style={{ width: '100%' }}>
                                          <Typography
                                            className={classes.typographyTitleMiniTwo}>{fragmentField.title}</Typography>
                                          <CustomSelect
                                            value={fragmentField.value}
                                            width={"100%"} height={"35px"}
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
                                            deleteIcon={<></>}
                                          />
                                        </div>
                                      ) ||
                                      (fragmentField.selectType === 'checkbox' &&
                                        <div style={{
                                          width: '100%',
                                          marginTop: '10px'
                                        }}>
                                          <div style={{ display: 'flex' }}>
                                            <CustomCheckbox
                                              style={{ marginRight: '10px' }}
                                              onClick={(event) => {
                                                dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                  arrayIndex: arrayIndex,
                                                  fieldIndex: fragmentFieldIndex,
                                                  // @ts-ignore
                                                  value: { value: event.target.checked, label: 'check' }
                                                }));
                                              }}
                                              checked={fragmentField.value.value}
                                            />
                                            <Typography
                                              className={classes.typographyTitleMiniThree}
                                            >
                                              {fragmentField.title}
                                            </Typography>
                                          </div>
                                        </div>
                                      ) ||
                                      (fragmentField.selectType === 'input' &&
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                          <Field
                                            label={fragmentField.title}
                                            width={"100%"}
                                          >
                                            <InputBase
                                              onChange={(event: any) => {
                                                dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                  arrayIndex: arrayIndex,
                                                  fieldIndex: fragmentFieldIndex,
                                                  value: { value: event.target.value, label: event.target.value }
                                                }));
                                              }}
                                              className={classes.tdTagNameInput}
                                              type="text"
                                              value={fragmentField.value.value}
                                            />
                                          </Field>
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
                              icon={<PlusSvg
                                style={{ marginRight: '10px', width: '12px', height: '12px', marginTop: '-3px' }} />}
                              customControl={
                                <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0 10px 0' }}>
                                  <Typography className={classes.typographyTitleMini}>
                                    Дополнительное условие
                                  </Typography>
                                </div>
                              }
                              menuPosition={'left'}
                              name={'tagsGlobalSelect'}
                            />
                          </div>
                          <IconButton style={{ cursor: 'pointer', height: '100%', marginLeft: '7%' }}>
                            <TrashSvg
                              style={{ width: '25px', height: '25px' }}
                              onClick={() => {
                                dispatch(tagsSlice.actions.removeFragment(arrayIndex));
                              }}
                            />
                          </IconButton>
                        </div>
                      )
                    })}
                  </>
                  :
                  <Alert
                    width={'84%'}
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
        <div style={{ margin: '30px 0' }}>
          <Typography className={classes.typographyTitle}>Теги</Typography>
          <div>
            <div>
              {activeSetTags.length > 0 ? activeSetTags.map(tag => {
                const setTagIndex = activeSetTags.indexOf(tag);
                return (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 0 20px 0',
                    borderBottom: '1px solid #E3E8EF'
                  }}>
                    <div style={{ width: '84%' }}>
                      <div style={{ display: 'flex' }}>
                        <Field
                          label={'Название тега'}
                          width={"47.5%"}
                          margin={"0 5% 0 0"}
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
                          width={"47.5%"}
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
                      </div>

                      <div style={{ display: 'flex', marginTop: '15px' }}>
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
                          style={{ marginRight: '10px' }}
                        />
                        <Typography className={classes.typographyTitleMini}>Скрыть</Typography>
                      </div>
                    </div>
                    <IconButton style={{ cursor: 'pointer', height: '100%', marginLeft: '7%' }}>
                      <TrashSvg
                        style={{ width: '25px', height: '25px' }}
                        onClick={() => {
                          dispatch(tagsSlice.actions.removeSetTag(setTagIndex));
                        }}
                      />
                    </IconButton>
                  </div>
                )
              }) :
                <Alert
                  width={'84%'}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            {/* Активация и деактивация тега */}
            {currentTag && currentTag.allowedActions.includes("enable") && currentTag.allowedActions.includes("disable") && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  onChecked={async (e) => {
                    if (currentGroup) {
                      dispatch(langSlice.actions.setSnackbar({type: 'loading', value: true, text: 'Загрузка...', time: null }))

                      await dispatch(tagsActions({
                        tagId: currentTag.id,
                        action: currentTag.enabled ? 'disable' : 'enable'
                      }));
                      const groupsData = await dispatch(getTagGroups());
                      // @ts-ignore
                      const groups: TagGroupType[] = groupsData.payload;
                      if (currentGroup.count < 1) {
                        dispatch(tagsSlice.actions.setCurrentTagGroup(groups[0]));
                        const dictsData = await dispatch(getTags({ group: groups[0].group }));
                        // @ts-ignore
                        const tags: DictType[] = dictsData.payload;
                        await dispatch(getTag(tags[0].id));
                      } else {
                        const dictsData = await dispatch(getTags({ group: currentGroup.group }));
                        // @ts-ignore
                        const tags: DictType[] = dictsData.payload;
                        await dispatch(getTag(currentTag.id))
                        dispatch(tagsSlice.actions.setSearchParams(`?group=${currentGroup.group}&id=${currentTag.id}`))
                        history.location.pathname = '/';
                        history.replace(`${language}/${userId}/markuprules/tags?group=${currentGroup.group}&id=${currentTag.id}`)
                      }

                      dispatch(langSlice.actions.setSnackbar({
                        type: 'success',
                        value: true,
                        text: `Словарь ${currentTag.enabled ? 'выключен' : 'включён'}`,
                        time: 1000
                      }))
                    }
                  }}
                  checked={currentTag.enabled}
                  disabled={false}
                />
                <Typography style={{ fontWeight: '700', marginLeft: '10px' }}>
                  {currentTag.enabled ? 'Вкл' : 'Выкл'}
                </Typography>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <LoadingButton
                type={"submit"}
                style={{ marginRight: '24px' }}
                variant={"contained"}
                loading={loading}
                onClick={onClickSaveButton}
              >
                {translate("saveButton_dictDetail", language)}
              </LoadingButton>
              <div style={{ width: '40px', height: '40px' }}>
                <CustomControlSelect
                  disabled={false}
                  optionsPosition={"top"}
                  options={createSelectOptions()}
                  svg={'horizontal'}
                  handleSelectChange={async (e) => {
                    if (e.value === 'delete') {
                      handleDeleteMWOpen();
                    } else if (e.value === 'clone' && currentGroup) {
                      dispatch(langSlice.actions.setSnackbar({
                        type: 'loading', value: true, text: 'Загрузка...', time: null
                      }))
                      await dispatch(tagsActions({
                        tagId: currentTag.id,
                        action: 'clone'
                      }));

                      const groupsData = await dispatch(getTagGroups());
                      // @ts-ignore
                      const groups: GroupType[] = groupsData.payload;
                      dispatch(tagsSlice.actions.setCurrentTagGroup(groups[0]))
                      if (currentGroup.count < 2) {
                        const tagsData = await dispatch(getTags({ group: groups[0].group }))
                        // @ts-ignore
                        const tags: TagType[] = tagsData.payload;
                        await dispatch(getTag(tags[0].id))

                        dispatch(tagsSlice.actions.setSearchParams(`?group=${groups[0].group}&id=${tags[0].id}`));

                        history.location.pathname = `/`;
                        history.replace(`${language}/${userId}/markuprules/tags?group=${groups[0].group}&id=${tags[0].id}`);
                      } else {
                        const tagsData = await dispatch(getTags({ group: currentGroup.group }))
                        // @ts-ignore
                        const tags: TagType[] = tagsData.payload;
                        await dispatch(getTag(tags[0].id))

                        dispatch(tagsSlice.actions.setSearchParams(`?group=${currentGroup.group}&id=${tags[0].id}`));

                        history.location.pathname = `/`;
                        history.replace(`${language}/${userId}/markuprules/tags?group=${currentGroup.group}&id=${tags[0].id}`);
                      }

                      dispatch(langSlice.actions.setSnackbar({
                        type: 'loading', value: false, text: 'Загрузка...', time: null
                      }))
                      dispatch(langSlice.actions.setSnackbar({
                        type: 'success', value: true, text: 'Тег склонирован', time: 2000
                      }))
                    }
                  }}
                />
              </div>
            </div>
          </div>

        </div>

        <ModalWindow
          isMWOpen={deleteMWIsOpen}
          handleMWClose={handleDeleteMWClose}
          text={"Вы правда хотите удалить этот тег?"}
        >
          <div>
            <LoadingButton
              style={{ marginRight: '15px' }}
              loading={buttonLoading}
              variant="contained"
              color="error"
              onClick={async () => {
                if (currentGroup) {
                  setButtonLoading(true);
                  await dispatch(deleteTag(currentTag.id));

                  const groupsData = await dispatch(getTagGroups());

                  if (currentGroup.count < 2) {
                    // @ts-ignore
                    const groups: GroupType[] = groupsData.payload;
                    dispatch(tagsSlice.actions.setCurrentTagGroup(groups[0]));
                    const tagsData = await dispatch(getTags({ group: groups[0].group }));
                    // @ts-ignore
                    const tags: TagType[] = tagsData.payload;
                    await dispatch(getTag(tags[0].id));

                    dispatch(tagsSlice.actions.setSearchParams(`?group=${groups[0].group}&id=${tags[0].id}`))
                    history.location.pathname = '/';
                    history.replace(`${language}/${userId}/markuprules/tags?group=${groups[0].group}&id=${tags[0].id}`)
                  } else {
                    const tagsDicts = await dispatch(getTags({ group: currentGroup.group }));
                    // @ts-ignore
                    const tags: TagType[] = tagsDicts.payload;
                    await dispatch(getTag(tags[0].id));

                    dispatch(tagsSlice.actions.setSearchParams(`?group=${currentGroup.group}&id=${tags[0].id}`))
                    history.location.pathname = '/';
                    history.replace(`${language}/${userId}/markuprules/tags?group=${currentGroup.group}&id=${tags[0].id}`);
                  }
                  handleDeleteMWClose();
                  // setDeleteDictMWIsOpen(false);

                  dispatch(langSlice.actions.setSnackbar({
                    type: "success", text: 'Словарь удален', value: true, time: 2000
                  }))
                }
                setButtonLoading(false);
              }}
            >
              {translate("deleteButton", language)}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="secondary"
            >
              {translate("cancelButton", language)}
            </LoadingButton>
          </div>
        </ModalWindow>

      </div>
    </BlockBox>
  )
};

export default TagDetails;
