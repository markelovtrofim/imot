import React, {FC} from 'react';
import {useAppSelector} from "../../../../hooks/redux";
import TagGroup from "./TagGroup/TagGroup";


const TagGroups: FC = () => {
  const tagGroups = useAppSelector(state => state.tags.tagGroups);
  const currentGroup = useAppSelector(state => state.tags.currentTagGroup);

  return (
    <div style={{padding: '5px 0'}}>
      {tagGroups.map((group) => {
        return (
          <TagGroup
            group={group}
            isActive={Boolean(currentGroup && group && group.group === currentGroup.group)}
          />
        )
      })}
    </div>
  );
};

export default TagGroups;
