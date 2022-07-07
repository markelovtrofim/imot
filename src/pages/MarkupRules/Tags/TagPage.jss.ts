import { makeStyles } from "@mui/styles";

export const useTagsStyles = makeStyles(({
  // dp - dicts page
  tagsContainer: {
    width: '100%',
    height: '810px',
    margin: '40px 10px',
    display: 'flex'
  },

  // left block
  dpLeftBlock: {
    width: '58%',
    marginRight: '2%',
    display: 'flex',
  },
  dpLeftBlockGroups: {
    width: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px"
  },

  dpLeftBlockDicts: {
    paddingTop: '26px',
    overflow: 'hidden',
    width: '50%',
    backgroundColor: '#F8FAFC',
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
  },

  dpBothBox: {
    marginTop: '24px',
    height: '700px',
    overflow: 'hidden',
    overflowY: 'auto',
    borderRadius: '5px',

    '&::-webkit-scrollbar': {
      paddingTop: '4px',
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

  // right block
  dpRightBlock: {
    width: '40%',
  },
}));
