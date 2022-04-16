import Item from "./Item";
import React, {FC} from "react";
import {useAppSelector} from "../../../../hooks/redux";
import {useDispatch} from "react-redux";
import {dictsSlice, getDict} from "../../../../store/dicts/dicts.slice";
import {Typography} from "@mui/material";
import {DictType} from "../../../../store/dicts/dicts.types";
import {RootState} from "../../../../store/store";
import {translate} from "../../../../localizations";

type ItemsPropsType = {
  items: DictType[] | null[] | null
}

const Items: FC<ItemsPropsType> = ({items}) => {
  const currentDict = useAppSelector(state => state.dicts.currentDict);
  const dispatch = useDispatch();
  const {language} = useAppSelector((state: RootState) => state.lang);
  console.log(items);
  return (
    <div style={{padding: '5px 0'}}>
      {items && items.length > 0
        ?
        items.map((item) => {
          return (
            <Item
              body={item}
              // @ts-ignore
              isActive={currentDict && item && currentDict.id === item.id}
              handleClick={async () => {
                if (item) {
                  dispatch(dictsSlice.actions.setCurrentDict(null));
                  await dispatch(getDict(item.id));
                }
              }}
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

export default Items;
