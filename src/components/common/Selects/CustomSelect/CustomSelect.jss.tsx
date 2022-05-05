import {makeStyles} from "@mui/styles";

export const useMuiCustomSelectStyles = makeStyles(({
  selectBox: {
    display: 'flex !important',
    alignItems: 'center',
    cursor: 'pointer'
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
    position: 'relative'
  },
  selectPlaceholder: {
    // @ts-ignore
    position: 'absolute !important',
    left: '11px !important',
    top: '9px !important'
  }
}));

export function selectCustomStylesCreator(props: { menuIsOpen: boolean }) {
  return {
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
      borderColor: props.menuIsOpen ? '#722ED1 !important' : '#E3E8EF !important',
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
  };
}

