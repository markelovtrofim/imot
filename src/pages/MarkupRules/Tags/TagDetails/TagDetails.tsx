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
import {searchSlice} from "../../../../store/search/search.slice";

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

  const testOptions = [
    {value: 'test', label: 'test'},
    {value: 'test', label: 'test'},
    {value: 'test', label: 'test'}
  ];

  const classes = useTagDetailsStyles();
  const dispatch = useDispatch();

  const allGlobalFilterCriterias = useAppSelector(state => state.tags.allGlobalFilterCriterias);
  const activeGlobalFilterCriterias = useAppSelector(state => state.tags.activeGlobalFilterCriterias);
  const currentTag = useAppSelector(state => state.tags.currentTag);

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

  // select functions.
  // добавление критерия.
  function addValueHandler(event: any, isDefaultCriteria: boolean, fullCriteria: any) {
    const eventConverter = () => {
      let result = [];
      for (let i = 0; i < event.length; i++) {
        result.push(event[i].value);
      }
      return result;
    };

    const eventConverterResult = eventConverter();

    debugger

    if (isDefaultCriteria) {
      dispatch(searchSlice.actions.setDefaultCriteriaValues({key: fullCriteria.key, values: [...eventConverterResult]}))
    } else {
      dispatch(tagsSlice.actions.setActiveGlobalFilterCriteriasValues({...fullCriteria, values: [...eventConverterResult]}));
    }
  }


  return (
    <BlockBox padding={'0 24px 24px 24px'}>
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

      <div style={{width: '100%'}}>
        <Typography className={classes.typographyTitle}>Глобальные настройки тега</Typography>
        <div>
          {activeGlobalFilterCriterias.length > 0 ?
            <div>
              {activeGlobalFilterCriterias.map((criteria) => {
                const criteriaKey = criteria.key.slice(4);
                return (
                  <div>
                    <Typography className={classes.typographyTitleMini}>{criteria.title}</Typography>
                    <div style={{display: 'flex'}}>
                      <CustomSelect
                        addValueHandler={addValueHandler}
                        // removeValuesHandler={}
                        // canBeDeleted={}
                        // activeCriteria={}
                        // fullCriteria={}
                        // width={}
                        // height={}
                      />
                    </div>
                  </div>
                )
              })}
            </div> :
            <Alert
              iconType={'info'}
              text={'У этой критерии нет глобальных фильтров'}
            />
          }
        </div>
      </div>
      <TextSelect
        value={null}
        handleValueChange={(event: any) => {
          dispatch(tagsSlice.actions.setActiveGlobalFilterCriterias(event.value));
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

    </BlockBox>
  );
};

export default TagDetails