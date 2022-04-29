import React from 'react';
import {InputBase, Typography} from "@mui/material";
import {BlockBox} from "../../../../components/common";
import Field from "../../../../components/common/FIeld";
import ContainedSelect from "../../../../components/common/Selects/ContainedSelect";
import TextSelect from "../../../../components/common/Selects/TextSelect";
import {useTagDetailsStyles} from './TagDetails.jss';

const TagDetails = () => {
  const classes = useTagDetailsStyles();

  return (
    <BlockBox padding={'5px 24px'}>
      <div className={classes.tdNameAdnPriority}>
        <Field label={"Название тега"} height={'45px'} width={"75%"} margin={'5%'}>
          <InputBase
            className={classes.tdTagNameInput}
            type="text"
          />
        </Field>
        <Field label={"Приоритет"} height={'45px'} width={'15%'}>
          <InputBase
            className={classes.tdPriorityInput}
            type="text"
          />
        </Field>
      </div>

      <div style={{width: '100%'}}>
        <Typography className={classes.typographyTitle}>Глобальные настройки тега</Typography>
        <div>
          <Typography>Телефон</Typography>
          <ContainedSelect
            width={'75%'}
            height={'45px'}
            onSelectChange={() => {
            }}
            options={[{value: 'test', label: 'test'}]}
            value={{value: 'test', label: 'test'}}
          />
        </div>
      </div>
      <TextSelect inputValue={{value: 'test', label: 'test'}} options={[{value: 'test', label: 'test'}]} handleInputValueChange={() => {}} inputValueColor={'red'} arrowPosition={'left'}/>

      ...
    </BlockBox>
  );
};

export default TagDetails;