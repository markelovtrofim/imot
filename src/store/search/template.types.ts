export type TemplateItem = {
  key: string,
  values: string[]
};

export type TemplatesType = {
  id: string,
  items: TemplateItem[],
  title: string
};
