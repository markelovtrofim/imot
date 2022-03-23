export type TemplateItem = {
  key: string,
  values: string[]
};

export type TemplateType = {
  id: string,
  items: TemplateItem[],
  title: string
};
