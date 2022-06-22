import React, {FC, memo} from "react";
import {makeStyles} from "@mui/styles";
import {Skeleton, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {dictsSlice, getDict, getDicts} from "../../../store/dicts/dicts.slice";
import {DictType, DictTypeDetailed, GroupType} from "../../../store/dicts/dicts.types";
import {useHistory} from "react-router-dom";
import queryString from "query-string";
import {tagsSlice} from "../../../store/tags/tags.slice";

const PurpleCircleSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="7.5" fill="white" stroke="#9254DE"/>
      <circle cx="8" cy="8" r="4" fill="#9254DE"/>
    </svg>
  );
};


type GroupPropsType = {
  group: GroupType | null,
  isActive: boolean
};


const Group: FC<GroupPropsType> = memo(({group, isActive}) => {
  const useStyles = makeStyles(({
    groupItem: {
      minHeight: '56px',
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
  const history = useHistory();

  const onGroupClick = async () => {
    if (group) {
      dispatch(tagsSlice.actions.setSearchInput(""));
      dispatch(dictsSlice.actions.setCurrentGroup(group));
      dispatch(dictsSlice.actions.setEmptyDicts(null));
      dispatch(dictsSlice.actions.setCurrentDict(null));
      const dictsData = await dispatch(getDicts({group: group.group}));
      // @ts-ignore
      const dicts: DictType[] = dictsData.payload;
      const dataDict = await dispatch(getDict(dicts[0].id));
      // @ts-ignore
      const dict: DictTypeDetailed = dataDict.payload;
      dispatch(dictsSlice.actions.setSearch( queryString.extract(`?group=${group.group}&id=${dict.id}`)));
      history.location.pathname = `/`;
      history.replace(`markuprules/dictionaries?group=${group.group}&id=${dict.id}`);
    }
  };

  return (
    <div className={classes.groupItem} onClick={onGroupClick}>
      <div className={classes.groupTopBlock}>
        {group
          ? <Typography className={classes.groupTopBlockText}>{group.group}</Typography>
          : <Skeleton variant="text" width={250} height={20} />
        }
        {isActive && <PurpleCircleSvg/>}
      </div>

      <div className={classes.groupBottomBlock}>
        {group
          ? <Typography className={classes.groupBottomBlockText}>{group.count} словарей</Typography>
          : <Skeleton variant="text" width={80} height={20} />
        }
      </div>

    </div>
  );
});

export default Group;
