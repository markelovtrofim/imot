import React, {useState} from 'react';
import {MarkupRulesButtons, SearchInput} from "../../index";
import TagsDetail from "../Tags/TagsDetail";
import ModalWindow from "../../../../components/ModalWindowBox";
import {Input} from "../../../../components";
import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import ChecklistsDetail from './ChecklistsDetail';

const ChecklistsPage = () => {
  const useStyles = makeStyles(({
    checklistsContainer: {
      width: '100%',
      height: '810px',
      margin: '40px 10px',
      display: 'flex'
    },
    checklistsLeftBlock: {
      width: '29%',
      marginRight: '2%',
      backgroundColor: '#fff',
      borderRadius: '10px',
      height: '100%'
    },
    checklistsRightBlock: {
      width: '40%',
    }
  }));
  const classes = useStyles();
  const [addDictMWIsOpen, setAddDictMWIsOpen] = useState<boolean>(false);
  const handleMWOpen = () => {
    setAddDictMWIsOpen(true);
  };
  const handleMWClose = () => {
    setAddDictMWIsOpen(false);
  };

  return (
    <div className={classes.checklistsContainer}>
      <div className={classes.checklistsLeftBlock}>
        {/* local url handler */}
        <MarkupRulesButtons/>
        <div style={{marginTop: '25px'}}>
          <SearchInput handleMWOpen={handleMWOpen}/>
        </div>
      </div>

      {/* detail */}
      <div className={classes.checklistsRightBlock}>
        <ChecklistsDetail/>
      </div>

      {/* modal window */}
      <ModalWindow isOpen={addDictMWIsOpen} handleClose={() => handleMWClose()}>
        <Input name={'dict'} type={'text'} bcColor={'#F8FAFC'} label={'Добавить словарь'}/>
      </ModalWindow>

    </div>
  );
};

export default ChecklistsPage;