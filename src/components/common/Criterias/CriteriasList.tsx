import React, {FC} from 'react';
import {makeStyles} from '@mui/styles';
import {CriteriasType, RequestDataType} from '../../../store/search/search.types';
import CriteriaItem from './CriteriaItem';

const useStyles = makeStyles(({
  searchItems: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    // marginTop: '16px'
    // display: 'grid'
  },
  searchItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0 22px 16px 0',
    width: '100%',
  },
  searchItemBlock_1:{
    gridRowStart: 1,
    gridRowEnd: 2,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_2:{
    gridRowStart: 2,
    gridRowEnd: 3,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_3:{
    gridRowStart: 3,
    gridRowEnd: 4,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_4:{
    gridRowStart: 4,
    gridRowEnd: 5,
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_noWide: {
    width: '30%',
    display: 'flex',
    alignItems: 'center',
  },
  searchItemBlock_Wide: {
    width: '70%',
    display: 'flex',
    alignItems: 'center',
  },
}))

type FindCriteriasPropsType = {
  defaultCriterias?: RequestDataType[],
  allCriterias: CriteriasType[] | null,
  activeCriterias: CriteriasType[],
  block?: string,
  index?: {arrayIndex: number},
}

const CriteriasList: FC<FindCriteriasPropsType> = React.memo(({
  defaultCriterias,
  allCriterias,
  activeCriterias,
  block,
  index
}) => {
  const classes = useStyles();
  
  function switchSearchItemCLassName(className: string) {
    const classSwitcher: {[id: string]: any} = {};
    classSwitcher['searchItemBlock_1'] = classes.searchItemBlock_1;
    classSwitcher['searchItemBlock_2'] = classes.searchItemBlock_2;
    classSwitcher['searchItemBlock_3'] = classes.searchItemBlock_3;
    classSwitcher['searchItemBlock_4'] = classes.searchItemBlock_4;
    classSwitcher['searchItemBlock_Wide'] = classes.searchItemBlock_Wide;
    classSwitcher['searchItemBlock_noWide'] = classes.searchItemBlock_noWide;
    return classSwitcher[className];
  }

  return (
    <div className={classes.searchItems}>
      {defaultCriterias && allCriterias ? defaultCriterias.map(criteria => {
        const criteriaKey = criteria.key.slice(4);
        const compResult = allCriterias.filter(v => v.key === criteria.key);
        return (
          <div className={classes.searchItem}>
            <CriteriaItem
              title={compResult[0].title}
              criteriaFull={compResult[0]}
              criteriaCurrent={criteria}
              isDefaultCriteria={true}
              block={block}
              index={index}
            />
          </div>
        )
      }) : null}

      {activeCriterias && allCriterias ? activeCriterias.map(criteria => {
        const compResult = allCriterias.filter(v => v.key === criteria.key);
        const criteriaWide = criteria.wide ? 'searchItemBlock_Wide' : 'searchItemBlock_noWide';
        const criteriaBlock = `searchItemBlock_${criteria.block}`;
        return ( 
          // <div className={switchSearchItemCLassName(criteriaBlock)}> 
            <div className={switchSearchItemCLassName(criteriaWide)}>
              <div className={classes.searchItem}>
                <CriteriaItem
                  title={criteria.title}
                  criteriaFull={compResult[0]}
                  criteriaCurrent={criteria}
                  isDefaultCriteria={false}
                  block={block}
                  index={index}
                />
              </div>
            {/* </div> */}
          </div>
        )
      }) : null}
    </div>
  )
})

export default CriteriasList;