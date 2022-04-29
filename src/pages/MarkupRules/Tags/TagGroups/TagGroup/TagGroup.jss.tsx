import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";

type TagGroupStylesType = {
  isActive: boolean
}

export const useTagGroupStyles = makeStyles<Theme, TagGroupStylesType>((theme: Theme) => ({
  groupItem: {
    minHeight: '56px',
    cursor: "pointer",
    padding: '24px',
    margin: '0 24px 24px 24px',
    border: '2px solid #fff',
    borderColor: props => props.isActive ? '#AD80E6' : '#ffffff',
    boxShadow: '0px 0px 4px rgba(98, 98, 98, 0.22)',
    borderRadius: '10px',
    transition: '0.1s',
    '&:hover': {
      boxShadow: '0px 0px 4px rgba(98, 98, 98, 0.4)',
    }
  },
  groupTopBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  groupTopBlockText: {
    fontWeight: '700 !important',
    color: '#738094 !important'
  },

  groupBottomBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupBottomBlockText: {
    color: '#000 !important'
  },
  groupBottomBlockRight: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupBottomBlockSvg: {
    marginRight: '10px'
  }
}));