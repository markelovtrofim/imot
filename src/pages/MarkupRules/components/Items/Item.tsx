import React, {FC, memo} from "react";
import {DictType} from "../../../../store/dicts/dicts.types";
import {makeStyles} from "@mui/styles";
import {getDict} from "../../../../store/dicts/dicts.slice";
import {useDispatch} from "react-redux";
import {InfoCircleActive} from "../../index";
import {Skeleton} from "@mui/material";

const InfoCircle = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.916 2.66602C6.80787 2.66602 2.66602 6.80787 2.66602 11.916C2.66602 17.0242 6.80787 21.166 11.916 21.166C17.0242 21.166 21.166 17.0242 21.166 11.916C21.166 6.80787 17.0242 2.66602 11.916 2.66602ZM11.916 19.5968C7.67506 19.5968 4.23521 16.157 4.23521 11.916C4.23521 7.67506 7.67506 4.23521 11.916 4.23521C16.157 4.23521 19.5968 7.67506 19.5968 11.916C19.5968 16.157 16.157 19.5968 11.916 19.5968Z"
        fill="#738094"/>
      <path
        d="M10.666 7.85649C10.666 8.17223 10.7914 8.47503 11.0147 8.69829C11.238 8.92154 11.5408 9.04697 11.8565 9.04697C12.1722 9.04697 12.475 8.92154 12.6983 8.69829C12.9215 8.47503 13.047 8.17223 13.047 7.85649C13.047 7.54076 12.9215 7.23796 12.6983 7.0147C12.475 6.79144 12.1722 6.66602 11.8565 6.66602C11.5408 6.66602 11.238 6.79144 11.0147 7.0147C10.7914 7.23796 10.666 7.54076 10.666 7.85649ZM12.6501 11.4279C12.6501 10.9896 12.2948 10.6343 11.8565 10.6343C11.4182 10.6343 11.0628 10.9896 11.0628 11.4279C11.0628 11.7747 11.0628 12.1148 11.0628 12.166V16.1921C11.0628 16.2446 11.0628 16.6143 11.0628 16.9835C11.0628 17.4218 11.4182 17.7771 11.8565 17.7771C12.2948 17.7771 12.6501 17.4218 12.6501 16.9835C12.6501 16.6143 12.6501 16.2446 12.6501 16.1921V12.166C12.6501 12.1148 12.6501 11.7747 12.6501 11.4279Z"
        fill="#738094"/>
    </svg>
  );
};

type DictPropsType = {
  body: DictType | null,
  isActive: boolean,
  handleClick: any
};

const areEqual = (prevProps: any, nextProps: any) => {
  return prevProps.isActive === nextProps.isActive;
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
        borderColor: isActive ? '#9254DE !important' : '#F9F0FF !important',
        backgroundColor: '#F9F0FF'
      },
      '&:hover div': {
        color: "#722ED1 !important",
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
      color: isActive ? '#29025F' : '#2F3747',
      marginTop: '5px',
      fontSize: '10px',
      fontFamily: 'Inter, sans-serif',
    }
  }));
  const classes = useStyles();
  return (
    <div className={classes.itemBox} onClick={isActive ? () => null : handleClick}>
      <div style={{minWidth: '130px'}}>
        <div className={classes.item}>
          {body
            ? <>{body.title}</>
            : <Skeleton variant="text" width={130} height={15}/>
          }
        </div>
        <div className={classes.rule}>
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
