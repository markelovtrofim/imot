import React, {useState} from 'react';
import ModalWindow from "../../../../components/ModalWindowBox";
import {Input} from "../../../../components";
import Groups from "../../components/Groups";
import Items from "../../components/Items";
import {MarkupRulesButtons, SearchInput} from "../../index";
import {makeStyles} from "@mui/styles";
import TagsDetail from "./TagsDetail";

const TagsPage = () => {
  // STYLES BLOCK
  const useDictsStyles = makeStyles(({
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
  const classes = useDictsStyles();

  // LOGIC BLOCK

  // логика открытия модально окна
  // MW - Modal Window
  const [addDictMWIsOpen, setAddDictMWIsOpen] = useState<boolean>(false);
  const handleMWOpen = () => {
    setAddDictMWIsOpen(true);
  };
  const handleMWClose = () => {
    setAddDictMWIsOpen(false);
  };

  return (
    <div className={classes.tagsContainer}>
      <div className={classes.dpLeftBlock}>
        <div className={classes.dpLeftBlockGroups}>
          {/* local url handler */}
          <MarkupRulesButtons/>

          {/* groups */}
          <div className={classes.dpBothBox}>
            <Groups groups={[null,null,null,null,null]}/>
          </div>
        </div>

        {/* dicts */}
        <div className={classes.dpLeftBlockDicts}>
          <SearchInput handleMWOpen={handleMWOpen}/>
          <div className={classes.dpBothBox}>
            <Items items={[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]}/>
          </div>
        </div>
      </div>

      {/* detail */}
      <div className={classes.dpRightBlock}>
        <TagsDetail/>
      </div>

      {/* modal window */}
      <ModalWindow isOpen={addDictMWIsOpen} handleClose={() => handleMWClose()}>
        <Input name={'dict'} type={'text'} bcColor={'#F8FAFC'} label={'Добавить словарь'}/>
      </ModalWindow>

    </div>
  );
};

export default TagsPage;