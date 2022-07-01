import React, {useState} from 'react';
import {MarkupRulesButtons, SearchInput} from "../MarkupRules";
import ModalWindow from "../../../components/common/ModalWindowBox";
import {Input} from "../../../components/common";
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
          <SearchInput
            onSubmit={(values) => {}}
            handleMWOpen={handleMWOpen}
          />
        </div>
      </div>

      {/* detail */}
      <div className={classes.checklistsRightBlock}>
        <ChecklistsDetail/>
      </div>

    </div>
  );
};

export default ChecklistsPage;