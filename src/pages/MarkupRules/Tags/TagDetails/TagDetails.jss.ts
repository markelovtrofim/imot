import {makeStyles} from "@mui/styles";

export const useTagDetailsStyles = makeStyles(({
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
