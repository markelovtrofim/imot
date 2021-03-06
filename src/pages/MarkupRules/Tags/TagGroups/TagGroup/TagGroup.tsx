import React, { FC, memo } from "react";
import { Skeleton, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTagGroupStyles } from "./TagGroup.jss";
import { TagDetailedType, TagGroupType, TagType } from "../../../../../store/tags/tags.types";
import { PurpleCircleSvg } from "./TagGroup.svg";
import { createNullArray, getTag, getTags, tagsSlice } from "../../../../../store/tags/tags.slice";
import { useAppSelector } from "../../../../../hooks/redux";
import { RootState } from "../../../../../store/store";

type TagGroupPropsType = {
  group: TagGroupType | null,
  isActive: boolean
};

const TagGroup: FC<TagGroupPropsType> = memo(({ group, isActive }) => {
  const classes = useTagGroupStyles({ isActive });
  const dispatch = useDispatch();
  const history = useHistory();

  const { language } = useAppSelector((state: RootState) => state.lang);

  const userIdData = useAppSelector(state => state.users.currentUser?.id);
  const userId = userIdData ? userIdData : "_";
  // ${language}/${userId}/

  const onTagGroupClick = async () => {
    if (group) {
      dispatch(tagsSlice.actions.setSearchInput(""));
      dispatch(tagsSlice.actions.setTags(createNullArray(20)));
      dispatch(tagsSlice.actions.setCurrentTag(null));
      dispatch(tagsSlice.actions.setActiveGlobalFilterCriterias([]));
      dispatch(tagsSlice.actions.removeFragments(null));
      await dispatch(tagsSlice.actions.removeSetTags(null));
      dispatch(tagsSlice.actions.setCurrentTagGroup(group));

      const tagsData = await dispatch(getTags({ group: group.group }));
      // @ts-ignore
      const tags: TagType[] = tagsData.payload;
      if (tags.length > 0) {
        const dataTag = await dispatch(getTag(tags[0].id));
        // @ts-ignore
        const tag: TagDetailedType = dataTag.payload;
        dispatch(tagsSlice.actions.setSearchParams(`?group=${group.group}&id=${tag.id}`));
        history.location.pathname = `/`;
        history.replace(`${language}/${userId}/markuprules/tags?group=${group.group}&id=${tag.id}`);
      }
    }
  };

  return (
    <div className={classes.groupItem} onClick={onTagGroupClick}>

      <div className={classes.groupTopBlock}>
        {group
          ? <Typography className={classes.groupTopBlockText}>{group.group}</Typography>
          : <Skeleton variant="text" width={250} height={20} />
        }
        {isActive && <PurpleCircleSvg />}
      </div>

      <div className={classes.groupBottomBlock}>
        {group
          ? <Typography className={classes.groupBottomBlockText}>{group.count} ??????????</Typography>
          : <Skeleton variant="text" width={80} height={20} />
        }
      </div>

    </div>
  );
});

export default TagGroup;
