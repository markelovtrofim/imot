import React, {FC} from 'react';
import {BlockBox} from "./BlockBox";
import {Typography} from "@mui/material";
import {Theme} from '@mui/material/styles';
import CustomSelect from './CustomSelect'
import Select, {SelectChangeEvent} from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';
import {makeStyles} from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from "@mui/material/MenuItem";

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

const Filter: FC<FilterPropsType> = ({pageName}) => {
  const [loading, setLoading] = React.useState(false);

  const searchButtonHandleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  };

  const classes = useStyles();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: {value},
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleDelete = () => {
    console.log('DELETE')
  }
  return (
    <div style={{margin: '24px 0'}}>
      <BlockBox padding="30px 25px">
        <Typography variant="h5">{pageName}</Typography>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className={classes.filterItems}>
            <div className={classes.filterItem}>
              <Typography>Группа тегов</Typography>
              <CustomSelect/>
            </div>
            <div className={classes.filterItem}>
              <Typography>Клиент</Typography>
              <CustomSelect/>
            </div>
            <div className={classes.filterItem}>
              <Typography>Сотрудник</Typography>
              <CustomSelect/>
            </div>
            <div className={classes.filterItem}>
              <Typography>Отдел</Typography>
              <CustomSelect/>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <LoadingButton
              onClick={searchButtonHandleClick}
              startIcon={<SearchIcon/>}
              loading={loading}
              color="secondary"
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

export default Filter;

