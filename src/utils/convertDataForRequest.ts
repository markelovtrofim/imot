import {CriteriasType, RequestDataType} from "../store/search/search.types";

export const convertDataForRequest = (defaultCriterias: RequestDataType[], activeCriterias: CriteriasType[]) => {
  let requestArray = [];
  for (let i = 0; i < defaultCriterias.length; i++) {
    if (defaultCriterias[i].values.length > 0) {
      requestArray.push({key: defaultCriterias[i].key, values: defaultCriterias[i].values})
    }
  }
  for (let i = 0; i < activeCriterias.length; i++) {
    if (activeCriterias[i].values.length > 0) {
      requestArray.push({key: activeCriterias[i].key, values: activeCriterias[i].values});
    }
  }
  return requestArray;
};
