import * as React from 'react';
import {Theme, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {makeStyles} from "@mui/styles";
import {Checkbox, InputBase, ListItemText} from "@mui/material";
import Tag from "./Tag";

const useStyles = makeStyles(({
  selectInput: {
    minWidth: '70px',
    width: '100%',
    height: '32px',
    border: `1px solid #E3E8EF`,
    borderRadius: '5px',
    "&:focus": {
      borderColor: `red`,
    }
  }
}));

const CustomSelect = (props: any) => {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const classes = useStyles();

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    debugger
    const {target: {value}} = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };
  return (
    <FormControl>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={personName}
        onChange={handleChange}
        input={<InputBase className={classes.selectInput}/>}
        renderValue={(selected) => {
          if (selected.length > 1) {
            return <div style={{display: 'flex'}}>
              <Tag label={selected[0]}/>
              <Tag label={`+${selected.length - 1}`}/>
            </div>
          }
          return <Tag label={selected[0]}/>
        }}
      >
        <div style={{height: '200px'}}>
          {props.value ? props.value.map((name: any) => {
            return (
              <MenuItem key={name} value={name}>
                <ListItemText primary={name}/>
                <Checkbox checked={personName.indexOf(name) > -1}/>
              </MenuItem>
            )
          }) : null}
        </div>
      </Select>
    </FormControl>
  );
}

export default CustomSelect;