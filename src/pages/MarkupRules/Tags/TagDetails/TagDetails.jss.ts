import { makeStyles } from "@mui/styles";

export const useTagDetailsStyles = makeStyles(({
  tdWrapper: {
    height: '100%',
    padding: '24px'
  },
  tdNameAdnPriority: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  tdTagNameInput: {
    width: '100%',
    border: ''
  },
  tdPriorityInput: {
    '& input': {
      textAlign: 'center'
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none"
    }
  },
  typographyTitle: {
    color: '#2F3747 !important',
    fontWeight: '700 !important',
    fontSize: '16px !important',
    margin: '15px 0 !important'
  },
  typographyTitleMini: {
    color: '#738094 !important',
    fontWeight: '700 !important',
    fontSize: '11px !important'
  },
  typographyTitleMiniTwo: {
    marginBottom: '10px !important',
    color: '#738094 !important',
    fontWeight: '700 !important',
    fontSize: '13px !important'
  },
  typographyTitleMiniThree: {
    color: '#738094 !important',
    fontWeight: '700 !important',
    fontSize: '13px !important'
  }
}));
