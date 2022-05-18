import React, {FC, memo} from "react";
import {useDispatch} from "react-redux";
import {Skeleton} from "@mui/material";
import {useHistory} from "react-router-dom";
import {useTagItemStyles} from "./TagItem.jss";
import {TagType} from "../../../../../store/tags/tags.types";
import {InfoCircle, InfoCircleActive} from "../../../MarkupRules";
import {getTag, tagsSlice} from "../../../../../store/tags/tags.slice";
import {useAppSelector} from "../../../../../hooks/redux";

type TagItemPropsType = {
  tag: TagType | null,
  isActive: boolean
};

const TagItem: FC<TagItemPropsType> = memo(({tag, isActive}) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useTagItemStyles({tag, isActive});
  const activeGlobalFilterCriterias = useAppSelector(state => state.tags.activeGlobalFilterCriterias);

  async function onTagItemClick() {
    if (!isActive && tag) {
      dispatch(tagsSlice.actions.setCurrentTag(null));
      dispatch(tagsSlice.actions.setActiveGlobalFilterCriterias([]));
      dispatch(tagsSlice.actions.removeFragments(null));
      dispatch(tagsSlice.actions.removeSetTags(null));
      await dispatch(getTag(tag.id));
      history.location.pathname = '/';
      history.replace(`markuprules/tags/${tag.id}`);
    }
  }

  return (
    <div className={classes.itemBox} onClick={onTagItemClick}>
      <div style={{minWidth: '130px'}}>
        <div className={classes.item}>
          {tag
            ? <>{tag.title}</>
            : <Skeleton variant="text" width={130} height={15}/>
          }
        </div>
      </div>
      {isActive ? <InfoCircleActive/> : <InfoCircle/>}
    </div>
  )
});

export default TagItem;
