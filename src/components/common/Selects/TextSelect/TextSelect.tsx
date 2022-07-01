import React, {FC, useEffect, useState, memo} from 'react';
import Select, {components} from "react-select";
import {useMuiTextSelectStyles} from "./TextSelect.jss";
import {createTextSelectStyles} from './TextSelect.jss';
import {CrossSvgWithBg, OnBottomArrow, OnTopArrow, PlusSvg, MinusSvg} from "./TextSelect.svg";
import {templateSlice} from "../../../../store/search/template.slice";
import {searchSlice} from "../../../../store/search/search.slice";
import {useDispatch} from "react-redux";

// TYPES BLOCK
type SelectValueFormat = {
  value: any | null, label: string | null
};

type TextSelectPropsType = {
  value: SelectValueFormat | null,
  handleValueChange: (event: any) => void,
  options: SelectValueFormat[],

  iconPosition?: 'left' | 'right',
  icon?: any,

  customControl: any,

  notClose?: boolean,
  menuPosition: 'left' | 'right',

  width?: string,
  height?: string,
  ifArrowColor?: string,

  name: string
};


const TextSelect: FC<TextSelectPropsType> = (
  {
    value,
    handleValueChange,
    options,
    icon,
    iconPosition,
    customControl,
    notClose,
    menuPosition,
    width,
    height,
    ifArrowColor,

    name
  }
) => {
  const customSelectStyles = createTextSelectStyles({width, menuPosition});
  const classes = useMuiTextSelectStyles({arrowColor: ifArrowColor});
  const dispatch = useDispatch();

  // COMPONENTS BLOCK
  const Arrow = memo(() => {
    if (isMenuOpen) {
      return <div className={classes.selectArrowOnTopBox}>
        <OnTopArrow className={classes.selectArrow}/>
      </div>
    }
    return <OnBottomArrow className={classes.selectArrow}/>
  });
  const Control: FC<any> = ({children, ...props}) => (
    <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', margin: '2px'}}>
      <div style={{display: 'flex', alignItems: 'center'}} onClick={handleSelectClick}>
        {iconPosition === 'left' ? icon ? icon : <Arrow/> : null}
        {customControl}
        {iconPosition === 'right' ? icon ? icon : <Arrow/> : null}
      </div>
      {name === 'templatesSelect' && value &&
      <CrossSvgWithBg
        style={{fill: '#722ED1', cursor: 'pointer', marginLeft: '15px'}}
        onClick={() => {
          dispatch(templateSlice.actions.setCurrentTemplate(null));
          dispatch(searchSlice.actions.setClearDefaultCriteriasValues(null));
          dispatch(searchSlice.actions.removeAllActiveCriterias(null));
        }}
      />
      }
    </div>
  );
  const CustomMenuList = memo(({selectProps, ...props}: any) => {
    return (
      <div style={{height: `${height ? height : 'auto'}`}}>
        {props.children}
      </div>
    );
  });
  const CustomOption: FC<any> = ({children, ...props}) => {
    return (
      <components.Option {...props}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
          {children}
          {props.data.icon === 'plus' ? <PlusSvg/> : <MinusSvg/>}
        </div>          
      </components.Option>
    );
  };

  // LOGIC BLOCK

  // выполняется когда меняется значение.
  const handleSelectChange = (event: any) => {
    if (notClose) {
      handleValueChange(event);
    } else {
      handleValueChange(event);
      setIsMenuOpen(false);
    }
  };

  // выполняется клике на селекта.
  const handleSelectClick = () => {
    setIsMenuOpen(true);
  };

  // открыте и закрытие менюшки.
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // костылечек для загрытия менюшки.
  useEffect(() => {
    document.addEventListener("mousedown", () => setIsMenuOpen(false));
    return () => {
      document.removeEventListener("mousedown", () => setIsMenuOpen(false));
    };
  }, []);


  return (
    <div className={classes.selectBox}>
      <Select
        styles={customSelectStyles}
        options={options}
        value={value}
        openMenuOnFocus={true}
        menuIsOpen={isMenuOpen}
        isClearable={true}
        closeMenuOnSelect={false}
        isSearchable={false}
        hideSelectedOptions={false}
        onChange={handleSelectChange}
        components={{
          IndicatorsContainer: () => null,
          Control: Control,
          MenuList: CustomMenuList,
          Option: CustomOption,
        }}
      />
    </div>
  );
};

export default TextSelect;
