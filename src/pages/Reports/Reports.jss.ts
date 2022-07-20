import { makeStyles } from "@mui/styles";

export const reportsStyles = makeStyles(({
  reportItemInfo: {
    marginTop: '40px',
  },
  reportTitle: {
    marginRight: '16px !important',
    color: '#2F3747 !important',
    fontWeight: '500 !important',
  },
  reportFindNumber: {
    color: '#A3AEBE !important',
    fontWeight: '700 !important'
  },
  reportButtonsGroup: {
    margin: '24px 0 16px 0',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  reportButtonsGroupLeft: {},
  reportOptionsButton: {
    // @ts-ignore
    textTransform: 'none !important',
    borderRadius: '5px !important',
    background: '#fff !important',
    color: '#1B202B !important',
  },
  reportOptionsButtonActive: {
    // @ts-ignore
    textTransform: 'none !important',
    borderRadius: '5px !important',
    background: '#fff !important',
    color: '#1B202B !important',
    border: '1px solid #722ED1 !important',
  },
  getReportsButton: {
    // @ts-ignore
    textTransform: 'none !important',
    borderRadius: '5px !important',
    marginLeft: '20px !important'
  },
  searchTitleLeftText: {
    marginRight: '16px !important',
    color: '#2F3747 !important',
    fontWeight: '500 !important',
  },
  btnAddColumn: {
    fontFamily: '"Inter",sans-serif',
    color: '#722ED1',
    cursor: 'pointer',
    marginLeft: '5px',
    fontWeight: 700
  },
  searchTitleLeftStick: {
    marginLeft: '16px !important',
    color: '#CDD5DF !important',
    fontSize: '17px !important'
  },
  tooltip: {
    borderRadius: "5px",
    fontFamily: 'Inter, sans-serif !important',
    color: '#000 !important',
    minWidth: '300px',
    fontSize: '14px !important',
    padding: '6px 8px !important',
    backgroundColor: '#fff !important',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    // marginTop: '15px !important',
  },

  searchText: {
    marginRight: '8px !important',
    color: '#2F3747 !important',
    whiteSpace: 'nowrap'
  },
  tagsBox: {
    minWidth: '70px',
    height: '32px',
    backgroundColor: '#F8FAFC',
    border: 'none !important',
    outline: 'none'
  },
  searchSearchButton: {
    // @ts-ignore
    textTransform: 'none !important',
    borderRadius: '5px !important'
  },
  selectArrow: {
    marginRight: '10px'
  },
  selectArrowOnArrow: {
    marginBottom: '5px'
  },
  criteriaList: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: '16px',
    width: '100%'
  },
  filterBlockFlex: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border: '1px solid #E3E8EF',
    borderRadius: '13px',
    padding: '16px 16px 0 16px',
  },
  filterBlockWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filterBlockControl: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end'
  },
  filterBlockTitle: {
    color: '#722ED1 !important',
    fontWeight: '700 !important',
    marginLeft: '5px !important'
  },
  parameterBlock: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    width: '100%',
    flexWrap: 'wrap',
    '&:last-of-type': {
      marginBottom: 0
    }
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  parameterItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: '10px !important',
    minWidth: '180px',
  },
  parameterItemTitle: {
    marginRight: '10px !important',
    whiteSpace: 'nowrap',
    color: '#2F3747 !important'
  },
  parameterSelect: {
    display: 'inline-flex',
    marginRight: '20px',
    whiteSpace: 'nowrap',
    width: '200px'
  },
  reportInput: {
    border: '1px solid #ccc',
    borderRadius: '2px',
    minWidth: '200px',
    maxWidth: '300px',
    width: '100%'
  },
  checkboxDiff: {
    '& label': {
      marginRight: '0px',
    }
  },
  checkboxDiffValues: {
    display: 'flex',
    //@ts-ignore
    flexDirection: 'row !important',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& label': {
      marginRight: '0px',
    }
  },
  checkboxDiffLabel: {
    marginRight: '15px !important',
  },
  reportName: {
    '& span': {
      display: 'none'
    }
  },
  errorInput: {
    position: 'relative',
    '& .MuiFormControl-root': {
      borderColor: '#F5222D !important'
    },
    '& span': {
      display: 'block',
      position: 'absolute',
      top: '-20px',
      left: '0px'
    }
  },
  errorTitle: {
    color: '#F5222D !important',
    fontSize: '13px !important'
  },

  notFoundCalls: {
    color: '#A3AEBE !important',
    fontWeight: '700 !important',
    textAlign: 'center',
    margin: '14% 0'
  },
  deleteModal: {
    padding: '20px',
    minHeight: '160px',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  table: {
    width: 'auto',
    marginTop: '24px',
    marginBottom: '30px',
    height: '100%',
    //@ts-ignore
    overflowX: 'auto !important',
    overflowY: 'hidden',
    '&::-webkit-scrollbar': {
      height: '6px',
      backgroundColor: '#fff',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundСolor: '#A3AEBE',
      background: '#A3AEBE',
      borderRadius: '14px',
    }
  },
  flexCenterMb: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: '16px'
  },
  tableHeaderTitle: {
    fontWeight: '600',
    lineHeight: '1.3',
    color: '#738094',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  tableHeaderSubTitle: {
    whiteSpace: 'break-spaces',
    paddingBottom: '17px',
    textAlign: 'center',
    position: 'relative',
    fontSize: '13px',
    '&:after': {
      position: 'absolute',
      bottom: '7px',
      width: '36px',
      height: '1px',
      display: 'block',
      content: '""',
      left: 'calc(50% - 18px)',
      background: 'rgba(224, 224, 224, 1)',
    },
  },
  tableHeaderSubSubTitle: {
    fontSize: '0.8em',
    textAlign: 'center',
    fontWeight: '400'
  },
  centerMessage: {
    color: '#738094',
    opacity: '0.6',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px'
  },
  centerMessageTitle: {
    maxWidth: '300px',
    textAlign: 'center'
  }
}));