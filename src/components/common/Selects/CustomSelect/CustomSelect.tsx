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
};

type CustomSelect = {
  // значение
  value: OptionType[] | any,
  // все предлогаемые значения
  options: OptionType[],
  // тип селекта
  selectType: string,
  // поле по умолчанию?
  isDefaultField: boolean,

  // при изменении значений селекта
  valueHandler: (event: any) => void,
  // удаление всего поля
  removeSelectHandler?: (event: any) => void,

  // иконка удаления (по дефолту крестик с бэкграундом)
  deleteIcon?: React.ReactElement,

  // стили
  width?: string,
  height?: string
}

const CustomSelect: FC<CustomSelect> = (
  {
    value,
    options,
    selectType,

    valueHandler,
    isDefaultField,
    deleteIcon,
    removeSelectHandler,
    width,
    height
  }
) => {
  // styles
  const classes = useMuiCustomSelectStyles({width: width});


  // logic block
  // LOGIC BLOCK
  // диспатч
  const dispatch = useDispatch();

  // открыте и закрытие менюшки.
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);


  // костылечек для загрытия селектов
  useEffect(() => {
    document.addEventListener("mousedown", () => setMenuIsOpen(false));
    return () => {
      document.removeEventListener("mousedown", () => setMenuIsOpen(false));
    };
  }, []);

  return (
    <div className={classes.selectBox}>
      {selectType === "multiString" ?
        <div className={classes.selectSelectBox} onClick={() => setMenuIsOpen(true)}>
          <CreatableSelect
            closeMenuOnSelect={false}
            isMulti
            createOptionPosition={'first'}
            styles={selectCustomStylesCreator({menuIsOpen: menuIsOpen})}
            formatCreateLabel={(str) => str}
            value={value}
            onChange={valueHandler}
            tabIndex={0}
            isValidNewOption={(str) => true}
            options={options}
            hideSelectedOptions={false}
            components={{
              MenuList: CustomMenuList,
              Option: CustomOption,
              // @ts-ignore
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
            onChange={valueHandler}
            isClearable={true}
            closeMenuOnSelect={false}
            styles={selectCustomStylesCreator({menuIsOpen: menuIsOpen})}
            isMulti
            isSearchable={false}
            value={value}
            options={options}
            hideSelectedOptions={false}
          />
          {value.length < 1 &&
          <Typography className={classes.selectPlaceholder}>Все</Typography>
          }
        </div>
      }
      {!isDefaultField
        ?
        <div onClick={removeSelectHandler}>
          {deleteIcon ?
            deleteIcon :
            <CrossSvg style={{cursor: 'pointer', marginLeft: '8px'}}/>
          }
        </div>
        : null
      }
    </div>
  );
};

export default CustomSelect;
