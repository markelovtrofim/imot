import Item from "./Item";
import React, {useState} from "react";
import {Preloader} from "../index";
import {useAppSelector} from "../../../hooks/redux";
import {useDispatch} from "react-redux";
import {getDict} from "../../../store/dicts/dicts.slice";
import {Typography} from "@mui/material";
import {Input} from "../../../components";
import ModalWindow from "../../../components/ModalWindowBox";

const Items = () => {
  const dicts = useAppSelector(state => state.dicts.dicts);
  const currentDict = useAppSelector(state => state.dicts.currentDict);
  const loading = useAppSelector(state => state.dicts.loading.itemsBlockLoading);
  const dispatch = useDispatch();

  return (
    <div>
      {loading ? <Preloader/> :
        <div>
          {dicts && currentDict ?
          dicts.map((dict) => {
            return (
              <Item
                body={dict}
                isActive={currentDict.id === dict.id}
                handleClick={async () => {
                  dispatch(getDict(dict.id));
                }}
              />
            )
          }) : <Typography variant={"h3"}>Пусто</Typography>}
        </div>
      }
    </div>
  );
};

export default Items;