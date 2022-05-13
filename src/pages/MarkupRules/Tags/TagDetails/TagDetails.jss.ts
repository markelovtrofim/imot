import {makeStyles} from "@mui/styles";

export const useTagDetailsStyles = makeStyles(({
  tdWrapper: {
    height: '100%',
    padding: '24px',

    overflow: 'hidden',
    overflowY: 'auto',

    '&::-webkit-scrollbar': {
      width: '4px',
      outline: 'none',
      background: '#CDD5DF'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#A3AEBE',
      height: '50px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#9298A1'
    }
  },
  tdNameAdnPriority: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  tdTagNameInput: {
    width: '100%'
  },
  tdPriorityInput: {
    '& input': {
      textAlign: 'center'
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
    fontSize: '13px !important',
  }
}));
