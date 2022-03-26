import React, {memo, useState} from 'react';
import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {BlockBox, Input} from "../../components";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Plus from "../Calls/Body/Buttons/Plus";

const useStyles = makeStyles(({}));

const MarkupRules = memo(() => {
  // STYLES BLOCK
  const useStyles = makeStyles(({
    mrContainer: {
      width: '100%',
      height: '810px',
      margin: '40px 10px',
      display: 'flex',
    },

    // left block
    mrTypeHandlerBlock: {
      flex: '0 0 58%',
      marginRight: '2%',
      display: 'flex',
    },
    mrTypeHandlerGroups: {
      flex: '0 0 50%',
      backgroundColor: '#fff',
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px",
    },
    mrTypeHandlerGroupsInner: {
      padding: '24px'
    },

    mrTypeHandlerItems: {
      flex: '0 0 50%',
      backgroundColor: '#F8FAFC',
      borderTopRightRadius: "10px",
      borderBottomRightRadius: "10px",
    },

    // right block
    mrTypeBodyBlock: {
      flex: '0 0 40%',
    },

    controlBlockButtonBox: {
      boxShadow: 'none !important',
    },
    controlBlockButton: {
      border: 'none !important',
      transition: '0.4s !important',
      outline: 'none !important',
      height: '40px',
      fontSize: '14px !important',
      // @ts-ignore
      textTransform: 'none !important',
      color: '#738094 !important',
      backgroundColor: '#EEF2F6 !important',
      '&.Mui-selected, &:active': {
        backgroundColor: '#D6D9DF !important',
        color: '#000 !important'
      },
      '&.Mui-disabled': {
        cursor: 'pointer'
      }
    },
  }));
  const classes = useStyles();

  const [typeOfMarkup, setTypeOfMarkup] = useState();


  type alignmentType = 'dictionaries' | 'tags' | 'checklists'
  const [alignment, setAlignment] = useState<alignmentType>('dictionaries');
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: alignmentType,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <div className={classes.mrContainer}>
      <div className={classes.mrTypeHandlerBlock}>
        <div className={classes.mrTypeHandlerGroups}>
          <div className={classes.mrTypeHandlerGroupsInner}>
            <ToggleButtonGroup
              className={classes.controlBlockButtonBox}
              value={alignment}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton
                disabled={"dictionaries" === alignment}
                className={classes.controlBlockButton} value="dictionaries"
                onClick={() => {
                }}
              >
                Словари
              </ToggleButton>

              <ToggleButton disabled={"tags" === alignment}
                            className={classes.controlBlockButton} value="tags"
                            onClick={() => {
                            }}
              >
                Теги
              </ToggleButton>

              <ToggleButton
                className={classes.controlBlockButton} disabled={"checklists" === alignment} value="checklists"
                onClick={() => {
                }}
              >
                Чек-листы
              </ToggleButton>
            </ToggleButtonGroup>

            <div style={{display: 'flex', alignItems: 'center'}}>
              <Input name={'mrGroup'} type={'text'} height={'30px'} bcColor={'#F8FAFC'} border={'1px solid #E3E8EF'} label={"Поиск"}/>
              <div style={{marginLeft: '16px'}}><Plus/></div>
            </div>
          </div>
        </div>

        <div className={classes.mrTypeHandlerItems}>

        </div>
      </div>

      <div className={classes.mrTypeBodyBlock}>
        <BlockBox>

          {/* Словари */}
          {alignment === 'dictionaries' &&
          <div>
            <Typography
              style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}
              variant="h3"
            >
              Dictionaries
            </Typography>
          </div>
          }

          {/* Теги */}
          {alignment === 'tags' &&
          <div>
            <Typography
              style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}
              variant="h3"
            >
              Tags
            </Typography>
          </div>
          }

          {/* Чек-листы */}
          {alignment === 'checklists' &&
          <div>
            <Typography
              style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}
              variant="h3"
            >
              Checklists
            </Typography>
          </div>
          }
        </BlockBox>
      </div>
    </div>
  );
});

export default MarkupRules;
