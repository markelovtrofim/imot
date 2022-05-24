import React, {FC} from 'react';
import {IconButton, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import ModalWindow from "../../../../components/common/ModalWindowBox";
import {Input} from "../../../../components/common";
import {LoadingButton} from "@mui/lab";
import {translate} from "../../../../localizations";
import {useFormik} from "formik";
import CloseIcon from "@mui/icons-material/Close";
import ContainedSelect from "../../../../components/common/Selects/ContainedSelect";
import {useAppSelector} from "../../../../hooks/redux";
import {RootState} from "../../../../store/store";

type PostModalWindowType = {
  isOpen: boolean,
  handleMWClose: () => void
}

const PostModalWindow: FC<PostModalWindowType> = ({isOpen, handleMWClose}) => {
  const useStyles = makeStyles(({
    MWTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px'
    },
    MWTitleText: {
      fontWeight: '700 !important'
    },
    MWButtons: {
      marginTop: '15px',
      textAlign: 'right'
    },
    MWInput: {
      width: '100%',
      height: '20px',
      '&:input': {
        padding: '0'
      }
    }
  }));
  const classes = useStyles();
  const {language} = useAppSelector((state: RootState) => state.lang);
  const allDicts = useAppSelector(state => state.tags.allGlobalFilterCriterias).find(item => item.key === 'client_text');


  function dictsConverter() {
    if (allDicts) {
      const result: {value: string, label: string}[] = []
      for (let i = 0; i < allDicts.values.length; i++) {
        result.push({label: allDicts.values[i], value: allDicts.values[i]});
      }
      return result;
    } else {
      return [];
    }
  }

  const convertedDicts = dictsConverter();

  const formik = useFormik({
    initialValues: {
      dict: '',
      group: '',
      howSaid: ''
    },
    onSubmit: async () => {

    }
  })

  return (
    <ModalWindow isOpen={isOpen} handleClose={handleMWClose}>
      <div className={classes.MWTitle}>
        <Typography className={classes.MWTitleText}>Введите имя словаря и группы</Typography>
        <IconButton onClick={handleMWClose}>
          <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
        </IconButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <ContainedSelect
          width={'100%'}
          onSelectChange={() => {}}
          options={convertedDicts}
          value={convertedDicts[0]}
        />
        <Input
          height={'36px'}
          value={formik.values.dict}
          handleChange={formik.handleChange}
          name={'dictName'}
          type={'text'}
          bcColor={'#F8FAFC'}
          label={'Словарь'}
        />
        <div style={{marginTop: '20px'}}>
          <Input
            height={'36px'}
            value={formik.values.group}
            handleChange={formik.handleChange}
            name={'groupName'}
            type={'text'}
            bcColor={'#F8FAFC'}
            label={'Группа'}
          />
        </div>

        <div className={classes.MWButtons}>
          <LoadingButton
            loading={false}
            style={{marginRight: '15px'}}
            variant="contained"
            color="primary"
            type="submit"
          >
            {translate("sendButton", language)}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="secondary"
            onClick={handleMWClose}
          >
            {translate("cancelButton", language)}
          </LoadingButton>
        </div>
      </form>
    </ModalWindow>
  );
};

export default PostModalWindow;