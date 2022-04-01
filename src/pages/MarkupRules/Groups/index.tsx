import React from 'react';
import Group from "./Group";
import {useAppSelector} from "../../../hooks/redux";
import {Preloader} from '../index';

const Groups = () => {
  // в пропсах надо сделать.
  const groups = useAppSelector(state => state.dicts.groups);
  const currentGroup = useAppSelector(state => state.dicts.currentGroup);
  const loading = useAppSelector(state => state.dicts.loading.groupsBlockLoading);
  return (
    <div>
      {loading ? <Preloader/> :
        <div>
          {groups && currentGroup &&
            groups.map((group) => {
              return (
                <Group
                  group={group}
                  isActive={group.group === currentGroup.group}
                />
              )
            })}
        </div>
      }
    </div>
  );
};

export default Groups;
