import React, {FC} from "react";
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import CustomControlSelect from "../../../components/Selects/CustomControlSelect";
import {useDispatch} from "react-redux";
import {dictsSlice, getDicts} from "../../../store/dicts/dicts.slice";
import {GroupType} from "../../../store/dicts/dicts.types";

const PurpleCircleSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="7.5" fill="white" stroke="#9254DE"/>
      <circle cx="8" cy="8" r="4" fill="#9254DE"/>
    </svg>
  );
};

const Eye = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M6.1875 9C6.1875 7.4467 7.4467 6.1875 9 6.1875C10.5533 6.1875 11.8125 7.4467 11.8125 9C11.8125 10.5533 10.5533 11.8125 9 11.8125C7.4467 11.8125 6.1875 10.5533 6.1875 9ZM9 7.3125C8.06805 7.3125 7.3125 8.06805 7.3125 9C7.3125 9.93195 8.06805 10.6875 9 10.6875C9.93195 10.6875 10.6875 9.93195 10.6875 9C10.6875 8.06805 9.93195 7.3125 9 7.3125Z"
            fill="black"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M3.24257 7.9848C2.92823 8.43773 2.8125 8.79203 2.8125 9C2.8125 9.20797 2.92823 9.56227 3.24257 10.0152C3.54643 10.453 3.99809 10.9277 4.5695 11.3663C5.71484 12.2453 7.28509 12.9375 9 12.9375C10.7149 12.9375 12.2852 12.2453 13.4305 11.3663C14.0019 10.9277 14.4535 10.453 14.7575 10.0152C15.0718 9.56227 15.1875 9.20797 15.1875 9C15.1875 8.79203 15.0718 8.43773 14.7575 7.9848C14.4535 7.54695 14.0019 7.07229 13.4305 6.63373C12.2852 5.75469 10.7149 5.0625 9 5.0625C7.28509 5.0625 5.71484 5.75469 4.5695 6.63373C3.99809 7.07229 3.54643 7.54695 3.24257 7.9848ZM3.88456 5.74127C5.18224 4.74531 6.98699 3.9375 9 3.9375C11.013 3.9375 12.8177 4.74531 14.1154 5.74127C14.7656 6.24021 15.3024 6.79683 15.6817 7.34336C16.0504 7.87477 16.3125 8.45797 16.3125 9C16.3125 9.54203 16.0504 10.1252 15.6817 10.6567C15.3024 11.2032 14.7656 11.7598 14.1154 12.2587C12.8177 13.2547 11.013 14.0625 9 14.0625C6.98699 14.0625 5.18224 13.2547 3.88456 12.2587C3.23447 11.7598 2.69761 11.2032 2.31832 10.6567C1.94953 10.1252 1.6875 9.54203 1.6875 9C1.6875 8.45797 1.94953 7.87477 2.31832 7.34336C2.69761 6.79683 3.23447 6.24021 3.88456 5.74127Z"
            fill="black"/>
    </svg>

  );
};

const ClosedEye = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M15.3977 3.39775C15.6174 3.17808 15.6174 2.82192 15.3977 2.60225C15.178 2.38258 14.8219 2.38258 14.6023 2.60225L2.60225 14.6023C2.38258 14.8219 2.38258 15.178 2.60225 15.3977C2.82192 15.6174 3.17808 15.6174 3.39775 15.3977L5.53292 13.2625C6.55765 13.7449 7.7379 14.0625 9 14.0625C11.013 14.0625 12.8177 13.2547 14.1154 12.2587C14.7655 11.7598 15.3024 11.2032 15.6817 10.6567C16.0504 10.1252 16.3125 9.54202 16.3125 9C16.3125 8.45797 16.0504 7.87477 15.6817 7.34336C15.3024 6.79683 14.7655 6.24021 14.1154 5.74127C13.9189 5.59039 13.7106 5.44381 13.4917 5.30372L15.3977 3.39775ZM12.6746 6.12085L11.3465 7.44897C11.641 7.8936 11.8125 8.42677 11.8125 9C11.8125 10.5533 10.5533 11.8125 9 11.8125C8.42677 11.8125 7.8936 11.641 7.44897 11.3465L6.38643 12.409C7.18558 12.7346 8.07157 12.9375 9 12.9375C10.7149 12.9375 12.2851 12.2453 13.4305 11.3662C14.0019 10.9277 14.4535 10.453 14.7574 10.0152C15.0718 9.56227 15.1875 9.20797 15.1875 9C15.1875 8.79202 15.0718 8.43772 14.7574 7.9848C14.4535 7.54695 14.0019 7.07229 13.4305 6.63373C13.1956 6.45346 12.9428 6.28104 12.6746 6.12085ZM8.27242 10.523C8.49277 10.6285 8.73945 10.6875 9 10.6875C9.93195 10.6875 10.6875 9.93195 10.6875 9C10.6875 8.73945 10.6285 8.49277 10.523 8.27242L8.27242 10.523Z"
            fill="black"/>
      <path
        d="M9 3.9375C9.77423 3.9375 10.5177 4.057 11.2133 4.26076C11.3472 4.29996 11.387 4.46747 11.2885 4.56608L10.67 5.18449C10.6236 5.23088 10.5564 5.24946 10.4925 5.23475C10.013 5.12443 9.51293 5.0625 9 5.0625C7.28509 5.0625 5.71484 5.75469 4.5695 6.63373C3.99809 7.07229 3.54643 7.54695 3.24257 7.9848C2.92823 8.43773 2.8125 8.79203 2.8125 9C2.8125 9.20798 2.92823 9.56227 3.24257 10.0152C3.50794 10.3976 3.88604 10.808 4.35818 11.198C4.44508 11.2698 4.45336 11.4011 4.37367 11.4809L3.84199 12.0125C3.77426 12.0803 3.66617 12.0862 3.59278 12.0247C3.07304 11.5888 2.63927 11.1191 2.31833 10.6567C1.94953 10.1252 1.6875 9.54203 1.6875 9C1.6875 8.45798 1.94953 7.87478 2.31833 7.34336C2.69761 6.79683 3.23447 6.24021 3.88456 5.74127C5.18224 4.74531 6.98699 3.9375 9 3.9375Z"
        fill="black"/>
      <path
        d="M9 6.1875C9.08887 6.1875 9.17677 6.19162 9.26347 6.19968C9.41115 6.2134 9.46455 6.38993 9.3597 6.49478L8.45055 7.40397C7.96057 7.5726 7.5726 7.96057 7.40397 8.45055L6.49478 9.3597C6.38993 9.46455 6.2134 9.41115 6.19968 9.26348C6.19162 9.17678 6.1875 9.08888 6.1875 9C6.1875 7.4467 7.4467 6.1875 9 6.1875Z"
        fill="black"/>
    </svg>
  );
};


type GroupPropsType = {
  group: GroupType,
  isActive: boolean
};


const Group: FC<GroupPropsType> = ({group, isActive}) => {
  const useStyles = makeStyles(({
    groupItem: {
      cursor: "pointer",
      padding: '24px',
      margin: '0 24px 24px 24px',
      border: '2px solid #fff',
      borderColor: isActive ? '#AD80E6' : '#ffffff',
      boxShadow: '0px 0px 4px rgba(98, 98, 98, 0.22)',
      borderRadius: '10px',
      transition: '0.1s',
      '&:hover': {
        boxShadow: '0px 0px 4px rgba(98, 98, 98, 0.4)',
      }
    },
    groupTopBlock: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    groupTopBlockText: {
      fontWeight: '700 !important',
      color: '#738094 !important'
    },

    groupBottomBlock: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    groupBottomBlockText: {
      color: '#000 !important'
    },
    groupBottomBlockRight: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    groupBottomBlockSvg: {
      marginRight: '10px'
    }
  }));
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={classes.groupItem} onClick={async () => {
      dispatch(dictsSlice.actions.setLoading({type: 'items', value: true}));
      dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: true}));
      await dispatch(getDicts({group: group.group, showDisabled: group.group === 'Отключенные глобальные словари' || group.group === "Disabled global dictionaries"}));
      dispatch(dictsSlice.actions.setCurrentGroup(group));
      dispatch(dictsSlice.actions.setLoading({type: 'items', value: false}));
      dispatch(dictsSlice.actions.setLoading({type: 'itemDetails', value: false}));
    }}>

      <div className={classes.groupTopBlock}>
        <Typography className={classes.groupTopBlockText}>{group.group}</Typography>
        {isActive && <PurpleCircleSvg/>}
      </div>

      <div className={classes.groupBottomBlock}>
        <Typography className={classes.groupBottomBlockText}>{group.count} словарей</Typography>
      </div>

    </div>
  );
};

export default Group;
