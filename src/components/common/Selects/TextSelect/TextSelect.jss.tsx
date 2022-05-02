import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";

type TextSelectStylesType = {
  arrowColor?: string
}

export const useMuiTextSelectStyles = makeStyles<Theme, TextSelectStylesType>((theme: Theme) => ({
  selectBox: {
    position: 'relative'
  },
  selectArrow: {
    fill: props => props.arrowColor ? props.arrowColor : '#000',
    margin: '0 7px'
  },
  selectArrowOnTopBox: {
    marginBottom: '5px'
  },
}));

type createCustomTextSelectStylesParamsType = {
  width?: string,
  menuPosition: 'right' | 'left',
}

export function createTextSelectStyles({width, menuPosition}: createCustomTextSelectStylesParamsType) {
  return {
    menu: (provided: any, state: any) => ({
      ...provided,
      width: width ? width : '322px',
      right: menuPosition === 'right' && '0',
      overflow: 'hidden',
      overflowY: 'auto',
      zIndex: '1000',
      margin: '0',
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
    })
  }
}

//control: (provided: any, state: any) => ({
//       ...provided,
//       display: 'flex',
//       flexDirection: iconPosition === 'left' ? 'row-reverse' : 'row',
//       border: 'none',
//       minHeight: '24px',
//       cursor: 'pointer',
//       boxShadow: 'none',
//       borderRadius: '0px',
//       "&:hover": {
//         borderColor: 'none'
//       },
//       fontFamily: 'Inter, sans-serif',
//       minWidth: '100px',
//       backgroundColor: 'none'
//     })