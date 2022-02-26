import React, {FC} from 'react';
import BlockBox from "./BlockBox";
import {Typography} from "@mui/material";
import {Theme} from '@mui/material/styles';
import Select from './Select'
import {makeStyles} from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import {useAppSelector} from "../hooks/redux";

const useStyles = makeStyles(({
  filterItems: {
    display: 'flex',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '22px'
  },
  tagsBox: {
    minWidth: '70px',
    height: '32px',
    backgroundColor: '#F8FAFC',
    border: 'none !important',
    outline: 'none'
  }
}));

type FilterPropsType = {
  pageName: string
}

const Search: FC<FilterPropsType> = ({pageName}) => {
  const [loading, setLoading] = React.useState(false);

  const classes = useStyles();
  const [personName, setPersonName] = React.useState<string[]>([]);
  const userCriterias = useAppSelector(state => state.search.userCriterias);
  const allCriterias = useAppSelector(state => state.search.allCriterias);
    return (
    <div style={{margin: '24px 0'}}>
      <BlockBox padding="30px 25px">
        <Typography variant="h5">{pageName}</Typography>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className={classes.filterItems}>
            {userCriterias ? userCriterias.map(field => {
              const fieldik = field.slice(4)
              // @ts-ignore
              const f = allCriterias.filter(v => v.key === field);
              return (
                <div className={classes.filterItem}>
                  <Typography>{fieldik}</Typography>
                  <Select value={f[0].values}/>
                </div>
              )
            }) : null}
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <LoadingButton
              startIcon={<SearchIcon/>}
              loading={loading}
              onClick={() => {setLoading(true)}}
              color="primary"
              loadingPosition="start"
              variant="contained"
            >
              Искать
            </LoadingButton>
            <Typography style={{marginLeft: '10px', cursor: 'pointer'}}>Еще</Typography>
          </div>
        </div>
      </BlockBox>
    </div>
  );
};

export default Search;