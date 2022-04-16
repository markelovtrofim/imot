import React, {FC} from 'react';
import Group from "./Group";
import {useAppSelector} from "../../../../hooks/redux";
import {Preloader} from '../../index';
import {GroupType} from "../../../../store/dicts/dicts.types";

type GroupsPropsType = {
  groups: GroupType[] | null[]
}

const Groups: FC<GroupsPropsType> = ({groups}) => {
  // в пропсах надо сделать.
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
