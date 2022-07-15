import * as React from 'react';
import {FC, memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {makeStyles} from "@mui/styles";
import Select, {components} from "react-select";
import SearchIcon from '@mui/icons-material/Search';
import cn from 'classnames';
import {templateSlice} from "../../../store/search/template.slice";
import {searchSlice} from "../../../store/search/search.slice";

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


// TYPE BLOCK
type ContainedSelectPropsType = {
  width: string,
  height?: string,
  justify?: string,
  marginRight?: string,

  onSelectChange: (event: any) => void,
  options: { value: any, label: string }[],
  value: any
}


const ContainedSelect: FC<ContainedSelectPropsType> = (
  {
    width,
    height,
    justify,
    marginRight,

    onSelectChange,
    options,
    value
  }
) => {
  // STYLES BLOCK
  const useStyles = makeStyles(({
    selectBox: {
      display: 'flex !important',
      justifyContent: justify ? justify : 'left',
      alignItems: 'center',
      width: '100% !important',
      marginRight: marginRight ? marginRight : '25px'
    },
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
    selectSelectBox: {
      position: 'relative'
    },
    selectPlaceholder: {
      // @ts-ignore
      position: 'absolute !important',
      left: '11px !important',
      top: '9px !important'
    }
  }));
  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: width,
    }),
    menu: (provided: any) => ({
      ...provided,
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
      padding: '10px 24px 10px 10px',
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
      width: '100%',
      minHeight: '32px',
      height: height ? height : '32px',
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
    singleValue: (provided: any) => ({
      ...provided,
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      color: `#738094`
    })
  }
  const classes = useStyles();


  // COMPONENTS BLOCK
  const Arrow = memo((props: any) => {
    if (menuIsOpen) {
      return <div className={cn(classes.selectArrowOnArrow, classes.selectArrow)}><OnTopArrow/></div>
    }
    return <OnBottomArrow className={classes.selectArrow}/>
  });
  const Option = memo((props: any) => {
    return <div>
      <components.Option {...props} className={classes.selectOption}>
        {props.children}
      </components.Option>
    </div>
  });
  const Control: FC<any> = ({children, ...props}) => (
    <div onClick={() => setMenuIsOpen(true)}
         style={{display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%'}}>
      <components.Control {...props}>
        {children}
      </components.Control>
    </div>
  );

  // LOGIC BLOCK
  // открыте и закрытие менюшки.
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  // выполняется когда меняется значение.
  const handleSelectChange = (event: any) => {
    onSelectChange(event);
    setMenuIsOpen(false);
  };


  // костылечек для загрытия селектов
  useEffect(() => {
    document.addEventListener("mousedown", () => setMenuIsOpen(false));
    return () => {
      document.removeEventListener("mousedown", () => setMenuIsOpen(false));
    };
  }, []);

  return (
    <div className={classes.selectBox}>
      <Select
        openMenuOnFocus={true}
        menuIsOpen={menuIsOpen}
        name="color"
        placeholder={''}
        components={{
          Option: Option,
          IndicatorsContainer: () => (<Arrow/>),
          IndicatorSeparator: () => null,
          Control: Control,
        }}
        onChange={handleSelectChange}
        isClearable={true}
        closeMenuOnSelect={false}
        styles={customStyles}
        isSearchable={false}
        value={value}
        options={options}
        hideSelectedOptions={false}
      />
    </div>
  );
};

export default ContainedSelect;
