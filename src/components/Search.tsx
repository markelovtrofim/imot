import React, {FC} from 'react';
import BlockBox from "./BlockBox";
import {Typography} from "@mui/material";
import {Theme} from '@mui/material/styles';
import Select from './Select'
import {makeStyles} from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";

const useStyles = makeStyles(({
  filterItems: {
    display: 'flex'
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

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Search: FC<FilterPropsType> = ({pageName}) => {
  const [loading, setLoading] = React.useState(false);

  const searchButtonHandleClick = async () => {
    setLoading(true);

    // ALL CALLS
    let allCalls = []
    // @ts-ignore
    const token = await JSON.parse(localStorage.getItem('token'));
    const responseCalls = await axios.post('https://test.imot.io/new_api/search_calls/?skip=0&limit=50', [], {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    });
    console.log('')
    console.log('ALL CALLS')
    console.log(JSON.stringify(responseCalls.data));

    // ONE CALL
    const responseCall = await axios.get(`https://test.imot.io/new_api/call/${responseCalls.data.call_ids[0]}`, {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    });
    console.log('')
    console.log('ONE CALLS')
    console.log(JSON.stringify(responseCall.data));

    // ONE CALL STT
    const responseCallStt = await axios.get(`https://test.imot.io/new_api/call/${responseCalls.data.call_ids[0]}/stt`, {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    });
    console.log('')
    console.log('ONE CALLS STT')
    console.log(JSON.stringify(responseCall.data));

    setLoading(false);
  };

  const classes = useStyles();
  const [personName, setPersonName] = React.useState<string[]>([]);
  return (
    <div style={{margin: '24px 0'}}>
      <BlockBox padding="30px 25px">
        <Typography variant="h5">{pageName}</Typography>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className={classes.filterItems}>
            <div className={classes.filterItem}>
              <Typography>Группа тегов</Typography>
              <Select/>
            </div>
            <div className={classes.filterItem}>
              <Typography>Клиент</Typography>
              <Select/>
            </div>
            <div className={classes.filterItem}>
              <Typography>Сотрудник</Typography>
              <Select/>
            </div>
            <div className={classes.filterItem}>
              <Typography>Отдел</Typography>
              <Select/>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <LoadingButton
              onClick={searchButtonHandleClick}
              startIcon={<SearchIcon/>}
              loading={loading}
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

