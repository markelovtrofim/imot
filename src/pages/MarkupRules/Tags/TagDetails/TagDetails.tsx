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
import TagPageSelect from "../../../../components/common/Selects/TagPageSelect";
import CustomSelect from "../../../../components/common/Selects/CustomSelect/CustomSelect";

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
        <div style={{width: '100%'}}>
          <Typography className={classes.typographyTitle}>Глобальные настройки тега</Typography>
          <div>
            <div>
              <div>
                {defaultGlobalFilterCriterias.length > 0 &&
                defaultGlobalFilterCriterias.map((currentCriteria) => {

                  const criteriaFull = allGlobalFilterCriterias.find((fullCriteria) => {
                    return currentCriteria.key === fullCriteria.key;
                  })
                  if (criteriaFull) {
                    return (
                      <div>
                        <Typography className={classes.typographyTitleMini}>{criteriaFull.title}</Typography>
                        <div style={{display: 'flex'}}>
                          {criteriaFull &&
                          <TagPageSelect
                            criteriaFull={criteriaFull}
                            criteriaCurrent={currentCriteria}
                            isDefaultCriteria={true}
                            width={'60%'}
                          />
                          }
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
              <div>
                {activeGlobalFilterCriterias.map((currentCriteria) => {

                  const criteriaFull = allGlobalFilterCriterias.find((fullCriteria) => {
                    return currentCriteria.key === fullCriteria.key;
                  })
                  return (
                    <div>
                      <Typography className={classes.typographyTitleMini}>{currentCriteria.title}</Typography>
                      <div style={{display: 'flex'}}>
                        {criteriaFull &&
                        <>
                          <TagPageSelect
                            criteriaFull={criteriaFull}
                            criteriaCurrent={currentCriteria}
                            isDefaultCriteria={false}
                            width={'60%'}
                          />
                          <CustomSelect
                            addValueHandler={}
                          />
                        </>
                        }
                      </div>
                    </div>
                  )
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
        <div style={{display: 'flex'}}>
          <div style={{width: '5%', textAlign: 'center'}}>
            <Typography variant={'h6'}>1.</Typography>
          </div>
          <div>
            <div>
              {activeFragments.length > 0 ?
                <div>
                  {activeFragments.map((displayFragment) => {
                    return <>
                      {displayFragment.map((fragmentField) => {
                        if (fragmentField.visible) {
                          return (
                            <TagPageSelect
                              criteriaFull={{values: fragmentField.options, selectType: fragmentField.selectType}}
                              criteriaCurrent={{values: fragmentField.value, selectType: fragmentField.selectType}}
                              isDefaultCriteria={fragmentField.key === 'phrasesAndDicts'}
                              width={'100%'}
                            />
                          )
                        }
                      })}
                    </>
                  })}
                </div>
                :
                <div>У этого тега нет фрагментов </div>
              }
            </div>
            <div>

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
                    <Typography className={classes.typographyTitleMini}>Добавить правило</Typography>
                  </div>
                }
                menuPosition={'left'}
                name={'tagsGlobalSelect'}
              />
            </div>
          </div>
        </div>

      </div>

    </BlockBox>
  );
};

export default TagDetails