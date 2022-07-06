import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import { TagType } from "../../../../../store/tags/tags.types";

type TagItemStylesType = {
  isActive: boolean,
  tag: TagType | null
}

export const useTagItemStyles = makeStyles<Theme, TagItemStylesType>((theme: Theme) => ({
  itemBox: {
    cursor: 'pointer',
    minHeight: '31px',

    padding: '9px 24px',
    transition: '0.1s',
    backgroundColor: props => props.isActive ? '#F9F0FF' : '#F8FAFC',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRight: '4px solid #FFFFFF',
    borderColor: props => props.isActive ? '#9254DE' : '#F8FAFC',
    '&:hover': {
      borderColor: props => props.isActive ? '#722ED1' : '#F9F0FF',
      backgroundColor: '#F9F0FF'
    },
    '&:hover div': {
      color: "#722ED1",
    }
  },
  item: {
    fontWeight: '700',
    color: props => props.isActive ? '#722ED1' : '#2F3747',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  rule: {
    fontWeight: '700',
    color: props => props.isActive ? '#722ED1' : '#2F3747',
    marginTop: '5px',
    fontSize: '10px',
    fontFamily: 'Inter, sans-serif',
    '&:hover': {
      color: '#002766 !important'
    }
  }
}));