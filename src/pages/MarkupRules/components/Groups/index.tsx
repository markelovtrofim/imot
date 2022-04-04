import React from 'react';
import Group from "./Group";
import {useAppSelector} from "../../../../hooks/redux";
import {Preloader} from '../../index';

const Groups = () => {
  // в пропсах надо сделать.
  const groups = useAppSelector(state => state.dicts.groups);
  const currentGroup = useAppSelector(state => state.dicts.currentGroup);

  return (
    <div style={{padding: '5px 0'}}>
      {groups.map((group) => {
        return (
          <Group
            group={group}
            // @ts-ignore
            isActive={currentGroup && group && group.group === currentGroup.group}
          />
        )
      })}
    </div>
  );
};

export default Groups;
