import {styled} from "@mui/styles";
import {Checkbox, CheckboxProps} from "@mui/material";
import * as React from "react";

const BpIcon = styled('span')(({theme}: any) => ({
  borderRadius: 5,
  border: '1px solid #A3AEBE',
  width: 16,
  height: 16,
  backgroundColor: '#E3E8EF',
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#722ED1',
  borderColor: '#722ED1',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#5116A1',
  },
});

const CustomCheckbox = (props: CheckboxProps) => {
  return (
    <Checkbox
      sx={{
        '&:hover': {bgcolor: 'transparent'},
        padding: '0'
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon/>}
      icon={<BpIcon/>}
      inputProps={{'aria-label': 'Checkbox demo'}}
      {...props}
    />
  );
}

export default CustomCheckbox;
