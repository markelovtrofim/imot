import React, {FC, memo} from "react";
import {Skeleton, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {useTagGroupStyles} from "./TagGroup.jss";
import {TagDetailedType, TagGroupType, TagType} from "../../../../../store/tags/tags.types";
import {PurpleCircleSvg} from "./TagGroup.svg";
import {createNullArray, getTag, getTags, tagsSlice} from "../../../../../store/tags/tags.slice";

type TagGroupPropsType = {
  group: TagGroupType | null,
  isActive: boolean
};

const TagGroup: FC<TagGroupPropsType> = memo(({group, isActive}) => {
  const classes = useTagGroupStyles({isActive});
  const dispatch = useDispatch();
  const history = useHistory();

  const onTagGroupClick = async () => {
    if (group) {
      dispatch(tagsSlice.actions.setTags(createNullArray(10)));
      dispatch(tagsSlice.actions.setCurrentTag(null));

      dispatch(tagsSlice.actions.setCurrentTagGroup(group));

      const tagsData = await dispatch(getTags({group: group.group}));
      // @ts-ignore
      const tags: TagType[] = tagsData.payload;
      if (tags.length > 0) {
        const dataTag = await dispatch(getTag(tags[0].id));
        // @ts-ignore
        const tag: TagDetailedType = dataTag.payload;

        history.location.pathname = `/`;
        history.replace(`markuprules/tags/${tag.id}`);
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
        {isActive && <PurpleCircleSvg/>}
      </div>

      <div className={classes.groupBottomBlock}>
        {group
          ? <Typography className={classes.groupBottomBlockText}>{group.count} тегов</Typography>
          : <Skeleton variant="text" width={80} height={20} />
        }
      </div>

    </div>
  );
});

export default TagGroup;
