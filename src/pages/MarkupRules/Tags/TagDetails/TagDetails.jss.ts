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
    margin: '24px 0 19px 0 !important'
  }
}));
