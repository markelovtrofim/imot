import {memo} from "react";
import {components} from "react-select";
import cn from "classnames";
import Checkbox from "../../Checkbox";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import {CrossWithoutBg, OnBottomArrow, OnTopArrow} from "../../Search/SearchSelect";
import {useMuiCustomSelectStyles} from './CustomSelect.jss';

export const CustomMultiValueLabel = memo((props: any) => {
  return (
    <components.MultiValueLabel {...props} />
  )
});

export const CustomMultiValueRemove = memo((props: any) => {
  return (
    <components.MultiValueRemove {...props}>
      <CrossWithoutBg fill={'000'}/>
    </components.MultiValueRemove>
  )
});

export const LimitedChipsContainer = ({children, hasValue, ...props}: any) => {
  const classes = useMuiCustomSelectStyles({});
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

export const CustomInd = memo((props: any) => {
  const classes = useMuiCustomSelectStyles({});
  if (props.menuIsOpen) {
    return <components.DropdownIndicator {...props}>
      <div className={cn(classes.selectArrowOnArrow, classes.selectArrow)}>
        <OnTopArrow/>
      </div>
    </components.DropdownIndicator>
  }
  return <OnBottomArrow className={classes.selectArrow}/>
});

export const CustomOption = memo((props: any) => {
  const classes = useMuiCustomSelectStyles({});
  if (props.children.length > 0) {
    return <div>
      <components.Option {...props} className={classes.selectOption}>
        {props.children}
        {/*<Checkbox*/}
        {/*  disableRipple*/}
        {/*  checked={props.activeCriteria.values.indexOf(props.children) >= 0}*/}
        {/*/>*/}
      </components.Option>
    </div>
  }
  return null;
})


export const CustomMenuList = memo(({selectProps, ...props}: any) => {
  const {onInputChange, inputValue, onMenuInputFocus} = selectProps;
  const classes = useMuiCustomSelectStyles({})

  return (
    <div>
      <div>
        <input
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
