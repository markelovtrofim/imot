import {DictTypeDetailed} from "../dicts/dicts.types";

export type TagGroupType = {
  group: string,
  count: number
}

export type TagType = {
  id: string,
  title: string,
  calculatedRulePriority: number
}


type GlobalFilterItem = {
  key: string,
  values: string[]
}
type FragmentRulesItem = {
  phrases: string[],
  dicts: string[],
  direction: string,
  fromStart: boolean,
  silentBefore: string,
  silentAfter: string,
  interruptTime: string
}
type SetTagsItem = {
  name: string,
  value: string,
  visible: boolean
}

export type TagDetailedType = {
  id: string,
  owner: string,
  title: string,
  calculatedRulePriority: number,
  globalFilter: GlobalFilterItem[],
  fragmentRules: FragmentRulesItem[],
  setTags: SetTagsItem[]
}
