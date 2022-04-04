import Item from "./Item";
import React, {useState} from "react";
import {Preloader} from "../../index";
import {useAppSelector} from "../../../../hooks/redux";
import {useDispatch} from "react-redux";
import {getDict} from "../../../../store/dicts/dicts.slice";
import {Typography} from "@mui/material";

const Items = () => {
  const dicts = useAppSelector(state => state.dicts.dicts);
  const currentDict = useAppSelector(state => state.dicts.currentDict);
  const dispatch = useDispatch();

  return (
    <div style={{padding: '5px 0'}}>
      {dicts ?
        dicts.map((dict) => {
          return (
            <Item
              body={dict}
              // @ts-ignore
              isActive={currentDict && dict && currentDict.id === dict.id}
              handleClick={async () => {
                if (dict) {
                  dispatch(getDict(dict.id));
                }
              }}
            />
          )
        }) : <Typography variant={"h3"}>Пусто</Typography>}
    </div>
  );
};

export default Items;