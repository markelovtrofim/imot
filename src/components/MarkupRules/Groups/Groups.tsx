import React, {FC} from 'react';
import Group from "./Group";
import {useAppSelector} from "../../../hooks/redux";
import {Preloader} from '../../../pages/MarkupRules/MarkupRules';
import {GroupType} from "../../../store/dicts/dicts.types";

type GroupsPropsType = {
  groups: GroupType[] | null[],
  currentGroup: GroupType | null
}

const Groups: FC<GroupsPropsType> = ({groups, currentGroup}) => {
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
