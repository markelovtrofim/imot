import React, {FC} from "react";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../../hooks/redux";
import {RootState} from "../../../../store/store";
import {translate} from "../../../../localizations";
import TagItem from "./TagItem/TagItem";

const TagItems: FC = () => {
  const dispatch = useDispatch();
  const {language} = useAppSelector((state: RootState) => state.lang);

  const tags = useAppSelector(state => state.tags.tags);
  const currentTag = useAppSelector(state => state.tags.currentTag);

  return (
    <div style={{padding: '5px 0'}}>
      {tags && tags.length > 0
        ?
        tags.map((tag) => {
          return (
            <TagItem
              tag={tag}
              isActive={Boolean(currentTag && tag && currentTag.id === tag.id)}
            />
          )
        })
        :
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: '700',
            fontSize: '16px',
            marginLeft: '24.5px',

            color: '#738094'
          }}
        >
          {translate('nothingFound_dicts', language)}
        </div>
      }
    </div>
  );
};

export default TagItems;
