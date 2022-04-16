import React, {FC, memo} from "react";
import {DictType} from "../../../../store/dicts/dicts.types";
import {makeStyles} from "@mui/styles";
import {dictsSlice} from "../../../../store/dicts/dicts.slice";
import {useDispatch} from "react-redux";
import {InfoCircle, InfoCircleActive} from "../../index";
import {Skeleton} from "@mui/material";
import {useHistory} from "react-router-dom";


type DictPropsType = {
  body: DictType | null,
  isActive: boolean,
  handleClick: any
};

const Item: FC<DictPropsType> = memo(({body, isActive, handleClick}) => {
  const useStyles = makeStyles(({
    itemBox: {
      cursor: 'pointer',
      minHeight: '31px',

      padding: '9px 24px',
      transition: '0.1s',
      backgroundColor: isActive ? '#F9F0FF' : '#F8FAFC',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRight: '4px solid #FFFFFF',
      borderColor: isActive ? '#9254DE !important' : '#FFFFFF !important',
      '&:hover': {
        borderColor: body ? isActive ? '#9254DE !important' : '#F9F0FF !important' : '#F8FAFC',
        backgroundColor: body ? '#F9F0FF' : '#F8FAFC'
      },
      '&:hover div': {
        color: "#722ED1",
      }
    },
    item: {
      fontWeight: '700',
      color: isActive ? '#722ED1' : '#2F3747',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif',
    },
    rule: {
      fontWeight: '700',
      color: isActive ? '#722ED1' : '#2F3747',
      marginTop: '5px',
      fontSize: '10px',
      fontFamily: 'Inter, sans-serif',
      '&:hover': {
        color: '#002766 !important'
      }
    }
  }));
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  return (
    <div
      className={classes.itemBox}
      onClick={isActive
        ? () => null
        : () => {
          handleClick();
          history.location.pathname = '/'
          if (body) {
            history.replace(`markuprules/dictionaries/${body.id}`)
          }
        }}
    >
      <div style={{minWidth: '130px'}}>
        <div className={classes.item}>
          {body
            ? <>{body.title}</>
            : <Skeleton variant="text" width={130} height={15}/>
          }
        </div>
        <div className={classes.rule} onClick={isActive ? async () => {
          history.location.pathname = '/'
          history.replace(`markuprules/tags/1`)
          await dispatch(dictsSlice.actions.setActivePage('tags'));
        } : () => null}>
          {body
            ? <i style={{marginRight: '3px'}}>{body.usedRules.map((rule) => rule.title)}</i>
            : <Skeleton variant="text" width={60} height={11}/>
          }
        </div>
      </div>
      {isActive ? <InfoCircleActive/> : <InfoCircle/>}

    </div>
  )
});

export default Item;
