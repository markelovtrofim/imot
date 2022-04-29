import React, {FC, memo} from "react";
import {useDispatch} from "react-redux";
import {Skeleton} from "@mui/material";
import {useHistory} from "react-router-dom";
import {useTagItemStyles} from "./TagItem.jss";
import {TagType} from "../../../../../store/tags/tags.types";
import {InfoCircle, InfoCircleActive} from "../../../MarkupRules";

type TagItemPropsType = {
  tag: TagType | null,
  isActive: boolean,
  handleClick: () => void
};

const TagItem: FC<TagItemPropsType> = memo(({tag, isActive, handleClick}) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useTagItemStyles({tag, isActive});

  function onTagItemClick () {
    // isActive
    //   ? () => null
    //   : () => {
    //     handleClick();
    //     history.location.pathname = '/'
    //     if (tag) {
    //       history.replace(`markuprules/dictionaries/${tag.id}`)
    //     }
    //   }
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
