import React, {FC, memo} from "react";
import {useDispatch} from "react-redux";
import {Skeleton, Typography} from "@mui/material";
import {useHistory} from "react-router-dom";
import {useTagItemStyles} from "./TagItem.jss";
import {TagType} from "../../../../../store/tags/tags.types";
import {InfoCircle, InfoCircleActive} from "../../../MarkupRules";
import {getTag, tagsSlice} from "../../../../../store/tags/tags.slice";
import {useAppSelector} from "../../../../../hooks/redux";
import {searchStringParserInObj} from "../../TagPage";

type TagItemPropsType = {
  tag: TagType | null,
  isActive: boolean
};

const TagItem: FC<TagItemPropsType> = memo(({tag, isActive}) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useTagItemStyles({tag, isActive});
  const currentGroup = useAppSelector(state => state.tags.currentTagGroup);


  const search = useAppSelector(state => state.tags.searchParams);
  const searchParamsObject = searchStringParserInObj(search);


  async function onTagItemClick() {
    if (!isActive && tag && currentGroup) {
      dispatch(tagsSlice.actions.setCurrentTag(null));
      dispatch(tagsSlice.actions.setActiveGlobalFilterCriterias([]));
      dispatch(tagsSlice.actions.removeFragments(null));
      dispatch(tagsSlice.actions.removeSetTags(null));
      await dispatch(getTag(tag.id));

      if (searchParamsObject.search) {
        dispatch(tagsSlice.actions.setSearchParams(`?group=${currentGroup.group}&id=${tag.id}&search=${searchParamsObject.search}`));
        history.location.pathname = `/`;
        history.replace(`markuprules/tags?group=${currentGroup.group}&id=${tag.id}&search=${searchParamsObject.search}`);
      } else {
        dispatch(tagsSlice.actions.setSearchParams(`?group=${currentGroup.group}&id=${tag.id}`));
        history.location.pathname = `/`;
        history.replace(`markuprules/tags?group=${currentGroup.group}&id=${tag.id}`);
      }
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
      <div style={{display: 'flex', alignItems: 'center'}}>
        {isActive ? <InfoCircleActive style={{marginLeft: '30px'}}/> : <InfoCircle style={{marginLeft: '30px'}}/>}
      </div>
    </div>
  )
});

export default TagItem;
