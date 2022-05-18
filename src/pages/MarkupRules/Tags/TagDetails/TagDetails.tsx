import React, {useEffect, useState, FC} from 'react';
import {InputBase, Typography} from "@mui/material";
import {BlockBox} from "../../../../components/common";
import Field from "../../../../components/common/FIeld";
import TextSelect from "../../../../components/common/Selects/TextSelect/TextSelect";
import {useTagDetailsStyles} from './TagDetails.jss';
import {useAppSelector} from "../../../../hooks/redux";
import {getAllGlobalTagFilters, tagsSlice} from "../../../../store/tags/tags.slice";
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
      priority: '' as string | number,

      fragmentsInputArray: [] as any[]
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

  if (!currentTag) {
    return (
      <BlockBox padding={'0'} height={'100%'}>
        <div style={{position: 'relative', height: '100%'}}>
          <div style={{position: 'absolute', top: '30%', left: '32%'}}>
            <img src={Preloader} alt=""/>
          </div>
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
                        <div style={{display: 'flex'}}>
                          <div style={{width: '5%', textAlign: 'center', paddingTop: '5px'}}>
                            <Typography>{arrayIndex + 1}.</Typography>
                          </div>
                          <div style={{width: '100%'}}>
                            {displayFragment.map((fragmentField) => {
                              const fragmentFieldIndex = displayFragment.indexOf(fragmentField);
                              if (fragmentField.visible) {
                                return (
                                  <div style={{width: '100%'}}>
                                    {
                                      (fragmentField.selectType === 'multiValue' &&
                                        <div style={{width: '100%'}}>
                                          <Typography>{fragmentField.title}</Typography>
                                          <ContainedSelect
                                            width={'60%'}
                                            height={'30px'}
                                            onSelectChange={(event: any) => {
                                              dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                arrayIndex: arrayIndex,
                                                fieldIndex: fragmentFieldIndex,
                                                value: event
                                              }))
                                            }}
                                            // @ts-ignore
                                            options={fragmentField.options}
                                            value={fragmentField.value}
                                          />
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
                                        <div style={{display: 'flex', width: '100%'}}>
                                          <Typography>{fragmentField.title}</Typography>
                                          <CustomCheckbox/>
                                        </div>
                                      ) ||
                                      (fragmentField.selectType === 'input' &&
                                        <div style={{width: '100%'}}>
                                          <Field
                                            label={fragmentField.title}
                                            width={"60%"}
                                          >
                                            <InputBase
                                              onChange={(event: any) => {
                                                dispatch(tagsSlice.actions.setFragmentFieldValue({
                                                  arrayIndex: arrayIndex,
                                                  fieldIndex: fragmentFieldIndex,
                                                  value: event.target.value
                                                }));
                                              }}
                                              className={classes.tdTagNameInput}
                                              type="text"
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
                  return (
                    <div>
                      <Field
                        label={'Название тега'}
                        width={"60%"}
                      >
                        <InputBase
                          value={tag.name}
                          className={classes.tdTagNameInput}
                          type="text"
                        />
                      </Field>
                      <Field
                        label={'Значение тега'}
                        width={"60%"}
                      >
                        <InputBase
                          value={tag.value}
                          className={classes.tdTagNameInput}
                          type="text"
                        />
                      </Field>
                      <div style={{display: 'flex'}}>
                        <Checkbox checked={tag.visible} style={{marginRight: '10px'}}/>
                        <Typography className={classes.typographyTitleMini}>Скрыть</Typography>
                      </div>
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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <LoadingButton
            type={"submit"}
            style={{marginRight: '24px'}}
            variant={"contained"}
          >
            {translate("saveButton_dictDetail", language)}
          </LoadingButton>
          <div style={{width: '40px', height: '40px'}}>
          </div>
        </div>

      </div>
    </BlockBox>
  );
};

export default TagDetails;