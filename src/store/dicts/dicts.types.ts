export type MarkupRulesPagesType = 'dictionaries' | 'tags' | 'checklists';


export type GroupType = {
  group: string,
  count: number
};


export type DictType = {
  enabled?: boolean,
  id: string,
  owner: string,
  sttAutoReplace?: boolean | null,
  title: string,
  usedRules: {id: string, title: string}[]
};

export type DictTypeDetailed = {
  id: string,
  owner: string | null,
  title: string,
  sttAutoReplace: boolean | null,
  enabled: boolean,
  allowedActions: string[],
  allowedUsers: string[] | [],
  usedRules: any,
  phrases: string[] | [],
  group: string
};

export type DictActionType = 'clone' | 'enable' | 'disable' | 'delete' | 'make_global';
