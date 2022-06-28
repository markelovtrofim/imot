import * as React from 'react';
import CreatableSelect from 'react-select/creatable';
import {FC, memo, useEffect, useRef, useState} from "react";
import {CriteriasType, RequestDataType} from "../../../store/search/search.types";
import {searchSlice} from "../../../store/search/search.slice";
import {useDispatch} from "react-redux";
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import Select, {components} from "react-select";
import SearchIcon from '@mui/icons-material/Search';
import cn from 'classnames';
import Checkbox from "../Checkbox";
import {templateSlice} from "../../../store/search/template.slice";
import useOnClickOutside from "use-onclickoutside";
import {useAppSelector} from "../../../hooks/redux";
import {translate} from '../../../localizations';
import {RootState} from "../../../store/store";
import { reportsSlice } from '../../../store/reports/reports.slice';

const CrossSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="8" fill="#738094"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M11.1618 4.83785C11.3896 5.06567 11.3896 5.43503 11.1618 5.66285L5.66187 11.1628C5.43406 11.3906 5.06469 11.3906 4.83688 11.1628C4.60906 10.935 4.60906 10.5656 4.83688 10.3378L10.3368 4.83785C10.5646 4.61004 10.934 4.61004 11.1618 4.83785Z"
            fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.83688 4.83785C5.06469 4.61004 5.43406 4.61004 5.66187 4.83785L11.1618 10.3378C11.3896 10.5656 11.3896 10.935 11.1618 11.1628C10.934 11.3906 10.5646 11.3906 10.3368 11.1628L4.83688 5.66285C4.60906 5.43503 4.60906 5.06567 4.83688 4.83785Z"
            fill="white"/>
    </svg>
  );
};

export const OnTopArrow = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M7.39101 4.59994C7.17176 4.83662 6.81636 4.83662 6.59711 4.59994L3.9999 1.79621L1.40271 4.59994C1.18347 4.83662 0.828006 4.83662 0.608766 4.59994C0.389526 4.36325 0.389526 3.97957 0.608766 3.74288L3.60295 0.510518C3.8222 0.273838 4.1776 0.273838 4.39685 0.510518L7.39101 3.74288C7.61026 3.97957 7.61026 4.36325 7.39101 4.59994Z"
            fill="#1B202B"/>
    </svg>
  );
};

export const OnBottomArrow = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M7.39101 0.400166C7.61026 0.636846 7.61026 1.02059 7.39101 1.25725L4.39685 4.48958C4.1776 4.72627 3.8222 4.72627 3.60295 4.48958L0.608766 1.25725C0.389526 1.02059 0.389526 0.636846 0.608766 0.400166C0.828006 0.163486 1.18347 0.163486 1.40271 0.400166L3.9999 3.20392L6.59711 0.400166C6.81636 0.163486 7.17176 0.163486 7.39101 0.400166Z"
            fill="#738094"/>
    </svg>
  );
};


export const CrossWithoutBg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M11.1618 4.83785C11.3896 5.06567 11.3896 5.43503 11.1618 5.66285L5.66187 11.1628C5.43406 11.3906 5.06469 11.3906 4.83688 11.1628C4.60906 10.935 4.60906 10.5656 4.83688 10.3378L10.3368 4.83785C10.5646 4.61004 10.934 4.61004 11.1618 4.83785Z"
            fill="#237804"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.83688 4.83785C5.06469 4.61004 5.43406 4.61004 5.66187 4.83785L11.1618 10.3378C11.3896 10.5656 11.3896 10.935 11.1618 11.1628C10.934 11.3906 10.5646 11.3906 10.3368 11.1628L4.83688 5.66285C4.60906 5.43503 4.60906 5.06567 4.83688 4.83785Z"
      />
    </svg>
  );
};

// TYPES BLOCK
type SelectPropsType = {
  criteriaFull: CriteriasType,
  criteriaCurrent: CriteriasType | RequestDataType,
  isDefaultCriteria: boolean,
  block?: string,
  index?: {arrayIndex: number, fieldIndex: number},
};


const SearchSelect: FC<SelectPropsType> = ({
                                             criteriaFull,
                                             criteriaCurrent,
                                             isDefaultCriteria,
                                             block,
                                             index,
                                           }) => {
  // STYLES BLOCK
  const useStyles = makeStyles(({
    selectBox: {
      display: 'flex !important',
      alignItems: 'center',
      cursor: 'pointer',
      width: '75%'
    },
    selectItem: {},
    selectMenuListInput: {
      width: "228px",
      margin: '16px 24px',
      outline: 'none',
      backgroundColor: '#F8FAFC',
      border: '1px solid #E3E8EF',
      borderRadius: '5px',
      padding: '10px 30px 10px 12px',
      color: '#738094',
      fontSize: '14px',
      position: 'relative'
    },
    selectMenuListInputIcon: {
      position: 'absolute',
      left: '262px',
      top: '23px',
      color: '#738094',
      width: '11px'
    },
    selectOption: {
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 24px'
    },
    selectArrow: {
      marginRight: '10px'
    },
    selectArrowOnArrow: {
      marginBottom: '5px'
    },
    selectCheckBox: {
      '&.MuiCheckbox-root': {
        backgroundColor: '#E3E8EF !important'
      }
    },
    selectTag: {
      height: '22px !important',
      cursor: 'pointer !important',
      fontFamily: 'Inter, sans-serif !important',
      border: '2px solid #E9ECEF !important',
      borderRadius: '5px !important',
      margin: '2.5px !important',
      padding: '0 5px',
      backgroundColor: '#E9ECEF !important',
      color: `#000000 !important`,
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
    },
    selectSelectBox: {
      position: 'relative',
      width: '100%'
    },
    selectPlaceholder: {
      // @ts-ignore
      position: 'absolute !important',
      left: '11px !important',
      top: '9px !important'
    }
  }));
  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      width: '322px',
      height: '400px !important',
      overflow: 'hidden',
      overflowY: 'auto',
      zIndex: '1000',
      '&::-webkit-scrollbar': {
        width: '4px',
        backgroundColor: '#f1f1f1',
        outline: 'none',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#A3AEBE',
        height: '50px',
        borderRadius: '10px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#9298A1'
      }
    }),
    option: (provided: any, state: any) => ({
      cursor: 'pointer',
      padding: '10px 24px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      color: '#000',
      "&:hover": {
        backgroundColor: '#F8FAFC',
        color: '#722ED1'
      }
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      cursor: 'pointer',
      minHeight: '38px',
      border: '1px solid #E3E8EF',
      boxShadow: 'none',
      borderColor: menuIsOpen ? '#722ED1 !important' : '#E3E8EF !important',
      "&:hover": {
        borderColor: '#E3E8EF'
      },
      minWidth: '70px',
      borderRadius: '5px',
      backgroundColor: '#F8FAFC'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#738094',
      '&:hover': {
        color: '#738094'
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: '14px',
      color: '#738094',
      fontFamily: 'Inter, sans-serif'
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      '& svg path:hover': {
        fill: 'hsl(0, 0%, 80%)'
      },
      padding: '0'
    }),
    multiValue: (provided: any) => ({
      ...provided,
      height: '24px !important',
      cursor: 'pointer !important',
      fontFamily: 'Inter, sans-serif !important',
      border: '2px solid #E9ECEF !important',
      borderRadius: '5px !important',
      margin: '2.5px !important',
      backgroundColor: '#E9ECEF !important',
      color: `#000000 !important`,
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      backgroundColor: '#E9ECEF !important',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      display: 'flex',
      paddingRight: '20px',

    })
  }
  const classes = useStyles();


  // COMPONENTS BLOCK
  const CustomMultiValueLabel = memo((props: any) => {
    return (
      <components.MultiValueLabel {...props} />
    )
  });
  const CustomMultiValueRemove = memo((props: any) => {
    return (
      <components.MultiValueRemove {...props}>
        <CrossWithoutBg fill={'000'}/>
      </components.MultiValueRemove>
    )
  });
  const LimitedChipsContainer = ({children, hasValue, ...props}: any) => {
    if (!hasValue) {
      return (
        <components.ValueContainer {...props}>
          {children}
        </components.ValueContainer>
      );
    }
    let CHIPS_LIMIT = 3;
    const [chips, otherChildren] = children;
    if (chips.length > CHIPS_LIMIT) {
      CHIPS_LIMIT = 1;
    }
    const overflowCounter = chips.slice(CHIPS_LIMIT).length;
    const displayChips = chips.slice(overflowCounter, overflowCounter + CHIPS_LIMIT);
    return (
      <components.ValueContainer {...props}>
        {displayChips}
        {overflowCounter > 0 &&
        <div className={classes.selectTag}>
          +{overflowCounter}
        </div>}
      </components.ValueContainer>
    );
  };
  const CustomInd = memo((props: any) => {
    if (menuIsOpen) {
      return <div className={cn(classes.selectArrowOnArrow, classes.selectArrow)}><OnTopArrow/></div>
    }
    return <OnBottomArrow className={classes.selectArrow}/>
  });
  const CustomOption = memo((props: any) => {
    if (props.children.length > 0) {
      return <div>
        <components.Option {...props} className={classes.selectOption}>
          {props.children}
          <Checkbox
            disableRipple
            checked={criteriaCurrent.values.indexOf(props.children) >= 0}
          />
        </components.Option>
      </div>
    }
    return null;
  })

  const CustomMenuList = memo(({selectProps, ...props}: any) => {
    const selectSearch = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (selectSearch.current && criteriaFull.selectType !== 'multiString') {
        selectSearch.current.focus();
      }
    }, [setMenuIsOpen])

    const {onInputChange, inputValue, onMenuInputFocus} = selectProps;
    return (
      <div>
        <div>
          <input
            ref={selectSearch}
            className={classes.selectMenuListInput}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            type="text"
            value={inputValue}
            onChange={(e) =>
              onInputChange(e.currentTarget.value, {
                action: "input-change"
              })
            }
            onMouseDown={(e) => {
              e.stopPropagation();
              // @ts-ignore
              e.target.focus();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              // @ts-ignore
              e.target.focus();
            }}
            onFocus={onMenuInputFocus}
            placeholder={translate('searchTag', language)}
          />
          <SearchIcon className={classes.selectMenuListInputIcon}/>
        </div>
        <div style={{height: '400px !important'}}>
          {props.children}
        </div>
      </div>
    );
  });

  // LOGIC BLOCK
  // диспатч
  const dispatch = useDispatch();
  const {language} = useAppSelector((state: RootState) => state.lang);

  // открыте и закрытие менюшки.
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  // удаление критерии.
  const removeCriteria = () => {
    dispatch(templateSlice.actions.setCurrentTemplate(null));
    dispatch(searchSlice.actions.removeActiveCriteria(criteriaFull));
  };

  // выполняется когда меняется значение.
  const handleSelectChange = (event: any) => {
    dispatch(templateSlice.actions.setCurrentTemplate(null));
    const eventConverter = () => {
      let result = [];
      for (let i = 0; i < event.length; i++) {
        result.push(event[i].value);
      }
      return result;
    };

    const eventConverterResult = eventConverter();
    if (block === 'reports') {
      dispatch(searchSlice.actions.setActiveCriteriaReportsValues({key: criteriaFull.key, values: [...eventConverterResult]}));
    }  else if (block === 'reports-column') {
      dispatch(searchSlice.actions.setActiveCriteriaReportsColumnValues({key: criteriaFull.key, values: [...eventConverterResult]}));
    }  else if (index) {
      dispatch(reportsSlice.actions.setActiveCriteriaValuesColumn({arrayIndex: index.arrayIndex, fieldIndex: index.fieldIndex, criteria: {key: criteriaFull.key, values: [...eventConverterResult]}}))
      console.log(index);
    }  else {
      if (isDefaultCriteria) {
        dispatch(searchSlice.actions.setDefaultCriteriaValues({key: criteriaFull.key, values: [...eventConverterResult]}));
      } else {
        dispatch(searchSlice.actions.setActiveCriteriaValues({key: criteriaFull.key, values: [...eventConverterResult]}));
      }
    }


  };

  const converter = (state: any) => {
    let local: { value: string, label: string }[] = [];
    if (state) {
      for (let i = 0; i < state.values.length; i++) {
        local.push({value: state.values[i], label: state.values[i]});
      }
    }
    return local
  };
  const converterCurrentResult = converter(criteriaCurrent);
  const converterFullResult = converter(criteriaFull);

  // костылечек для загрытия селектов
  useEffect(() => {
    document.addEventListener("mousedown", () => setMenuIsOpen(false));
    return () => {
      document.removeEventListener("mousedown", () => setMenuIsOpen(false));
    };
  }, []);

  return (
    <div className={classes.selectBox}>
      {criteriaFull.selectType === "multiString" ?
        <div className={classes.selectSelectBox} onClick={() => setMenuIsOpen(true)}>
          <CreatableSelect
            closeMenuOnSelect={false}
            isMulti
            createOptionPosition={'first'}
            styles={customStyles}
            formatCreateLabel={(str) => str}
            value={converterCurrentResult}
            onChange={handleSelectChange}

            tabIndex={0}
            isValidNewOption={(str) => true}
            options={converterFullResult}
            hideSelectedOptions={false}
            components={{
              MenuList: CustomMenuList,
              Option: CustomOption,
              DropdownIndicator: CustomInd,
              IndicatorSeparator: () => null,
              MultiValueLabel: CustomMultiValueLabel,
              MultiValueRemove: CustomMultiValueRemove,
            }}
            placeholder={translate('allTags', language)}
            menuIsOpen={menuIsOpen}

          />
        </div> :
        <div className={classes.selectSelectBox}  onClick={() => setMenuIsOpen(true)}>
          <Select
            openMenuOnFocus={true}
            menuIsOpen={menuIsOpen}
            className={classes.selectItem}
            name="color"
            placeholder={translate('allTags', language)}
            components={{
              MenuList: CustomMenuList,
              Option: CustomOption,
              DropdownIndicator: CustomInd,
              IndicatorSeparator: () => null,
              MultiValueLabel: CustomMultiValueLabel,
              MultiValueRemove: CustomMultiValueRemove,
              ValueContainer: LimitedChipsContainer,
            }}
            onChange={handleSelectChange}
            isClearable={true}
            closeMenuOnSelect={false}
            styles={customStyles}
            isMulti
            isSearchable={false}
            value={converterCurrentResult}
            options={converterFullResult}
            hideSelectedOptions={false}
          />
          {converterCurrentResult.length < 1 &&
          <Typography className={classes.selectPlaceholder}>{translate('allTags', language)}</Typography>
          }
        </div>
      }
    </div>
  );
};

export default SearchSelect;
