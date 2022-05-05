import React, {FC, useEffect, useState} from 'react';
import {selectCustomStylesCreator, useMuiCustomSelectStyles} from "./CustomSelect.jss";
import {useDispatch} from "react-redux";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import {Typography} from "@mui/material";
import {
  CustomInd,
  CustomMenuList,
  CustomMultiValueLabel,
  CustomMultiValueRemove,
  CustomOption,
  LimitedChipsContainer
} from './CustomSelect.components';

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

type OptionType = {
  label: string,
  value: any
}

type CustomSelect = {
  // добавление значения
  addValueHandler: (event: any, isDefaultCriteria: boolean, fullCriteria: any) => void,

  // удааление всех означений
  removeValuesHandler?: () => void,

  // дефолтная ли это критерия
  isDefaultCriteria?: boolean,
  // иконка удаления
  deleteIcon?: React.FC,
  // и функция при клике на иконку
  removeSelectHandler?: () => void,

  // текущая/активная версия критерия
  activeCriteria?: any,
  // её полная версия
  fullCriteria?: any,

  // styles
  width?: string,
  height?: string
}

const CustomSelect: FC<CustomSelect> = (
  {
    addValueHandler,
    removeValuesHandler,
    isDefaultCriteria,
    deleteIcon,
    removeSelectHandler,
    activeCriteria,
    fullCriteria,
    width,
    height
  }
) => {
  // styles
  const classes = useMuiCustomSelectStyles();


  // logic block
  // LOGIC BLOCK
  // диспатч
  const dispatch = useDispatch();

  // открыте и закрытие менюшки.
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  // удаление критерии.
  const converter = (state: any) => {
    debugger;
    let local: { value: string, label: string }[] = [];
    for (let i = 0; i < state.values.length; i++) {
      local.push({value: state.values[i], label: state.values[i]});
    }
    return local
  };
  const valueArray = converter(activeCriteria);
  const options = converter(activeCriteria);

  // костылечек для загрытия селектов
  useEffect(() => {
    document.addEventListener("mousedown", () => setMenuIsOpen(false));
    return () => {
      document.removeEventListener("mousedown", () => setMenuIsOpen(false));
    };
  }, []);


  return (
    <div className={classes.selectBox}>
      {fullCriteria.selectType === "multiString" ?
        <div className={classes.selectSelectBox} onClick={() => setMenuIsOpen(true)}>
          <CreatableSelect
            closeMenuOnSelect={false}
            isMulti
            createOptionPosition={'first'}
            styles={selectCustomStylesCreator({menuIsOpen: menuIsOpen})}
            formatCreateLabel={(str) => str}
            value={valueArray}
            onChange={(event) => {
              addValueHandler(event, Boolean(isDefaultCriteria), fullCriteria);
            }}
            tabIndex={0}
            isValidNewOption={(str) => true}
            options={options}
            hideSelectedOptions={false}
            components={{
              MenuList: CustomMenuList,
              Option: CustomOption,
              // @ts-ignore
              DropdownIndicator: <CustomInd menuIsOpen={menuIsOpen}/>,
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
              // @ts-ignore
              DropdownIndicator: <CustomInd menuIsOpen={menuIsOpen}/>,
              IndicatorSeparator: () => null,
              MultiValueLabel: CustomMultiValueLabel,
              MultiValueRemove: CustomMultiValueRemove,
              ValueContainer: LimitedChipsContainer,
            }}
            onChange={(event) => {
              addValueHandler(event, Boolean(isDefaultCriteria), fullCriteria);
            }}
            isClearable={true}
            closeMenuOnSelect={false}
            styles={selectCustomStylesCreator({menuIsOpen: menuIsOpen})}
            isMulti
            isSearchable={false}
            value={valueArray}
            options={options}
            hideSelectedOptions={false}
          />
          {valueArray.length < 1 &&
          <Typography className={classes.selectPlaceholder}>Все</Typography>
          }
        </div>
      }
      {!isDefaultCriteria
        ? <CrossSvg onClick={removeSelectHandler} style={{cursor: 'pointer', marginLeft: '8px'}}/>
        : null
      }
    </div>
  );
};

export default CustomSelect;