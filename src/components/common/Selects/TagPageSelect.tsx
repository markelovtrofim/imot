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
import {tagsSlice} from "../../../store/tags/tags.slice";
import {GlobalFilterItem, GlobalFilterItemDetailed} from "../../../store/tags/tags.types";
import {useAppSelector} from "../../../hooks/redux";


const CrossSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.9375 2.25C6.9375 1.93934 7.18934 1.6875 7.5 1.6875H10.5C10.8106 1.6875 11.0625 1.93934 11.0625 2.25V2.8125H14.25C14.5606 2.8125 14.8125 3.06434 14.8125 3.375C14.8125 3.68566 14.5606 3.9375 14.25 3.9375H3.75C3.43934 3.9375 3.1875 3.68566 3.1875 3.375C3.1875 3.06434 3.43934 2.8125 3.75 2.8125H6.9375V2.25Z" fill="#F5222D"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.68118 5.95858C4.70227 5.76868 4.8628 5.625 5.05388 5.625H12.9487C13.1397 5.625 13.3003 5.76868 13.3213 5.95858L13.4714 7.3096C13.742 9.74483 13.742 12.2026 13.4714 14.6378L13.4566 14.7708C13.3581 15.6577 12.6707 16.3649 11.787 16.4887C9.93883 16.7474 8.06368 16.7474 6.21556 16.4887C5.33178 16.3649 4.64439 15.6577 4.54584 14.7708L4.53106 14.6378C4.26048 12.2026 4.26048 9.74483 4.53106 7.3096L4.68118 5.95858ZM8.06375 8.55C8.06375 8.23935 7.8119 7.9875 7.50125 7.9875C7.19059 7.9875 6.93875 8.23935 6.93875 8.55V13.8C6.93875 14.1107 7.19059 14.3625 7.50125 14.3625C7.8119 14.3625 8.06375 14.1107 8.06375 13.8V8.55ZM11.0638 8.55C11.0638 8.23935 10.8119 7.9875 10.5013 7.9875C10.1906 7.9875 9.93875 8.23935 9.93875 8.55V13.8C9.93875 14.1107 10.1906 14.3625 10.5013 14.3625C10.8119 14.3625 11.0638 14.1107 11.0638 13.8V8.55Z" fill="#FF4D4F"/>
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
  criteriaFull: GlobalFilterItemDetailed,
  criteriaCurrent: GlobalFilterItemDetailed | GlobalFilterItem,
  isDefaultCriteria: boolean,

  width: string
};


const SearchSelect: FC<SelectPropsType> = (
  {
    criteriaFull,
    criteriaCurrent,
    isDefaultCriteria,

    width
  }) => {
  // STYLES BLOCK
  const useStyles = makeStyles(({
    selectBox: {
      display: 'flex !important',
      alignItems: 'center',
      cursor: 'pointer',
      width: `100% !important`,
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
      width: `${width} !important`
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
      minWidth: `100px !important`,
      borderRadius: '5px',
      backgroundColor: '#F8FAFC'
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
  const allCriterias = useAppSelector(state => state.tags.allGlobalFilterCriterias);


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
    const {onInputChange, inputValue, onMenuInputFocus} = selectProps;

    const selectSearch = useRef<HTMLInputElement | null>(null);


    useEffect(() => {
      if (selectSearch.current && criteriaFull.selectType !== 'multiString') {
        selectSearch.current.focus();
      }
    }, [setMenuIsOpen])

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
            placeholder="Поиск"
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

  // открыте и закрытие менюшки.
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  // удаление критерии.
  const removeCriteria = () => {
    dispatch(tagsSlice.actions.removeActiveGlobalFilterCriteria(criteriaFull));
  };

  // добавление критерии.
  const handleSelectChange = (event: any) => {
    const eventConverter = () => {
      let result = [];
      for (let i = 0; i < event.length; i++) {
        result.push(event[i].value);
      }
      return result;
    };

    const eventConverterResult = eventConverter();
    if (isDefaultCriteria) {
      dispatch(tagsSlice.actions.setDefaultGlobalFilterCriteriaValues({key: criteriaFull.key, values: [...eventConverterResult]}))
    } else {
      dispatch(tagsSlice.actions.setActiveGlobalFilterCriteriaValues({...criteriaFull, values: [...eventConverterResult]}));
    }
  };

  const converter = (state: any) => {
    let local: { value: string, label: string }[] = [];
    for (let i = 0; i < state.values.length; i++) {
      local.push({value: state.values[i], label: state.values[i]});
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
            placeholder={'Все'}
            menuIsOpen={menuIsOpen}
          />
        </div> :
        <div className={classes.selectSelectBox} onClick={() => setMenuIsOpen(true)}>
          <Select
            openMenuOnFocus={true}
            menuIsOpen={menuIsOpen}
            className={classes.selectItem}
            name="color"
            placeholder={'Все'}
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
          <Typography className={classes.selectPlaceholder}>Все</Typography>
          }
        </div>
      }
      {isDefaultCriteria
        ? null
        : <CrossSvg onClick={removeCriteria} style={{cursor: 'pointer', marginLeft: '8px'}}/>
      }
    </div>
  );
};

export default SearchSelect;
