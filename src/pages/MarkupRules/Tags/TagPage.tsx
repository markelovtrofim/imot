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
import Snackbar, {SnackbarType} from "../../../components/common/Snackbar";
import {useHistory} from "react-router-dom";
import queryString from "query-string";
import {createQueryString} from "../Dicts/Dicts";
import {langSlice} from "../../../store/lang/lang.slice";

export function searchStringParserInObj(initialString: string) {
  const searchString = initialString.slice(1);
  const searchStringArray = searchString.split("&");

  let output: any = {};
  for (let i = 0; i < searchStringArray.length; i++) {
    const query = queryString.parse(searchStringArray[i]);
    output = {...output, ...query}
  }
  return output;
}


const TagPage = () => {
  const classes = useTagsStyles();
  const dispatch = useDispatch();

  const currentGroup = useAppSelector(state => state.tags.currentTagGroup);
  const currentTag = useAppSelector(state => state.tags.currentTag);
  const search = useAppSelector(state => state.tags.searchParams);


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
    const searchParams = createQueryString(queryString.parse(search));
    // группы.
    const groupsData = await dispatch(getTagGroups())
    // @ts-ignore
    const groups: TagGroupType[] = groupsData.payload;

    if (searchParams.length < 2) {
      // устанавливаю первую группу как текущую.
      const currentGroup = groups[0];
      dispatch(tagsSlice.actions.setCurrentTagGroup(currentGroup));

      // запрашиваю теги текущей группы.
      const tagsData = await dispatch(getTags({group: currentGroup.group}));
      // @ts-ignore
      const tags: TagType[] = tagsData.payload;

      if (!currentTag) {
        // устанавливаю первый тег как текущий.
        await dispatch(getTag(tags[0].id));
      }
      dispatch(tagsSlice.actions.setSearchParams(`?group=${currentGroup.group}&id=${tags[0].id}`));
      history.location.pathname = '/';
      history.replace(`${language}/${userId}/markuprules/tags?group=${groups[0].group}&id=${tags[0].id}`)
    } else {
      queryByParameters(search);
      history.location.pathname = '/';
      let newSearch = search;
      if (search[0] !== '?') {
        newSearch = `?${search}`;
      }
      history.replace(`${language}/${userId}/markuprules/tags${newSearch}`);
    }
  }

  const [snackbar, setSnackbar] = useState<SnackbarType>({
    type: 'success',
    text: '',
    value: false,
    time: null
  });


  const history = useHistory();

  const {path} = JSON.parse(localStorage.getItem('path') || '{}');
  let pathArray = [];
  if (path) {
    pathArray = path.split("/");
  }
  const language = pathArray[1];
  const userIdData = useAppSelector(state => state.users.currentUser?.id);
  const userId = userIdData ? userIdData : "_";
  // ${language}/${userId}/

  async function queryByParameters(search: string) {

    const groupsData = await dispatch(getTagGroups());
    // @ts-ignore
    const groups: TagGroupType[] = groupsData.payload;

    const searchParamsObject = searchStringParserInObj(search);

    const currentGroupLocal = groups.find(item => {
      if (item) {
        return item.group === searchParamsObject.group
      }
    });
    if (currentGroupLocal && currentGroup && currentGroupLocal.group !== currentGroup.group) {
      dispatch(tagsSlice.actions.setTags(createNullArray(10)));
    }
    dispatch(tagsSlice.actions.setCurrentTag(null));

    let tags = null;

    if (currentGroupLocal && searchParamsObject.search) {
      dispatch(tagsSlice.actions.setCurrentTagGroup(currentGroupLocal));
      const tagsData = await dispatch(getTags({group: currentGroupLocal.group, filter: searchParamsObject.search}));
      // @ts-ignore
      tags = tagsData.payload;
    }
    if (currentGroupLocal && !searchParamsObject.search) {
      dispatch(tagsSlice.actions.setCurrentTagGroup(currentGroupLocal));
      dispatch(tagsSlice.actions.setSearchInput(""));
      const tagsData = await dispatch(getTags({group: currentGroupLocal.group}));
      // @ts-ignore
      tags = tagsData.payload;
    }
    if (tags) {
      if (tags.find((item: any) => item.id === searchParamsObject.id)) {
        await dispatch(getTag(searchParamsObject.id));
      } else {
        dispatch(tagsSlice.actions.setCurrentTag(false));
      }
    }
  }

  useEffect(() => {
    return history.listen((location) => {
      const currentSearch = createQueryString(queryString.parse(location.search));
      let oldSearchConverted = createQueryString(queryString.parse(search));
      if (oldSearchConverted[0] !== '?') {
        oldSearchConverted = `?${search}`
      }
      debugger
      if (currentSearch !== oldSearchConverted) {
        queryByParameters(location.search);
      }
    });
  }, [search]);

  useEffect(() => {
    getStartTagsData().then();
    dispatch(langSlice.actions.setLoading(false));
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
            onSubmit={async (values) => {
              const searchObj = searchStringParserInObj(history.location.search);
              dispatch(tagsSlice.actions.setTags(createNullArray(20)));
              dispatch(tagsSlice.actions.setCurrentTag(null));
              const tagsData = await dispatch(getTags({group: searchObj.group, filter: values.search}));
              // @ts-ignore
              const tags: TagType[] = tagsData.payload;
              if (tags.length < 1) {
                await dispatch(tagsSlice.actions.setCurrentTag(false));
              } else {
                await dispatch(getTag(tags[0].id));
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
        setSnackbar={setSnackbar}
        isOpen={addDictMWIsOpen}
        handleMWClose={handleMWClose}
      />

      {snackbar.value &&
      <Snackbar
        type={snackbar.type}
        open={snackbar.value}
        onClose={() => {
          setSnackbar({...snackbar, value: false})
        }}
        text={snackbar.text}
        time={snackbar.time}
      />
      }

    </div>
  );
};

export default TagPage;