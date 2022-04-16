export type UserType = {
  id: string,
  role: 'admin' | 'user' | 'operator',
  login: string,
  name: string,
  timezone: string,
  accessRights: string[],
  searchTags: string[],
  searchHideTags: string[],
  clientTags: string[],
  fastManualTags: string[],
  language: string
};

export type ChildUserType = {
  id: string,
  role: string,
  login: string,
  name: string,
  timezone: string,
  parentUser: string
};