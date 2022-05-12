import React, {useEffect} from 'react';
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

const TrashSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.9375 2.25C6.9375 1.93934 7.18934 1.6875 7.5 1.6875H10.5C10.8106 1.6875 11.0625 1.93934 11.0625 2.25V2.8125H14.25C14.5606 2.8125 14.8125 3.06434 14.8125 3.375C14.8125 3.68566 14.5606 3.9375 14.25 3.9375H3.75C3.43934 3.9375 3.1875 3.68566 3.1875 3.375C3.1875 3.06434 3.43934 2.8125 3.75 2.8125H6.9375V2.25Z"
        fill="#F5222D"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.68118 5.95858C4.70227 5.76868 4.8628 5.625 5.05388 5.625H12.9487C13.1397 5.625 13.3003 5.76868 13.3213 5.95858L13.4714 7.3096C13.742 9.74483 13.742 12.2026 13.4714 14.6378L13.4566 14.7708C13.3581 15.6577 12.6707 16.3649 11.787 16.4887C9.93883 16.7474 8.06368 16.7474 6.21556 16.4887C5.33178 16.3649 4.64439 15.6577 4.54584 14.7708L4.53106 14.6378C4.26048 12.2026 4.26048 9.74483 4.53106 7.3096L4.68118 5.95858ZM8.06375 8.55C8.06375 8.23935 7.8119 7.9875 7.50125 7.9875C7.19059 7.9875 6.93875 8.23935 6.93875 8.55V13.8C6.93875 14.1107 7.19059 14.3625 7.50125 14.3625C7.8119 14.3625 8.06375 14.1107 8.06375 13.8V8.55ZM11.0638 8.55C11.0638 8.23935 10.8119 7.9875 10.5013 7.9875C10.1906 7.9875 9.93875 8.23935 9.93875 8.55V13.8C9.93875 14.1107 10.1906 14.3625 10.5013 14.3625C10.8119 14.3625 11.0638 14.1107 11.0638 13.8V8.55Z"
            fill="#FF4D4F"/>
    </svg>
  );
};

const PlusSvg = (props: any) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd"
          d="M8.00034 2.66602C8.38454 2.66602 8.69599 2.97747 8.69599 3.36167V12.637C8.69599 13.0212 8.38454 13.3327 8.00034 13.3327C7.61614 13.3327 7.30469 13.0212 7.30469 12.637V3.36167C7.30469 2.97747 7.61614 2.66602 8.00034 2.66602Z"
          fill="#73D13D"/>
    <path fillRule="evenodd" clipRule="evenodd"
          d="M2.66602 8.00034C2.66602 7.61614 2.97747 7.30469 3.36167 7.30469H12.637C13.0212 7.30469 13.3327 7.61614 13.3327 8.00034C13.3327 8.38454 13.0212 8.69599 12.637 8.69599H3.36167C2.97747 8.69599 2.66602 8.38454 2.66602 8.00034Z"
          fill="#73D13D"/>
  </svg>
)

const TagDetails = () => {

  const classes = useTagDetailsStyles();
  const dispatch = useDispatch();

  const currentTag = useAppSelector(state => state.tags.currentTag);

  const allGlobalFilterCriterias = useAppSelector(state => state.tags.allGlobalFilterCriterias);
  const activeGlobalFilterCriterias = useAppSelector(state => state.tags.activeGlobalFilterCriterias);
  const defaultGlobalFilterCriterias = useAppSelector(state => state.tags.defaultGlobalFilterCriterias);

  const activeFragments = useAppSelector(state => state.tags.activeFragments);

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
    if (isDefault) {
      dispatch(tagsSlice.actions.setDefaultGlobalFilterCriteriaValues({
        key: criteriaFull.key,
        values: [...eventConverterResult]
      }))
    } else {
      dispatch(tagsSlice.actions.setActiveGlobalFilterCriteriaValues({
        ...criteriaFull,
        values: [...eventConverterResult]
      }));
    }
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

  const selectFragmentsConverter = (values: any) => {
    if (values) {
      let local: { value: any, label: string }[] = [];
      for (let i = 0; i < values.length; i++) {
        local.push({value: values[i], label: values[i].label});
      }
      return local;
    }
    return [];
  };

  return (
    <BlockBox padding={'0 24px 24px 24px'} height={'100%'}>
      <div className={classes.tdWrapper}>

        {/* Шапка */}
        <div>
          <div className={classes.tdNameAdnPriority}>
            {/* Название тега */}
            <Field
              label={"Название тега"}
              width={"60%"}
            >
              <InputBase
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
                className={classes.tdPriorityInput}
                type="text"
              />
            </Field>
          </div>
          {/* Название группы */}
          <Field
            label={"Название группы тега"}
            width={"60%"}
          >
            <InputBase
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
                  })
                  if (criteriaFull) {
                    return (
                      <div>
                        <Typography className={classes.typographyTitleMini}>{criteriaFull.title}</Typography>
                        <div style={{display: 'flex'}}>
                          <CustomSelect
                            value={selectConverter(currentCriteria.values)}
                            options={selectConverter(criteriaFull.values, currentCriteria.values)}
                            selectType={'multiString'}

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
                  iconType={'warning'}
                  text={'У этой критерии нет глобальных фильтров'}
                />
                }
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
                            <Typography variant={'h6'}>{arrayIndex+ 1}</Typography>
                          </div>
                          <div>
                            {displayFragment.map((fragmentField) => {
                              const fragmentFieldIndex = displayFragment.indexOf(fragmentField);
                              if (fragmentField.visible) {
                                return (
                                  <div>
                                    <Typography>{fragmentField.title}</Typography>
                                    <ContainedSelect
                                      width={'200px'}
                                      onSelectChange={(event: any) => {
                                        dispatch(tagsSlice.actions.setFragmentFieldValue({arrayIndex: arrayIndex, fieldIndex: fragmentFieldIndex, value: event}))
                                      }}
                                      // @ts-ignore
                                      options={fragmentField.options}
                                      value={fragmentField.value}
                                    />
                                  </div>
                                )
                              }
                            })}
                            <TextSelect
                              value={null}
                              handleValueChange={(event: any) => {
                                dispatch(tagsSlice.actions.setFragmentField({
                                  index: activeFragments.indexOf(displayFragment),
                                  value: event.value
                                }));
                              }}
                              options={selectFragmentsConverter(displayFragment)}
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
                  <>У этого тега нет фрагментов </>
                }
              </div>
            </div>
          </div>
          <div>
            <button
              style={{marginTop: '10px'}}
              onClick={() => {
                if (currentTag) {
                  dispatch(tagsSlice.actions.setFragment(null))
                }
              }}
            >
              add fragment
            </button>
          </div>
        </div>

      </div>

    </BlockBox>
  );
};

export default TagDetails