// пока не пришли данные отображается этот компонент
// наверное неправильное решение, так как много дублирую кода
// но зато не нужно писть много условий в основном компоненте

import React from 'react';
import {BlockBox} from "../../../../components/common";
import Field from "../../../../components/common/FIeld";
import {Skeleton, Typography} from "@mui/material";
import {useTagDetailsStyles} from "./TagDetails.jss";
import {AddButton} from "./TagDetails";

const TagDetailsStubMiddleware = () => {
  const classes = useTagDetailsStyles();
  return (
    <BlockBox padding={'0'} height={'100%'}>
      <div className={classes.tdWrapper}>

        {/* Шапка */}
        <div>
          <div className={classes.tdNameAdnPriority}>
            {/* Название тега */}
            <Field
              margin={'0 0 15px 0'}
              label={"Название тега"}
              width={"60%"}
              padding={'7.5px 10px'}
            >
              <Skeleton/>
            </Field>
            {/* Приоритет */}
            <Field
              label={"Приоритет"}
              width={'15%'}
              padding={'7.5px 10px'}
            >
              <Skeleton/>
            </Field>
          </div>
          {/* Название группы */}
          <Field
            label={"Название группы тега"}
            width={"60%"}
            padding={'7.5px 10px'}
          >
            <Skeleton/>
          </Field>
        </div>

        {/* Глобальные фильтры */}
        <div style={{width: '100%', margin: '30px 0'}}>
          <Typography className={classes.typographyTitle}>Глобальные настройки тега</Typography>
          <Field
            height={'37px'}
            label={''}
            width={"60%"}
            padding={'7.5px 10px'}
          >
            <Skeleton/>
          </Field>
          <AddButton>
            Добавить фильтр
          </AddButton>
        </div>

        {/* Фрагменты */}
        <div>
          <Typography className={classes.typographyTitle}>Фрагменты тега</Typography>
          <Field
            height={'37px'}
            label={''}
            width={"60%"}
            padding={'7.5px 10px'}
          >
            <Skeleton/>
          </Field>
          <AddButton>
            Добавить фрагмент
          </AddButton>
        </div>


        {/* Внутренние теги*/}
        <div style={{margin: '30px 0'}}>
          <Typography className={classes.typographyTitle}>Теги</Typography>
          <Field
            height={'37px'}
            label={''}
            width={"60%"}
            padding={'7.5px 10px'}
          >
            <Skeleton/>
          </Field>
          <AddButton>
            Добавить тег
          </AddButton>
        </div>
      </div>
    </BlockBox>
  );
};

export default TagDetailsStubMiddleware;