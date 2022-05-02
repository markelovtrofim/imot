export type TagGroupType = {
  group: string,
  count: number
}

export type TagType = {
  id: string,
  title: string,
  calculatedRulePriority: number
}


export type GlobalFilterItem = {
  key: string,
  values: string[]
}
export type GlobalFilterItemDetailed = {
  title: string,
  key: string,
  selectType: string,
  addMulti: boolean,
  values: string[]
}

export type FragmentRulesItem = {
  phrases: string[],
  dicts: string[],
  direction: string,
  fromStart: boolean,
  silentBefore: string,
  silentAfter: string,
  interruptTime: string
}

export type SetTagsItem = {
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
