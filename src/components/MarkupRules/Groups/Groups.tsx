import React, {FC} from 'react';
import Group from "./Group";
import {useAppSelector} from "../../../hooks/redux";

const Groups: FC = () => {
  const dictGroups = useAppSelector(state => state.dicts.groups);
  const currentGroup = useAppSelector(state => state.dicts.currentGroup)

  return (
    <div style={{padding: '5px 0'}}>
      {dictGroups ?
        dictGroups.map((group) => {
          console.log(currentGroup)
          return (
            <Group
              group={group}
              isActive={Boolean(currentGroup && group && group.group === currentGroup.group)}
            />
          )
        }) : null}
    </div>
  );
};

export default Groups;
