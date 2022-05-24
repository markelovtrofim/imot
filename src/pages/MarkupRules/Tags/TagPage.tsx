import React, {useEffect, useState} from 'react';
import {MarkupRulesButtons, SearchInput} from "../MarkupRules";
import TagDetails from "./TagDetails/TagDetails";
import {useDispatch} from "react-redux";
import {createNullArray, getTag, getTagGroups, getTags, tagsSlice} from "../../../store/tags/tags.slice";
import {TagGroupType, TagType} from "../../../store/tags/tags.types";
import {useTagsStyles} from './TagPage.jss';
import TagGroups from "./TagGroups/TagGroups";
import TagItems from "./TagItems/TagItems";
import {useAppSelector} from "../../../hooks/redux";
import PostModalWindow from "./TagDetails/PostModalWindow";

const TagPage = () => {
  const classes = useTagsStyles();
  const dispatch = useDispatch();

  const currentGroup = useAppSelector(state => state.tags.currentTagGroup);

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
            <TagGroups/>
          </div>
        </div>

        {/* tags */}
        <div className={classes.dpLeftBlockDicts}>
          <SearchInput
            onSubmit={async(values) => {
              if (currentGroup) {
                dispatch(tagsSlice.actions.setTags(createNullArray(20)));
                dispatch(tagsSlice.actions.setCurrentTag(null));
                const tagsData = await dispatch(getTags({group: currentGroup.group, filter: values.search}));
                // @ts-ignore
                const tags: TagType[] = tagsData.payload;
                if (tags.length < 1) {
                  await dispatch(tagsSlice.actions.setCurrentTag(false));
                } else {
                  await dispatch(getTag(tags[0].id));
                }
              }
            }}
            handleMWOpen={() => {
              setAddDictMWIsOpen(true);
            }}
          />
          <div className={classes.dpBothBox}>
            <TagItems/>
          </div>
        </div>
      </div>

      {/* detail */}
      <div className={classes.dpRightBlock}>
        <TagDetails/>
      </div>

      <PostModalWindow
        isOpen={addDictMWIsOpen}
        handleMWClose={handleMWClose}
      />

    </div>
  );
};

export default TagPage;