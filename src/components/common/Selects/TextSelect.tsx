import React, {FC, useEffect, useState, memo} from 'react';
import Select, {components} from "react-select";
import {makeStyles} from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import {useDispatch} from "react-redux";
import {templateSlice} from "../../../store/search/template.slice";
import {searchSlice} from "../../../store/search/search.slice";


// SVG BLOCK
const OnTopArrow = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.39101 4.59994C7.17176 4.83662 6.81636 4.83662 6.59711 4.59994L3.9999 1.79621L1.40271 4.59994C1.18347 4.83662 0.828006 4.83662 0.608766 4.59994C0.389526 4.36325 0.389526 3.97957 0.608766 3.74288L3.60295 0.510518C3.8222 0.273838 4.1776 0.273838 4.39685 0.510518L7.39101 3.74288C7.61026 3.97957 7.61026 4.36325 7.39101 4.59994Z"
      />
    </svg>
  );
};

const OnBottomArrow = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.39101 0.400166C7.61026 0.636846 7.61026 1.02059 7.39101 1.25725L4.39685 4.48958C4.1776 4.72627 3.8222 4.72627 3.60295 4.48958L0.608766 1.25725C0.389526 1.02059 0.389526 0.636846 0.608766 0.400166C0.828006 0.163486 1.18347 0.163486 1.40271 0.400166L3.9999 3.20392L6.59711 0.400166C6.81636 0.163486 7.17176 0.163486 7.39101 0.400166Z"
      />
    </svg>
  );
};

const PlusSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M5.99941 0C6.43163 0 6.78201 0.350386 6.78201 0.782609V11.2174C6.78201 11.6496 6.43163 12 5.99941 12C5.56718 12 5.2168 11.6496 5.2168 11.2174V0.782609C5.2168 0.350386 5.56718 0 5.99941 0Z"
            fill="#73D13D"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M0 6.00038C0 5.56816 0.350386 5.21777 0.782609 5.21777H11.2174C11.6496 5.21777 12 5.56816 12 6.00038C12 6.4326 11.6496 6.78299 11.2174 6.78299H0.782609C0.350386 6.78299 0 6.4326 0 6.00038Z"
            fill="#73D13D"/>
    </svg>
  );
}

const CrossSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="8"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M11.1618 4.83785C11.3896 5.06567 11.3896 5.43503 11.1618 5.66285L5.66187 11.1628C5.43406 11.3906 5.06469 11.3906 4.83688 11.1628C4.60906 10.935 4.60906 10.5656 4.83688 10.3378L10.3368 4.83785C10.5646 4.61004 10.934 4.61004 11.1618 4.83785Z"
            fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.83688 4.83785C5.06469 4.61004 5.43406 4.61004 5.66187 4.83785L11.1618 10.3378C11.3896 10.5656 11.3896 10.935 11.1618 11.1628C10.934 11.3906 10.5646 11.3906 10.3368 11.1628L4.83688 5.66285C4.60906 5.43503 4.60906 5.06567 4.83688 4.83785Z"
            fill="white"/>
    </svg>
  );
};


// TYPES BLOCK
type SelectValueFormat = {
  value: any | null, label: string | null
};

type TextSelectPropsType = {

  inputValue: SelectValueFormat | null,
  options: SelectValueFormat[]

  name?: string,
  handleInputValueChange: (event: any) => void,
  inputValueColor: 'default' | string,
  arrowPosition: 'left' | 'right',
  placeholder?: string,
  customControl?: any,
  notClose?: boolean,
  width?: string,
  height?: string,
  menuPosition?: string,
  optionWithPlus?: boolean
};


const TextSelect: FC<TextSelectPropsType> = ({
                                               name,
                                               inputValue,
                                               inputValueColor,
                                               handleInputValueChange,
                                               arrowPosition,
                                               options,
                                               placeholder,
                                               customControl,
                                               notClose,
                                               width,
                                               height,
                                               menuPosition,
                                               optionWithPlus
                                             }) => {
  // STYLES BLOCK
  const useStyles = makeStyles(({
    selectBox: {
      position: 'relative'
    },
    selectArrow: {
      fill:  inputValueColor !== 'default' && inputValue ? inputValueColor : '#000000',
      margin: '0 7px'
    },
    selectArrowOnTopBox: {
      marginBottom: '5px'
    },
    selectPlaceholder: {
      // @ts-ignore
      position: 'absolute !important',
      left: '11px !important',
      top: '9px !important'
    }
  }));
  const customSelectStyles = {
    menu: (provided: any, state: any) => ({
      ...provided,
      width: width ? width : '322px',
      right: menuPosition === 'right' && '0',
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
    menuList: (provided: any, state: any) => ({
      ...provided,
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
      display: 'flex',
      flexDirection: arrowPosition === 'left' ? 'row-reverse' : 'row',
      border: 'none',
      minHeight: '24px',
      borderLeft: '1px solid #CDD5DF',
      cursor: 'pointer',
      boxShadow: 'none',
      borderRadius: '0px',
      "&:hover": {
        borderColor: 'none'
      },
      fontFamily: 'Inter, sans-serif',
      minWidth: '100px',
      paddingLeft: '20px',
      backgroundColor: 'none'
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      padding: '0'
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: inputValueColor === 'default' ? '#000000' : inputValueColor,
      fontSize: '14px'
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      color: '#2F3747',
      fontWeight: '500',
      fontSize: '14px'
    })
  }
  const classes = useStyles();
  const dispatch = useDispatch();

  // COMPONENTS BLOCK
  const Control: FC<any> = ({children, ...props}) => (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div onClick={handleSelectClick}>
        <components.Control {...props}>
          {children}
        </components.Control>
      </div>
      {name === 'template' && inputValue &&
      <CrossSvg
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
  const Arrow = memo(() => {
    if (isMenuOpen) {
      return <div className={classes.selectArrowOnTopBox}>
        <OnTopArrow className={classes.selectArrow}/>
      </div>
    }
    return <OnBottomArrow className={classes.selectArrow}/>
  });
  const Value: FC<any> = ({children, ...props}) => {
    return (
      <components.SingleValue {...props}>
        {children}
        <span style={{marginLeft: '3px'}}>
          {customControl && name === 'more' ? <span>({customControl})</span> : null}
        </span>
      </components.SingleValue>
    )
  }
  const CustomMenuList = memo(({selectProps, ...props}: any) => {
    return (
      <div style={{height: `${height ? height : 'auto'}`}}>
        {props.children}
      </div>
    );
  });
  const CustomOption: FC<any> = ({children, ...props}) => {
    if (optionWithPlus) {
      return (
        <components.Option {...props}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
            {children}
            <PlusSvg/>
          </div>
        </components.Option>
      );
    }
    return (
      <components.Option {...props}>
        {children}
      </components.Option>
    );
  };
  const Placeholder: FC<any> = memo(({children, ...props}: any) => {
    return (
      <components.Placeholder {...props}>
        {children}
        {name === "template" ? <span>({customControl})</span> : null}
      </components.Placeholder>
    );
  });

  // LOGIC BLOCK

  // выполняется когда меняется значение.
  const handleSelectChange = (event: any) => {
    if (notClose) {
      handleInputValueChange(event);
    } else {
      handleInputValueChange(event);
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
        placeholder={placeholder}
        value={inputValue}
        openMenuOnFocus={true}
        menuIsOpen={isMenuOpen}
        isClearable={true}
        closeMenuOnSelect={false}
        isSearchable={false}
        hideSelectedOptions={false}
        onChange={handleSelectChange}
        // @ts-ignore
        components={{
          IndicatorsContainer: () => (<Arrow/>),
          Control: Control,
          SingleValue: Value,
          MenuList: CustomMenuList,
          Option: CustomOption,
          Placeholder: Placeholder
        }}
      />
    </div>
  );
};

export default TextSelect;
