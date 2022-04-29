import React, {useEffect, useState} from 'react';
import ModalWindow from "../../../components/common/ModalWindowBox";
import {Input} from "../../../components/common";
import Groups from "../../../components/MarkupRules/Groups/Groups";
import Items from "../../../components/MarkupRules/Items/Items";
import {MarkupRulesButtons, SearchInput} from "../MarkupRules";
import TagDetails from "./TagDetails/TagDetails";
import {useDispatch} from "react-redux";
import {getTag, getTagGroups, getTags, tagsSlice} from "../../../store/tags/tags.slice";
import {TagGroupType, TagType} from "../../../store/tags/tags.types";
import {useTagsStyles} from './TagPage.jss';
import {useAppSelector} from "../../../hooks/redux";

const TagPage = () => {
  const classes = useTagsStyles();
  const dispatch = useDispatch();

  const tagGroups = useAppSelector(state => state.tags.tagGroups);
  const currentTagGroup = useAppSelector(state => state.tags.currentTagGroup);
  const tags = useAppSelector(state => state.tags.tags);
  const currentTag = useAppSelector(state => state.tags.currentTag);

  // логика открытия модально окна (MW - Modal Window).
  const [addDictMWIsOpen, setAddDictMWIsOpen] = useState<boolean>(false);
  const handleMWOpen = () => {
    setAddDictMWIsOpen(true);
  };
  const handleMWClose = () => {
    setAddDictMWIsOpen(false);
  };

  // запросы сразу после отрисовки компонента.
  const getStartTagsData = async () => {
    // группы.
    const groupsData = await dispatch(getTagGroups())
    // @ts-ignore
    const groups: TagGroupType[] = groupsData.payload;

    // устанавливаю первую группу как текущую.
    const currentGroup = groups[0];
    dispatch(tagsSlice.actions.setCurrentTagGroup(currentGroup));

    // запрашиваю теги текущей группы.
    const tagsData = await dispatch(getTags({group: currentGroup.group}));
    // @ts-ignore
    const tags: TagType[] = tagsData.payload;

    // устанавливаю первый тег как текущий.
    await dispatch(getTag(tags[0].id));
  }
  useEffect(() => {
    getStartTagsData().then();
  }, []);

  return (
    <div className={classes.tagsContainer}>
      <div className={classes.dpLeftBlock}>
        <div className={classes.dpLeftBlockGroups}>
          {/* local url handler */}
          <MarkupRulesButtons/>

          {/* groups */}
          <div className={classes.dpBothBox}>
            <Groups
              groups={tagGroups}
              currentGroup={currentTagGroup}
            />
          </div>
        </div>

        {/* dicts */}
        <div className={classes.dpLeftBlockDicts}>
          <SearchInput handleMWOpen={handleMWOpen}/>
          <div className={classes.dpBothBox}>
            <Items
              items={tags}
              currentItem={currentTag}
            />
          </div>
        </div>
      </div>

      {/* detail */}
      <div className={classes.dpRightBlock}>
        <TagDetails/>
      </div>

      {/* modal window */}
      <ModalWindow isOpen={addDictMWIsOpen} handleClose={() => handleMWClose()}>
        <Input name={'dict'} type={'text'} bcColor={'#F8FAFC'} label={'Добавить словарь'}/>
      </ModalWindow>

    </div>
  );
};

export default TagPage;